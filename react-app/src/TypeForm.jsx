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
          Fyll i enkäten för att mejla din riksdagsledamot{" "}
        </button>
        <p className="explanation">
          <strong>Vi kommer att skriva ett e-postmeddelande</strong> baserat på din undersökning.{" "} <strong>Skrivet för att ha maximal effekt på din riksdagsledamot.</strong> Med din hjälp kan vi säkra det stöd som så många behöver.
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
