import { useSnackbar } from "@/hooks/use-snackbar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useState } from "react";

export const NumericKeypad = ({
  onNumberChange,
}: {
  onNumberChange: (value: string) => void;
}) => {
  const [tempoOreOperatore, setTempoOreOperatore] = useState(0);
  const [tempoMinutiOperatore, setTempoMinutiOperatore] = useState(0);

  const { enqueueSnackbar } = useSnackbar();

  const updateTime = (newHours: number, newMinutes: number) => {
    if (newHours > 20 || (newHours === 20 && newMinutes > 0)) {
      enqueueSnackbar("Non puoi superare le 20:00 ore", {
        variant: "error",
      });
      return;
    }

    setTempoOreOperatore(newHours);
    setTempoMinutiOperatore(newMinutes);
    onNumberChange(
      `${newHours.toString().padStart(2, "0")}:${newMinutes
        .toString()
        .padStart(2, "0")}`
    );
  };

  const handleNumberClick = (number: number) => {
    const newHours = tempoOreOperatore * 10 + number;
    updateTime(newHours, tempoMinutiOperatore);
  };

  const handleMinuteClick = (minutes: number) => {
    const totalMinutes = tempoMinutiOperatore + minutes;
    let newHours = tempoOreOperatore;
    let newMinutes = totalMinutes;

    if (totalMinutes >= 60) {
      newHours += Math.floor(totalMinutes / 60);
      newMinutes = totalMinutes % 60;
    }

    updateTime(newHours, newMinutes);
  };

  const handleClearClick = () => {
    setTempoOreOperatore(0);
    setTempoMinutiOperatore(0);
    onNumberChange("00:00");
  };

  return (
    <Paper
      elevation={3}
      sx={(theme) => ({
        // mt: theme.spacing(3),
        pb: theme.spacing(3),
        minWidth: { xs: 290 },
      })}
    >
      <Grid container spacing={1}>
        <Grid container size={{ xs: 12 }} justifyContent="center">
          <Typography variant="h1" textAlign="center">
            {tempoOreOperatore.toString().padStart(2, "0")}:
            {tempoMinutiOperatore.toString().padStart(2, "0")}
          </Typography>
        </Grid>
        <Grid container size={{ xs: 12 }} justifyContent="center">
          <Grid>
            <Typography variant="caption" textAlign="center">
              {"ore"}
            </Typography>
          </Grid>
          {[1, 2, 3].map((row) => (
            <Grid container key={row} size={{ xs: 12 }} justifyContent="center">
              {[1, 2, 3].map((col) => {
                const number = (row - 1) * 3 + col;
                return (
                  <Grid key={number}>
                    <Button
                      color="info"
                      style={{
                        fontSize: "3rem",
                        width: "5rem",
                        height: "4rem",
                      }}
                      variant="outlined"
                      onClick={() => handleNumberClick(number)}
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
              <Button
                color="info"
                style={{ fontSize: "3rem", width: "5rem", height: "4rem" }}
                variant="outlined"
                onClick={() => handleNumberClick(0)}
              >
                0
              </Button>
            </Grid>
            <Grid>
              <Button
                color="info"
                style={{ width: "10.5rem", height: "4rem", fontSize: "1.5rem" }}
                variant="outlined"
                onClick={handleClearClick}
              >
                Cancella
              </Button>
            </Grid>
          </Grid>
          <hr style={{ width: "50%" }} />
          <Grid container size={{ xs: 12 }} mb={3} justifyContent="center">
            <Grid>
              <Typography variant="caption" textAlign="center">
                {"minuti"}
              </Typography>
            </Grid>
            <Grid container size={{ xs: 12 }} justifyContent="center">
              {[15, 30, 45].map((minute) => (
                <Grid key={minute}>
                  <Button
                    color="info"
                    style={{
                      fontSize: "1.5rem",
                      width: "5rem",
                      height: "4rem",
                    }}
                    variant="contained"
                    onClick={() => handleMinuteClick(minute)}
                  >
                    {minute}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};
