"use client";

import { NumericKeypadKm } from "@/components/numeric-keypad-km";
import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import AirportShuttleTwoToneIcon from "@mui/icons-material/AirportShuttleTwoTone";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import ForwardTwoToneIcon from "@mui/icons-material/ForwardTwoTone";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TargaMezziTable from "../targa-mezzi-table";

function FormCreateUser() {
  const router = useRouter();

  const [km, setKm] = useState("0");

  return (
    <Container maxWidth="md">
      <Grid container pt={3}>
        <Grid size={{ xs: 12 }}>
          <Button
            variant="contained"
            color="info"
            size="large"
            style={{ height: 50, fontSize: "1.5rem" }}
            onClick={() => router.push("/hours/manage")}
            startIcon={<ArrowBackTwoToneIcon />}
            endIcon={<AirportShuttleTwoToneIcon />}
          >
            KM Autista
          </Button>
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
              <Button
                style={{
                  width: "100%",
                  height: 50,
                  fontSize: "1.5rem",
                }}
                fullWidth
                size="large"
                variant="contained"
                onClick={async () => {
                  router.push(
                    `/hours/manage/create/step1_KmAutista?COD_ART=${COD_ART}&KM=${km}`
                  );
                }} // Usa la funzione onClick passata
              >
                <ForwardTwoToneIcon />
              </Button>
            )}
          />
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
