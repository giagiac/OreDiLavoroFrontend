"use client";

import { FullPageLoader } from "@/components/full-page-loader";
import { NumericKeypad } from "@/components/numeric-keypad-ore";
import { useSnackbar } from "@/hooks/use-snackbar";
import { usePostEpsNestjsOrpEffCicliEsecService } from "@/services/api/services/eps-nestjs-orp-eff-cicli-esec";
import { usePostEpsNestjsOrpEffCicliEsecChildService } from "@/services/api/services/eps-nestjs-orp-eff-cicli-esec-child";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { OrpEffCicli } from "@/services/api/types/orp-eff-cicli";
import { SortEnum } from "@/services/api/types/sort-type";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import CameraAltTwoToneIcon from "@mui/icons-material/CameraAltTwoTone";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import FilledInput from "@mui/material/FilledInput";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, Fragment, KeyboardEvent, useMemo, useState } from "react";
import { useGetOrpEffCicliQuery } from "../../queries/queries-orp-eff-cicli";
import TargaMezziTable from "../../targa-mezzi-table";
import AirportShuttleTwoToneIcon from "@mui/icons-material/AirportShuttleTwoTone";
import DeleteForeverTwoTone from "@mui/icons-material/DeleteForeverTwoTone";
import FactoryTwoToneIcon from "@mui/icons-material/FactoryTwoTone";
import FlightTakeoffTwoToneIcon from "@mui/icons-material/FlightTakeoffTwoTone";

type OrpEffCicliKeys = keyof OrpEffCicli;

const TEMPO_OPERATORE_DEFAULT = "00:00";
const CODICE_BREVE_DEFAULT = ""; // 2414014-1

type CreateFormData = {
  // OBBLIGATORI
  TIPO_TRASFERTA: string;
  TEMPO_OPERATORE: string;
  // Documento
  DOC_RIGA_ID: string;
  DOC_ID: string;
  AZIENDA_ID: number;

  // SEZIONE DEDICATA a KM AUTISTA
  COD_ART?: string | null; // ATT.NE non è il COD_ART delle Esecuzioni (da inserire nei componenti)
  KM?: number | null;

  // EXTRA
  NOTE?: string | null;
};

type CreateFormDataChild = {
  idfk: number;
  // OBBLIGATORI
  TIPO_TRASFERTA: string;
  TEMPO_OPERATORE: string;
  // Documento
  DOC_RIGA_ID: string;
  DOC_ID: string;
  AZIENDA_ID: number;

  // SEZIONE DEDICATA a KM AUTISTA
  COD_ART: string; // ATT.NE non è il COD_ART delle Esecuzioni (da inserire nei componenti)
  KM: number;

  // EXTRA
  NOTE?: string | null;
};

function FormCreateEpsNestjsOrpEffCicliEsec() {
  const params = useParams<{ type: string }>();
  const searchParams = useSearchParams();

  const tipoTrasferta = params.type;

  let prepareLink = "/hours/manage";
  let prepareText = "In sede";
  let buttonColor: "primary" | "secondary" | "info" = "secondary"; // Customizable button color
  let icon = <FactoryTwoToneIcon />;

  switch (tipoTrasferta) {
    case "in_sede":
      prepareLink = "/hours/manage";
      prepareText = "In sede";
      buttonColor = "secondary";
      break;
    // da qui in poi sono tutte
    // FUORI SEDE
    case "in_giornata":
      prepareLink = "/hours/manage/step2_FuoriSede";
      prepareText = "In giornata";
      buttonColor = "primary";
      icon = <FlightTakeoffTwoToneIcon />;
      break;
    case "in_giornata_dopo_21":
      prepareLink = "/hours/manage/step2_FuoriSede";
      prepareText = "In giornata dopo le 21:00";
      buttonColor = "primary";
      icon = <FlightTakeoffTwoToneIcon />;
      break;
    case "fuori_sede_andata":
      prepareText = "Fuori sede andata";
      prepareLink = "/hours/manage/step3_FuoriSede";
      buttonColor = "primary";
      icon = <FlightTakeoffTwoToneIcon />;
      break;
    case "fuori_sede_ritorno":
      prepareText = "Fuori sede ritorno";
      prepareLink = "/hours/manage/step3_FuoriSede";
      buttonColor = "primary";
      icon = <FlightTakeoffTwoToneIcon />;
      break;
    case "ancora_in_missione_0":
      prepareText = "Ancora in trasferta 0 Km";
      prepareLink = "/hours/manage/step3_FuoriSede";
      buttonColor = "primary";
      icon = <FlightTakeoffTwoToneIcon />;
      break;
    case "ancora_in_missione_10":
      prepareText = "Ancora in trasferta 5 Km";
      prepareLink = "/hours/manage/step3_FuoriSede";
      buttonColor = "primary";
      icon = <FlightTakeoffTwoToneIcon />;
      break;
    case "ancora_in_missione_20":
      prepareText = "Ancora in trasferta 10 Km";
      prepareLink = "/hours/manage/step3_FuoriSede";
      buttonColor = "primary";
      icon = <FlightTakeoffTwoToneIcon />;
      break;
    case "ancora_in_missione_30":
      prepareText = "Ancora in trasferta 15 Km";
      prepareLink = "/hours/manage/step3_FuoriSede";
      buttonColor = "primary";
      icon = <FlightTakeoffTwoToneIcon />;
      break;
    case "ancora_in_missione_40":
      prepareText = "Ancora in trasferta 20 Km";
      prepareLink = "/hours/manage/step3_FuoriSede";
      buttonColor = "primary";
      icon = <FlightTakeoffTwoToneIcon />;
      break;
    case "step1_KmAutista":
      prepareText = "Km Autista";
      prepareLink = "/hours/manage/step1_KmAutista";
      buttonColor = "info";
      icon = <AirportShuttleTwoToneIcon />;
      break;
  }

  const [codiceBreveValue, setCodiceBreve] = useState(CODICE_BREVE_DEFAULT);
  const [enterPressed, setEnterPressed] = useState(false);
  const [multipleScannerDetected, setMultipleScannerDetected] =
    useState<String | null>(null);

  const handleCustomInputChange = (
    event:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = event.target as HTMLInputElement;

    if ("key" in event && event.key === "Enter") {
      // Logica per gestire l'invio a capo
      console.log("Invio a capo rilevato:", target.value);
      setFilters([
        {
          columnName: "CODICE_BREVE",
          value: target.value,
        },
      ]);
      setEnterPressed(true);
      return;
    }

    setEnterPressed(false);
    setCodiceBreve(target.value);
  };

  // QR_CODE SCANNER
  const [isScannerOpen, setScannerOpen] = useState(false);
  const handleOpenScanner = () => setScannerOpen(true);
  const handleCloseScanner = () => setScannerOpen(false);

  // FILTERS
  const [{ order, orderBy }] = useState<{
    order: SortEnum;
    orderBy: OrpEffCicliKeys;
  }>({ order: SortEnum.ASC, orderBy: "DOC_RIGA_ID" });
  const [filters, setFilters] = useState<Array<FilterItem<OrpEffCicli>>>([
    { columnName: "CODICE_BREVE", value: codiceBreveValue },
  ]);
  const [othersFilters] = useState<Array<OthersFiltersItem>>([]);

  const { data, isFetched, isFetching, isLoading } = useGetOrpEffCicliQuery({
    sort: { order, orderBy },
    filters,
    othersFilters,
  });

  const result = useMemo(() => {
    const result =
      (data?.pages.flatMap((page) => page?.data) as OrpEffCicli[]) ??
      ([] as OrpEffCicli[]);

    return removeDuplicatesFromArrayObjects(result, "DOC_RIGA_ID");
  }, [data, filters]);

  const router = useRouter();
  const fetchPostEpsNestjsOrpEffCicliEsec =
    usePostEpsNestjsOrpEffCicliEsecService();
  // const { t } = useTranslation("admin-panel-users-create");
  const { enqueueSnackbar } = useSnackbar();

  const [tempoOreOperatore, setTempoOreOperatore] = useState<string>(
    TEMPO_OPERATORE_DEFAULT
  );
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setDialogOpen(false);
    setTempoOreOperatore(TEMPO_OPERATORE_DEFAULT);

    setFilters(() => {
      const newValue = "";
      setCodiceBreve(newValue);
      return [{ columnName: "CODICE_BREVE", value: newValue }];
    });
  };

  const [id, setId] = useState<number | null>(null);

  const onSubmit = async (COD_ART?: string) => {
    const selected_COD_ART = searchParams.get("COD_ART") || COD_ART;
    const KM: number = parseFloat(searchParams.get("KM") || "0");

    if (tempoOreOperatore === TEMPO_OPERATORE_DEFAULT) {
      enqueueSnackbar(`Non hai impostato il tempo operatore`, {
        variant: "error",
      });
      return;
    }

    const formData: CreateFormData = {
      TIPO_TRASFERTA: tipoTrasferta,

      TEMPO_OPERATORE: tempoOreOperatore,
      // Documento
      DOC_RIGA_ID: result[0].DOC_RIGA_ID,
      DOC_ID: result[0].DOC_ID,
      AZIENDA_ID: result[0].AZIENDA_ID,
      // SEZIONE DEDICATA a KM AUTISTA
      COD_ART: selected_COD_ART, // ATT.NE non è il COD_ART delle Esecuzioni (da inserire nei componenti)
      KM: KM,
      // EXTRA
      NOTE: "",
    };

    const { data, status } = await fetchPostEpsNestjsOrpEffCicliEsec(formData);
    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (Object.keys(data.errors) as Array<keyof CreateFormData>).forEach(
        (key) => {
          // TODO: GESTIONE ERRORI
          enqueueSnackbar(`${key} - ${data.errors[key]}`, {
            variant: "error",
          });
        }
      );
      return;
    }
    if (status === HTTP_CODES_ENUM.CREATED) {
      enqueueSnackbar("Ore commessa aggiunte", {
        variant: "success",
      });

      setId(Number(data.id));

      // Open confirmation dialog
      setDialogOpen(true);
    }
  };

  const fetchPostEpsNestjsOrpEffCicliEsecChild =
    usePostEpsNestjsOrpEffCicliEsecChildService();

  const onSubmitChild = async (COD_ART: string) => {
    const selected_COD_ART = searchParams.get("COD_ART") || COD_ART;
    const KM: number = parseFloat(searchParams.get("KM") || "0");

    const formData: CreateFormDataChild = {
      TIPO_TRASFERTA: tipoTrasferta,

      TEMPO_OPERATORE: tempoOreOperatore,
      // Documento
      DOC_RIGA_ID: result[0].DOC_RIGA_ID,
      DOC_ID: result[0].DOC_ID,
      AZIENDA_ID: result[0].AZIENDA_ID,
      // SEZIONE DEDICATA a KM AUTISTA
      COD_ART: selected_COD_ART, // ATT.NE non è il COD_ART delle Esecuzioni (da inserire nei componenti)
      KM: KM,
      // EXTRA
      NOTE: "",
      idfk: id || -1,
    };

    const { data, status } =
      await fetchPostEpsNestjsOrpEffCicliEsecChild(formData);
    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (Object.keys(data.errors) as Array<keyof CreateFormData>).forEach(
        (key) => {
          // TODO: GESTIONE ERRORI
          enqueueSnackbar(`${key} - ${data.errors[key]}`, {
            variant: "error",
          });
        }
      );
      return;
    }
    if (status === HTTP_CODES_ENUM.CREATED) {
      enqueueSnackbar("Ore commessa aggiunte", {
        variant: "success",
      });
    }
  };

  return (
    <>
      <Dialog open={isScannerOpen} onClose={handleCloseScanner} fullWidth>
        <DialogContent>
          <Scanner
            onScan={(result) => {
              if (result.length === 1) {
                setCodiceBreve(result[0].rawValue);
                setFilters([
                  {
                    columnName: "CODICE_BREVE",
                    value: result[0].rawValue,
                  },
                ]);
                handleCloseScanner();
                setMultipleScannerDetected(null);
              } else if (result.length > 1) {
                {
                  setMultipleScannerDetected(
                    result.map((item) => item.rawValue).join(", ")
                  );
                }
              }
            }}
          />
          <Typography variant="h6" align="center" gutterBottom sx={{ mt: 2 }}>
            {multipleScannerDetected}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseScanner} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Container maxWidth="md">
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
              size="large"
              style={{ height: 50, fontSize: "1.5rem" }}
              color={buttonColor} // Use customizable button color
              onClick={() => {
                router.push(prepareLink);
              }}
              startIcon={<ArrowBackTwoToneIcon />}
              endIcon={icon}
            >
              {prepareText}
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2} mb={3} mt={3}>
          <Grid size={{ xs: 12 }}>
            <FormControl sx={{}} variant="outlined" fullWidth>
              <InputLabel htmlFor="filled-adornment-codce-breve">
                Codice Breve
              </InputLabel>
              <FilledInput
                id="filled-adornment-codce-breve"
                value={codiceBreveValue}
                onChange={(e) => handleCustomInputChange(e)} // Passa esplicitamente l'evento
                onKeyDown={(e) => handleCustomInputChange(e)} // Passa esplicitamente l'evento
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleOpenScanner}>
                      <CameraAltTwoToneIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
          {isFetched && (
            <>
              {result.length === 0 &&
                codiceBreveValue.length > 0 &&
                enterPressed && (
                  <Grid size={{ xs: 12 }} textAlign="center">
                    <Typography variant="h3" color="error">
                      Nessuna commessa trovata
                    </Typography>
                  </Grid>
                )}
              {result.length === 0 && codiceBreveValue.length === 0 && (
                <Grid size={{ xs: 12 }} textAlign="center">
                  <Typography variant="h4" color="info">
                    Inserisci il codice commessa
                  </Typography>
                </Grid>
              )}
              {result.length > 0 &&
                result[0].orpEff !== null &&
                result[0].orpEff.STATUS === 2 && (
                  <Grid size={{ xs: 12 }} textAlign="center">
                    <Typography variant="h3" color="warning">
                      Commessa chiusa
                    </Typography>
                  </Grid>
                )}
              {/* DETTAGLIO COMMESSE - possono essere liste - ma improbabile */}
              {result.length > 0 &&
                result[0].orpEff !== null &&
                result[0].orpEff.STATUS !== 2 &&
                result.map((item) => (
                  <Fragment key={item.DOC_RIGA_ID}>
                    <Grid size={{ xs: 12 }}>
                      <TableContainer
                        component={Paper}
                        elevation={5}
                        sx={{ p: 2 }}
                      >
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell sx={{ borderBottom: "none", p: 0.5 }}>
                                <Typography variant="caption">
                                  Commessa
                                </Typography>
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderBottom: "none", p: 0.5 }}
                              >
                                <Typography
                                  variant="h4"
                                  gutterBottom
                                  textAlign="center"
                                >
                                  {item?.DOC_ID}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ borderBottom: "none", p: 0.5 }}>
                                <Typography variant="caption">
                                  Articolo
                                </Typography>
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderBottom: "none", p: 0.5 }}
                              >
                                <Typography
                                  variant="h4"
                                  gutterBottom
                                  textAlign="center"
                                >
                                  {item?.orpEff?.COD_ART}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ borderBottom: "none", p: 0.5 }}>
                                <Typography variant="caption">
                                  Cliente
                                </Typography>
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderBottom: "none", p: 0.5 }}
                              >
                                {(item?.linkOrpOrd?.length ?? 0) > 0 ? (
                                  <Fragment>
                                    <Typography
                                      variant="body1"
                                      gutterBottom
                                      textAlign="center"
                                    >
                                      {
                                        item?.linkOrpOrd?.[0]?.ordCliRighe?.cf
                                          .RAG_SOC_CF
                                      }
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      gutterBottom
                                      textAlign="center"
                                    >
                                      {item?.linkOrpOrd?.[0]?.ordCliRighe
                                        ?.ordCli.cfComm?.INDI_SEDE ||
                                        item?.linkOrpOrd?.[0]?.ordCliRighe?.cf
                                          .INDI_CF}
                                    </Typography>
                                  </Fragment>
                                ) : (
                                  <Typography variant="caption">
                                    Nessun ordine associato
                                  </Typography>
                                )}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ borderBottom: "none", p: 0.5 }}>
                                <Typography variant="caption">
                                  Prodotto
                                </Typography>
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderBottom: "none", p: 0.5 }}
                              >
                                <Typography
                                  variant="body1"
                                  gutterBottom
                                  textAlign="center"
                                >
                                  {item?.orpEff?.DES_PROD}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ borderBottom: "none", p: 0.5 }}>
                                <Typography variant="caption">Ciclo</Typography>
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderBottom: "none", p: 0.5 }}
                              >
                                <Typography
                                  variant="body1"
                                  gutterBottom
                                  textAlign="center"
                                >
                                  {item?.DES_CICLO?.replace(
                                    item?.orpEff?.DES_PROD || "",
                                    ""
                                  )}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>

                      <NumericKeypad
                        onNumberChange={(value) => {
                          setTempoOreOperatore(value);
                        }}
                      />
                      <Grid size={{ xs: 12 }}>
                        {tipoTrasferta !== "step1_KmAutista" && (
                          <Typography
                            gutterBottom
                            textAlign="center"
                            variant="body2"
                          >
                            Nota: anche se non sei l'autista specifica comunque
                            la targa del veicolo del viaggio!
                          </Typography>
                        )}
                        {tipoTrasferta !== "in_sede" &&
                        tipoTrasferta !== "step1_KmAutista" ? (
                          <>
                            <TargaMezziTable
                              childrenCallBack={(COD_ART) => (
                                <Button
                                  sx={(theme) => ({
                                    width: "100%",
                                    height: theme.spacing(10),
                                    fontSize: "1.5rem",
                                    mt: theme.spacing(2),
                                  })}
                                  fullWidth
                                  size="large"
                                  variant="contained"
                                  onClick={async () => {
                                    await onSubmit(COD_ART); // è UN AUTISTA
                                  }} // Usa la funzione onClick passata
                                >
                                  CONFERMA
                                </Button>
                              )}
                            />
                          </>
                        ) : (
                          <Button
                            style={{
                              width: "100%",
                              height: 50,
                              fontSize: "1.5rem",
                            }}
                            sx={(theme) => ({
                              width: "100%",
                              height: theme.spacing(10),
                              fontSize: "1.5rem",
                              mt: theme.spacing(2),
                            })}
                            fullWidth
                            size="large"
                            variant="contained"
                            onClick={async () => {
                              await onSubmit(); // NON è un AUTISTA
                            }}
                          >
                            CONFERMA
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </Fragment>
                ))}
            </>
          )}
        </Grid>
      </Container>
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogContent>
          <Typography>
            La creazione è avvenuta con successo. Vuoi aggiungere altre ORE? ⏱️
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Sì
          </Button>
          <Button
            onClick={() => {
              router.push("/hours/manage");
            }}
            color="secondary"
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
      <FullPageLoader isLoading={isLoading || isFetching} />
    </>
  );
}

function CreateUser() {
  return <FormCreateEpsNestjsOrpEffCicliEsec />;
}

export default withPageRequiredAuth(CreateUser);
