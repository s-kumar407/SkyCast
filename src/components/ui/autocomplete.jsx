import React, { useState } from "react";
import Autosuggest from "react-autosuggest";
import { Card, CardContent } from "./card";
import { styled } from "@stitches/react";
import { Button } from "./button";
const SuggestionList = styled("div", {
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  backgroundColor: "white",
  boxShadow:
    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  zIndex: 10,
  maxHeight: "200px",
  overflowY: "auto",
});

const SuggestionItem = styled(Card, {
  padding: "0.5rem",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
});
const Autocomplete = ({ searchCity, cities, onSuggestionSelected }) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const getSuggestions = async (value) => {
    const inputValue = value.trim().toLowerCase();

    const inputLength = inputValue.length;

    if (inputLength === 0) {
      return [];
    }

    return cities.filter(
      (city) => city.name.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  const onSuggestionsFetchRequested = async ({ value }) => {
    const suggestions = await getSuggestions(value);
    setSuggestions(suggestions);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelectedHandler = (event, { suggestion }) => {
    setValue(suggestion.name);
    onSuggestionSelected(suggestion);
  };

  const renderSuggestion = (suggestion) => (
    <SuggestionItem suggestion={suggestion} />
  );

  const onKeyDown = async(event) => {
    if (event.key === "Enter") {
      await searchCity(value);
      setValue("");
    }
  };

  async function findCity() {
    await searchCity(value);
    setValue("");
  }

  return (
    <div className="relative">
      <div className="flex justify-center items-center ">
      <div className="flex-grow mr-2">
        <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        onSuggestionSelected={onSuggestionSelectedHandler}
        getSuggestionValue={(suggestion) => suggestion.name}
        renderSuggestion={renderSuggestion}
        inputProps={{
          placeholder: "Type something...",
          value,
          onChange: (event, { newValue }) => setValue(newValue),
          onKeyDown,
        }}
        
      />

        </div>
    
      <Button variant="outline" onClick={findCity} className="bg-black text-white m-2">
        Search
      </Button>
      </div>
      {suggestions.length > 0 && (
        <SuggestionList>
          {suggestions.map((suggestion, index) => (
            <SuggestionItem key={index}>{suggestion.name}</SuggestionItem>
          ))}
        </SuggestionList>
      )}
    </div>
  );
};

export default Autocomplete;
