import React, { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";

export const NumericKeypad = () => {
  const [numbers, setNumbers] = useState<string[]>([]);

  const handleNumberClick = (number: string) => {
    setNumbers((prevNumbers) => {
      const newNumbers = [...prevNumbers];
      newNumbers.unshift(number);
      return newNumbers.slice(0, 2);
    });
  };

  const handleClearClick = () => {
    setNumbers([]);
  };

  return (
    <Grid container spacing={1}>
      {[1, 2, 3].map((row) => (
        <Grid container key={row} size={{ xs: 12 }} justifyContent="center">
          {[1, 2, 3].map((col) => {
            const number = (row - 1) * 3 + col;
            return (
              <Grid key={number}>
                <Button
                  style={{ fontSize: "3rem", width: "5rem", height: "4rem" }}
                  variant="contained"
                  onClick={() => handleNumberClick(number.toString())}
                >
                  {number}
                </Button>
              </Grid>
            );
          })}
        </Grid>
      ))}
      <Grid container size={{ xs: 12 }} justifyContent="center">
        <Grid>
          <Button style={{ width: "10.5rem", height: "4rem", fontSize:"1.5rem" }} variant="contained" onClick={handleClearClick}>
            Cancella
          </Button>
        </Grid>
        <Grid>
          <Button style={{ fontSize: "3rem", width: "5rem", height: "4rem" }} variant="contained" onClick={() => handleNumberClick("0")}>
            0
          </Button>
        </Grid>
      </Grid>
      <Grid container size={{ xs: 12 }} justifyContent="center">
        <p>{numbers.join("")}</p>
      </Grid>
    </Grid>
  );
};
