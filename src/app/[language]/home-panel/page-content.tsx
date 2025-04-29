"use client";

import { RoleEnum } from "@/services/api/types/role";
import useAuth from "@/services/auth/use-auth";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useRouter } from "next/navigation";
import imageWorker from "../../../../public/worker_pause.png";

function AdminPanel() {
  const router = useRouter();
  const { t } = useTranslation("user-panel-home");
  const { user } = useAuth();

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} pt={3}>
        <Grid textAlign={{ xs: "right" }} size={6}>
          <Image src={imageWorker} alt="No records image" height={200} />
        </Grid>
        <Grid textAlign={{ xs: "right" }} size={6}>
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
        {[RoleEnum.ADMIN].includes(user?.role?.id as RoleEnum) && (
          <Grid size={{ xs: 12 }}>
            <iframe
              width="100%"
              height={500}
              src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSwkwic6JfrkgW8ZRm-R4kgX-FQGqoeJz_0_SMvOcIIVWGrDGtgEI-m7b3LEZlC1FvpVMxLYhVR8sce/pubhtml?gid=0&amp;single=true&amp;widget=true&amp;headers=false"
              style={{ border: 0 }}
            ></iframe>
          </Grid>
        )}
        <Grid size={12}>
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
            <Grid size={{ xs: 12 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                style={{ height: 80, fontSize: "1.5rem" }}
                onClick={() => {
                  router.push(`/hours-history`);
                }}
                endIcon={"🔒"}
              >
                {t("history")}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Typography
        sx={{
          mt: 20,
          mb: 10,
          textAlign: "center",
          fontSize: 9,
        }}
      >
        Vers. app : {process.env.NEXT_PUBLIC_APP_VERSION}
      </Typography>
    </Container>
  );
}

export default withPageRequiredAuth(AdminPanel, {
  roles: [RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.AUTISTA],
});
