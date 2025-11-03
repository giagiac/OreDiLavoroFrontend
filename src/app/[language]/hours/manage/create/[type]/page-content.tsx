"use client";

import { NumericKeypad } from "@/components/numeric-keypad-ore";
import { useSnackbar } from "@/hooks/use-snackbar";
import { usePostEpsNestjsOrpEffCicliEsecService } from "@/services/api/services/eps-nestjs-orp-eff-cicli-esec";
import { FilterItem } from "@/services/api/types/filter";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { OrpEffCicli } from "@/services/api/types/orp-eff-cicli";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import AirportShuttleTwoToneIcon from "@mui/icons-material/AirportShuttleTwoTone";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import CameraAltTwoToneIcon from "@mui/icons-material/CameraAltTwoTone";
import FactoryTwoToneIcon from "@mui/icons-material/FactoryTwoTone";
import FlightTakeoffTwoToneIcon from "@mui/icons-material/FlightTakeoffTwoTone";
import HomeTwoToneIcon from "@mui/icons-material/HomeTwoTone";
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
import TableContainer from "@mui/material/TableContainer";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ChangeEvent,
  Fragment,
  KeyboardEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePostEpsNestjsOrpEffCicliEsecChildService } from "../../queries/queries";
import Children from "./children";
import { ButtonTipoTrasferta } from "@/components/button-tipo-trasferta";
import { useGetOrpEffCicliService } from "@/services/api/services/orp-eff-cicli";
import { useGetTargaMezziService } from "@/services/api/services/targa-mezzi";
import { ArtAna } from "@/services/api/types/art-ana";
import { TipoTrasferta } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec";
import { SortEnum } from "@/services/api/types/sort-type";
import { TargaMezzi } from "@/services/api/types/targa-mezzi";
import dayjs from "dayjs";
import { OperatoreSelected } from "../../opertore-selected";
import { AnelloGiallo, StelleEuropee } from "../../targa-mezzi-table";
dayjs.locale("it");

const TEMPO_OPERATORE_DEFAULT = "00:00";
const CODICE_BREVE_DEFAULT = ""; // 2414014-1

const LAST_SCAN_BARCODE_WITH_ONFOCUS = "wasTextFieldFocused";

type CreateFormData = {
  // OBBLIGATORI
  TIPO_TRASFERTA: string;
  TEMPO_OPERATORE: string;
  COD_OP: string;

  // Documento
  DOC_RIGA_ID: string;
  DOC_ID: string;
  AZIENDA_ID: number;
  DATA_INIZIO: string | null;
  DATA_FINE: string | null;

  // SEZIONE DEDICATA a KM AUTISTA
  COD_ART?: string | null; // ATT.NE non è il COD_ART delle Esecuzioni (da inserire nei componenti)
  KM?: number;

  // EXTRA
  NOTE?: string | null;
};

type CreateFormDataChild = {
  idfk: number;
  // OBBLIGATORI
  TIPO_TRASFERTA: string;
  TEMPO_OPERATORE: string;
  COD_OP: string;

  // Documento
  DOC_RIGA_ID: string;
  DOC_ID: string;
  AZIENDA_ID: number;
  DATA_INIZIO: string | null;
  DATA_FINE: string | null;

  // SEZIONE DEDICATA a KM AUTISTA
  COD_ART: string; // ATT.NE non è il COD_ART delle Esecuzioni (da inserire nei componenti)
  KM: number;

  // EXTRA
  NOTE?: string | null;
};

function FormCreateEpsNestjsOrpEffCicliEsec() {
  const params = useParams<{
    type: TipoTrasferta;
  }>();
  const tipoTrasferta = params.type;

  const searchParams = useSearchParams();

  const COD_ART = searchParams.get("COD_ART");
  const KM: number = parseFloat(searchParams.get("KM") || "0");
  // const id = searchParams.get("id"); //nope this - passaggio a salvataggio locale
  // const [id, setId] = useState<string | null>(() => null);
  const COD_OP = searchParams.get("COD_OP");
  const DATA_INIZIO = searchParams.get("DATA_INIZIO");
  const id = searchParams.get("ID"); // solo per sezione KM_AUTISTA che è l'unico che può creare figli (in questo caso si segue una logica diversa basata solo sull'ID)

  let prepareText = "In sede";

  let icon = <FactoryTwoToneIcon />;

  const filtersArtAna: Array<FilterItem<TargaMezzi>> = [
    { columnName: "COD_ART", value: COD_ART || "" },
  ];

  const [dataArtAna, setDataArtAna] = useState<ArtAna | null>(null);

  const fetchTarga = useGetTargaMezziService();

  useMemo(async () => {
    if (filtersArtAna[0].value != "") {
      const { status, data } = await fetchTarga({
        page: 0,
        limit: 500,
        filters: filtersArtAna,
        othersFilters: [],
        sort: [{ order: SortEnum.DESC, orderBy: "COD_ART" }],
      });

      if (status === HTTP_CODES_ENUM.OK) {
        if (data.data.length > 0 && data.data[0].artAna !== undefined) {
          setDataArtAna(data.data[0].artAna);
        }
      }
    }
  }, []);

  switch (tipoTrasferta) {
    case "in_sede":
      prepareText = "In sede";
      icon = <FactoryTwoToneIcon />;
      break;
    // da qui in poi sono tutte
    // FUORI SEDE
    case "in_giornata":
      prepareText = "In giornata";
      icon = <FlightTakeoffTwoToneIcon />;
      break;
    case "in_giornata_dopo_21":
      prepareText = "In giornata dopo le 21:00";
      icon = <FlightTakeoffTwoToneIcon />;
      break;
    case "fuori_sede_andata":
      prepareText = "Fuori sede andata";
      icon = <FlightTakeoffTwoToneIcon />;
      break;
    case "fuori_sede_ritorno_in_giornata":
      prepareText = "Fuori sede ritorno in giornata";
      icon = <FlightTakeoffTwoToneIcon />;
      break;
    case "fuori_sede_ritorno_dopo_21":
      prepareText = "Fuori sede ritorno dopo le 21:00";
      icon = <FlightTakeoffTwoToneIcon />;
      break;
    case "ancora_in_trasferta_0":
      prepareText = "Ancora in trasferta 0 Km";
      icon = <FlightTakeoffTwoToneIcon />;
      break;
    case "ancora_in_trasferta_10":
      prepareText = "Ancora in trasferta 10 Km";
      icon = <FlightTakeoffTwoToneIcon />;
      break;
    case "ancora_in_trasferta_20":
      prepareText = "Ancora in trasferta 20 Km";
      icon = <FlightTakeoffTwoToneIcon />;
      break;
    case "ancora_in_trasferta_30":
      prepareText = "Ancora in trasferta 30 Km";
      icon = <FlightTakeoffTwoToneIcon />;
      break;
    case "ancora_in_trasferta_40":
      prepareText = "Ancora in trasferta 40 Km";
      icon = <FlightTakeoffTwoToneIcon />;
      break;
    // da qui in poi sono tutte
    // FUORI SEDE
    case "step1_km_autista":
      prepareText = "Km Autista";
      icon = <AirportShuttleTwoToneIcon />;
      break;
  }

  const [codiceBreveValue, setCodiceBreve] = useState(CODICE_BREVE_DEFAULT);
  const [enterPressed, setEnterPressed] = useState<number>(0);
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
      const value = target.value;
      setFilters([
        {
          columnName: "CODICE_BREVE",
          value,
        },
      ]);
      setEnterPressed((prev) => prev + 1);
      return;
    }

    setEnterPressed(0);
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

  const [filters, setFilters] = useState<Array<FilterItem<OrpEffCicli>>>([
    { columnName: "CODICE_BREVE", value: codiceBreveValue },
  ]);

  const [data, setData] = useState<OrpEffCicli[] | null>(null);

  const fetch = useGetOrpEffCicliService();
  async function handleScannerDetected() {
    setData(null);
    const { status, data } = await fetch({
      page: 1,
      limit: 10,
      filters,
      sort: undefined,
      othersFilters: [],
    });

    if (status === HTTP_CODES_ENUM.OK) {
      setData(data.data);
      setEnterPressed(0);
    }
  }
  useEffect(() => {
    if (enterPressed > 0) {
      handleScannerDetected();
    }
  }, [enterPressed]);

  const result = useMemo(() => {
    const result =
      (data?.flatMap((page) => page) as OrpEffCicli[]) ?? ([] as OrpEffCicli[]);

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

    setData(null);
    setCodiceBreve("");
    setEnterPressed(0);

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

    if (COD_OP === null) {
      enqueueSnackbar(`Operatore non definito`, {
        variant: "error",
      });
      return;
    }

    const formData: CreateFormData = {
      TIPO_TRASFERTA: tipoTrasferta,
      COD_OP: COD_OP,

      TEMPO_OPERATORE: tempoOreOperatore,
      // Documento
      DOC_RIGA_ID: result[0].DOC_RIGA_ID,
      DOC_ID: result[0].DOC_ID,
      AZIENDA_ID: result[0].AZIENDA_ID,
      DATA_INIZIO: dayjs(DATA_INIZIO).format("YYYY-MM-DD"),
      DATA_FINE: dayjs(DATA_INIZIO).format("YYYY-MM-DD"),
      // SEZIONE DEDICATA a KM AUTISTA
      COD_ART, // ATT.NE non è il COD_ART delle Esecuzioni (da inserire nei componenti)
      KM,
      // EXTRA
      NOTE: "",
    };

    const { data, status } = await fetchPostEpsNestjsOrpEffCicliEsec(formData);

    if (status === HTTP_CODES_ENUM.CREATED) {
      enqueueSnackbar("Ore commessa aggiunte", {
        variant: "success",
      });
      if (tipoTrasferta === "step1_km_autista") {
        router.replace(
          `${window.location.pathname}?COD_ART=${COD_ART}&KM=${KM}&COD_OP=${COD_OP}&DATA_INIZIO=${DATA_INIZIO}&ID=${data.id}`,
          {
            scroll: true,
          }
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

  const onSubmitChild = async (id: string) => {
    if (COD_ART === null) {
      enqueueSnackbar(`Non hai selezionato un articolo`, {
        variant: "error",
      });
      return;
    }

    if (COD_OP === null) {
      enqueueSnackbar(`Operatore non definito`, {
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
      COD_OP: COD_OP,

      TEMPO_OPERATORE: tempoOreOperatore,
      // Documento
      DOC_RIGA_ID: result[0].DOC_RIGA_ID,
      DOC_ID: result[0].DOC_ID,
      AZIENDA_ID: result[0].AZIENDA_ID,
      DATA_INIZIO: dayjs(DATA_INIZIO).format("YYYY-MM-DD"),
      DATA_FINE: dayjs(DATA_INIZIO).format("YYYY-MM-DD"),
      // SEZIONE DEDICATA a KM AUTISTA
      COD_ART, // ATT.NE non è il COD_ART delle Esecuzioni (da inserire nei componenti)
      KM,
      // EXTRA
      NOTE: "",
      idfk: Number(id), // idfk sarà l'id del padre...
    };

    const { data, status } =
      await fetchPostEpsNestjsOrpEffCicliEsecChild(formData);
    if (status === HTTP_CODES_ENUM.CREATED) {
      enqueueSnackbar("Ore commessa aggiunte", {
        variant: "success",
      });

      // Open confirmation dialog
      setDialogOpen(
        "La creazione è avvenuta con successo. Vuoi aggiungere altre commesse?"
      );
      setEnterPressed(prev => prev + 1);
    }
  };

  const DATA_INIZIO_FORMATTED = DATA_INIZIO
    ? dayjs(DATA_INIZIO).format("ddd DD MMM YY")
    : "";

  const hadleReturnToMain = () => {
    if (window.location.pathname.indexOf("manage-badge-admin") > -1) {
      // sono amministatore e torno alla main riposizionando l'utente
      router.push(
        `/hours/manage-badge-admin?COD_OP=${COD_OP}&DATA_INIZIO=${DATA_INIZIO}`,
        {
          scroll: true,
        }
      );
    } else if (window.location.pathname.indexOf("manage-badge") > -1) {
      // sono operatore badge e torno alla main senza riposizionare l'utente
      window.history.pushState({}, "", `${window.location.pathname}`);
      router.replace(`/hours/manage-badge`, {
        scroll: true,
      });
    } else {
      window.history.pushState({}, "", `${window.location.pathname}`);
      router.replace(`/hours/manage`, {
        scroll: true,
      });
    }
  };

  return (
    <>
      <Dialog open={isScannerOpen} onClose={handleCloseScanner} fullWidth>
        <DialogContent>
          <Scanner
            onScan={(result) => {
              setCodiceBreve(result[0].rawValue);
              setEnterPressed((prev) => {
                setFilters([
                  {
                    columnName: "CODICE_BREVE",
                    value: result[0].rawValue,
                  },
                ]);
                handleCloseScanner();
                return prev + 1;
              });

              if (result.length === 1) {
                // TODO :
                setMultipleScannerDetected(null);
              } else if (result.length > 1) {
                {
                  enqueueSnackbar("Att.ne seleziona un codice alla volta", {
                    variant: "error",
                  });
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
      <Container maxWidth="xl" sx={{ m: 0, p: 1 }}>
        <Stack direction="row" mb={3} spacing={1}>
          {prepareText !== "In sede" && (
            <Button onClick={hadleReturnToMain}>
              <HomeTwoToneIcon />
            </Button>
          )}
          <ButtonTipoTrasferta
            onClickAction={() => {
              router.back();
            }}
            endIcon={icon}
            label={prepareText}
            startIcon={<ArrowBackTwoToneIcon />}
          />
        </Stack>
        <Grid container direction="row" sx={{ justifyContent: "flex-end" }}>
          <Grid size={12} textAlign="right">
            <OperatoreSelected text="inserisci il codice breve dell’ordine di produzione" />
          </Grid>
          <Grid size={12} mb={1}>
            <Typography textAlign="right" variant="h6">
              {DATA_INIZIO_FORMATTED}
            </Typography>
          </Grid>
          {dataArtAna !== null && (
            <>
              <Grid size={{ xs: 10, sm: 8, md: 6 }} direction="row">
                <Grid
                  container
                  direction="row"
                  sx={{
                    mb: 3,
                  }}
                  style={{
                    borderRadius: 6,
                    borderWidth: 4,
                    borderStyle: "solid",
                    borderColor: "black",
                    boxShadow: `4px 4px 4px gray`,
                  }}
                >
                  <Grid size={{ xs: 1 }}>
                    <StelleEuropee />
                  </Grid>
                  <Grid size={{ xs: 10 }} textAlign="center">
                    <Typography>{dataArtAna.COD_ART}</Typography>
                    <Typography>{dataArtAna.DES_ART}</Typography>
                  </Grid>
                  <Grid size={{ xs: 1 }}>
                    <AnelloGiallo />
                  </Grid>
                </Grid>
              </Grid>
              {KM > 0 && (
                <Grid size={{ xs: "auto" }}>
                  <Stack direction="row" alignItems="baseline" ml={2}>
                    <>
                      <Typography variant="h6">{KM}</Typography>
                      <Typography variant="caption">Km</Typography>
                    </>
                  </Stack>
                </Grid>
              )}
            </>
          )}
          <Grid
            size={{ xs: 12 }}
            sx={{
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                autoFocus={
                  localStorage.getItem(LAST_SCAN_BARCODE_WITH_ONFOCUS) ===
                  "true"
                }
                type="text"
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
                      {codiceBreveValue.length > 0 &&
                        enterPressed > 0 &&
                        result.length === 0 && (
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
                                  style={{
                                    animation: "spin 1s linear infinite",
                                  }}
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
            {codiceBreveValue.length > 0 &&
              data?.length === 0 && (
                <Grid size={{ xs: 12 }} textAlign="center">
                  <Typography variant="h5" color="error">
                    Nessuna commessa trovata
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
            {tipoTrasferta === "step1_km_autista" &&
              id !== null &&
              COD_OP !== null &&
              DATA_INIZIO !== null && (
                <Children
                  key={enterPressed}
                  id={Number(id)}
                  COD_OP={COD_OP}
                  DATA_INIZIO={DATA_INIZIO}
                />
              )}
            {/* DETTAGLIO COMMESSE - possono essere liste - ma improbabile */}
            {result.length > 0 &&
              result[0].orpEff !== null &&
              result[0].orpEff.STATUS !== 2 &&
              result.map((item) => (
                <Fragment key={item.DOC_RIGA_ID}>
                  <Grid container pt={0.5}>
                    <Grid size={{ xs: 12, md: 8 }} p={0.1}>
                      <TableContainer
                        component={Paper}
                        elevation={3}
                        sx={{ p: 2, minHeight: "100%" }}
                      >
                        <Grid container spacing={{ xs: 0, sm: 1 }}>
                          {/* Ordine di produzione */}
                          <Grid
                            size={{ xs: 12, sm: 1 }}
                            textAlign={{ xs: "right", sm: "right" }}
                          >
                            <Typography variant="caption">
                              Ord. Prod.
                            </Typography>
                          </Grid>
                          <Grid
                            size={{ xs: 12, sm: 11 }}
                            textAlign={{ xs: "center", sm: "left" }}
                          >
                            {(item.linkOrpOrd?.length ?? 0) > 0 ? (
                              <Typography variant="body1" gutterBottom>
                                {item?.DOC_ID}
                              </Typography>
                            ) : (
                              (item?.orpEffCicliPadre?.gerarchiaDocumenti
                                ?.length ?? 0) > 0 && (
                                <Fragment>
                                  <Stack direction="row">
                                    {item?.orpEffCicliPadre?.gerarchiaDocumenti?.map(
                                      (it, index) => (
                                        <Fragment key={it.DOC_ID}>
                                          {index != 0 && (
                                            <Typography
                                              variant="body1"
                                              gutterBottom
                                              mr={1}
                                            >
                                              {"←"}
                                            </Typography>
                                          )}
                                          <Typography
                                            variant="body1"
                                            gutterBottom
                                            mr={1}
                                          >
                                            {it.DOC_ID}
                                          </Typography>
                                        </Fragment>
                                      )
                                    )}
                                  </Stack>
                                </Fragment>
                              )
                            )}
                          </Grid>
                          {/* Commessa */}
                          <Grid
                            size={{ xs: 12, sm: 1 }}
                            textAlign={{ xs: "right", sm: "right" }}
                          >
                            <Typography variant="caption">Comm.</Typography>
                          </Grid>
                          <Grid
                            size={{ xs: 12, sm: 11 }}
                            textAlign={{ xs: "center", sm: "left" }}
                          >
                            {(item.linkOrpOrd?.length ?? 0) > 0 ? (
                              <Typography variant="body1" gutterBottom>
                                {item?.linkOrpOrd?.[0]?.ordCliRighe?.DOC_ID}
                              </Typography>
                            ) : (
                              (item.orpEffCicliPadre?.linkOrpOrd?.length ?? 0) >
                                0 && (
                                <Typography variant="body1" gutterBottom>
                                  {
                                    item.orpEffCicliPadre?.linkOrpOrd?.[0]
                                      ?.ordCliRighe?.DOC_ID
                                  }
                                </Typography>
                              )
                            )}
                          </Grid>

                          {/* Articolo */}
                          <Grid
                            size={{ xs: 12, sm: 1 }}
                            textAlign={{ xs: "right", sm: "right" }}
                          >
                            <Typography variant="caption">Art.</Typography>
                          </Grid>
                          <Grid
                            size={{ xs: 12, sm: 11 }}
                            textAlign={{ xs: "center", sm: "left" }}
                          >
                            <Typography variant="body1" gutterBottom>
                              {item?.orpEff?.COD_ART}
                            </Typography>
                          </Grid>

                          {/* Cliente */}
                          <Grid
                            size={{ xs: 12, sm: 1 }}
                            textAlign={{ xs: "right", sm: "right" }}
                          >
                            <Typography variant="caption">Cli.</Typography>
                          </Grid>
                          <Grid
                            size={{ xs: 12, sm: 11 }}
                            textAlign={{ xs: "center", sm: "left" }}
                          >
                            {(item?.linkOrpOrd?.length ?? 0) > 0 ? (
                              <Fragment>
                                <Typography variant="h4" gutterBottom>
                                  {
                                    item?.linkOrpOrd?.[0]?.ordCliRighe?.cf
                                      .RAG_SOC_CF
                                  }
                                </Typography>
                                <Typography variant="h4" gutterBottom>
                                  {
                                    item?.linkOrpOrd?.[0]?.ordCliRighe?.ordCli
                                      .cfComm?.DES_SEDE
                                  }
                                </Typography>
                              </Fragment>
                            ) : (
                              <>
                                {(item?.orpEffCicliPadre?.linkOrpOrd?.length ??
                                  0) > 0 ? (
                                  <Fragment>
                                    <Typography variant="h4" gutterBottom>
                                      {
                                        item?.orpEffCicliPadre?.linkOrpOrd?.[0]
                                          ?.ordCliRighe?.cf.RAG_SOC_CF
                                      }
                                    </Typography>
                                    <Typography variant="h4" gutterBottom>
                                      {
                                        item?.orpEffCicliPadre?.linkOrpOrd?.[0]
                                          ?.ordCliRighe?.ordCli.cfComm?.DES_SEDE
                                      }
                                    </Typography>
                                  </Fragment>
                                ) : (
                                  <Typography variant="caption">
                                    Nessun ordine associato
                                  </Typography>
                                )}
                              </>
                            )}
                          </Grid>

                          {/* Prodotto */}
                          <Grid
                            size={{ xs: 12, sm: 1 }}
                            textAlign={{ xs: "right", sm: "right" }}
                          >
                            <Typography variant="caption">Prod.</Typography>
                          </Grid>
                          <Grid
                            size={{ xs: 12, sm: 11 }}
                            textAlign={{ xs: "center", sm: "left" }}
                          >
                            <Typography variant="h4" gutterBottom>
                              {item?.orpEff?.DES_PROD}
                            </Typography>
                          </Grid>

                          {/* Riga ordine (solo se necessario) */}
                          {item?.DES_CICLO &&
                            (item.linkOrpOrd?.length ?? 0) > 0 &&
                            item.DES_CICLO !==
                              item.linkOrpOrd?.[0]?.ordCliRighe?.DES_RIGA && (
                              <>
                                <Grid
                                  size={{ xs: 12, sm: 1 }}
                                  textAlign={{ xs: "right", sm: "right" }}
                                >
                                  <Typography variant="caption">
                                    Riga ordine
                                  </Typography>
                                </Grid>
                                <Grid
                                  size={{ xs: 12, sm: 11 }}
                                  textAlign={{ xs: "center", sm: "left" }}
                                >
                                  <Typography variant="body1" gutterBottom>
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
                                        } else if (desRiga.includes(desCiclo)) {
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
                                </Grid>
                              </>
                            )}
                        </Grid>
                      </TableContainer>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }} p={0.1}>
                      <NumericKeypad
                        onNumberChange={(value) => {
                          setTempoOreOperatore(value);
                        }}
                      />
                    </Grid>
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
                          debugger
                          if (tipoTrasferta === "step1_km_autista") {
                            if (id) {
                              await onSubmitChild(id);
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
          </Grid>
          {/* <FullPageLoader isLoading={isLoading || isFetching} /> */}
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
                onClick={hadleReturnToMain}
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
