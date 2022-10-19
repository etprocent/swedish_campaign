import React, { useState, useEffect, useRef } from "react";
import mpsList from "./MPsList.json";
import DisplayMp from "./DisplayMp";

const MpForm = ({
  passDataUpstream,
  mp,
  setUpstreamState,
  upstreamState,
  generateGreetingDisplayEmail,
}) => {
  const [state, setState] = useState({
    postcodeError: "",
    postcode: "",
    bots: "",
    isLoading: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const { postcodeError, isLoading } = state;
  const { dropDownOpen } = upstreamState;

  const dropdownRef = useRef();

  //if the dropdown postcode is opened, on 'don't see your MP' this scrolls the page down to it
  useEffect(() => {
    const { current } = dropdownRef;
    current &&
      current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    window.scrollBy(0, 100);
  }, [dropDownOpen]);

  // const postToApi = async (postcode) => {
  //   setState({ ...state, isLoading: true });
  //   const response = await fetch(`/api/postcode/${postcode}`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.error) {
  //         setState({ ...state, isLoading: false, postcodeError: data.error });
  //       } else {
  //         passDataUpstream({ mpData: data });
  //         setState({ ...state, isLoading: false, postcodeError: "" });
  //       }
  //     });
  //   return response;
  // };
  const handleValidation = (e) => {
    e.preventDefault();
    let { value } = e.target;
    if (value) {
      // Replace everything coming from outside the set to empty string. This will protect us from users
      // crashing our website when entering bad regex
      value = value.replace(/[^a-zA-ZäöåÄÖÅ \n\.-]+/, "");
      const mp = mpsList.find((mp) => mp.Member.match(value));
      setSubmitted(true);

      if (mp) {
        passDataUpstream({
          mpData: {
            full_name: mp.Member,
            name: mp.Member.split(" ")[0],
            constituency: mp.Constituency,
            party: mp.party,
            error: "",
            mpEmailAddress: mp.Email,
          },
        });
      }
    }
  };

  return (
    <div>
      <div className="button-container" id="postcodeDropdown">
        <button
          className="btn btn-lg cta btn-outline-primary left-button"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            passDataUpstream({ dropDownOpen: true });
          }}
        >
          Ser du inte din riksdagsledamot?
        </button>

        {/* <button
          className="btn btn-lg cta btn-primary right-button "
          type="submit"
          onClick={(e) => {
            if (upstreamState.mps.length < 1) {
              alert("Välj minst en!");
              return;
            }
            e.preventDefault();
            setState({ ...state, dropDownOpen: false });
            passDataUpstream({ emailVisible: true });

            const greetings = ["Kära", "Till", "Hej"];
            function rand(items) {
              // "|" for a kinda "int div"
              return items[(items.length * Math.random()) | 0];
            }

            const generatedGreeting = upstreamState.mps.reduce((acc, el, i) => {
              // Skip coma in first MP

              const memberArray = el.Member.split(" ");

              const lastName = memberArray[memberArray.length - 1];
              // Check if last name exists
              const firstAndLastName =
                memberArray[0] + " " + (lastName ? lastName : "");
              if (i === 0) {
                return acc + " " + firstAndLastName;
              }

              // Add and to the last MP
              if (i === upstreamState.mps.length - 1) {
                return acc + " och " + firstAndLastName;
              }

              return acc + ", " + firstAndLastName;
            }, rand(greetings));

            setUpstreamState((state) => {
              return {
                ...state,
                greeting: generatedGreeting,
                emailWithGreeting:
                  generatedGreeting + "\n\n" + state.generatedEmailBody,
              };
            });
          }}
        >
          Ja, fortsätt med denna riksdagsledamot
        </button> */}
      </div>

      {dropDownOpen && (
        <>
          {submitted && (
            <div>
              <DisplayMp mp={mp}></DisplayMp>
            </div>
          )}
          <form
            className="get-MP-form"
            id="postcodeDropdown"
            ref={dropdownRef}
            onChange={handleValidation}
            onSubmit={handleValidation}
          >
            <label htmlFor="postcode" className="postcode-label">
              Name:
            </label>
            <input type="text" name="postcode" className="postcode-input" />
            <input
              type="checkbox"
              className="bots"
              name="bots"
              tabIndex="-1"
              autoComplete="off"
            />
            {submitted && (
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => {
                    if (!upstreamState.mpData.mpEmailAddress) {
                      console.trace("no email");
                    }
                    generateGreetingDisplayEmail({
                      Member: upstreamState.mpData.full_name,
                      Constituency: upstreamState.mpData.constituency,
                      party: upstreamState.mpData.party,
                      Email: upstreamState.mpData.mpEmailAddress,
                    });
                  }}
                >
                  Lägg till mp
                </button>
              </div>
            )}

            <div className="form-messages">
              {postcodeError && !isLoading && (
                <div className="error postcode-error">{postcodeError}</div>
              )}
              {isLoading && <div className="loading">Fetching your MP...</div>}
            </div>
          </form>
        </>
      )}
    </div>
  );
};
export default MpForm;
