import AirportShuttleTwoToneIcon from "@mui/icons-material/AirportShuttleTwoTone";
import FactoryTwoToneIcon from "@mui/icons-material/FactoryTwoTone";
import HourglassTopTwoToneIcon from "@mui/icons-material/HourglassTopTwoTone";
import NightsStayTwoToneIcon from "@mui/icons-material/NightsStayTwoTone";
import TrendingUpTwoToneIcon from "@mui/icons-material/TrendingUpTwoTone";
import UTurnLeftTwoToneIcon from "@mui/icons-material/UTurnLeftTwoTone";
import WbSunnyTwoToneIcon from "@mui/icons-material/WbSunnyTwoTone";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Stack, styled, useTheme } from "@mui/system";
import React, { ReactElement } from "react";
import { TipoTrasfertaColors } from "../constants/theme-colors";
import { TipoTrasferta } from "../services/api/types/eps-nestjs-orp-eff-cicli-esec";

export interface TipoTrasfertaProps {
  tipotrasferta: TipoTrasferta;
  children?: ReactElement;
}

const StyledPaper = styled(Paper)(({
  tipotrasferta,
}: {
  tipotrasferta: TipoTrasferta;
}) => {
  const theme = useTheme();

  const color =
    theme.palette.mode === "dark"
      ? TipoTrasfertaColors[tipotrasferta].dark
      : TipoTrasfertaColors[tipotrasferta].light;

  return {
    padding: theme.spacing(1.5),
    backgroundColor: color.main,
    color: theme.palette.getContrastText(color.main),
    "&:hover": {
      backgroundColor: color.hover,
    },
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
      icon = <WbSunnyTwoToneIcon />;
      descrizione = "in giornata";
      break;
    case "in_giornata_dopo_21":
      icon = <NightsStayTwoToneIcon />;
      descrizione = "in giornata dopo 21:00";
      break;
    case "fuori_sede_andata":
      icon = <TrendingUpTwoToneIcon />;
      descrizione = "fuori sede andata";
      break;
    case "fuori_sede_ritorno_in_giornata":
      icon = <UTurnLeftTwoToneIcon />;
      descrizione = "fuori sede ritorno in giornata";
      break;
    case "fuori_sede_ritorno_dopo_21":
      icon = <NightsStayTwoToneIcon />;
      descrizione = "fuori sede ritorno dopo le 21:00";
      break;
    case "ancora_in_trasferta_0":
      icon = <HourglassTopTwoToneIcon />;
      descrizione = "ancora in trasferta 0";
      break;
    case "ancora_in_trasferta_10":
      icon = <HourglassTopTwoToneIcon />;
      descrizione = "ancora in trasferta 10";
      break;
    case "ancora_in_trasferta_20":
      icon = <HourglassTopTwoToneIcon />;
      descrizione = "ancora in trasferta 20";
      break;
    case "ancora_in_trasferta_30":
      icon = <HourglassTopTwoToneIcon />;
      descrizione = "ancora in trasferta 30";
      break;
    case "ancora_in_trasferta_40":
      icon = <HourglassTopTwoToneIcon />;
      descrizione = "ancora in trasferta 40";
      break;
    case "step1_km_autista":
      icon = <AirportShuttleTwoToneIcon />;
      descrizione = "Km Autista";
      break;
  }

  return (
    <StyledPaper tipotrasferta={tipotrasferta} elevation={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="column">
          {icon}
          <Typography variant="caption">{descrizione}</Typography>
        </Stack>
        {children}
      </Stack>
    </StyledPaper>
  );
};
export default TipoTrasfertaComponent;
