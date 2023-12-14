import React from "react";

import "./Search.css";

export default function Search() {
  return (
    <div className="Search">
      <form>
        <input className="searchCity" type="text" placeholder="Enter a city" />
        <input className="goButton" type="submit" value="Go" />
        <button className="fas fa-location-arrow"></button>
      </form>
    </div>
  );
}
