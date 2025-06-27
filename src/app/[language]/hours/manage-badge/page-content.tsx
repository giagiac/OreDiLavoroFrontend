"use client";

import { ButtonTipoTrasferta } from "@/components/button-tipo-trasferta";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import { useSnackbar } from "@/hooks/use-snackbar";
import {
  EpsNestjsOrpEffCicliEsecsResponse,
  useDeleteEpsNestjsOrpEffCicliEsecService,
  useGetEpsNestjsOrpEffCicliEsecService,
} from "@/services/api/services/eps-nestjs-orp-eff-cicli-esec";
import { useScheduleTaskService } from "@/services/api/services/schedule-task";
import { Cf } from "@/services/api/types/cf";
import { CfComm } from "@/services/api/types/cfComm";
import { EpsNestjsOrpEffCicliEsec } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec";
import { FilterItem } from "@/services/api/types/filter";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { LinkOrpOrd } from "@/services/api/types/link-orp-ord";
import { Operatori } from "@/services/api/types/operatori";
import { OrdCli } from "@/services/api/types/ord-cli";
import { RoleEnum } from "@/services/api/types/role";
import { SortEnum } from "@/services/api/types/sort-type";
import { User } from "@/services/api/types/user";
import useAuth from "@/services/auth/use-auth";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useTranslation } from "@/services/i18n/client";
import useLanguage from "@/services/i18n/use-language";
import { yupResolver } from "@hookform/resolvers/yup";
import AirportShuttleTwoToneIcon from "@mui/icons-material/AirportShuttleTwoTone";
import FactoryTwoToneIcon from "@mui/icons-material/FactoryTwoTone";
import FlightTakeoffTwoToneIcon from "@mui/icons-material/FlightTakeoffTwoTone";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/it";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import imageLogo from "../../../../../public/emotions.png";
import { EditOperatoreFormData } from "../../admin-panel/operatori/create-operatori/page-content";
import EditOperatori from "../../admin-panel/operatori/edit-operatori";
import { ChildEpsNestjsOrpEffCicliEsecCard } from "./child-eps-nestjs-orp-eff-cicli-esec-card";
import { useGetMeQuery } from "./queries/queries";

function UserHours() {
  const { user } = useAuth();

  const router = useRouter();

  const { t } = useTranslation("hours-history");

  const language = useLanguage();

  const [dateSelected, setDateSelected] = useState<Dayjs>(dayjs());

  const [filter, setFilter] = useState<
    Array<FilterItem<EpsNestjsOrpEffCicliEsec>>
  >([]);

  const fetch = useGetEpsNestjsOrpEffCicliEsecService();
  const [data, setData] = useState<EpsNestjsOrpEffCicliEsecsResponse | null>(
    null
  );
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      const { status, data: responseData } = await fetch({
        filters: filter,
        page: 0,
        limit: 0,
        sort: [{ order: SortEnum.DESC, orderBy: "id" }],
      });
      if (status === HTTP_CODES_ENUM.OK) {
        setData(responseData);
      } else {
        setData(null);
      }
    };
    if (filter.length > 0) {
      fetchData();
    }
  }, [filter, index, fetch]);

  const result = useMemo(() => {
    const result =
      (data?.data.flatMap((page) => page) as EpsNestjsOrpEffCicliEsec[]) ??
      ([] as EpsNestjsOrpEffCicliEsec[]);

    return removeDuplicatesFromArrayObjects(result, "id");
  }, [data]);

  const { confirmDialog } = useConfirmDialog();
  const fetchEpsNestjsOrpEffCicliEsecDelete =
    useDeleteEpsNestjsOrpEffCicliEsecService();

  const onDelete = async (id: string) => {
    const isConfirmed = await confirmDialog({
      title: "Ore commessa",
      message: "Vuoi confermare la cancellazione?",
    });

    if (isConfirmed) {
      const { status } = await fetchEpsNestjsOrpEffCicliEsecDelete({
        id,
      });
      if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
        enqueueSnackbar("Impossibile eliminare!", {
          variant: "error",
        });
      } else {
        enqueueSnackbar("Ore commessa eliminate!", {
          variant: "success",
        });
      }

      setIndex((index) => index + 1);
    }
  };

  const fetchScheduleTask = useScheduleTaskService();

  const onScheduleTask = async (id: string) => {
    const isConfirmed = await confirmDialog({
      title: "Ore commessa",
      message: "Vuoi confermare l'esecuzione ed inviarla ad HG?",
    });

    if (isConfirmed) {
      const { status } = await fetchScheduleTask({
        id,
      });
      if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
        enqueueSnackbar("Impossibile processare!", {
          variant: "error",
        });
      } else {
        enqueueSnackbar("Esecuzione processata!", {
          variant: "success",
        });
      }

      setIndex((index) => index + 1);
    }
  };

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

  const { enqueueSnackbar } = useSnackbar();

  const [userSelected, setUserSelected] = useState<User | null>();
  const fetchGetMe = useGetMeQuery();

  useEffect(() => {
    const fetchUser = async (
      filter: Array<FilterItem<EpsNestjsOrpEffCicliEsec>>
    ) => {
      const codOpValue = filter?.find(
        (it) => it.columnName === "COD_OP"
      )?.value;

      if (codOpValue) {
        try {
          const { data, status } = await fetchGetMe({
            COD_OP: String(codOpValue),
          });
          if (status === HTTP_CODES_ENUM.OK) {
            setUserSelected(data as User);
          }
        } catch (error) {
          console.log(error);
          setUserSelected(null);
        }
      } else {
        setUserSelected(null);
      }
    };
    fetchUser(filter);
  }, [filter]);

  const [operatori] = useState();

  const validationSchema: yup.ObjectSchema<EditOperatoreFormData> = yup
    .object()
    .shape({
      operatori: yup.object().shape({
        COD_OP: yup.string().required("COD_OP è obbligatorio"),
        NOME_OP: yup.string().required("NOME_OP è obbligatorio"),
      }),
    });

  const methods = useForm<EditOperatoreFormData>({
    resolver: yupResolver(validationSchema), // yupResolver(validationSchema),
    defaultValues: {
      operatori: operatori,
    },
  });

  // Keyboard listener for COD_OP input (max 8 chars)

  useEffect(() => {
    let buffer = "";
    let timeoutId: NodeJS.Timeout | null = null;

    const resetBuffer = () => {
      buffer = "";
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      console.info("Baffer reset");
    };

    const handleKeyDown = async (e: KeyboardEvent) => {
      // Ignore if focus is on an input, textarea or contenteditable
      const active = document.activeElement;
      if (
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          (active as HTMLElement).isContentEditable)
      ) {
        return;
      }

      // Only allow alphanumeric chars (adjust if COD_OP allows other chars)
      if (/^[0-9]$/.test(e.key)) {
        buffer += e.key;
        if (buffer.length > 10) {
          resetBuffer();
          buffer += e.key; // start new buffer with current key
        }
        // Reset buffer if no key pressed for 1.5s
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(resetBuffer, 1000);

        if (buffer.length === 10) {
          console.log("COD_OP -> ", buffer);
          // Update filter and route
          const filter: Array<FilterItem<EpsNestjsOrpEffCicliEsec>> = [
            {
              columnName: "COD_OP",
              value: buffer,
            },
            {
              columnName: "DATA_INIZIO",
              value: dateSelected.format("YYYY-MM-DD"),
            },
          ];
          setFilter(filter);
          playConfirmationBeep();
          resetBuffer();
        }
      } else {
        resetBuffer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      resetBuffer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function playConfirmationBeep() {
    const AudioCtx = window.AudioContext || window.AudioContext;
    const ctx = new AudioCtx();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 880; // Hz, a pleasant beep
    gain.gain.value = 1.0; // volume

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.15); // 150ms beep

    oscillator.onended = () => ctx.close();
  }

  const handleRequestFilter = (value: Dayjs | null) => {
    if (value !== null) {
      setDateSelected(value);
      setFilter([
        {
          columnName: "DATA_INIZIO",
          value: value.format("YYYY-MM-DD"),
        },
        {
          columnName: "COD_OP",
          value: userSelected?.COD_OP || "",
        },
      ]);
    }
  };

  const DATA_INIZIO_FORMATTED = data?.dateInizio
    ? dayjs(data?.dateInizio).format("ddd DD MMM YY")
    : "";

  return (
    <Container
      maxWidth="xl"
      sx={{
        p: 0,
        m: 0,
      }}
    >
      {[RoleEnum.ADMIN].includes(user?.role?.id as RoleEnum) && (
        <FormProvider {...methods}>
          <EditOperatori
            join={true}
            onSubmit={function (operatori: Operatori | null): void {
              if (operatori?.user) {
                //setOperatoreSelected(operatori);
                const filter: Array<FilterItem<EpsNestjsOrpEffCicliEsec>> = [
                  {
                    columnName: "COD_OP",
                    value: operatori.COD_OP,
                  },
                  {
                    columnName: "DATA_INIZIO",
                    value: dateSelected.format("YYYY-MM-DD"),
                  },
                ];
                setFilter(filter);
              } else {
                setFilter([]);
                setUserSelected(null);
              }
            }}
          />
        </FormProvider>
      )}
      {userSelected === null && (
        <Typography textAlign="center" mt={5} variant="h5">
          Nessun operatore selezionato
        </Typography>
      )}
      {userSelected !== null && (
        <>
          <Grid container spacing={1} justifyContent="center">
            <Grid size={{ xs: 12 }} mt={1}>
              <Typography
                textAlign="right"
                variant="subtitle2"
              >{`${userSelected?.lastName} ${userSelected?.firstName}`}</Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Stack
                textAlign="right"
                direction="column"
                alignItems={"flex-end"}
              >
                {[RoleEnum.ADMIN].includes(user?.role?.id as RoleEnum) ? (
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale={language}
                  >
                    <DatePicker
                      label={t("hours-history:formInputs.dateFilter.label")}
                      format="ddd DD MMM YYYY"
                      value={dateSelected}
                      onChange={(newValue) => {
                        handleRequestFilter(newValue);
                      }}
                      maxDate={dayjs()}
                    />
                  </LocalizationProvider>
                ) : (
                  <Fragment>
                    <Typography variant="h6">
                      {DATA_INIZIO_FORMATTED}
                    </Typography>
                  </Fragment>
                )}

                <Typography variant="subtitle2">
                  ore totali della giornata
                </Typography>
                <Typography variant="h2">{data?.totale}</Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12 }} textAlign="right">
              <Button
                variant="contained"
                onClick={() => {
                  setFilter([]);
                  setUserSelected(null);
                }}
                size="large"
              >
                ESCI
              </Button>
            </Grid>
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="unset"
            >
              {result.map((epsNestjsOrpEffCicliEsec) => (
                <ChildEpsNestjsOrpEffCicliEsecCard
                  key={epsNestjsOrpEffCicliEsec.id}
                  epsNestjsOrpEffCicliEsec={epsNestjsOrpEffCicliEsec}
                  onDelete={onDelete}
                  onSendHG={onScheduleTask}
                  renderOrdCliTrasDialog={renderOrdCliTrasDialog}
                />
              ))}
            </Grid>
            {result.length === 0 && (
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
          <Grid
            container
            justifyContent="center"
            spacing={2}
            mt={2}
            sx={(theme) => ({
              position: "fixed",
              bottom: 0, // Add some space from the bottom edge
              left: 0,
              width: "100%", // Adjust width to content
              // Apply card-like styling with backdrop effect
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(40, 40, 40, 0.25)" // Semi-transparent dark background
                  : "rgba(255, 255, 255, 0.25)", // Semi-transparent light background
              backdropFilter: "blur(3px)", // Backdrop blur effect
              borderRadius: (theme) => theme.shape.borderRadius, // Rounded corners like a Card
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              boxShadow: (theme) => theme.shadows[10], // Elevation effect

              padding: theme.spacing(1),
            })}
          >
            {[RoleEnum.AUTISTA, RoleEnum.ADMIN].includes(
              userSelected?.role?.id as RoleEnum
            ) && (
              <Grid>
                <ButtonTipoTrasferta
                  tipoTrasfertaButton="km_autista_button"
                  label="Km Autista"
                  onClickAction={() =>
                    router.push(
                      `${window.location.pathname}/step1_km_autista?COD_OP=${userSelected?.COD_OP}&DATA_INIZIO=${dateSelected?.toISOString() || ""}`
                    )
                  }
                  endIcon={<AirportShuttleTwoToneIcon />}
                />
              </Grid>
            )}
            <Grid>
              <ButtonTipoTrasferta
                tipoTrasfertaButton="fuori_sede_button"
                onClickAction={() =>
                  router.push(
                    `${window.location.pathname}/step1_FuoriSede?COD_OP=${userSelected?.COD_OP}&DATA_INIZIO=${dateSelected?.toISOString() || ""}`
                  )
                }
                endIcon={<FlightTakeoffTwoToneIcon />}
                label="Trasferta"
              />
            </Grid>
            <Grid>
              <ButtonTipoTrasferta
                tipoTrasfertaButton="in_sede_button"
                label="In Sede"
                onClickAction={() => {
                  router.push(
                    `${window.location.pathname}/create/in_sede?COD_OP=${userSelected?.COD_OP}&DATA_INIZIO=${dateSelected?.toISOString() || ""}`,
                    {
                      scroll: true,
                    }
                  );
                }}
                endIcon={<FactoryTwoToneIcon />}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
}

export default withPageRequiredAuth(UserHours, {
  roles: [RoleEnum.BADGE, RoleEnum.ADMIN],
});
