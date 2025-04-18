"use client";

import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import { useSnackbar } from "@/hooks/use-snackbar";
import { useDeleteEpsNestjsOrpEffCicliEsecService } from "@/services/api/services/eps-nestjs-orp-eff-cicli-esec";
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
import { DeleteForeverTwoTone } from "@mui/icons-material";
import AirportShuttleTwoToneIcon from "@mui/icons-material/AirportShuttleTwoTone";
import FactoryTwoToneIcon from "@mui/icons-material/FactoryTwoTone";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FlightTakeoffTwoToneIcon from "@mui/icons-material/FlightTakeoffTwoTone";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Icon,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Fragment,
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useGetEpsNestjsOrpEffCicliEsecQuery } from "./queries/queries";
import imageLogo from "../../../../../public/emotions.png";
import TipoTrasfertaComponent, {
  backgroundColorsDark,
  backgroundColorsLight,
} from "@/components/tipo-trasferta";
import Grid from "@mui/material/Grid2";
import LockTwoToneIcon from "@mui/icons-material/LockTwoTone";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";

type EpsNestjsOrpEffCicliEsecKeys = keyof EpsNestjsOrpEffCicliEsec;

const TableCellLoadingContainer = styled(TableCell)(() => ({
  padding: 0,
}));

function TableSortCellWrapper(
  props: PropsWithChildren<{
    width?: number;
    orderBy: EpsNestjsOrpEffCicliEsecKeys;
    order: SortEnum;
    column: EpsNestjsOrpEffCicliEsecKeys;
    handleRequestSort: (
      event: React.MouseEvent<unknown>,
      property: EpsNestjsOrpEffCicliEsecKeys
    ) => void;
  }>
) {
  return (
    <TableCell
      style={{ width: props.width }}
      sortDirection={props.orderBy === props.column ? props.order : false}
    >
      <TableSortLabel
        active={props.orderBy === props.column}
        direction={props.orderBy === props.column ? props.order : SortEnum.ASC}
        onClick={(event) => props.handleRequestSort(event, props.column)}
      >
        {props.children}
      </TableSortLabel>
    </TableCell>
  );
}

function UserHours() {
  const { t: tEpsNestjsOrpEffCicliEsec } = useTranslation(
    "admin-panel-epsNestjsOrpEffCicliEsec"
  );
  const { t: tRoles } = useTranslation("admin-panel-roles");
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

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: EpsNestjsOrpEffCicliEsecKeys
  ) => {
    const isAsc = orderBy === property && order === SortEnum.ASC;
    const searchParams = new URLSearchParams(window.location.search);
    const newOrder = isAsc ? SortEnum.DESC : SortEnum.ASC;
    const newOrderBy = property;
    searchParams.set(
      "sort",
      JSON.stringify({ order: newOrder, orderBy: newOrderBy })
    );
    setSort({
      order: newOrder,
      orderBy: newOrderBy,
    });
    router.push(window.location.pathname + "?" + searchParams.toString());
  };

  const filter = useMemo(() => {
    const searchParamsFilter = searchParams.get("filter");
    if (searchParamsFilter) {
      return JSON.parse(searchParamsFilter) as Array<
        FilterItem<EpsNestjsOrpEffCicliEsec>
      >;
    }

    return undefined;
  }, [searchParams]);

  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
    refetch,
  } = useGetEpsNestjsOrpEffCicliEsecQuery({
    filters: filter,
    sort: { order, orderBy },
  });

  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const result = useMemo(() => {
    const result =
      (data?.pages.flatMap(
        (page) => page?.data
      ) as EpsNestjsOrpEffCicliEsec[]) ?? ([] as EpsNestjsOrpEffCicliEsec[]);

    return removeDuplicatesFromArrayObjects(result, "id");
  }, [data]);

  const { user } = useAuth();

  const theme = useTheme();

  const { enqueueSnackbar } = useSnackbar();
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
      debugger
      if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
        enqueueSnackbar("Impossibile eliminare!", {
          variant: "error",
        });
      } else {
        enqueueSnackbar("Ore commessa eliminate!", {
          variant: "success",
        });
      }

      refetch();
    }
  };

  const [open, setOpen] = useState(false);
  const [selectedOrdCliTras, setSelectedOrdCliTras] =
    useState<OrdCliTras | null>(null);

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
          <Stack textAlign="right" direction="column">
            <Typography variant="h6">{data?.targetDateInizio}</Typography>
            <Typography variant="subtitle2">
              ore totali della giornata
            </Typography>
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
                minWidth: "100%",
                padding: 16,
                borderRadius: 8,
                border: `1px solid ${
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
                >
                  {epsNestjsOrpEffCicliEsec.HYPSERV_REQ2_COD_CHIAVE != null ||
                  epsNestjsOrpEffCicliEsec.APP_REQ3_HYPSERV_COD_CHIAVE !=
                    null ? (
                    <Icon>
                      <LockTwoToneIcon />
                    </Icon>
                  ) : (
                    <Button
                      onClick={() => {
                        onDelete(epsNestjsOrpEffCicliEsec?.id);
                      }}
                      variant="contained"
                      endIcon={<DeleteForeverTwoTone />}
                    >
                      {epsNestjsOrpEffCicliEsec?.id}
                    </Button>
                  )}
                </TipoTrasfertaComponent>
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
              height="40vh"
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
      <Grid
        container
        justifyContent="center"
        spacing={2}
        mt={2}
        sx={{
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
          zIndex: 1000,
          padding: 2,
        }}
      >
        {[RoleEnum.AUTISTA, RoleEnum.ADMIN].includes(
          user?.role?.id as RoleEnum
        ) && (
          <Grid>
            <Button
              size="large"
              variant="contained"
              color="info"
              onClick={() => router.push("/hours/manage/step1_KmAutista")}
              startIcon={<AirportShuttleTwoToneIcon />}
            >
              Km Autista
            </Button>
          </Grid>
        )}
        <Grid>
          <Button
            size="large"
            variant="contained"
            color="primary"
            onClick={() => router.push("/hours/manage/step1_FuoriSede")}
            startIcon={<FlightTakeoffTwoToneIcon />}
          >
            Fuori Sede
          </Button>
        </Grid>
        <Grid>
          <Button
            size="large"
            variant="contained"
            color="secondary"
            onClick={() => router.push("/hours/manage/create/in_sede")}
            startIcon={<FactoryTwoToneIcon />}
          >
            In Sede
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default withPageRequiredAuth(UserHours, {
  roles: [RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.AUTISTA],
});
