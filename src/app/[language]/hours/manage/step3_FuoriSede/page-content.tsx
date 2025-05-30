"use client";

import { ButtonTipoTrasferta } from "@/components/button-tipo-trasferta";
import useAuth from "@/services/auth/use-auth";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import FlightTakeoffTwoToneIcon from "@mui/icons-material/FlightTakeoffTwoTone";
import TrendingUpTwoToneIcon from "@mui/icons-material/TrendingUpTwoTone";
import UTurnLeftTwoToneIcon from "@mui/icons-material/UTurnLeftTwoTone";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useState } from "react";
import HourglassTopTwoToneIcon from "@mui/icons-material/HourglassTopTwoTone";
function FormCreateUser() {
  const router = useRouter();
  const { user } = useAuth();

  const [showMissionPanel, setShowMissionPanel] = useState(false);

  return (
    <Container maxWidth="md" sx={{ m: 0, p: 1 }}>
      <Grid container>
        <Grid textAlign="right" size={12} mb={10}>
          <Typography variant="h4" gutterBottom>
            {`${user?.firstName} ${user?.lastName}`} sei rientrato?
          </Typography>
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
                onClickAction={() =>
                  router.push("/hours/manage/step2_FuoriSede")
                }
                startIcon={<ArrowBackTwoToneIcon />}
                endIcon={<FlightTakeoffTwoToneIcon />}
                label="Pernotto fuori sede"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ButtonTipoTrasferta
                tipoTrasfertaButton="fuori_sede_andata"
                onClickAction={() =>
                  router.push("/hours/manage/create/fuori_sede_andata")
                }
                endIcon={<TrendingUpTwoToneIcon />}
                label="Andata"
              />
            </Grid>
            <Grid size={{ xs: 12 }} mb={5}>
              <ButtonTipoTrasferta
                tipoTrasfertaButton="fuori_sede_ritorno"
                onClickAction={() =>
                  router.push("/hours/manage/create/fuori_sede_ritorno")
                }
                endIcon={<UTurnLeftTwoToneIcon />}
                label="Ritorno"
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
                    opacity: showMissionPanel ? 1 : 0,
                    transition: "opacity 0.5s ease-in-out",
                  })}
                >
                  <Grid size={{ xs: 12 }}>
                    <ButtonTipoTrasferta
                      tipoTrasfertaButton="ancora_in_trasferta_0"
                      onClickAction={() =>
                        router.push(
                          "/hours/manage/create/ancora_in_trasferta_0"
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
                          "/hours/manage/create/ancora_in_trasferta_10"
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
                          "/hours/manage/create/ancora_in_trasferta_20"
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
                          "/hours/manage/create/ancora_in_trasferta_30"
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
                          "/hours/manage/create/ancora_in_trasferta_40"
                        )
                      }
                      label="40 km"
                    />
                  </Grid>
                </Grid>
              </div>
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

export default withPageRequiredAuth(CreateUser);
