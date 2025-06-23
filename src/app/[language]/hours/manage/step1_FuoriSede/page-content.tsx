"use client";

import { ButtonTipoTrasferta } from "@/components/button-tipo-trasferta";
import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import FlightTakeoffTwoToneIcon from "@mui/icons-material/FlightTakeoffTwoTone";
import ForwardTwoToneIcon from "@mui/icons-material/ForwardTwoTone";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import { useRouter, useSearchParams } from "next/navigation";
import { OperatoreSelected } from "../../manage/opertore-selected";
import TargaMezziTable from "../targa-mezzi-table";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import "dayjs/locale/it";
dayjs.locale("it");

function FormCreateUser() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const COD_OP = searchParams.get("COD_OP");
  const DATA_INIZIO = searchParams.get("DATA_INIZIO");

  const DATA_INIZIO_FORMATTED = DATA_INIZIO
    ? dayjs(DATA_INIZIO).format("ddd DD MMM YY")
    : "";

  return (
    <Container maxWidth="md" sx={{ m: 0, p: 1 }}>
      <Grid container>
        <Grid textAlign="right" size={12} mb={1}>
          <OperatoreSelected text="seleziona la targa!" />
        </Grid>
        <Grid textAlign="right" size={12} mb={2}>
          <Typography variant="h6">{DATA_INIZIO_FORMATTED}</Typography>
        </Grid>
        <Grid size={12}>
          <Grid container>
            <Grid size={{ xs: 12 }} mb={5}>
              <ButtonTipoTrasferta
                tipoTrasfertaButton="not_defined"
                label="Trasferta"
                onClickAction={() => router.back()}
                startIcon={<ArrowBackTwoToneIcon />}
                endIcon={<FlightTakeoffTwoToneIcon />}
              />
            </Grid>
            <Grid size={12} pt={3}>
              <TargaMezziTable
                childrenCallBack={(COD_ART) => (
                  <ButtonTipoTrasferta
                    tipoTrasfertaButton="fuori_sede_button"
                    onClickAction={async () => {
                      router.push(
                        `step2_FuoriSede?COD_ART=${COD_ART}&KM=${0}&COD_OP=${COD_OP}&DATA_INIZIO=${DATA_INIZIO}`
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
