import React from "react";

const sendEmail = ({ subject, body, mpEmailAddress, passDataUpstream }) => {
  const getFullEmailLink = (mpEmailAddress) =>
    mpEmailAddress +
    "?Subject=" +
    encodeURIComponent(subject) +
    "&Body=" +
    encodeURIComponent(body) +
    "&bcc=emails@1procent.nu";

  return (
    <div className="send-email">
      <h2 className="secondary-header send-email-header">Skicka ditt e-post</h2>
      <p className="explanation campaign-explanation">
        Detta öppnar din e-posttjänst i en annan flik
      </p>
      <a
        href={"mailto:" + getFullEmailLink(mpEmailAddress)}
        className="btn btn-primary btn-lg cta send-button"
        target="_blank"
        rel="noreferrer"
        onClick={() => {
          passDataUpstream({ emailSent: true });
        }}
      >
        SKICKA E-POST
      </a>
    </div>
  );
};
export default sendEmail;
