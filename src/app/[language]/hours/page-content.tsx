"use client";

import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

function AdminPanel() {
  const { t } = useTranslation("admin-panel-home");

  return (
    <Container maxWidth="md" sx={{ m: 0, p: 1 }}>
      <Grid container spacing={3} wrap="nowrap" pt={3}>
        <Grid>
          <Typography variant="h3" gutterBottom>
            CTREATE {t("title")}
          </Typography>
          <Typography>{t("description")}</Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

export default withPageRequiredAuth(AdminPanel, {
  roles: [RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.AUTISTA, RoleEnum.BADGE],
});
