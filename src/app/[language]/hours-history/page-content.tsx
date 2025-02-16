"use client";

import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import useLanguage from "@/services/i18n/use-language";
import "dayjs/locale/it";
import "dayjs/locale/en";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function AdminPanel() {
  // const { t } = useTranslation("admin-panel-home");

  const language = useLanguage();

  const [value, setValue] = useState<Dayjs | null>(dayjs());

  return (
    <Container maxWidth="md">
      <Grid
        container
        direction="column"
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={language}
          >
            <DatePicker
              label="Date Picker"
              format="YYYY/MM/DD"
              value={value}
              onChange={(newValue) => setValue(newValue)}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Container>
  );
}

export default withPageRequiredAuth(AdminPanel, {
  roles: [RoleEnum.ADMIN, RoleEnum.USER],
});
