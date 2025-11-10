"use client";

import { ButtonTipoTrasferta } from "@/components/button-tipo-trasferta";
import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import FlightTakeoffTwoToneIcon from "@mui/icons-material/FlightTakeoffTwoTone";
import NightsStayTwoToneIcon from "@mui/icons-material/NightsStayTwoTone";
import WbSunnyTwoToneIcon from "@mui/icons-material/WbSunnyTwoTone";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { OperatoreSelected } from "../opertore-selected";
import HourglassTopTwoToneIcon from "@mui/icons-material/HourglassTopTwoTone";
import TrendingUpTwoToneIcon from "@mui/icons-material/TrendingUpTwoTone";
import UTurnLeftTwoToneIcon from "@mui/icons-material/UTurnLeftTwoTone";
import { useState } from "react";
import MonetizationOnTwoToneIcon from "@mui/icons-material/MonetizationOnTwoTone";
import "dayjs/locale/it";
import { Stack } from "@mui/material";

dayjs.locale("it");

function FormCreateUser() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const [showMissionPanel, setShowMissionPanel] = useState(false);

  const COD_ART = searchParams.get("COD_ART");
  const km: number = parseFloat(searchParams.get("KM") || "0");
  const COD_OP = searchParams.get("COD_OP");
  const DATA_INIZIO = searchParams.get("DATA_INIZIO");

  const DATA_INIZIO_FORMATTED = DATA_INIZIO
    ? dayjs(DATA_INIZIO).format("ddd DD MMM YY")
    : "";

  const handleNavigate = (url: string) => {
    if (window.location.pathname.indexOf("manage-badge") > -1) {
      router.push(url, { scroll: true });
    } else {
      router.push(url, { scroll: true });
    }
  };

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
                label="Fuori sede"
                startIcon={<ArrowBackTwoToneIcon />}
                endIcon={<FlightTakeoffTwoToneIcon />}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Grid container alignItems="center" sx={{ width: "100%" }}>
                <Grid size={{ xs: 1 }}>
                  <LocalShippingIcon sx={{ fontSize: 48 }} />
                </Grid>
                <Grid size="grow">
                  <Grid container direction="column" alignItems="center">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "90%",
                        mb: 0.5,
                      }}
                    >
                      <Box
                        sx={{
                          flexGrow: 1,
                          height: "2px",
                          bgcolor: "text.primary",
                        }}
                      />
                      <Box
                        sx={{
                          width: 0,
                          height: 0,
                          borderTop: "5px solid transparent",
                          borderBottom: "5px solid transparent",
                          borderLeft: "5px solid",
                          borderLeftColor: "text.primary",
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "90%",
                      }}
                    >
                      <Box
                        sx={{
                          width: 0,
                          height: 0,
                          borderTop: "5px solid transparent",
                          borderBottom: "5px solid transparent",
                          borderRight: "5px solid",
                          borderRightColor: "text.primary",
                        }}
                      />
                      <Box
                        sx={{
                          flexGrow: 1,
                          height: "2px",
                          bgcolor: "text.primary",
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
                <Grid size={{ xs: 1 }} alignItems="center">
                  <Stack direction="column" alignItems="center" spacing={0}>
                    <Typography variant="h6">x2</Typography>
                    <MonetizationOnTwoToneIcon sx={{ fontSize: 28 }} />
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ButtonTipoTrasferta
                tipoTrasfertaButton="in_giornata"
                onClickAction={() =>
                  handleNavigate(
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
                  handleNavigate(
                    `create/in_giornata_dopo_21?COD_ART=${COD_ART}&KM=${km}&COD_OP=${COD_OP}&DATA_INIZIO=${DATA_INIZIO}`
                  )
                }
                label="In giornata dopo le 21:00"
                endIcon={<NightsStayTwoToneIcon />}
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid size={{ xs: 12 }}>
              <Grid container alignItems="center" sx={{ width: "100%" }}>
                <Grid size={{ xs: 1 }}>
                  <LocalShippingIcon sx={{ fontSize: 48 }} />
                </Grid>
                <Grid size="grow">
                  <Grid container direction="column" alignItems="center">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "90%",
                        mb: 0.5,
                      }}
                    >
                      <Box
                        sx={{
                          flexGrow: 1,
                          height: "2px",
                          bgcolor: "text.primary",
                        }}
                      />
                      <Box
                        sx={{
                          width: 0,
                          height: 0,
                          borderTop: "5px solid transparent",
                          borderBottom: "5px solid transparent",
                          borderLeft: "5px solid",
                          borderLeftColor: "text.primary",
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
                <Grid size={{ xs: 1 }} alignItems="center">
                  <Stack direction="column" alignItems="center" spacing={0}>
                    <Typography variant="h6">x1</Typography>
                    <MonetizationOnTwoToneIcon sx={{ fontSize: 28 }} />
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ButtonTipoTrasferta
                tipoTrasfertaButton="fuori_sede_andata"
                onClickAction={() =>
                  handleNavigate(
                    `create/fuori_sede_andata?COD_ART=${COD_ART}&KM=${km}&COD_OP=${COD_OP}&DATA_INIZIO=${DATA_INIZIO}`
                  )
                }
                endIcon={<TrendingUpTwoToneIcon />}
                label="Andata con pernotto"
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
                        handleNavigate(
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
                        handleNavigate(
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
                        handleNavigate(
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
                        handleNavigate(
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
                        handleNavigate(
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
                  handleNavigate(
                    `create/fuori_sede_ritorno_in_giornata?COD_ART=${COD_ART}&KM=${km}&COD_OP=${COD_OP}&DATA_INIZIO=${DATA_INIZIO}`
                  )
                }
                endIcon={<UTurnLeftTwoToneIcon />}
                label="Ritorno in giornata dalla trasferta"
              />
            </Grid>
            <Grid size={{ xs: 12 }} mb={5}>
              <ButtonTipoTrasferta
                tipoTrasfertaButton="fuori_sede_ritorno_dopo_21"
                onClickAction={() =>
                  handleNavigate(
                    `create/fuori_sede_ritorno_dopo_21?COD_ART=${COD_ART}&KM=${km}&COD_OP=${COD_OP}&DATA_INIZIO=${DATA_INIZIO}`
                  )
                }
                endIcon={<NightsStayTwoToneIcon />}
                label="Ritorno in giornata dalla trasferta dopo le 21:00"
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
