"use client";

import { Cf } from "@/services/api/types/cf";
import { CfComm } from "@/services/api/types/cfComm";
import { EpsNestjsOrpEffCicliEsec } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec";
import { FilterItem } from "@/services/api/types/filter";
import { LinkOrpOrd } from "@/services/api/types/link-orp-ord";
import { OrdCli } from "@/services/api/types/ord-cli";
import { RoleEnum } from "@/services/api/types/role";
import { SortEnum } from "@/services/api/types/sort-type";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useTranslation } from "@/services/i18n/client";
import useLanguage from "@/services/i18n/use-language";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid2";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/it";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useMemo, useState } from "react";
import imageLogo from "../../../../public/emotions.png";
import { useGetEpsNestjsOrpEffCicliEsecQuery } from "./queries/queries";
import TipoTrasfertaComponent from "@/components/tipo-trasferta";
import { TipoTrasfertaColors } from "@/constants/theme-colors";
import { useTheme } from "@mui/material/styles";

type EpsNestjsOrpEffCicliEsecKeys = keyof EpsNestjsOrpEffCicliEsec;

function UserHours() {
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
    ] as Array<FilterItem<EpsNestjsOrpEffCicliEsec>>;
  }

  const { data, isFetchingNextPage, isLoading } =
    useGetEpsNestjsOrpEffCicliEsecQuery({
      filters: filter,
      sort: { order, orderBy },
    });

  const handleRequestFilter = (value: string) => {
    const columnName = "DATA_INIZIO";
    const searchParams = new URLSearchParams(window.location.search);

    const oldFilter: Array<FilterItem<EpsNestjsOrpEffCicliEsec>> = [
      {
        columnName,
        value,
      },
    ];

    searchParams.set("filter", JSON.stringify(oldFilter));

    // setFilters(oldFilter);
    router.push("/hours-history?" + searchParams.toString());
  };

  const result = useMemo(() => {
    const result =
      (data?.pages.flatMap(
        (page) => page?.data
      ) as EpsNestjsOrpEffCicliEsec[]) ?? ([] as EpsNestjsOrpEffCicliEsec[]);

    return removeDuplicatesFromArrayObjects(result, "id");
  }, [data]);

  // const theme = useTheme();

  const [selectedOrdCli, setSelectedOrdCli] = useState<OrdCli | null>(null);
  const handleOpen = (ordCli: OrdCli) => {
    setSelectedOrdCli(ordCli);
  };
  const handleClose = () => {
    setSelectedOrdCli(null);
  };

  const [selectedCf, setSelectedCf] = useState<Cf | null>(null);
  const handleOpenCf = (cf: Cf) => {
    setSelectedCf(cf);
  };
  const handleCloseCf = () => {
    setSelectedCf(null);
  };

  const theme = useTheme();

  const renderOrdCliTrasDialog = (linkOrpOrd: Array<LinkOrpOrd>) => {
    if (!linkOrpOrd || linkOrpOrd.length === 0)
      return (
        <Typography variant="body2">
          Nessuna commessa/ordine collegata/o
        </Typography>
      );

    return (
      <>
        {linkOrpOrd.map((it) => {
          const ordCli = it.ordCliRighe?.ordCli || ({} as OrdCli);

          const cfComm = ordCli.cfComm;

          if (ordCli.NUM_SEDE === null || cfComm === null) {
            const cf = it.ordCliRighe?.cf;

            return (
              <Fragment key={ordCli.DOC_ID}>
                <Button
                  variant="outlined"
                  onClick={() => cf && handleOpenCf(cf)}
                  fullWidth
                  disabled={!cf} // Optionally disable the button if cf is undefined
                >
                  {cf?.INDI_CF || "No Title"}
                </Button>
                <Dialog
                  open={selectedCf !== null}
                  onClose={handleCloseCf}
                  fullWidth
                  maxWidth="sm"
                >
                  <DialogTitle>{`${selectedCf?.INDI_CF || "No Title"}`}</DialogTitle>
                  <DialogContent>
                    <Table size="small">
                      <TableBody>
                        {(Object.keys(selectedCf || {}) as (keyof Cf)[]).map(
                          (key) => {
                            const value = selectedCf?.[key];
                            if (value === null || value === undefined)
                              return null;
                            return (
                              <TableRow key={key}>
                                <TableCell align="left">
                                  <Typography variant="caption">
                                    {key}
                                  </Typography>
                                </TableCell>
                                <TableCell align="left" style={{ width: 300 }}>
                                  <Typography variant="subtitle2">
                                    {String(value)}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            );
                          }
                        )}
                      </TableBody>
                    </Table>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseCf} color="primary">
                      Chiudi
                    </Button>
                  </DialogActions>
                </Dialog>
              </Fragment>
            );
          }

          // si c'è sede commerciale

          return (
            <Fragment key={ordCli.DOC_ID}>
              <Button
                variant="outlined"
                onClick={() => handleOpen(ordCli)}
                fullWidth
                disabled={!ordCli.NUM_SEDE} // Optionally disable the button if NUM_DEST is undefined
              >
                {`${cfComm?.NUM_SEDE} · ${cfComm?.DES_SEDE}` || "No Title"}
              </Button>
              <Dialog
                open={selectedOrdCli !== null}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
              >
                <DialogTitle>
                  {`${selectedOrdCli?.cfComm?.NUM_SEDE} · ${selectedOrdCli?.cfComm?.DES_SEDE || "No Title"}`}
                </DialogTitle>
                <DialogContent>
                  <Table size="small">
                    <TableBody>
                      {(
                        Object.keys(
                          selectedOrdCli?.cfComm || {}
                        ) as (keyof CfComm)[]
                      ).map((key) => {
                        const value = selectedOrdCli?.cfComm?.[key];
                        if (value === null || value === undefined) return null;
                        return (
                          <TableRow key={key}>
                            <TableCell align="left">
                              <Typography variant="caption">{key}</Typography>
                            </TableCell>
                            <TableCell align="left" style={{ width: 300 }}>
                              <Typography variant="subtitle2">
                                {String(value)}
                              </Typography>
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
            </Fragment>
          );
        })}
      </>
    );
  };

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

        {result.map((epsNestjsOrpEffCicliEsec) => {
          const color =
            theme.palette.mode === "dark"
              ? TipoTrasfertaColors[epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA]
                  .dark
              : TipoTrasfertaColors[epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA]
                  .light;

          return (
            <Grid
              container
              size={{ xs: 12, sm: 6, md: 4 }}
              key={epsNestjsOrpEffCicliEsec?.id}
              justifyContent="center"
            >
              <Card
                sx={(theme) => ({
                  minWidth: "100%",
                  padding: theme.spacing(1),
                  borderRadius: 1,
                  border: `1px solid`,
                  borderColor: color.main,
                })}
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
                  <Typography variant="body2" textAlign="right">
                    {epsNestjsOrpEffCicliEsec?.COD_ART !== null &&
                      `Targa mezzo : ${epsNestjsOrpEffCicliEsec?.artAna?.DES_ART}${
                        epsNestjsOrpEffCicliEsec?.KM?.toString() !== "0"
                          ? ` · ${epsNestjsOrpEffCicliEsec?.KM} Km`
                          : ""
                      }`}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h4" textAlign="right">
                    {epsNestjsOrpEffCicliEsec?.TEMPO_OPERATORE_SESSANTESIMI?.toString()}
                  </Typography>
                </Grid>
              </Card>
            </Grid>
          );
        })}

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
  roles: [RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.AUTISTA],
});
