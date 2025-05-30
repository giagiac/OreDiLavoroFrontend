"use client";

import { ButtonTipoTrasferta } from "@/components/button-tipo-trasferta";
import { NumericKeypadKm } from "@/components/numeric-keypad-km";
import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import FlightTakeoffTwoToneIcon from "@mui/icons-material/FlightTakeoffTwoTone";
import ForwardTwoToneIcon from "@mui/icons-material/ForwardTwoTone";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import TargaMezziTable from "../targa-mezzi-table";
import Typography from "@mui/material/Typography";
import useAuth from "@/services/auth/use-auth";

function FormCreateUser() {
  const router = useRouter();

  const [km, setKm] = useState("0");
  const params = useParams<{ type: string }>();
  const tipoTrasferta = params.type;

  const { user } = useAuth();

  return (
    <Container maxWidth="md" sx={{ m: 0, p: 1 }}>
      <Grid container>
        <Grid textAlign="right" size={12} mb={10}>
          <Typography variant="h4" gutterBottom>
            {`${user?.firstName} ${user?.lastName}`} seleziona la targa?
          </Typography>
        </Grid>
        <Grid size={12}>
          <Grid container>
            <Grid size={{ xs: 12 }} mb={5}>
              <ButtonTipoTrasferta
                tipoTrasfertaButton="not_defined"
                label="Fuori sede"
                onClickAction={() => router.push("/hours/manage")}
                startIcon={<ArrowBackTwoToneIcon />}
                endIcon={<FlightTakeoffTwoToneIcon />}
              />
            </Grid>
            {tipoTrasferta === "step1_km_autista" && (
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
            )}
            <Grid size={12} pt={3}>
              <TargaMezziTable
                childrenCallBack={(COD_ART) => (
                  <ButtonTipoTrasferta
                    tipoTrasfertaButton="fuori_sede_button"
                    onClickAction={async () => {
                      if (tipoTrasferta === "step1_km_autista") {
                        router.push(
                          `/hours/manage/create/${tipoTrasferta}?COD_ART=${COD_ART}&KM=${km}`
                        );
                      } else {
                        router.push(
                          `/hours/manage/step2_FuoriSede?COD_ART=${COD_ART}`
                        );
                      }
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
  roles: [RoleEnum.ADMIN, RoleEnum.AUTISTA],
});
