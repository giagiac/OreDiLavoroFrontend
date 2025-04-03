"use client";

import useAuth from "@/services/auth/use-auth";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
function FormCreateUser() {
  const { user } = useAuth();

  const router = useRouter();
  const { t } = useTranslation("admin-panel-users-create");

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} pt={3}>
        <Grid textAlign={{ xs: "right" }} size={12}>
          {/* <Typography variant="h3" gutterBottom>
            {`${user?.firstName} ${user?.lastName}`}
          </Typography> */}
          <Typography variant="h4" gutterBottom>
            Sei rientrato?
          </Typography>
        </Grid>
        <Grid size={12}>
          <Container maxWidth="sm">
            <Grid
              container
              spacing={2}
              mb={3}
              mt={3}
              justifyContent="center"
              alignItems="center"
            >
              <Grid size={{ xs: 12 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  style={{ height: 50, fontSize: "1.5rem" }}
                  onClick={() => router.push("/hours/manage")}
                  startIcon={<ArrowBackTwoToneIcon />}
                >
                  Fuori sede
                </Button>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  size="large"
                  style={{ height: 80, fontSize: "1.5rem" }}
                  onClick={() => router.push("/hours/manage/create/in_giornata")}
                  endIcon={"📅"}
                >
                  In giornata
                </Button>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  size="large"
                  style={{ height: 80, fontSize: "1.5rem" }}
                  onClick={() => router.push("/hours/manage/create/in_giornata_dopo_21")}
                  endIcon={"🌃"}
                >
                  In giornata dopo le 21:00
                </Button>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  size="large"
                  style={{ height: 80, fontSize: "1.5rem" }}
                  onClick={() => router.push("/hours/manage/step2_FuoriSede")}
                  endIcon={"🏩"}
                >
                  Pernotto fuori sede
                </Button>
              </Grid>
            </Grid>
          </Container>
        </Grid>
      </Grid>
    </Container>
  );
}

function CreateUser() {
  return <FormCreateUser />;
}

export default withPageRequiredAuth(CreateUser);
