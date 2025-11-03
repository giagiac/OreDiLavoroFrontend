import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Stack } from "@mui/material";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { ButtonTipoTrasferta } from "../../../../components/button-tipo-trasferta";
import { useRouter } from "next/navigation";
import FlightTakeoffTwoToneIcon from "@mui/icons-material/FlightTakeoffTwoTone";
import {
  useGetEpsNestjsOrpEffCicliEsecQuery,
  useGetMeQuery,
} from "./queries/queries";
import HTTP_CODES_ENUM from "../../../../services/api/types/http-codes";
import { User } from "../../../../services/api/types/user";
import useAuth from "../../../../services/auth/use-auth";
import FactoryTwoToneIcon from "@mui/icons-material/FactoryTwoTone";

type CardAttenzioneProps = {
  onFuoriSedeClick?: () => void;
  onInSedeClick?: () => void;
};

const CardAttenzione: React.FC<CardAttenzioneProps> = ({
  onFuoriSedeClick = () => {},
  onInSedeClick = () => {},
}) => {
  return (
    // Il componente Card ha una elevazione di default (shadow) che lo mette in "rilievo".
    // Puoi modificarla con la prop 'elevation' (es. elevation={8}) se desideri una maggiore ombra.
    <Card elevation={5}>
      <CardContent>
        <Box sx={{}}>
          <Typography
            variant="h4"
            component="div"
            fontWeight="bold"
            color="orange"
          >
            <LightbulbIcon color="warning" sx={{ fontSize: "1.5rem", mr: 2 }} />
            Attenzione :
          </Typography>
        </Box>

        <Typography variant="h5" mt={2}>
          scegli <b>fuori sede</b> o <b>in sede</b> in base al pranzo:
        </Typography>

        <Stack direction="column" spacing={1} mt={2} ml={2}>
          <Stack direction="row" display="flex" alignItems="center" ml={2}>
            <Typography variant="h6" gutterBottom width={250}>
              Pranzo fuori sede →
            </Typography>
            <ButtonTipoTrasferta
              sx={{ size: 2, mr: 2 }}
              size="small"
              tipoTrasfertaButton="fuori_sede_button"
              label="Fuori Sede"
              onClickAction={onFuoriSedeClick}
              endIcon={<FlightTakeoffTwoToneIcon />}
            />
          </Stack>
          <Stack direction="row" display="flex" alignItems="center" ml={2}>
            <Typography variant="h6" gutterBottom width={250}>
              Pranzo in officina →
            </Typography>
            <ButtonTipoTrasferta
              size="small"
              sx={{ size: 2, mr: 2 }}
              tipoTrasfertaButton="in_sede_button"
              label="In Sede"
              onClickAction={onInSedeClick}
              endIcon={<FactoryTwoToneIcon />}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CardAttenzione;
