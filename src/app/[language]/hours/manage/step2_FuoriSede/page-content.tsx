"use client";

import { usePostUserService } from "@/services/api/services/users";
import useAuth from "@/services/auth/use-auth";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import UndoIcon from "@mui/icons-material/Undo";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import { useState } from "react";

function FormCreateUser() {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useTranslation("admin-panel-users-create");

  const [showMissionPanel, setShowMissionPanel] = useState(false);

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} pt={3}>
        <Grid textAlign={{ xs: "right" }} size={12}>
          <Typography variant="h3" gutterBottom>
            {`${user?.firstName} ${user?.lastName}`}
          </Typography>
          <Typography variant="h4" gutterBottom>
            che tipo di trasferta hai fatto?
          </Typography>
        </Grid>
        <Grid size={12}>
          <Container maxWidth="sm">
            <Grid
              container
              spacing={2}
              mb={3}
              mt={3}
            >
              <Grid size={{ xs: 12 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  style={{ height: 50, fontSize: "1.5rem" }}
                  onClick={() => router.push("/hours/manage/step1_FuoriSede")}
                  startIcon={<ArrowBackTwoToneIcon />}
                >
                  Pernotto fuori sede
                </Button>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  size="large"
                  style={{ height: 80, fontSize: "1.5rem" }}
                  onClick={() =>
                    router.push("/hours/manage/create/fuori_sede_andata")
                  }
                  endIcon={"↗"}
                >
                  Andata
                </Button>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  size="large"
                  style={{ height: 80, fontSize: "1.5rem" }}
                  onClick={() =>
                    router.push("/hours/manage/create/fuori_sede_ritorno")
                  }
                  endIcon={"↙"}
                >
                  Ritorno
                </Button>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  size="large"
                  style={{ height: 80, fontSize: "1.5rem" }}
                  onClick={() => setShowMissionPanel(!showMissionPanel)}
                  endIcon={"↔"}
                >
                  Ancora in missione
                </Button>
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
                    style={{
                      marginTop: "20px",
                      opacity: showMissionPanel ? 1 : 0,
                      transition: "opacity 0.5s ease-in-out",
                    }}
                  >
                    <Grid size={{ xs: 12 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        style={{ height: 50, fontSize: "1.2rem" }}
                        onClick={() =>
                          router.push(
                            "/hours/manage/create/ancora_in_missione_5"
                          )
                        }
                      >
                        5 km
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        style={{ height: 50, fontSize: "1.2rem" }}
                        onClick={() =>
                          router.push(
                            "/hours/manage/create/ancora_in_missione_10"
                          )
                        }
                      >
                        10 km
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        style={{ height: 50, fontSize: "1.2rem" }}
                        onClick={() =>
                          router.push(
                            "/hours/manage/create/ancora_in_missione_15"
                          )
                        }
                      >
                        15 km
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        style={{ height: 50, fontSize: "1.2rem" }}
                        onClick={() =>
                          router.push(
                            "/hours/manage/create/ancora_in_missione_20"
                          )
                        }
                      >
                        20 km
                      </Button>
                    </Grid>
                  </Grid>
                </div>
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
