const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();
var http = require("http").createServer(app);
const crypto = require("crypto");
const fs = require("fs");
const mpsjson = require("./emailGenerator/MPs.json");
const emailStrings = require("./emailGenerator/emailStrings.json");

const io = require("socket.io")(http);

const { getMpByPostcode } = require("./api-calls");
const { generateEmailBody } = require("./generateEmailBody");

function rand(items) {
  // "|" for a kinda "int div"
  return items[(items.length * Math.random()) | 0];
}
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

app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    if (req.headers["x-forwarded-proto"] !== "https") {
      console.log("forwarding to https");
      return res.redirect("https://" + req.headers.host + req.url);
    } else return next();
  } else return next();
});
//

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

        const getMp = (db, party, region) => {
          const regions = db[party];
          let mps = regions[region];

          function getRandomProperty(obj) {
            const keys = Object.keys(obj);

            return keys[Math.floor(Math.random() * keys.length)];
          }
          while (mps.members.length === 0) {
            region = getRandomProperty(regions);
            mps = regions[region];
          }
          const mp = mps.members[0];
          return {
            Member: mp.name,
            Constituency: region,
            Email: mp.email,
            party,
          };
        };

        const mp = getMp(mpsjson, answers.party, answers.region);

        const getMPs = (db, party, region) => {
          const regions = db[party];
          let mps = regions[region].members;

          function getRandomProperty(obj) {
            const keys = Object.keys(obj);

            return keys[Math.floor(Math.random() * keys.length)];
          }
          // Return MPs right away if there are any. If there are no MPSs pick random MPs from a different region
          if (mps.length !== 0) {
            return mps.map((mp) => ({
              Member: mp.name,
              Constituency: region,
              party,
              Email: mp.email,
            }));
          }
          // Select a random different region where there are MPs
          while (mps.length === 0) {
            region = getRandomProperty(regions);
            mps = regions[region].members;
          }
          function getMultipleRandom(arr, num) {
            const shuffled = [...arr].sort(() => 0.5 - Math.random());

            return shuffled.slice(0, num);
          }

          const itms = 3 > mps.length ? mps.length : 3;

          return getMultipleRandom(mps, itms).map((mp) => ({
            Member: mp.name,
            Constituency: region,
            party,
            Email: mp.email,
          }));
        };

        const mps = getMPs(mpsjson, answers.party, answers.region);
        console.log(answers);

        client2.emit("typeform-incoming", {
          formToken: data.form_response.token,
          generatedEmail: {
            body: generateEmailBody(
              answers.party,
              answers.why,
              answers.doYouWantMeetingWithMP === "Ja" ? true : false,
              answers.name
            ),

            // Testing: how to handle illegal character in user input? I should remove everything that can be used to hack us
            // handle weird behaviour in general... do some testing... Ehh...
            // yeah, this whole app is pretty random and it could be helpful to establish some bounduaries
            // email greeting should be generated on clicking continue with this MPs
            subject: rand(emailStrings.subject),
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
            mps,
            greeting: "",
            // Generate greeting on the client side because
            // The list of MPs we are targeting can change

            supportsAid: "aid", //TODO
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
