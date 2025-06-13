"use client";

import { ButtonTipoTrasferta } from "@/components/button-tipo-trasferta";
import { NumericKeypadKm } from "@/components/numeric-keypad-km";
import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import AirportShuttleTwoToneIcon from "@mui/icons-material/AirportShuttleTwoTone";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import ForwardTwoToneIcon from "@mui/icons-material/ForwardTwoTone";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { OperatoreSelected } from "../opertore-selected";
import TargaMezziTable from "../targa-mezzi-table";

function FormCreateUser() {
  const router = useRouter();

  const [km, setKm] = useState("0");

  const searchParams = useSearchParams();
  const COD_OP = searchParams.get("COD_OP");

  return (
    <Container maxWidth="md" sx={{ m: 0, p: 1 }}>
      <Grid container>
        <Grid textAlign="right" size={12} mb={1}>
          <OperatoreSelected text="quanti km hai percorso in tutto?" />
        </Grid>
        <Grid size={12}>
          <Grid container>
            <Grid size={{ xs: 12 }}>
              <ButtonTipoTrasferta
                tipoTrasfertaButton="not_defined"
                onClickAction={() => router.back()}
                startIcon={<ArrowBackTwoToneIcon />}
                endIcon={<AirportShuttleTwoToneIcon />}
                label="KM Autista"
              />
            </Grid>
            <Grid size={12}>
              <Grid container justifyContent="center" alignItems="center">
                <Grid size={{ xs: 12 }}>
                  <NumericKeypadKm
                    onChange={(value) => {
                      setKm(value);
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid size={12} pt={3}>
              <TargaMezziTable
                childrenCallBack={(COD_ART) => (
                  <ButtonTipoTrasferta
                    tipoTrasfertaButton="km_autista_button"
                    onClickAction={async () => {
                      router.push(
                        `create/step1_km_autista?COD_ART=${COD_ART}&KM=${km}&COD_OP=${COD_OP}`
                      );
                    }}
                    icon={<ForwardTwoToneIcon />}
                  />
                )}
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
