import React from "react";
import Maxtreo from "../Images/maxtreo.gif";

export default function SimpleSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50">
      <div className="flex flex-col items-center">
        <div className="flex justify-center items-center">
          {/* Just the GIF, larger size */}
          <img
            src={Maxtreo}
            alt="Loading..."
            className="h-40 w-40 object-contain"
          />
        </div>
      </div>
    </div>
  );
}