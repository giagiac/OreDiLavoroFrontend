"use client";

import { ButtonTipoTrasferta } from "@/components/button-tipo-trasferta";
import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import FlightTakeoffTwoToneIcon from "@mui/icons-material/FlightTakeoffTwoTone";
import HotelTwoToneIcon from "@mui/icons-material/HotelTwoTone";
import NightsStayTwoToneIcon from "@mui/icons-material/NightsStayTwoTone";
import WbSunnyTwoToneIcon from "@mui/icons-material/WbSunnyTwoTone";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import "dayjs/locale/it";
import { useRouter, useSearchParams } from "next/navigation";
import { OperatoreSelected } from "../opertore-selected";
dayjs.locale("it");

function FormCreateUser() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const COD_ART = searchParams.get("COD_ART");
  const km: number = parseFloat(searchParams.get("KM") || "0");
  const COD_OP = searchParams.get("COD_OP");
  const DATA_INIZIO = searchParams.get("DATA_INIZIO");

  const DATA_INIZIO_FORMATTED = DATA_INIZIO
    ? dayjs(DATA_INIZIO).format("ddd DD MMM YY")
    : "";

  return (
    <Container maxWidth="md" sx={{ m: 0, p: 1 }}>
      <Grid container>
        <Grid textAlign="right" size={12} mb={1}>
          <OperatoreSelected text="sei rientrato?" />
        </Grid>
        <Grid textAlign="right" size={12} mb={2}>
          <Typography variant="h6">{DATA_INIZIO_FORMATTED}</Typography>
        </Grid>
        <Grid size={12}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }} mb={5}>
              <ButtonTipoTrasferta
                tipoTrasfertaButton="not_defined"
                onClickAction={() => router.back()}
                label="Trasferta"
                startIcon={<ArrowBackTwoToneIcon />}
                endIcon={<FlightTakeoffTwoToneIcon />}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ButtonTipoTrasferta
                tipoTrasfertaButton="in_giornata"
                onClickAction={() =>
                  router.push(
                    `create/in_giornata?COD_ART=${COD_ART}&KM=${km}&COD_OP=${COD_OP}&DATA_INIZIO=${DATA_INIZIO}`
                  )
                }
                label="In giornata"
                endIcon={<WbSunnyTwoToneIcon />}
              />
            </Grid>
            <Grid size={{ xs: 12 }} mb={5}>
              <ButtonTipoTrasferta
                tipoTrasfertaButton="in_giornata_dopo_21"
                onClickAction={() =>
                  router.push(
                    `create/in_giornata_dopo_21?COD_ART=${COD_ART}&KM=${km}&COD_OP=${COD_OP}&DATA_INIZIO=${DATA_INIZIO}`
                  )
                }
                label="In giornata dopo le 21:00"
                endIcon={<NightsStayTwoToneIcon />}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ButtonTipoTrasferta
                tipoTrasfertaButton="not_defined"
                onClickAction={() =>
                  router.push(
                    `step3_FuoriSede?COD_ART=${COD_ART}&KM=${km}&COD_OP=${COD_OP}&DATA_INIZIO=${DATA_INIZIO}`
                  )
                }
                label="Pernotto fuori sede"
                endIcon={<HotelTwoToneIcon />}
                style={{ height: 80, fontSize: "1.5rem" }}
                fullWidth
                variant="outlined"
                color="primary"
                size="large"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

function CreateUser() {
  return <FormCreateUser />;
}

export default withPageRequiredAuth(CreateUser, {
  roles: [RoleEnum.ADMIN, RoleEnum.AUTISTA, RoleEnum.USER, RoleEnum.BADGE],
});
