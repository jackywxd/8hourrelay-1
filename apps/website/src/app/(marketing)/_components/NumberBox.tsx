import React from "react";

interface numProp {
  num: string | number;
  unit: string;
  flip: boolean;
}

export const NumberBox = ({ num, unit, flip }: numProp) => {
  return (
    <div className="countdown-item">
      <div className="number">{num}</div>
      <div className="unit">{unit}</div>
    </div>
  );
};
