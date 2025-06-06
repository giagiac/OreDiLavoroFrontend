"use client";

import { NumericKeypad } from "@/components/numeric-keypad-ore";
import { useSnackbar } from "@/hooks/use-snackbar";
import { usePostEpsNestjsOrpEffCicliEsecService } from "@/services/api/services/eps-nestjs-orp-eff-cicli-esec";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { OrpEffCicli } from "@/services/api/types/orp-eff-cicli";
import { SortEnum } from "@/services/api/types/sort-type";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import AirportShuttleTwoToneIcon from "@mui/icons-material/AirportShuttleTwoTone";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import CameraAltTwoToneIcon from "@mui/icons-material/CameraAltTwoTone";
import FactoryTwoToneIcon from "@mui/icons-material/FactoryTwoTone";
import FlightTakeoffTwoToneIcon from "@mui/icons-material/FlightTakeoffTwoTone";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ChangeEvent,
  Fragment,
  KeyboardEvent,
  useRef,
  useMemo,
  useState,
} from "react";
import { usePostEpsNestjsOrpEffCicliEsecChildService } from "../../queries/queries";
import { useGetOrpEffCicliQuery } from "../../queries/queries-orp-eff-cicli";
import Children from "./children";
import HomeTwoToneIcon from "@mui/icons-material/HomeTwoTone";

type OrpEffCicliKeys = keyof OrpEffCicli;

const TEMPO_OPERATORE_DEFAULT = "00:00";
const CODICE_BREVE_DEFAULT = ""; // 2414014-1

const LAST_SCAN_BARCODE_WITH_ONFOCUS = "wasTextFieldFocused";

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

import { ButtonTipoTrasferta } from "@/components/button-tipo-trasferta";

function FormCreateEpsNestjsOrpEffCicliEsec() {
  const params = useParams<{
    type: string;
  }>();
  const tipoTrasferta = params.type;

  const searchParams = useSearchParams();

  const COD_ART = searchParams.get("COD_ART");
  const KM: number = parseFloat(searchParams.get("KM") || "0");
  const id = searchParams.get("id");

  let prepareLink = "/hours/manage";
  let prepareText = "In sede";

  let icon = <FactoryTwoToneIcon />;

  switch (tipoTrasferta) {
    case "in_sede":
      prepareLink = "/hours/manage";
      prepareText = "In sede";
      icon = <FactoryTwoToneIcon />;
      break;
    // da qui in poi sono tutte
    // FUORI SEDE
    case "in_giornata":
      prepareLink = "/hours/manage/step2_FuoriSede";
      prepareText = "In giornata";
      icon = <FlightTakeoffTwoToneIcon />;
      break;
    case "in_giornata_dopo_21":
      prepareLink = "/hours/manage/step2_FuoriSede";
      prepareText = "In giornata dopo le 21:00";
      icon = <FlightTakeoffTwoToneIcon />;
      break;
    case "fuori_sede_andata":
      prepareText = "Fuori sede andata";
      prepareLink = "/hours/manage/step3_FuoriSede";
      icon = <FlightTakeoffTwoToneIcon />;
      break;
    case "fuori_sede_ritorno":
      prepareText = "Fuori sede ritorno";
      prepareLink = "/hours/manage/step3_FuoriSede";
      icon = <FlightTakeoffTwoToneIcon />;
      break;
    case "ancora_in_trasferta_0":
      prepareText = "Ancora in trasferta 0 Km";
      prepareLink = "/hours/manage/step3_FuoriSede";

      icon = <FlightTakeoffTwoToneIcon />;
      break;
    case "ancora_in_trasferta_10":
      prepareText = "Ancora in trasferta 10 Km";
      prepareLink = "/hours/manage/step3_FuoriSede";
      icon = <FlightTakeoffTwoToneIcon />;
      break;
    case "ancora_in_trasferta_20":
      prepareText = "Ancora in trasferta 20 Km";
      prepareLink = "/hours/manage/step3_FuoriSede";
      icon = <FlightTakeoffTwoToneIcon />;
      break;
    case "ancora_in_trasferta_30":
      prepareText = "Ancora in trasferta 30 Km";
      prepareLink = "/hours/manage/step3_FuoriSede";
      icon = <FlightTakeoffTwoToneIcon />;
      break;
    case "ancora_in_trasferta_40":
      prepareText = "Ancora in trasferta 40 Km";
      prepareLink = "/hours/manage/step3_FuoriSede";
      icon = <FlightTakeoffTwoToneIcon />;
      break;
    case "step1_km_autista":
      prepareText = "Km Autista";
      prepareLink = "/hours/manage/step1_km_autista";
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

  const [isScannerOpen, setScannerOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const wasTextFieldFocused =
        localStorage.getItem(LAST_SCAN_BARCODE_WITH_ONFOCUS) === "true";
      return !wasTextFieldFocused;
    }
    return false;
  });

  const handleOpenScanner = () => {
    localStorage.setItem(LAST_SCAN_BARCODE_WITH_ONFOCUS, "false");
    setScannerOpen(true);
  };

  const handleCloseScanner = () => {
    setScannerOpen(false);
  };

  // Handle TextField focus state
  const handleTextFieldFocus = () => {
    localStorage.setItem(LAST_SCAN_BARCODE_WITH_ONFOCUS, "true");
  };

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
  }, [data]);

  const router = useRouter();
  const fetchPostEpsNestjsOrpEffCicliEsec =
    usePostEpsNestjsOrpEffCicliEsecService();
  const { enqueueSnackbar } = useSnackbar();

  const [tempoOreOperatore, setTempoOreOperatore] = useState<string>(
    TEMPO_OPERATORE_DEFAULT
  );
  const [isDialogOpen, setDialogOpen] = useState<string | null>(null);

  const handleDialogClose = () => {
    setDialogOpen(null);
    setTempoOreOperatore(TEMPO_OPERATORE_DEFAULT);

    setFilters(() => {
      const newValue = "";
      setCodiceBreve(newValue);
      return [{ columnName: "CODICE_BREVE", value: newValue }];
    });

    const wasTextFieldFocused =
      localStorage.getItem(LAST_SCAN_BARCODE_WITH_ONFOCUS) === "true";
    if (!wasTextFieldFocused) {
      setScannerOpen(true);
    }
  };

  const onSubmit = async () => {
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
      COD_ART, // ATT.NE non è il COD_ART delle Esecuzioni (da inserire nei componenti)
      KM,
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

      if (tipoTrasferta === "step1_km_autista") {
        router.push(
          `/hours/manage/create/step1_km_autista?${searchParams}&id=${data.id}`
        );
        // Open confirmation dialog
        setDialogOpen(
          "La creazione è avvenuta con successo. Vuoi aggiungere altre COMMESSE?"
        );
      } else {
        // Open confirmation dialog
        setDialogOpen(
          "La creazione è avvenuta con successo. Vuoi aggiungere altre ORE?"
        );
      }
    }
  };

  const fetchPostEpsNestjsOrpEffCicliEsecChild =
    usePostEpsNestjsOrpEffCicliEsecChildService();

  const onSubmitChild = async () => {
    if (COD_ART === null) {
      enqueueSnackbar(`Non hai selezionato un articolo`, {
        variant: "error",
      });
      return;
    }

    if (id === null) {
      enqueueSnackbar(`Non hai selezionato una commessa padre valida`, {
        variant: "error",
      });
      return;
    }

    if (KM === null) {
      enqueueSnackbar(`Non hai indicato i KM`, {
        variant: "error",
      });
      return;
    }

    const formData: CreateFormDataChild = {
      TIPO_TRASFERTA: tipoTrasferta,

      TEMPO_OPERATORE: tempoOreOperatore,
      // Documento
      DOC_RIGA_ID: result[0].DOC_RIGA_ID,
      DOC_ID: result[0].DOC_ID,
      AZIENDA_ID: result[0].AZIENDA_ID,
      // SEZIONE DEDICATA a KM AUTISTA
      COD_ART, // ATT.NE non è il COD_ART delle Esecuzioni (da inserire nei componenti)
      KM,
      // EXTRA
      NOTE: "",
      idfk: Number(id),
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

      // Open confirmation dialog
      setDialogOpen(
        "La creazione è avvenuta con successo. Vuoi aggiungere altre commesse?"
      );
    }
  };

  return (
    <>
      <Dialog open={isScannerOpen} onClose={handleCloseScanner} fullWidth>
        <DialogContent>
          <Scanner
            onScan={(result) => {
              setCodiceBreve(result[0].rawValue);
              setFilters([
                {
                  columnName: "CODICE_BREVE",
                  value: result[0].rawValue,
                },
              ]);
              handleCloseScanner();

              if (result.length === 1) {
                // TODO :
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
      <Container maxWidth="md" sx={{ m: 0, p: 1 }}>
        <Stack direction="row" mb={3} spacing={1}>
          {prepareText != "In sede" && (
            <Button
              onClick={() => {
                router.push("/hours/manage", { scroll: true });
              }}
            >
              <HomeTwoToneIcon />
            </Button>
          )}
          <ButtonTipoTrasferta
            onClickAction={() => {
              router.push(prepareLink);
            }}
            endIcon={icon}
            label={prepareText}
            startIcon={<ArrowBackTwoToneIcon />}
          />
        </Stack>
        <Grid container spacing={1} justifyContent="center">
          <Grid size={{ xs: 12 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                autoFocus={
                  localStorage.getItem(LAST_SCAN_BARCODE_WITH_ONFOCUS) ===
                  "true"
                }
                inputMode="text"
                autoComplete="off"
                fullWidth
                label="Codice Breve"
                variant="outlined"
                value={codiceBreveValue}
                onChange={(e) => handleCustomInputChange(e)}
                onFocus={handleTextFieldFocus}
                onKeyDown={(e) =>
                  handleCustomInputChange(
                    e as React.KeyboardEvent<HTMLInputElement>
                  )
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "56px",
                    fontSize: "1.2rem",
                    backgroundColor: "background.paper",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                      borderWidth: 2,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                      borderWidth: 2,
                    },
                  },
                  "& .MuiInputLabel-outlined": {
                    fontSize: "1.1rem",
                    "&.Mui-focused": {
                      color: "primary.main",
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <>
                      {(isLoading || isFetching) && (
                        <InputAdornment position="end">
                          <IconButton disabled>
                            <span
                              style={{
                                display: "inline-block",
                                width: 24,
                                height: 24,
                              }}
                            >
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ animation: "spin 1s linear infinite" }}
                              >
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="#1976d2"
                                  strokeWidth="4"
                                  strokeDasharray="60"
                                  strokeDashoffset="20"
                                  fill="none"
                                />
                                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                              </svg>
                            </span>
                          </IconButton>
                        </InputAdornment>
                      )}
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleOpenScanner}
                          sx={{
                            "&:hover": {
                              backgroundColor: "rgba(25, 118, 210, 0.04)",
                            },
                          }}
                        >
                          <CameraAltTwoToneIcon color="primary" />
                        </IconButton>
                      </InputAdornment>
                    </>
                  ),
                }}
              />
            </Stack>
          </Grid>
          {/* <FullPageLoader isLoading={isLoading || isFetching} /> */}
          {isFetched && (
            <>
              {result.length === 0 &&
                codiceBreveValue.length > 0 &&
                enterPressed && (
                  <Grid size={{ xs: 12 }} textAlign="center">
                    <Typography variant="h5" color="error">
                      Nessuna commessa trovata
                    </Typography>
                  </Grid>
                )}
              {result.length === 0 && codiceBreveValue.length === 0 && (
                <Grid size={{ xs: 12 }} textAlign="center">
                  <Typography variant="h5" color="info">
                    Inserisci il codice commessa
                  </Typography>
                </Grid>
              )}
              {result.length > 0 &&
                result[0].orpEff !== null &&
                result[0].orpEff.STATUS === 2 && (
                  <Grid size={{ xs: 12 }} textAlign="center">
                    <Typography variant="h5" color="warning">
                      Commessa chiusa
                    </Typography>
                  </Grid>
                )}
              {id && <Children id={Number(id)} />}
              {/* DETTAGLIO COMMESSE - possono essere liste - ma improbabile */}
              {result.length > 0 &&
                result[0].orpEff !== null &&
                result[0].orpEff.STATUS !== 2 &&
                result.map((item) => (
                  <Fragment key={item.DOC_RIGA_ID}>
                    <Grid size={{ xs: 12 }}>
                      <TableContainer
                        component={Paper}
                        elevation={3}
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
                                  variant="body1"
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
                                  variant="body1"
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
                                      variant="h4"
                                      gutterBottom
                                      textAlign="center"
                                    >
                                      {
                                        item?.linkOrpOrd?.[0]?.ordCliRighe?.cf
                                          .RAG_SOC_CF
                                      }
                                    </Typography>
                                    <Typography
                                      variant="h4"
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
                                  variant="h4"
                                  gutterBottom
                                  textAlign="center"
                                >
                                  {item?.orpEff?.DES_PROD}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            {item?.DES_CICLO &&
                              (item.linkOrpOrd?.length ?? 0) > 0 &&
                              item.DES_CICLO !==
                                item.linkOrpOrd?.[0]?.ordCliRighe?.DES_RIGA && (
                                <TableRow>
                                  <TableCell
                                    sx={{ borderBottom: "none", p: 0.5 }}
                                  >
                                    <Typography variant="caption">
                                      Riga ordine
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
                                      {(() => {
                                        const desCiclo = item?.DES_CICLO ?? "";
                                        const desRiga =
                                          item?.linkOrpOrd &&
                                          item.linkOrpOrd[0]?.ordCliRighe
                                            ?.DES_RIGA
                                            ? item.linkOrpOrd[0].ordCliRighe
                                                .DES_RIGA
                                            : "";

                                        if (desCiclo && desRiga) {
                                          if (desCiclo.includes(desRiga)) {
                                            // Show the part of desCiclo that is not in desRiga
                                            return desCiclo
                                              .replace(desRiga, "")
                                              .trim();
                                          } else if (
                                            desRiga.includes(desCiclo)
                                          ) {
                                            // Show the part of desRiga that is not in desCiclo
                                            return desRiga
                                              .replace(desCiclo, "")
                                              .trim();
                                          } else {
                                            // Show both if no containment
                                            return `${desCiclo} / ${desRiga}`;
                                          }
                                        }
                                        return desCiclo || desRiga;
                                      })()}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <NumericKeypad
                        onNumberChange={(value) => {
                          setTempoOreOperatore(value);
                        }}
                      />
                      <Grid size={{ xs: 12 }}>
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
                            // doppio controllo (anche se mi aspetto sia sempre solo KmAutista - per ora...)
                            if (tipoTrasferta === "step1_km_autista") {
                              if (id) {
                                await onSubmitChild();
                              } else {
                                await onSubmit();
                              }
                            } else {
                              await onSubmit();
                            }
                          }}
                        >
                          CONFERMA
                        </Button>
                      </Grid>
                    </Grid>
                  </Fragment>
                ))}
            </>
          )}
        </Grid>
      </Container>
      <Dialog open={isDialogOpen !== null} onClose={handleDialogClose}>
        <DialogTitle>
          <Typography>{isDialogOpen}</Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid size={{ xs: 6 }}>
              <Button
                onClick={() => {
                  router.push("/hours/manage");
                }}
                color="secondary"
                variant="contained"
                fullWidth
                sx={{ height: 56, fontSize: "1.25rem" }}
              >
                No
              </Button>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Button
                onClick={handleDialogClose}
                color="primary"
                variant="contained"
                fullWidth
                sx={{ height: 56, fontSize: "1.25rem" }}
              >
                Sì
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}

function PageContent() {
  return <FormCreateEpsNestjsOrpEffCicliEsec />;
}

export default withPageRequiredAuth(PageContent);
