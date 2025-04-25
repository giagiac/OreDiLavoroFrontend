import AirportShuttleTwoToneIcon from "@mui/icons-material/AirportShuttleTwoTone";
import FactoryTwoToneIcon from "@mui/icons-material/FactoryTwoTone";
import FlightTakeoffTwoToneIcon from "@mui/icons-material/FlightTakeoffTwoTone";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { Stack, styled, useTheme } from "@mui/system";
import React, { ReactElement } from "react";
import { TipoTrasferta } from "../services/api/types/eps-nestjs-orp-eff-cicli-esec";

export interface TipoTrasfertaProps {
  tipotrasferta: TipoTrasferta;
  children?: ReactElement;
}

// Costante per i colori di background in modalità light
export const backgroundColorsLight: Record<TipoTrasferta, string> = {
  in_sede: "#e0f7fa",
  in_giornata: "#fbe9e7",
  in_giornata_dopo_21: "#ffccbc",
  fuori_sede_andata: "#dcedc8",
  fuori_sede_ritorno: "#c5e1a5",
  ancora_in_missione_5: "#f8bbd0",
  ancora_in_missione_10: "#f48fb1",
  ancora_in_missione_15: "#ce93d8",
  ancora_in_missione_20: "#b39ddb",
  step1_KmAutista: "#9fa8da",
};

// Costante per i colori di background in modalità dark
export const backgroundColorsDark: Record<TipoTrasferta, string> = {
  in_sede: "#263238",
  in_giornata: "#3E2723",
  in_giornata_dopo_21: "#3E2723",
  fuori_sede_andata: "#1B5E20",
  fuori_sede_ritorno: "#1B5E20",
  ancora_in_missione_5: "#880E4F",
  ancora_in_missione_10: "#880E4F",
  ancora_in_missione_15: "#4A148C",
  ancora_in_missione_20: "#311B92",
  step1_KmAutista: "#1A237E",
};

const StyledPaper = styled(Paper)(({
  tipotrasferta,
}: {
  tipotrasferta: TipoTrasferta;
}) => {
  const theme = useTheme();
  return {
    padding: theme.spacing(1.5),
    minWidth: 200,
    backgroundColor:
      theme.palette.mode === "dark"
        ? backgroundColorsDark[tipotrasferta]
        : backgroundColorsLight[tipotrasferta],
    color: theme.palette.mode === "dark" ? "#fff" : "#000",
  };
});

const TipoTrasfertaComponent: React.FC<TipoTrasfertaProps> = ({
  tipotrasferta,
  children,
}) => {
  let descrizione = "";
  let icon = <AirportShuttleTwoToneIcon />;

  switch (tipotrasferta) {
    case "in_sede":
      icon = <FactoryTwoToneIcon />;
      descrizione = "in sede";
      break;
    case "in_giornata":
      icon = <FlightTakeoffTwoToneIcon />;
      descrizione = "in giornata";
      break;
    case "in_giornata_dopo_21":
      icon = <FlightTakeoffTwoToneIcon />;
      descrizione = "in giornata dopo 21";
      break;
    case "fuori_sede_andata":
      icon = <FlightTakeoffTwoToneIcon />;
      descrizione = "fuori sede andata";
      break;
    case "fuori_sede_ritorno":
      icon = <FlightTakeoffTwoToneIcon />;
      descrizione = "fuori sede ritorno";
      break;
    case "ancora_in_missione_5":
      icon = <FlightTakeoffTwoToneIcon />;
      descrizione = "ancora in missione 5";
      break;
    case "ancora_in_missione_10":
      icon = <FlightTakeoffTwoToneIcon />;
      descrizione = "ancora in missione 10";
      break;
    case "ancora_in_missione_15":
      icon = <FlightTakeoffTwoToneIcon />;
      descrizione = "ancora in missione 15";
      break;
    case "ancora_in_missione_20":
      icon = <FlightTakeoffTwoToneIcon />;
      descrizione = "ancora in missione 20";
      break;
    case "step1_KmAutista":
      icon = <AirportShuttleTwoToneIcon />;
      descrizione = "KmAutista";
      break;
  }

  return (
    <StyledPaper tipotrasferta={tipotrasferta} elevation={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="column">
          {icon}
          <Typography variant="body1">{descrizione}</Typography>
        </Stack>
        {children}
      </Stack>
    </StyledPaper>
  );
};
export default TipoTrasfertaComponent;
