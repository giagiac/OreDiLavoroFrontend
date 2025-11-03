"use client";

import { ButtonTipoTrasferta } from "@/components/button-tipo-trasferta";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import { useSnackbar } from "@/hooks/use-snackbar";
import {
  EpsNestjsOrpEffCicliEsecPatchRequest,
  EpsNestjsOrpEffCicliEsecsResponse,
  useDeleteEpsNestjsOrpEffCicliEsecService,
  useGetEpsNestjsOrpEffCicliEsecService,
  usePatchEpsNestjsOrpEffCicliEsecChildService,
  usePatchEpsNestjsOrpEffCicliEsecService,
} from "@/services/api/services/eps-nestjs-orp-eff-cicli-esec";
import { useScheduleTaskService } from "@/services/api/services/schedule-task";
import { EpsNestjsOrpEffCicliEsec } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec";
import { FilterItem } from "@/services/api/types/filter";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { Operatori } from "@/services/api/types/operatori";
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
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/it";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import imageLogo from "../../../../../public/emotions.png";
import { EditOperatoreFormData } from "../../admin-panel/operatori/create-operatori/page-content";
import EditOperatori from "../../admin-panel/operatori/edit-operatori";
import { ChildEpsNestjsOrpEffCicliEsecCard } from "./child-eps-nestjs-orp-eff-cicli-esec-card";
import { useGetMeQuery } from "./queries/queries";

function UserHours() {
  const searchParams = useSearchParams();

  const { user } = useAuth();

  const router = useRouter();

  const { t } = useTranslation("hours-history");

  const language = useLanguage();

  const [dateSelected, setDateSelected] = useState<Dayjs>(dayjs());

  const fetchGetMe = useGetMeQuery();

  const fetchData = useGetEpsNestjsOrpEffCicliEsecService();

  const [data, setData] = useState<EpsNestjsOrpEffCicliEsecsResponse | null>(
    null
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const COD_OP = searchParams.get("COD_OP");
    const DATA_INIZIO = searchParams.get("DATA_INIZIO");

    // Initialize dateSelected from the DATA_INIZIO search param (ISO string like 2025-10-03T22:00:00.000Z)
    // If DATA_INIZIO is not provided or invalid, default to today
    const dateSelected =
      DATA_INIZIO && dayjs(DATA_INIZIO).isValid()
        ? dayjs(DATA_INIZIO)
        : dayjs();
    setDateSelected(dateSelected);

    // Initialize filter from search params (if provided) so the page loads already filtered
    // const initialFilter: Array<FilterItem<EpsNestjsOrpEffCicliEsec>> = [];

    const funFetchUser = async (onUserFetched: (user: User) => void) => {
      if (COD_OP !== null) {
        try {
          const { data, status } = await fetchGetMe({
            COD_OP: String(COD_OP),
          });
          if (status === HTTP_CODES_ENUM.OK) {
            onUserFetched(data as User);
          } else {
            enqueueSnackbar(
              "Errore nel recupero dei dati su codice operatore!",
              {
                variant: "error",
              }
            );
            setUserSelected(null);
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            enqueueSnackbar(error.message, {
              variant: "error",
            });
          }
          setUserSelected(null);
        }
      } else {
        setUserSelected(null);
      }
    };
    const funFetchData = async (user: User) => {
      if (dateSelected !== null) {
        try {
          const filters: FilterItem<EpsNestjsOrpEffCicliEsec>[] = [
            {
              columnName: "DATA_INIZIO",
              value: dateSelected.toISOString(),
            },
            {
              columnName: "COD_OP",
              value: user?.COD_OP || "",
            },
          ];

          const { status, data } = await fetchData({
            page: 0,
            limit: 10,
            filters,
            sort: [{ order: SortEnum.DESC, orderBy: "id" }],
            othersFilters: [],
          });

          if (status === HTTP_CODES_ENUM.OK) {
            setData(data);
            setUserSelected(user);
            methods.setValue("operatori", {
              ...user.operatori,
            } as Operatori);
          } else {
            enqueueSnackbar("Errore nel recupero dei dati inseriti!", {
              variant: "error",
            });
            setData(null);
          }
        } catch (error) {
          if (error instanceof Error) {
            enqueueSnackbar(error.message, {
              variant: "error",
            });
          }
          setData(null);
        }
      } else {
        setData(null);
      }
    };
    funFetchUser((user) => {
      funFetchData(user);
    });
  }, [searchParams, index]);

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

  const { enqueueSnackbar } = useSnackbar();

  const [userSelected, setUserSelected] = useState<User | null>();

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
      operatori: null,
    },
  });

  const handleDateChange = (value: Dayjs | null) => {
    if (value !== null) {
      const COD_OP = searchParams.get("COD_OP");
      router?.push(
        `${window.location.pathname}?COD_OP=${COD_OP}&DATA_INIZIO=${value.toISOString() || ""}`
      );
    }
  };

  const handleOperatoreChange = (operatore: Operatori | null) => {
    const DATA_INIZIO = searchParams.get("DATA_INIZIO");
    if (operatore) {
      router?.push(
        `${window.location.pathname}?COD_OP=${operatore?.COD_OP}&DATA_INIZIO=${DATA_INIZIO}`
      );
    } else {
      router?.push(`${window.location.pathname}?DATA_INIZIO=${DATA_INIZIO}`);
    }
  };

  const fetchPatchEpsNestjsOrpEffCicliEsec =
    usePatchEpsNestjsOrpEffCicliEsecService();

  const onUpdate = async (
    id: string,
    tempoOreOperatore: string | null,
    idfk?: string,
  ): Promise<boolean> => {
    if (tempoOreOperatore === null) {
      enqueueSnackbar(`Non hai impostato il tempo operatore`, {
        variant: "error",
      });
      return Promise.resolve(false);
    }

    const formData: EpsNestjsOrpEffCicliEsecPatchRequest = {
      id,
      idfk,
      COD_OP: data?.data[0].COD_OP || "",
      DATA_INIZIO: dateSelected?.format("YYYY-MM-DD") || "",
      DATA_FINE: dateSelected?.format("YYYY-MM-DD") || "",
      TEMPO_OPERATORE: tempoOreOperatore,
    };

    const { status } = await fetchPatchEpsNestjsOrpEffCicliEsec(formData);

    setIndex((index) => index + 1);

    if (status === HTTP_CODES_ENUM.OK) {
      enqueueSnackbar("Ore aggiornate correttamente", {
        variant: "success",
      });
      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  };

  const onDisable = async (
    id: string,
    prev: number | null | undefined,
    idfk?: string,
  ): Promise<boolean> => {
    const formData: EpsNestjsOrpEffCicliEsecPatchRequest = {
      id,
      idfk,
      COD_OP: data?.data[0].COD_OP || "",
      DATA_INIZIO: dateSelected?.format("YYYY-MM-DD") || "",
      DATA_FINE: dateSelected?.format("YYYY-MM-DD") || "",
      HYPSERV_REQ2_COD_CHIAVE_DELETED: prev != 1 ? 1 : null,
    };

    const { status } = await fetchPatchEpsNestjsOrpEffCicliEsec(formData);

    setIndex((index) => index + 1);

    if (status === HTTP_CODES_ENUM.OK) {
      enqueueSnackbar("Ore aggiornate correttamente", {
        variant: "success",
      });
      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  };

  const DATA_INIZIO_FORMATTED = data?.dateInizio
    ? dayjs(data?.dateInizio).format("ddd DD MMM YY")
    : "";

  return (
    <Container maxWidth="xl">
      {[RoleEnum.ADMIN].includes(user?.role?.id as RoleEnum) && (
        <FormProvider {...methods}>
          <EditOperatori
            join={true}
            onSubmit={function (operatori: Operatori | null): void {
              handleOperatoreChange(operatori);
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
            <Grid size={{ xs: 12 }} mb={1}>
              <Typography
                textAlign="right"
                variant="subtitle2"
              >{`${userSelected?.email}`}</Typography>
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
                        handleDateChange(newValue);
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
                  // setFilter([]);
                  // setUserSelected(null);
                  router?.replace(window.location.pathname);
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
                  onUpdate={onUpdate}
                  onDisable={onDisable}
                  onDelete={onDelete}
                  onSendHG={onScheduleTask}
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
                    router?.push(
                      `${window.location.pathname}/step1_km_autista?COD_OP=${userSelected?.COD_OP}&DATA_INIZIO=${dateSelected?.toISOString() || ""}`,
                      { scroll: true }
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
                  router?.push(
                    `${window.location.pathname}/step1_FuoriSede?COD_OP=${userSelected?.COD_OP}&DATA_INIZIO=${dateSelected?.toISOString() || ""}`,
                    { scroll: true }
                  )
                }
                endIcon={<FlightTakeoffTwoToneIcon />}
                label="Fuori sede"
              />
            </Grid>
            <Grid>
              <ButtonTipoTrasferta
                tipoTrasfertaButton="in_sede_button"
                label="In Sede"
                onClickAction={() => {
                  router?.push(
                    `${window.location.pathname}/create/in_sede?COD_OP=${userSelected?.COD_OP}&DATA_INIZIO=${dateSelected?.toISOString() || ""}`,
                    { scroll: true }
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
  roles: [RoleEnum.ADMIN],
});
