import React, { useState, useEffect } from "react";
import axios from "axios";
import Autosuggest from "react-autosuggest";

const hereMapAPIKey = "DZm9Ia3wXJqJ5I34OnYcH4p_r1G3uOuvnHfTb5QsQwo";
const hereMapAutoCompleteURL =
  "https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json";

const HereMap = (props) => {
  const [autoCompleteData, setAutoCompleteData] = useState([]);
  const [value, setValue] = React.useState("");
  const [suggestions, setSuggestions] = React.useState([]);

  const theme = {
    suggestionsContainerOpen: {
      display: "block",
      position: "absolute",
      width: "100%",
      border: "1px solid #aaa",
      listStyle: "none",
      zIndex: 10,
      backgroundColor: "rgb(255, 255, 255)",
      fontSize: 14,
      fontFamily: "sans-serif",
      maxHeight: "250px",
      overflow: "auto",
      padding: "5px 15px",
    },
    suggestionsList: {
      listStyleType: "none",
    },
    suggestion: {
      cursor: "pointer",
      padding: "5px 0px",
    },
    suggestionHighlighted: {
      backgroundColor: "rgba(114, 112, 112, 0.125)",
    },
    input: {
      border: "1px solid #ced4da",
      padding: "1rem .75rem",
      height: "calc(3.5rem + 2px)",
      borderRadius: "5px",
    },
  };

  const getSuggestionValue = (suggestion) => suggestion.name;

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    const suggestValues =
      inputLength === 0
        ? []
        : autoCompleteData.filter((item) =>
            item.name.toLowerCase().includes(inputValue)
          );
    return suggestValues;
  };

  const renderSuggestion = (suggestion) => <div>{suggestion.name}</div>;

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => setSuggestions([]);

  const inputProps = {
    placeholder: "Search location",
    value,
    onChange,
  };

  const params = {
    apiKey: hereMapAPIKey,
    query: value,
    maxresults: 20,
  };

  useEffect(() => {
    if (value.length > 3) {
      axios.get(hereMapAutoCompleteURL, { params }).then(function (response) {
        const suggestData = response.data.suggestions;
        const autoComplete = suggestData
          .filter(
            (item) =>
              item.address && item.address.postalCode && item.address.city
          )
          .map((val) => {
            return { name: val.label };
          });
        setAutoCompleteData(autoComplete);
        if (undefined !== suggestData && suggestData.length > 0) {
          const address = suggestData[0].address;
          const address2 = address.street ? address.street : "";
          const city = address.city ? address.city : "";

          props.setProfileInfo({
            ...props.profileInfo,
            address: address2,
            city: city,
            state: address.state,
            country: address.country,
          });
        }
      });
    }
    // eslint-disable-next-line
  }, [value]);

  return (
    <>
      <div className="card card-flat card-borderless mb-3">
        <div className="card-body">
          <div className="row">
            <div className="col-lg-12">
              <div className="">
                <Autosuggest
                  suggestions={suggestions}
                  onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={onSuggestionsClearRequested}
                  getSuggestionValue={getSuggestionValue}
                  renderSuggestion={renderSuggestion}
                  inputProps={inputProps}
                  theme={theme}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HereMap;
