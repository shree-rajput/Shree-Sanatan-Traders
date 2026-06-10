import React from "react";

function TrialCompo() {
  return (
    <div>
      <div
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        Right click me
      </div>
    </div>
  );
}

export default TrialCompo;
