import { useSnackbar } from "@/hooks/use-snackbar";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import { useState } from "react";

export const NumericKeypadKm = ({
  onChange: onChange,
}: {
  onChange: (value: string) => void;
}) => {
  const [currentValue, setCurrentValue] = useState(0);

  const { enqueueSnackbar } = useSnackbar();

  const updateValue = (newValue: number) => {
    if (newValue > 9999) {
      enqueueSnackbar("Non puoi superare 9999 km", {
        variant: "error",
      });
      return;
    }

    setCurrentValue(newValue);
    onChange(newValue.toString());
  };

  const handleNumberClick = (number: number) => {
    const newValue = currentValue * 10 + number;
    updateValue(newValue);
  };

  const handleClearClick = () => {
    setCurrentValue(0);
    onChange("0");
  };

  return (
    <Grid mt={4} container spacing={1}>
      <Grid container size={{ xs: 12 }} justifyContent="center">
        <Stack direction="column">
          <Paper
            style={{ borderRadius: 5 }}
            elevation={3}
            sx={(theme) => ({
              paddingLeft: theme.spacing(1),
              paddingRight: theme.spacing(1),
            })}
          >
            <Typography variant="h1" textAlign="center">
              {currentValue.toString().padStart(4, "0")}
            </Typography>
          </Paper>
        </Stack>
      </Grid>
      <Grid container size={{ xs: 12 }} justifyContent="center">
        {[1, 2, 3].map((row) => (
          <Grid container key={row} size={{ xs: 12 }} justifyContent="center">
            {[1, 2, 3].map((col) => {
              const number = (row - 1) * 3 + col;
              return (
                <Grid key={number}>
                  <Button
                    color="info"
                    style={{ fontSize: "3rem", width: "5rem", height: "4rem" }}
                    variant="contained"
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
              variant="contained"
              onClick={() => handleNumberClick(0)}
            >
              0
            </Button>
          </Grid>
          <Grid>
            <Button
              color="info"
              style={{ width: "10.5rem", height: "4rem", fontSize: "1.5rem" }}
              variant="contained"
              onClick={handleClearClick}
            >
              Cancella
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
