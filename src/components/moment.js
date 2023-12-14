import React from "react";

import "./City.css";

export default function City() {
  let currentLocation = {
    city: "Vancouver",
    day: "Wednesday 09:00",
  };
  return (
    <div className="City">
      <h1> {currentLocation.city} </h1>
      <p className="currentDay"> {currentLocation.day} </p>
      <p className="currently">currently</p>
    </div>
  );
}
