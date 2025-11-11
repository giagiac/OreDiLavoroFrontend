"use client";

import { EpsNestjsOrpEffCicliEsec } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec";
import { FilterItem } from "@/services/api/types/filter";
import { RoleEnum } from "@/services/api/types/role";
import { SortEnum } from "@/services/api/types/sort-type";
import useAuth from "@/services/auth/use-auth";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useTranslation } from "@/services/i18n/client";
import useLanguage from "@/services/i18n/use-language";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/it";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import imageLogo from "../../../../public/emotions.png";
import { ChildEpsNestjsOrpEffCicliEsecCard } from "../hours/manage/child-eps-nestjs-orp-eff-cicli-esec-card";
import { useGetEpsNestjsOrpEffCicliEsecQuery } from "./queries/queries";

type EpsNestjsOrpEffCicliEsecKeys = keyof EpsNestjsOrpEffCicliEsec;

function UserHours() {
  const { user } = useAuth();

  const [dateSelected, setDateSelected] = useState<Dayjs | null>(
    dayjs().subtract(1, "day")
  );

  const { t } = useTranslation("hours-history");

  const language = useLanguage();

  const searchParams = useSearchParams();
  const router = useRouter();

  const [{ order, orderBy }] = useState<{
    order: SortEnum;
    orderBy: EpsNestjsOrpEffCicliEsecKeys;
  }>(() => {
    const searchParamsSort = searchParams.get("sort");
    if (searchParamsSort) {
      return JSON.parse(searchParamsSort);
    }
    return { order: SortEnum.DESC, orderBy: "id" };
  });

  let filter = [];
  const searchParamsFilter = searchParams.get("filter");
  if (searchParamsFilter) {
    filter = JSON.parse(searchParamsFilter) as Array<
      FilterItem<EpsNestjsOrpEffCicliEsec>
    >;
  } else {
    filter = [
      {
        columnName: "DATA_INIZIO",
        value: dateSelected?.format("YYYY-MM-DD") || "",
      },
      {
        columnName: "COD_OP",
        value: user?.COD_OP,
      },
    ] as Array<FilterItem<EpsNestjsOrpEffCicliEsec>>;
  }

  const { data, isFetchingNextPage, isLoading } =
    useGetEpsNestjsOrpEffCicliEsecQuery({
      filters: filter,
      sort: { order, orderBy },
    });

  const handleRequestFilter = (value: string) => {
    if (user && user.COD_OP !== null) {
      const searchParams = new URLSearchParams(window.location.search);
      const oldFilter: Array<FilterItem<EpsNestjsOrpEffCicliEsec>> = [
        {
          columnName: "DATA_INIZIO",
          value,
        },
        {
          columnName: "COD_OP",
          value: String(user.COD_OP),
        },
      ];

      searchParams.set("filter", JSON.stringify(oldFilter));
      router.push("/hours-history?" + searchParams.toString());
    }
  };

  const result = useMemo(() => {
    const result =
      (data?.pages.flatMap(
        (page) => page?.data
      ) as EpsNestjsOrpEffCicliEsec[]) ?? ([] as EpsNestjsOrpEffCicliEsec[]);

    return removeDuplicatesFromArrayObjects(result, "id");
  }, [data]);

  return (
    <Container maxWidth="xl">
      <Grid
        container
        spacing={1}
        sx={(theme) => ({
          marginTop: theme.spacing(0),
          marginBottom: theme.spacing(5),
        })}
        justifyContent="center"
      >
        <Grid size={{ xs: 12 }}>
          <Stack textAlign="right" direction="column" alignItems="flex-end">
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={language}
            >
              <DatePicker
                label={t("hours-history:formInputs.dateFilter.label")}
                format="ddd DD MMM YYYY"
                value={dateSelected}
                onChange={(newValue) => {
                  setDateSelected(newValue);
                  handleRequestFilter(newValue?.format("YYYY-MM-DD") || "");
                }}
                maxDate={dayjs().subtract(1, "day")}
              />
            </LocalizationProvider>
            <Typography variant="subtitle2">
              ore totali della giornata
            </Typography>
            <Typography variant="h2">{data?.totale}</Typography>
          </Stack>
        </Grid>

        <Grid container spacing={2} justifyContent="center" alignItems="unset">
          {result.map((epsNestjsOrpEffCicliEsec) => (
            <ChildEpsNestjsOrpEffCicliEsecCard
              key={epsNestjsOrpEffCicliEsec.id}
              epsNestjsOrpEffCicliEsec={epsNestjsOrpEffCicliEsec}
            />
          ))}
        </Grid>

        {isFetchingNextPage && (
          <Grid size={{ xs: 12 }}>
            <LinearProgress />
          </Grid>
        )}

        {result.length === 0 && !isLoading && (
          <Grid size={{ xs: 12 }}>
            <Box
              display="flex-column"
              justifyContent="center"
              alignItems="center"
              height="40vh"
              textAlign="center"
            >
              <Image src={imageLogo} alt="No records image" height={200} />
              <Typography variant="h2">
                Nessuna registrazione effettuata!
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default withPageRequiredAuth(UserHours, {
  roles: [RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.AUTISTA, RoleEnum.BADGE],
});
