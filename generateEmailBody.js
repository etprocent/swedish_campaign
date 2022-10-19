const emailStrings = require("./emailGenerator/emailStrings.json");

const generateEmailBody = (party, motivationArg, meetMp, name) => {
  function rand(items) {
    // "|" for a kinda "int div"
    return items[(items.length * Math.random()) | 0];
  }

  const motivations = emailStrings.motivation.find(
    (motivation) => motivation.response === motivationArg
  );

  let motivationString = "";
  if (motivations?.synonyms) {
    motivationString = rand(motivations.synonyms);
  } else {
    console.error("no motivation");
  }

  console.log(motivationString);

  const meetMpString = meetMp ? rand(emailStrings.meetMp) : "";
  return (
    rand(emailStrings.political_affiliation).replace(
      "POLITICAL_AFFILIATION",
      party
    ) +
    " " +
    rand(emailStrings.sentence1) +
    " " +
    rand(emailStrings.sentence2) +
    " " +
    motivationString +
    " " +
    meetMpString +
    "\n\n" +
    rand(emailStrings.signoff) +
    "\n" +
    (name ? name : "Medborgare i sverige")
  );
};

module.exports.generateEmailBody = generateEmailBody;
