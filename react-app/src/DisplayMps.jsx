import React from "react";

const DisplayMps = ({ mps, setState, generateGreetingDisplayEmail }) => {
  return (
    <div className="displayMP" id="displayMP">
      <h2 className="secondary-header">Hitta dina riksdagsledamöter</h2>
      <div
        className="mpCard text-center"
        style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}
      >
        {mps.map((mp, index) => (
          <React.Fragment key={index}>
            <button
              onClick={() => {
                setState((state) => ({
                  ...state,
                  dropDownOpen: false,

                  mpData: {
                    full_name: mp.Member,
                    name: mp.Member.split(" ")[0],
                    constituency: mp.Constituency,
                    party: mp.party,
                    error: "",
                    mpEmailAddress: mp.Email,
                  },
                }));
                generateGreetingDisplayEmail(mp);
              }}
            >
              <div style={{ display: "flex", gap: "5px" }}>
                <span>{mp.Member}</span>
              </div>
            </button>
          </React.Fragment>
        ))}
        {/* <div className="error">{error}</div>
        <div>{constituency}</div>
        <div>{name}</div>
        <div>{full_name}</div>
        <div>{party}</div>
        <div className="mpEmailAddress">{mpEmailAddress}</div> */}
      </div>
    </div>
  );
};
export default DisplayMps;

//: { constituency, full_name, party, name, error, mpEmailAddress },
