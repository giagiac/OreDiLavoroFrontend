"use client";

import { ButtonTipoTrasferta } from "@/components/button-tipo-trasferta";
import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import FlightTakeoffTwoToneIcon from "@mui/icons-material/FlightTakeoffTwoTone";
import HourglassTopTwoToneIcon from "@mui/icons-material/HourglassTopTwoTone";
import TrendingUpTwoToneIcon from "@mui/icons-material/TrendingUpTwoTone";
import UTurnLeftTwoToneIcon from "@mui/icons-material/UTurnLeftTwoTone";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { OperatoreSelected } from "../opertore-selected";
import dayjs from "dayjs";
import "dayjs/locale/it";
import Typography from "@mui/material/Typography";
import NightsStayTwoToneIcon from "@mui/icons-material/NightsStayTwoTone";
dayjs.locale("it");

function FormCreateUser() {
  const router = useRouter();

  const [showMissionPanel, setShowMissionPanel] = useState(false);

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
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid size={{ xs: 12 }} mb={5}>
              <ButtonTipoTrasferta
                tipoTrasfertaButton="not_defined"
                onClickAction={() => router.back()}
                startIcon={<ArrowBackTwoToneIcon />}
                endIcon={<FlightTakeoffTwoToneIcon />}
                label="Pernotto fuori sede"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ButtonTipoTrasferta
                tipoTrasfertaButton="fuori_sede_andata"
                onClickAction={() =>
                  router.push(
                    `create/fuori_sede_andata?COD_ART=${COD_ART}&KM=${km}&COD_OP=${COD_OP}&DATA_INIZIO=${DATA_INIZIO}`
                  )
                }
                endIcon={<TrendingUpTwoToneIcon />}
                label="Andata"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ButtonTipoTrasferta
                tipoTrasfertaButton="not_defined"
                onClickAction={() => setShowMissionPanel(!showMissionPanel)}
                endIcon={<HourglassTopTwoToneIcon />}
                label="Ancora in trasferta"
              />
              <div
                style={{
                  maxHeight: showMissionPanel ? "500px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.5s ease-in-out",
                }}
              >
                <Grid
                  container
                  spacing={2}
                  sx={(theme) => ({
                    marginTop: theme.spacing(6),
                    marginBottom: theme.spacing(6),
                    opacity: showMissionPanel ? 1 : 0,
                    transition: "opacity 0.5s ease-in-out",
                  })}
                >
                  <Grid size={{ xs: 12 }}>
                    <ButtonTipoTrasferta
                      tipoTrasfertaButton="ancora_in_trasferta_0"
                      onClickAction={() =>
                        router.push(
                          `create/ancora_in_trasferta_0?COD_ART=${COD_ART}&KM=0&COD_OP=${COD_OP}&DATA_INIZIO=${DATA_INIZIO}`
                        )
                      }
                      label="0 km"
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <ButtonTipoTrasferta
                      tipoTrasfertaButton="ancora_in_trasferta_10"
                      onClickAction={() =>
                        router.push(
                          `create/ancora_in_trasferta_10?COD_ART=${COD_ART}&KM=10&COD_OP=${COD_OP}&DATA_INIZIO=${DATA_INIZIO}`
                        )
                      }
                      label="10 km"
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <ButtonTipoTrasferta
                      tipoTrasfertaButton="ancora_in_trasferta_20"
                      onClickAction={() =>
                        router.push(
                          `create/ancora_in_trasferta_20?COD_ART=${COD_ART}&KM=20&COD_OP=${COD_OP}&DATA_INIZIO=${DATA_INIZIO}`
                        )
                      }
                      label="20 km"
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <ButtonTipoTrasferta
                      tipoTrasfertaButton="ancora_in_trasferta_30"
                      onClickAction={() =>
                        router.push(
                          `create/ancora_in_trasferta_30?COD_ART=${COD_ART}&KM=30&COD_OP=${COD_OP}&DATA_INIZIO=${DATA_INIZIO}`
                        )
                      }
                      label="30 km"
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <ButtonTipoTrasferta
                      tipoTrasfertaButton="ancora_in_trasferta_40"
                      onClickAction={() =>
                        router.push(
                          `create/ancora_in_trasferta_40?COD_ART=${COD_ART}&KM=40&COD_OP=${COD_OP}&DATA_INIZIO=${DATA_INIZIO}`
                        )
                      }
                      label="40 km"
                    />
                  </Grid>
                </Grid>
              </div>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ButtonTipoTrasferta
                tipoTrasfertaButton="fuori_sede_ritorno_in_giornata"
                onClickAction={() =>
                  router.push(
                    `create/fuori_sede_ritorno_in_giornata?COD_ART=${COD_ART}&KM=${km}&COD_OP=${COD_OP}&DATA_INIZIO=${DATA_INIZIO}`
                  )
                }
                endIcon={<UTurnLeftTwoToneIcon />}
                label="Ritorno in giornata"
              />
            </Grid>
            <Grid size={{ xs: 12 }} mb={5}>
              <ButtonTipoTrasferta
                tipoTrasfertaButton="fuori_sede_ritorno_dopo_21"
                onClickAction={() =>
                  router.push(
                    `create/fuori_sede_ritorno_dopo_21?COD_ART=${COD_ART}&KM=${km}&COD_OP=${COD_OP}&DATA_INIZIO=${DATA_INIZIO}`
                  )
                }
                endIcon={<NightsStayTwoToneIcon />}
                label="Ritorno dopo le 21:00"
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
