import React, { useEffect, useRef, useState } from "react";
import * as typeformEmbed from "@typeform/embed";

const TypeForm = ({ passDataUpstream, isMobile }) => {
  const typeformComponent = useRef(null);
  const buttonRef = useRef(null);
  const [typeformWidgetOpen, setTypeformWidgetOpen] = useState(true);

  const queryStr = window.location.search.substr(1);

  const mobileTypeform = typeformEmbed.makePopup(
    `https://skcgw55qrns.typeform.com/to/N8DmwqC6#${queryStr}`,
    {
      mode: "popup",
      autoClose: 3,
      onSubmit: (data) => {
        console.log(data);
        passDataUpstream({ responseId: data.response_id });
      },
      onClose: (data) => {
        console.log(data);
        passDataUpstream({ responseId: data.response_id });
      },
    }
  );

  useEffect(() => {
    !isMobile &&
      typeformEmbed.makeWidget(
        typeformComponent.current,
        `https://skcgw55qrns.typeform.com/to/N8DmwqC6#${queryStr}`,
        {
          hideScrollbars: true,
          hideHeaders: true,
          opacity: 0,
          onSubmit: (data) => {
            console.log(data);
            passDataUpstream({ responseId: data.response_id });
            setTimeout(() => {
              setTypeformWidgetOpen(false);
            }, 3000);
          },
        }
      );
  }, [typeformComponent, passDataUpstream, isMobile, queryStr]);

  return (
    <div>
      <div className="call-to-action text-center">
        <button
          ref={buttonRef}
          onClick={(e) => {
            e.preventDefault();
            isMobile
              ? mobileTypeform.open()
              : typeformComponent.current.scrollIntoView({
                  behavior: "smooth",
                  block: "end",
                });
          }}
          className="btn btn-primary btn-lg main-cta"
        >
          Fill out the survey to email your MP{" "}
        </button>
        <p className="explanation">
          <strong>We will draft an email</strong> based on your survey
          responses,{" "}
          <strong>written to have the maximum impact on your MP.</strong> With
          your help we can safeguard the support so many need.
        </p>
      </div>
      <div
        ref={typeformComponent}
        className={`typeform-widget ${typeformWidgetOpen ? "" : "closed"}`}
        id="typeform"
      />
    </div>
  );
};

export default TypeForm;
