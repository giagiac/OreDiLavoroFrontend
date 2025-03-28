"use client";

import { RoleEnum } from "@/services/api/types/role";
import useAuth from "@/services/auth/use-auth";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

function AdminPanel() {
  const router = useRouter();
  const { t } = useTranslation("user-panel-home");
  const { user } = useAuth();

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} pt={3}>
        <Grid textAlign={{ xs: "right" }} size={12}>
          <Typography variant="h4" gutterBottom>
            🎉 {t("title")} 🎉
          </Typography>
          <Typography variant="h3" gutterBottom>
            {`${user?.firstName} ${user?.lastName}`}
          </Typography>
          <Typography variant="h4" gutterBottom>
            {t("titleNext")}
          </Typography>
        </Grid>
        <Grid size={12}>
          <Grid
            container
            spacing={2}
            mb={3}
            mt={3}
            justifyContent="center"
            alignItems="center"
            style={{
              height: "50vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Grid size={{ xs: 12, sm: 6 }}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                size="large"
                style={{ height: 80, fontSize: "1.5rem" }}
                onClick={() => router.push("/hours/manage")}
                endIcon={"✍🏻"}
              >
                {t("createEdit")}
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                style={{ height: 80, fontSize: "1.5rem" }}
                onClick={() => router.push("/hours-history/orp-eff-cicli-esec")}
                endIcon={"🔒"}
              >
                {t("history")}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default withPageRequiredAuth(AdminPanel, {
  roles: [RoleEnum.ADMIN, RoleEnum.USER],
});
