import React from "react";

const DisplayMp = ({ mp }) => {
  return (
    <div className="displayMP" id="displayMP">
      <div
        className="mpCard text-center"
        style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}
      >
        <div className="error">{mp.error}</div>
        <div>{mp.full_name}</div>
      </div>
    </div>
  );
};
export default DisplayMp;
