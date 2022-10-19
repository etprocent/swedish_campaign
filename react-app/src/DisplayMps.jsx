import React from "react";

const DisplayMps = ({ mps, setState }) => {
  console.log(mps);
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
                console.log("clicked");
                setState((state) => ({
                  ...state,
                  mps: [
                    ...state.mps.filter(
                      (mpClick) => mpClick.Member !== mp.Member
                    ),
                  ],
                }));
              }}
            >
              <div style={{ display: "flex", gap: "5px" }}>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="44"
                    height="44"
                    fill="currentColor"
                    className="bi bi-x"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </div>
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
