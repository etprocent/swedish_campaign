const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();
var http = require("http").createServer(app);
const crypto = require("crypto");
const fs = require("fs");
const mps = require("./emailGenerator/MPs.json");

const io = require("socket.io")(http);

const { getMpByPostcode } = require("./api-calls");

const getAnswersFromTypeform = (typeform) => {
  function getObjKey(obj, value) {
    return Object.keys(obj).find((key) => obj[key] === value);
  }

  const typeformAnswers = typeform.form_response.answers;
  // Key to decipher typeform containing ids of fields and their types.
  const key = {
    shouldSwedenGiveAid: "aw0eDbnYFM6e", // Do you think it is good that Sweden gives aid to developing countries?
    why: "mAN4s5AjLA3D", // Why do you think it is important to preserve aid?
    party: "TKqucFyEhWjH", // Which party did you vote for?
    relationWithParty: "yIdt7p5jBDpv",
    doYouWantMeetingWithMP: "FJCxoMaWG5zY",
    name: "1dUPuPKEbad4",
    email: "FwUM3bB6Rtrx",
    region: "kWsxFuQHepRo",
    postcode: "SdRS3THm5a4S",
  };

  const answers = {};
  for (const typeformAnswer of typeformAnswers) {
    let value;
    switch (typeformAnswer.type) {
      case "choice":
        value = typeformAnswer.choice.label;
        break;
      case "email":
        value = typeformAnswer.email;
        break;
      case "text":
        value = typeformAnswer.text;
      default:
        console.log("error");
        break;
    }
    const fieldName = getObjKey(key, typeformAnswer.field.id);

    answers[fieldName] = value;
  }

  return answers;
};

//initialise express and define a port
const port = process.env.PORT || 5000;
const client = require("socket.io-client")("http://localhost:" + port);
const dir = {};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//allows us to write exampleResponses for testing in the early stages of development
//NOTE: be careful to not to save any files with personal details
const writeDataToExampleResponsesFile = (data) => {
  // Use hashed answers as filename to avoid generating multiple files containing the same responses.
  const answersJson = JSON.stringify(data.form_response.answers);
  const answersHashCode = crypto
    .createHash("md5")
    .update(answersJson)
    .digest("hex");
  const filePath = `./tests/mockTypeformResponses/${answersHashCode}.json`;
  fs.writeFileSync(filePath, JSON.stringify(data));
  console.log("Wrote form data to", filePath);
};

app.get("/api/postcode/:postcodeInput", (req, res) => {
  getMpByPostcode(req.params.postcodeInput).then((response) =>
    res.send(response)
  );
});

app.post("/hook", (req, res) => {
  res.status(200).end(); // Responding is important
  client.emit("create", req.body);
});

//our webhook is triggered by the post request above

io.on("connection", (socket) => {
  socket.on("register", (token) => {
    dir[token] = socket;
  });

  socket.on("create", (data) => {
    const rep = (i) => {
      if (i > 10) {
        return;
      }
      const client2 = dir[data.form_response.token];
      if (client2) {
        const answers = getAnswersFromTypeform(data);

        let mp = mps.find((mp) => {
          return (
            mp.Party === answers.party && mp.Constituency === answers.region
          );
        });

        // Fallback
        if (!mp) {
          console.log("Did not find an mp for", {
            ...answers,
            name: "XXX",
            email: "XXX",
          });
          mp = mps.find((mp) => mp.Constituency === answers.region);
        }

        // Naive way of doing that, I will later change it. It will index the MPs based on the constituency

        client2.emit("typeform-incoming", {
          formToken: data.form_response.token,
          generatedEmail: {
            body: "body",
            subject: "subject",
            mpData: mp
              ? {
                  full_name: mp.Member,
                  name: mp.Member.split(" ")[0],
                  constituency: mp.Constituency,
                  party: mp.party,
                  error: "",
                  mpEmailAddress: mp.Email,
                }
              : { error: "mp not fund!" },
            greeting: "greeting",
            supportsAid: "aid",
          },
        });
      } else {
        setTimeout(() => {
          rep(i++);
        }, 500);
      }
    };
    rep(0);

    // if (app.settings.env === "development") {
    //   // writeDataToExampleResponsesFile(data);
    // }
    // });
  });
});

http.listen(port, () =>
  console.log(
    `Listening on port ${port}, process env = ${process.env.NODE_ENV}`
  )
);

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "react-app/build")));

  // Handle React routing, return all requests to React app
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "react-app/build", "index.html"));
  });
}
