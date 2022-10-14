const SauceSelection = (props) => {
  const { title, names, selectedSauceOption, setSauceOption } = props;
  return (
    <div>
      <div className = 'title-card'>
        <div className='title-container'>2. {title}</div>
        <div className= 'selection-wrapper'>
          {names.map((name, idx) => {
            return (
              <form>
              <div key={idx}>
                <label
                  className="sauce-selection-container"
                  style={
                    selectedSauceOption === name
                      ? { "backgroundColor": "pink" }
                      : {}
                  }
                >
                  <input
                    type="radio"
                    checked={selectedSauceOption === name}
                    value={name}
                    name="choice"
                    onChange={() => {
                      setSauceOption(name);
                      // console.log(name);
                    }}
                  />
                  {name}
                </label>
              </div>
            </form>
                );
          })}
        </div>  
      </div>
    </div>
  );
};

export default SauceSelection;
