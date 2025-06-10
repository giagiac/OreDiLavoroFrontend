import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Star from "@mui/icons-material/Star";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Grid from "@mui/material/Grid2";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

export const NO_TARGA_MEZZI_SELECTED = "NO_TARGA_MEZZI_SELECTED";

const AnelloGiallo = () => {
  const theme = useTheme();
  return (
    <div
      style={{
        backgroundColor: "#003DA3",
        height: "100%",
        paddingTop: theme.spacing(1),
      }}
    >
      <div
        style={{
          position: "relative",
          marginLeft: theme.spacing(0.75),
          width: theme.spacing(3.125),
          height: theme.spacing(3.125),
          borderRadius: "50%",
          border: 2,
          borderColor: "#FFC300",
          borderStyle: "solid",
        }}
      />
    </div>
  );
};

const StelleEuropee = () => {
  const numStars = 10; // Numero di stelle
  const radius = 16; // Raggio del cerchio
  const starSize = 8; // Dimensione delle stelle

  const stars = [];
  for (let i = 0; i < numStars; i++) {
    const angle = (i / numStars) * 2 * Math.PI;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    stars.push(
      <Star // Usa Star invece di StarFill e aggiungi fill="#FFC300"
        key={i}
        style={{
          position: "absolute",
          left: `calc(50% + ${x}px - ${starSize / 2}px)`,
          top: `calc(50% + ${y}px - ${starSize / 2}px)`,
          width: starSize,
          height: starSize,
          color: "#FFC300", // Colore delle stelle
        }}
      />
    );
  }

  return (
    <div style={{ backgroundColor: "#003DA3", width: 100, height: "100%" }}>
      <div
        style={{
          width: 45,
          height: 50,
          position: "absolute", // Importante per posizionare le stelle relativamente a questo div
          display: "inline-block",
        }}
      >
        {stars}
      </div>
    </div>
  );
};

const TargaMezziTableReadonly = () => {
  // const searchParams = useSearchParams();

  // const codArt = searchParams.get("COD_ART");

  return (
    <>
      <Grid
        container
        direction="row"
        style={{
          borderRadius: 6,
          borderWidth: 4,
          borderStyle: "solid",
          borderColor: "black",
          boxShadow: `4px 4px 4px gray`,
        }}
        sx={{ mb: 3 }}
      >
        <Grid size={{ xs: 1 }}>
          <StelleEuropee />
        </Grid>
        <Grid size={{ xs: 10 }}>
          <Accordion sx={{ minHeight: 120 }} elevation={0}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{ flexFlow: "column", textAlign: "center" }}
            >
              <Typography variant="h4">
                {"Targa selezionata non trovata"}
              </Typography>
            </AccordionSummary>
          </Accordion>
        </Grid>
        <Grid size={{ xs: 1 }}>
          <AnelloGiallo />
        </Grid>
      </Grid>
    </>
  );
};

export default TargaMezziTableReadonly;
