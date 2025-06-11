"use client";

import { ButtonTipoTrasferta } from "@/components/button-tipo-trasferta";
import { RoleEnum } from "@/services/api/types/role";
import useAuth from "@/services/auth/use-auth";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import FlightTakeoffTwoToneIcon from "@mui/icons-material/FlightTakeoffTwoTone";
import HourglassTopTwoToneIcon from "@mui/icons-material/HourglassTopTwoTone";
import TrendingUpTwoToneIcon from "@mui/icons-material/TrendingUpTwoTone";
import UTurnLeftTwoToneIcon from "@mui/icons-material/UTurnLeftTwoTone";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { OperatoreSelected } from "../opertore-selected";
function FormCreateUser() {
  const router = useRouter();

  const [showMissionPanel, setShowMissionPanel] = useState(false);

  const searchParams = useSearchParams();

  const COD_ART = searchParams.get("COD_ART");
  const km: number = parseFloat(searchParams.get("KM") || "0");
  const COD_OP = searchParams.get("COD_OP");

  return (
    <Container maxWidth="md" sx={{ m: 0, p: 1 }}>
      <Grid container>
        <Grid textAlign="right" size={12} mb={1}>
          <OperatoreSelected text="sei rientrato?" />
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
                    `create/fuori_sede_andata?COD_ART=${COD_ART}&KM=${km}&COD_OP=${COD_OP}`
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
                          `create/ancora_in_trasferta_0?COD_ART=${COD_ART}&KM=0&COD_OP=${COD_OP}`
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
                          `create/ancora_in_trasferta_10?COD_ART=${COD_ART}&KM=10&COD_OP=${COD_OP}`
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
                          `create/ancora_in_trasferta_20?COD_ART=${COD_ART}&KM=20&COD_OP=${COD_OP}`
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
                          `create/ancora_in_trasferta_30?COD_ART=${COD_ART}&KM=30&COD_OP=${COD_OP}`
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
                          `create/ancora_in_trasferta_40?COD_ART=${COD_ART}&KM=40&COD_OP=${COD_OP}`
                        )
                      }
                      label="40 km"
                    />
                  </Grid>
                </Grid>
              </div>
            </Grid>
            <Grid size={{ xs: 12 }} mb={5}>
              <ButtonTipoTrasferta
                tipoTrasfertaButton="fuori_sede_ritorno"
                onClickAction={() =>
                  router.push(
                    `create/fuori_sede_ritorno?COD_ART=${COD_ART}&KM=${km}&COD_OP=${COD_OP}`
                  )
                }
                endIcon={<UTurnLeftTwoToneIcon />}
                label="Ritorno"
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
