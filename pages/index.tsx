import React, { useEffect, useState } from "react";
import { Button, Autocomplete, TextField, Checkbox, Stack, Typography } from "@mui/material";
import { AutocompleteChangeReason, AutocompleteChangeDetails } from "@mui/material/Autocomplete";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import SendIcon from "@mui/icons-material/Send";


function index() {
  
  //Endpoint1 is the http request for when the button is clicked
  //Endpoint2 is the http request for the autocomplete options when the site loads
  const apiEndpoint1 = process.env.ENDPOINT1 as string
  const apiEndpoint2 = process.env.ENDPOINT2 as string

  //Checkbox Autocomplete settings
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  //Options for Checkbox Autocompletes
  const [champKeys, setChampKeys] = useState<string[]>([]);
  const [traitKeys, setTraitKeys] = useState<string[]>([]);

  //Overriding Button Styles
  const [isHovered, setIsHovered] = useState(false);
  const buttonStyle = {
    backgroundColor: isHovered ? "#1565c0" : "#1976d2",
  };

  //User selected options
  const [selectedIncludedChamps, setSelectedIncludedChamps] = useState<string[]>([]);
  const [selectedExcludedChamps, setSelectedExcludedChamps] = useState<string[]>([]);
  const [selectedPriorityTraits, setSelectedPriorityTraits] = useState<string[]>([]);

  //Output information
  const [optimalBoard, setOptimalBoard] = useState("____");
  const [traitInfo, setTraitInfo] = useState("____");
  const [traitSynergyScore, settraitSynergyScore] = useState("____");

  const handleIncludedChampsChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: readonly string[],
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<string> | undefined
  ) => {
    setSelectedIncludedChamps(value as string[]);
  };

  const handleExcludedChampsChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: readonly string[],
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<string> | undefined
  ) => {
    setSelectedExcludedChamps(value as string[]);
  };

  const handlePriorityChampsChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: readonly string[],
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<string> | undefined
  ) => {
    setSelectedPriorityTraits(value as string[]);
  };

  //Button Click
  const handleSubmission = async () => {
    const data = {
      includedChamps: selectedIncludedChamps,
      excludedChamps: selectedExcludedChamps,
      priorityTraits: selectedPriorityTraits,
    };

    try {
        const response = await fetch(apiEndpoint1 , {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

      if (response.ok) {
        const responseData = await response.json();

        const optimalBoard = responseData[0].join(", ");
        const traitInfo = responseData[1].join(", ");
        const traitSynergyScore = responseData[2];

        setOptimalBoard(optimalBoard);
        setTraitInfo(traitInfo);
        settraitSynergyScore(traitSynergyScore);
      } 
      else {
        // Handle error response
      }
    } 
    catch (error) {
        console.error("Error:", error);
    }
  };

  //Checkbox Options
  useEffect(() => {
    fetch(apiEndpoint2)
      .then((response) => response.json())
      .then((data) => {
        const champKeys = Object.keys(data.champs);
        const traitKeys = Object.keys(data.traits);

        setChampKeys(champKeys);
        setTraitKeys(traitKeys);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <div className="index">
      <Stack spacing={8} alignItems="center" justifyContent="center">
        <Stack spacing={4} alignItems="center" justifyContent="center">
        <Typography variant="h5"><b>Select Model Parameters</b></Typography>
          <Autocomplete
            multiple
            id="included_champs_selector"
            options={champKeys}
            disableCloseOnSelect
            value={selectedIncludedChamps}
            onChange={handleIncludedChampsChange}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option}
              </li>
            )}
            style={{ width: 500 }}
            renderInput={(params) => (
              <TextField {...params} label="Included Champions" />
            )}
          />

          <Autocomplete
            multiple
            id="excluded_champs_selector"
            options={champKeys}
            disableCloseOnSelect
            value={selectedExcludedChamps}
            onChange={handleExcludedChampsChange}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option}
              </li>
            )}
            style={{ width: 500 }}
            renderInput={(params) => (
              <TextField {...params} label="Excluded Champions" />
            )}
          />

          <Autocomplete
            multiple
            id="priority_traits_selector"
            options={traitKeys}
            disableCloseOnSelect
            value={selectedPriorityTraits}
            onChange={handlePriorityChampsChange}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option}
              </li>
            )}
            style={{ width: 500 }}
            renderInput={(params) => (
              <TextField {...params} label="Priority Traits" />
            )}
          />
          <Button
          style={buttonStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          variant="contained"
          onClick={handleSubmission}
          endIcon={<SendIcon />}
        >
          Submit Choices
        </Button>
        </Stack>
        

        <Typography><b>Selected Champions:</b> {optimalBoard}</Typography>
        <Typography><b>Active Traits: </b>{traitInfo} <b> with a total synergy score of </b> {traitSynergyScore}</Typography>
      </Stack>
    </div>
  );
}

export default index;
