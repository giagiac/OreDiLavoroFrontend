"use client";

import TipoTrasfertaComponent, {
  backgroundColorsDark,
  backgroundColorsLight,
} from "@/components/tipo-trasferta";
import { EpsNestjsOrpEffCicliEsec } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec";
import { FilterItem } from "@/services/api/types/filter";
import { LinkOrpOrd } from "@/services/api/types/link-orp-ord";
import { OrdCliTras } from "@/services/api/types/ord-cli-tras";
import { RoleEnum } from "@/services/api/types/role";
import { SortEnum } from "@/services/api/types/sort-type";
import useAuth from "@/services/auth/use-auth";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useTranslation } from "@/services/i18n/client";
import useLanguage from "@/services/i18n/use-language";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  Typography,
  useTheme,
} from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
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
import { useGetEpsNestjsOrpEffCicliEsecQuery } from "./queries/queries";

type EpsNestjsOrpEffCicliEsecKeys = keyof EpsNestjsOrpEffCicliEsec;

const TableCellLoadingContainer = styled(TableCell)(() => ({
  padding: 0,
}));

function UserHours() {
  const [dateSelected, setDateSelected] = useState<Dayjs | null>(
    dayjs().subtract(1, "day")
  );

  const [open, setOpen] = useState(false); // Moved here
  const [selectedOrdCliTras, setSelectedOrdCliTras] =
    useState<OrdCliTras | null>(null); // Moved here

  const { t } = useTranslation("hours-history");

  const language = useLanguage();

  const searchParams = useSearchParams();
  const router = useRouter();

  const [{ order, orderBy }, setSort] = useState<{
    order: SortEnum;
    orderBy: EpsNestjsOrpEffCicliEsecKeys;
  }>(() => {
    const searchParamsSort = searchParams.get("sort");
    if (searchParamsSort) {
      return JSON.parse(searchParamsSort);
    }
    return { order: SortEnum.DESC, orderBy: "id" };
  });

  const filter = useMemo(() => {
    const searchParamsFilter = searchParams.get("filter");
    if (searchParamsFilter) {
      return JSON.parse(searchParamsFilter) as Array<
        FilterItem<EpsNestjsOrpEffCicliEsec>
      >;
    }
    return [
      {
        columnName: "DATA_INIZIO",
        value: dateSelected?.format("YYYY-MM-DD") || "",
        id: 0,
      },
    ] as Array<FilterItem<EpsNestjsOrpEffCicliEsec>>;
  }, [searchParams]);

  const { data, isFetchingNextPage, isLoading } =
    useGetEpsNestjsOrpEffCicliEsecQuery({
      filters: filter,
      sort: { order, orderBy },
    });

  const [filters, setFilters] = useState<
    Array<FilterItem<EpsNestjsOrpEffCicliEsec>>
  >(() => {
    const searchParamsFilter = searchParams.get("filter");
    if (searchParamsFilter) {
      return JSON.parse(searchParamsFilter);
    }
    return [];
  });

  const handleRequestFilter = (value: string) => {
    const columnName = "DATA_INIZIO";
    const searchParams = new URLSearchParams(window.location.search);

    let oldFilter: Array<FilterItem<EpsNestjsOrpEffCicliEsec>> = [
      {
        columnName,
        value,
        id: 0,
      },
    ];

    searchParams.set("filter", JSON.stringify(oldFilter));

    setFilters(oldFilter);
    router.push("/hours-history?" + searchParams.toString());
  };

  const result = useMemo(() => {
    const result =
      (data?.pages.flatMap(
        (page) => page?.data
      ) as EpsNestjsOrpEffCicliEsec[]) ?? ([] as EpsNestjsOrpEffCicliEsec[]);

    return removeDuplicatesFromArrayObjects(result, "id");
  }, [data]);

  const { user } = useAuth();

  const theme = useTheme();

  const handleOpen = (ordCliTras: OrdCliTras) => {
    setSelectedOrdCliTras(ordCliTras);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrdCliTras(null);
  };

  const renderOrdCliTrasDialog = (linkOrpOrd: Array<LinkOrpOrd>) => {
    return (
      <>
        {linkOrpOrd?.map((it, index) => {
          const ordCliTras = it.ordCliRighe?.ordCliTras || ({} as OrdCliTras);
          return (
            <Button
              key={index}
              variant="outlined"
              onClick={() => handleOpen(ordCliTras)}
              fullWidth
            >
              {ordCliTras.NUM_DEST} · {ordCliTras.DES_DEST_MERCE || "No Title"}
            </Button>
          );
        })}

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>
            {selectedOrdCliTras?.NUM_DEST} ·{" "}
            {selectedOrdCliTras?.DES_DEST_MERCE || "No Title"}
          </DialogTitle>
          <DialogContent>
            <Table size="small">
              <TableBody>
                {(
                  Object.keys(selectedOrdCliTras || {}) as (keyof OrdCliTras)[]
                ).map((key) => {
                  const value = selectedOrdCliTras?.[key];
                  if (
                    value == null ||
                    key === "DES_DEST_MERCE" ||
                    key === "NUM_DEST"
                  )
                    return null;
                  return (
                    <TableRow key={key}>
                      <TableCell align="left">
                        <Typography variant="caption">{key}</Typography>
                      </TableCell>
                      <TableCell align="left" style={{ width: 300 }}>
                        <Typography variant="subtitle2">{value}</Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Chiudi
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  return (
    <Container maxWidth="xl">
      <Grid
        container
        spacing={2}
        style={{ marginTop: 20, marginBottom: 200 }}
        justifyContent="center"
      >
        <Grid size={{ xs: 12 }}>
          <Stack
            textAlign="center"
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
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
            <Typography variant="h2">{data?.totale}</Typography>
          </Stack>
        </Grid>

        {result.map((epsNestjsOrpEffCicliEsec) => (
          <Grid
            container
            size={{ xs: 12, sm: 6, md: 4 }}
            key={epsNestjsOrpEffCicliEsec?.id}
            justifyContent="center"
          >
            <Card
              style={{
                padding: 16,
                borderRadius: 8,
                border: `2px solid ${
                  theme.palette.mode === "dark"
                    ? backgroundColorsDark[
                        epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA
                      ]
                    : backgroundColorsLight[
                        epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA
                      ]
                }`,
              }}
            >
              <Grid size={{ xs: 12 }}>
                <TipoTrasfertaComponent
                  tipotrasferta={epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body1">
                  {epsNestjsOrpEffCicliEsec?.orpEffCicli?.linkOrpOrd?.map(
                    (it) => it.ordCliRighe?.cf.RAG_SOC_CF
                  )}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                {epsNestjsOrpEffCicliEsec?.orpEffCicli?.linkOrpOrd &&
                  renderOrdCliTrasDialog(
                    epsNestjsOrpEffCicliEsec?.orpEffCicli.linkOrpOrd
                  )}
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption">
                  {epsNestjsOrpEffCicliEsec?.DOC_RIGA_ID}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2">
                  {epsNestjsOrpEffCicliEsec?.orpEffCicli?.orpEff.DES_PROD}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="h4" textAlign="right">
                  {epsNestjsOrpEffCicliEsec?.TEMPO_OPERATORE_SESSANTESIMI?.toString()}
                </Typography>
              </Grid>
            </Card>
          </Grid>
        ))}

        {isFetchingNextPage && (
          <Grid size={{ xs: 12 }}>
            <LinearProgress />
          </Grid>
        )}

        {result.length === 0 && !isLoading && (
          <Grid size={{ xs: 12 }}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="30vh"
              textAlign="center"
            >
              <Typography variant="h2">
                Nessuna registrazione effettuata!
              </Typography>
              <Image src={imageLogo} alt="No records image" height={200} />
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default withPageRequiredAuth(UserHours, {
  roles: [RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.AUTISTA],
});
