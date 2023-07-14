// import React from "react";
// // import "../styling/redirectButtonStyle.css";

// const RedirectButton = (props) => {
//   //create an active state

//   const handleClick = () => {
//     window.location.href = props.buttonUrl;
//   };

//   return (
//     <button className="redirectButton" id="redbtn" onClick={handleClick}>
//       {props.buttonText}
//     </button>
//   );
// };

// export default RedirectButton;

import React from "react";
import { useLocation } from "react-router-dom";
import "../styling/redirectButtonStyle.css";

const RedirectButton = (props) => {
  const location = useLocation();

  const handleClick = () => {
    window.location.href = props.buttonUrl;
  };

  return (
    <button
      className={
        location.pathname === props.buttonUrl
          ? "redirectButton active"
          : "redirectButton"
      }
      id="redbtn"
      onClick={handleClick}
    >
      {props.buttonText}
    </button>
  );
};

export default RedirectButton;
