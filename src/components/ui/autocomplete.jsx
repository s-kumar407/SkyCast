"use client";
import React, { useState } from "react";
import Autosuggest from "react-autosuggest";
import { Card } from "./card";
import { styled } from "@stitches/react";
import { Button } from "./button";
import { useEffect } from "react";
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
const Autocomplete = ({ searchCity, cities }) => {
  let [inputBoxValue, setInputBoxValue] = useState("");
  let [realInputBoxValue, setRealInputBoxValue] = useState("");
  let [suggestions, setSuggestions] = useState([]);
  let [isSelected, setIsSelected] = useState(false);
  useEffect(() => {
    changeInputBoxValue();
  }, [isSelected]);

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

  function changeInputBoxValue() {
    setInputBoxValue(realInputBoxValue);
  }

  const handleSuggestionClick = (row) => {
    setIsSelected(!isSelected);
    setRealInputBoxValue(row.name);
    setSuggestions([]);
  };

  const renderSuggestion = () => (
    <SuggestionList>
      {suggestions.map((row, index) => (
        <SuggestionItem key={index} onClick={() => handleSuggestionClick(row)}>
          {row.name}
        </SuggestionItem>
      ))}
    </SuggestionList>
  );

  const onKeyDown = async (event) => {
    if (event.key === "Enter") {
      await searchCity(inputBoxValue);
      setInputBoxValue("");
    }
  };

  async function findCity() {
    await searchCity(inputBoxValue);
    setInputBoxValue("");
  }

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row justify-center items-center ">
        <div className="flex-grow mr-2 border-2 border-black border-double rounded">
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={(suggestion) => suggestion.name}
            renderSuggestion={renderSuggestion}
            inputProps={{
              placeholder: `Type something...`,
              value: inputBoxValue,
              onChange: (event, { newValue }) => setInputBoxValue(newValue),
              onKeyDown,
            }}
          />
        </div>

        <Button
          variant="outline"
          onClick={findCity}
          className="bg-black text-white m-2 md:ml-auto"
          style={{ marginTop: '1rem' }}
        >
          Search
        </Button>
      </div>
    </div>
  );
};

export default Autocomplete;
