"use client";

import { NumericKeypadKm } from "@/components/numeric-keypad-km";
import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import FlightTakeoffTwoToneIcon from "@mui/icons-material/FlightTakeoffTwoTone";
import ForwardTwoToneIcon from "@mui/icons-material/ForwardTwoTone";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import TargaMezziTable from "../targa-mezzi-table";

function FormCreateUser() {
  const router = useRouter();

  const [km, setKm] = useState("0");

  const params = useParams<{ type: string }>();

  const tipoTrasferta = params.type;

  // let prepareLink = "/hours/manage";
  // // let prepareText = "In sede";
  // // let buttonColor: "primary" | "secondary" | "info" = "secondary"; // Customizable button color

  // switch (tipoTrasferta) {
  //   case "in_sede": // non usato in richiesta TARGA
  //     prepareLink = "/hours/manage";
  //     // prepareText = "In sede";
  //     // buttonColor = "secondary";
  //     break;
  //   case "in_giornata":
  //     prepareLink = "/hours/manage/step2_FuoriSede";
  //     // prepareText = "In giornata";
  //     // buttonColor = "primary";
  //     break;
  //   case "in_giornata_dopo_21":
  //     prepareLink = "/hours/manage/step2_FuoriSede";
  //     // prepareText = "In giornata dopo le 21:00";
  //     buttonColor = "primary";
  //     break;
  //   case "fuori_sede_andata":
  //     prepareLink = "/hours/manage/step3_FuoriSede";
  //     //prepareText = "Fuori sede andata";
  //     // buttonColor = "primary";
  //     break;
  //   case "fuori_sede_ritorno":
  //     prepareLink = "/hours/manage/step3_FuoriSede";
  //     //prepareText = "Fuori sede ritorno";
  //     // buttonColor = "primary";
  //     break;
  //   case "ancora_in_missione_0":
  //     prepareLink = "/hours/manage/step3_FuoriSede";
  //     //prepareText = "Ancora in trasferta 0 Km";
  //     // buttonColor = "primary";
  //     break;
  //   case "ancora_in_missione_10":
  //     prepareLink = "/hours/manage/step3_FuoriSede";
  //     //prepareText = "Ancora in trasferta 5 Km";
  //     // buttonColor = "primary";
  //     break;
  //   case "ancora_in_missione_20":
  //     prepareLink = "/hours/manage/step3_FuoriSede";
  //     //prepareText = "Ancora in trasferta 10 Km";
  //     // buttonColor = "primary";
  //     break;
  //   case "ancora_in_missione_30":
  //     prepareLink = "/hours/manage/step3_FuoriSede";
  //     //prepareText = "Ancora in trasferta 15 Km";
  //     // buttonColor = "primary";
  //     break;
  //   case "ancora_in_missione_40":
  //     prepareLink = "/hours/manage/step3_FuoriSede";
  //     //prepareText = "Ancora in trasferta 20 Km";
  //     // buttonColor = "primary";
  //     break;
  //   case "step1_KmAutista":
  //     prepareLink = "/hours/manage/step1_KmAutista";
  //     //prepareText = "Km Autista";
  //     // buttonColor = "info";
  //     break;
  // }

  return (
    <Container maxWidth="md">
      <Grid container pt={3}>
        <Grid size={{ xs: 12 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            style={{ height: 50, fontSize: "1.5rem" }}
            onClick={() => router.push("/hours/manage")}
            startIcon={<ArrowBackTwoToneIcon />}
            endIcon={<FlightTakeoffTwoToneIcon />}
          >
            Fuori sede
          </Button>
        </Grid>
        {tipoTrasferta === "step1_KmAutista" && (
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
                  if (tipoTrasferta === "step1_KmAutista") {
                    router.push(
                      `/hours/manage/create/${tipoTrasferta}?COD_ART=${COD_ART}&KM=${km}`
                    );
                  } else {
                    router.push(
                      `/hours/manage/step2_FuoriSede?COD_ART=${COD_ART}`
                    );
                  }
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
