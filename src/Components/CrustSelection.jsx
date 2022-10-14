import React from "react";
import "./Styles.css";

const CrustSelection = (props) => {
  const { crusts, title, selectedCrustOption, setCrustOption } = props;
  if (!crusts) {
    return <div></div>
  } 
  return (
    <div>
      <div className="title-card">
        <div className="title-container">1. {title}</div>
        <div className="crust-size-card">
          <div className="crust-size-circle">12"</div>
          <div className="crust-size-text">Medium</div>
        </div>
        <hr
          className="hr-style"
          style={{
            width: "450px",
          }}
        ></hr>
        <div className="selection-wrapper">
          {crusts.map((crust, idx) => {
            return (
              <form>
                <div key={idx}>
                  <div
                    className="selection-card"
                    style={
                      selectedCrustOption === crust?.name
                        ? { backgroundColor: "pink" }
                        : {}
                    }
                  >
                    <input
                      className="radio-card"
                      type="radio"
                      checked={selectedCrustOption.includes(crust?.name)} // checkedOption['Brooklyn Style']
                      value={crust?.name}
                      name="choice"
                      onChange={() => {
                        setCrustOption(crust);
                        // console.log(crust?.name);
                      }}
                    />
                    <label className="selection-container">{crust?.name}</label>
                  </div>
                </div>
              </form>
            );
          })}
        </div>
      </div>
      
    </div>
  );
};

export default CrustSelection;
