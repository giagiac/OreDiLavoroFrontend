"use client";

import { ButtonTipoTrasferta } from "@/components/button-tipo-trasferta";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import { useSnackbar } from "@/hooks/use-snackbar";
import {
  EpsNestjsOrpEffCicliEsecPatchRequest,
  useDeleteEpsNestjsOrpEffCicliEsecService,
  usePatchEpsNestjsOrpEffCicliEsecService,
} from "@/services/api/services/eps-nestjs-orp-eff-cicli-esec";
import { useScheduleTaskService } from "@/services/api/services/schedule-task";
import { EpsNestjsOrpEffCicliEsec } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec";
import { FilterItem } from "@/services/api/types/filter";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { RoleEnum } from "@/services/api/types/role";
import { SortEnum } from "@/services/api/types/sort-type";
import { User } from "@/services/api/types/user";
import useAuth from "@/services/auth/use-auth";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import AirportShuttleTwoToneIcon from "@mui/icons-material/AirportShuttleTwoTone";
import FactoryTwoToneIcon from "@mui/icons-material/FactoryTwoTone";
import FlightTakeoffTwoToneIcon from "@mui/icons-material/FlightTakeoffTwoTone";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import "dayjs/locale/it";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import imageLogo from "../../../../../public/emotions.png";
import CardAttenzione from "./card-attenzione";
import { ChildEpsNestjsOrpEffCicliEsecCard } from "./child-eps-nestjs-orp-eff-cicli-esec-card";
import {
  useGetEpsNestjsOrpEffCicliEsecQuery,
  useGetMeQuery,
} from "./queries/queries";
dayjs.locale("it");

type EpsNestjsOrpEffCicliEsecKeys = keyof EpsNestjsOrpEffCicliEsec;

function UserHours() {
  const searchParams = useSearchParams();

  const { user } = useAuth();

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

  const filter = useMemo(() => {
    const searchParamsFilter = searchParams.get("filter");
    if (searchParamsFilter) {
      return JSON.parse(searchParamsFilter) as Array<
        FilterItem<EpsNestjsOrpEffCicliEsec>
      >;
    }

    return [{ columnName: "COD_OP", value: user?.COD_OP }] as Array<
      FilterItem<EpsNestjsOrpEffCicliEsec>
    >;
  }, [searchParams]);

  const [userSelected, setUserSelected] = useState<User | null>();
  const fetchGetMe = useGetMeQuery();
  useEffect(() => {
    const fetchUser = async () => {
      const { data, status } = await fetchGetMe({
        COD_OP: user?.COD_OP ?? undefined,
      });
      if (status === HTTP_CODES_ENUM.OK) {
        setUserSelected(data as User);
      }
    };
    fetchUser();
  }, []);

  const { data, isFetchingNextPage, isLoading, refetch } =
    useGetEpsNestjsOrpEffCicliEsecQuery({
      filters: filter,
      sort: { order, orderBy },
    });

  const result = useMemo(() => {
    const result =
      (data?.pages.flatMap(
        (page) => page?.data
      ) as EpsNestjsOrpEffCicliEsec[]) ?? ([] as EpsNestjsOrpEffCicliEsec[]);

    return removeDuplicatesFromArrayObjects(result, "id");
  }, [data]);

  const { enqueueSnackbar } = useSnackbar();
  const { confirmDialog } = useConfirmDialog();

  const fetchPatchEpsNestjsOrpEffCicliEsec =
    usePatchEpsNestjsOrpEffCicliEsecService();

  const onUpdate = async (
    id: string,
    tempoOreOperatore: string | null,
    idfk?: string
  ): Promise<boolean> => {
    if (tempoOreOperatore === null) {
      enqueueSnackbar(`Non hai impostato il tempo operatore`, {
        variant: "error",
      });
      return Promise.resolve(false);
    }

    const DATA_INIZIO = data?.dateInizio.toString() || "";
    const DATA_FINE = data?.dateInizio.toString() || "";

    const formData: EpsNestjsOrpEffCicliEsecPatchRequest = {
      id,
      idfk,
      COD_OP: userSelected?.COD_OP || "",
      TEMPO_OPERATORE: tempoOreOperatore,
      DATA_INIZIO: new Date(DATA_INIZIO),
      DATA_FINE: new Date(DATA_FINE),
    };

    const { status } = await fetchPatchEpsNestjsOrpEffCicliEsec(formData);

    refetch();

    if (status === HTTP_CODES_ENUM.OK) {
      enqueueSnackbar("Tempo operatore aggiornato correttamente", {
        variant: "success",
      });
      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  };

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
      if (status === HTTP_CODES_ENUM.OK) {
        enqueueSnackbar("Ore commessa eliminate!", {
          variant: "success",
        });
      }

      refetch();
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

      refetch();
    }
  };

  if (user?.COD_OP === null) {
    return (
      <Typography color="warning">
        Att.ne nessun Operatore definito per questo utente!
      </Typography>
    );
  }

  const DATA_INIZIO_FORMATTED = data?.dateInizio
    ? dayjs(data?.dateInizio).format("ddd DD MMM YY")
    : "";

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
          <Stack textAlign="right" direction="column">
            <Typography variant="subtitle2">{`${userSelected?.lastName} ${userSelected?.firstName}`}</Typography>
            <Typography variant="h6">{DATA_INIZIO_FORMATTED}</Typography>
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
              onUpdate={onUpdate}
              onDisable={undefined}
              onDelete={onDelete}
              onSendHG={onScheduleTask}
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
            <CardAttenzione
              onInSedeClick={() =>
                router.push(
                  `${window.location.pathname}/create/in_sede?COD_OP=${userSelected?.COD_OP}&DATA_INIZIO=${data?.dateInizio}`
                )
              }
              onFuoriSedeClick={() =>
                router.push(
                  `${window.location.pathname}/step1_FuoriSede?COD_OP=${userSelected?.COD_OP}&DATA_INIZIO=${data?.dateInizio}`
                )
              }
            />
            <Box
              m={2}
              display="flex-column"
              justifyContent="center"
              alignItems="center"
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
        {[RoleEnum.AUTISTA, RoleEnum.ADMIN, RoleEnum.BADGE].includes(
          user?.role?.id as RoleEnum
        ) && (
          <Grid>
            <ButtonTipoTrasferta
              tipoTrasfertaButton="km_autista_button"
              label="Km Autista"
              onClickAction={() =>
                router.push(
                  `${window.location.pathname}/step1_km_autista?COD_OP=${userSelected?.COD_OP}&DATA_INIZIO=${data?.dateInizio}`
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
                `${window.location.pathname}/step1_FuoriSede?COD_OP=${userSelected?.COD_OP}&DATA_INIZIO=${data?.dateInizio}`
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
            onClickAction={() =>
              router.push(
                `${window.location.pathname}/create/in_sede?COD_OP=${userSelected?.COD_OP}&DATA_INIZIO=${data?.dateInizio}`
              )
            }
            endIcon={<FactoryTwoToneIcon />}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default withPageRequiredAuth(UserHours, {
  roles: [RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.AUTISTA, RoleEnum.BADGE],
});
