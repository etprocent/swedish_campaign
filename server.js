const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();
var http = require("http").createServer(app);
const crypto = require("crypto");
const fs = require("fs");

const io = require("socket.io")(http);

const { getMpByPostcode } = require("./api-calls");
const { generateEmail } = require("./emailGenerator");

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
        //generateEmail(data.form_response).then((generatedEmail) => {
        client2.emit("typeform-incoming", {
          formToken: data.form_response.token,
          generatedEmail: {
            body: "body",
            subject: "subject",
            mpData: {
              full_name: "full name",
              name: "name",
              constituency: "cons",
              party: "party",
              error: "error",
              mpEmailAddress: "email",
            },
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
