"use client";

import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import TipoTrasfertaComponent, {
  backgroundColorsDark,
  backgroundColorsLight,
} from "@/components/tipo-trasferta";
import { useSnackbar } from "@/hooks/use-snackbar";
import { useDeleteEpsNestjsOrpEffCicliEsecService } from "@/services/api/services/eps-nestjs-orp-eff-cicli-esec";
import { EpsNestjsOrpEffCicliEsec } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec";
import { FilterItem } from "@/services/api/types/filter";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { LinkOrpOrd } from "@/services/api/types/link-orp-ord";
import { OrdCliTras } from "@/services/api/types/ord-cli-tras";
import { RoleEnum } from "@/services/api/types/role";
import { SortEnum } from "@/services/api/types/sort-type";
import useAuth from "@/services/auth/use-auth";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import AirportShuttleTwoToneIcon from "@mui/icons-material/AirportShuttleTwoTone";
import DeleteForeverTwoTone from "@mui/icons-material/DeleteForeverTwoTone";
import FactoryTwoToneIcon from "@mui/icons-material/FactoryTwoTone";
import FlightTakeoffTwoToneIcon from "@mui/icons-material/FlightTakeoffTwoTone";
import LockTwoToneIcon from "@mui/icons-material/LockTwoTone";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid2";
import Icon from "@mui/material/Icon";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useMemo, useState } from "react";
import imageLogo from "../../../../../public/emotions.png";
import { useGetEpsNestjsOrpEffCicliEsecQuery } from "./queries/queries";
import { link } from "fs";
import { Cf } from "@/services/api/types/cf";

type EpsNestjsOrpEffCicliEsecKeys = keyof EpsNestjsOrpEffCicliEsec;

// const TableCellLoadingContainer = styled(TableCell)(() => ({
//   padding: 0,
// }));

// function TableSortCellWrapper(
//   props: PropsWithChildren<{
//     width?: number;
//     orderBy: EpsNestjsOrpEffCicliEsecKeys;
//     order: SortEnum;
//     column: EpsNestjsOrpEffCicliEsecKeys;
//     handleRequestSort: (
//       event: React.MouseEvent<unknown>,
//       property: EpsNestjsOrpEffCicliEsecKeys
//     ) => void;
//   }>
// ) {
//   return (
//     <TableCell
//       style={{ width: props.width }}
//       sortDirection={props.orderBy === props.column ? props.order : false}
//     >
//       <TableSortLabel
//         active={props.orderBy === props.column}
//         direction={props.orderBy === props.column ? props.order : SortEnum.ASC}
//         onClick={(event) => props.handleRequestSort(event, props.column)}
//       >
//         {props.children}
//       </TableSortLabel>
//     </TableCell>
//   );
// }

function UserHours() {
  // const { t: tEpsNestjsOrpEffCicliEsec } = useTranslation(
  //   "admin-panel-epsNestjsOrpEffCicliEsec"
  // );
  // const { t: tRoles } = useTranslation("admin-panel-roles");
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

  // const handleRequestSort = (
  //   event: React.MouseEvent<unknown>,
  //   property: EpsNestjsOrpEffCicliEsecKeys
  // ) => {
  //   const isAsc = orderBy === property && order === SortEnum.ASC;
  //   const searchParams = new URLSearchParams(window.location.search);
  //   const newOrder = isAsc ? SortEnum.DESC : SortEnum.ASC;
  //   const newOrderBy = property;
  //   searchParams.set(
  //     "sort",
  //     JSON.stringify({ order: newOrder, orderBy: newOrderBy })
  //   );
  //   setSort({
  //     order: newOrder,
  //     orderBy: newOrderBy,
  //   });
  //   router.push(window.location.pathname + "?" + searchParams.toString());
  // };

  const filter = useMemo(() => {
    const searchParamsFilter = searchParams.get("filter");
    if (searchParamsFilter) {
      return JSON.parse(searchParamsFilter) as Array<
        FilterItem<EpsNestjsOrpEffCicliEsec>
      >;
    }

    return undefined;
  }, [searchParams]);

  const { data, isFetchingNextPage, isLoading, refetch } =
    useGetEpsNestjsOrpEffCicliEsecQuery({
      filters: filter,
      sort: { order, orderBy },
    });

  // const handleScroll = useCallback(() => {
  //   if (!hasNextPage || isFetchingNextPage) return;
  //   fetchNextPage();
  // }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const result = useMemo(() => {
    const result =
      (data?.pages.flatMap(
        (page) => page?.data
      ) as EpsNestjsOrpEffCicliEsec[]) ?? ([] as EpsNestjsOrpEffCicliEsec[]);

    return removeDuplicatesFromArrayObjects(result, "id");
  }, [data]);

  const { user } = useAuth();

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

  const [selectedOrdCliTras, setSelectedOrdCliTras] =
    useState<OrdCliTras | null>(null);
  const handleOpen = (ordCliTras: OrdCliTras) => {
    setSelectedOrdCliTras(ordCliTras);
  };
  const handleClose = () => {
    setSelectedOrdCliTras(null);
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
        {linkOrpOrd.map((it, index) => {
          const ordCliTras = it.ordCliRighe?.ordCliTras || ({} as OrdCliTras);

          if (ordCliTras.NUM_DEST === null) {
            const cf = it.ordCliRighe?.cf;

            return (
              <Fragment key={index}>
                <Button
                  key={index}
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

          return (
            <Fragment key={index}>
              <Button
                variant="outlined"
                onClick={() => handleOpen(ordCliTras)}
                fullWidth
                disabled={!ordCliTras.NUM_DEST} // Optionally disable the button if NUM_DEST is undefined
              >
                {ordCliTras.NUM_DEST} {" · "}
                {ordCliTras.DES_DEST_MERCE || "No Title"}
              </Button>
              <Dialog
                open={selectedOrdCliTras !== null}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
              >
                <DialogTitle>
                  {`${selectedOrdCliTras?.NUM_DEST} · ${selectedOrdCliTras?.DES_DEST_MERCE || "No Title"}`}
                </DialogTitle>
                <DialogContent>
                  <Table size="small">
                    <TableBody>
                      {(
                        Object.keys(
                          selectedOrdCliTras || {}
                        ) as (keyof OrdCliTras)[]
                      ).map((key) => {
                        const value = selectedOrdCliTras?.[key];
                        if (value === null || value === undefined) return null;
                        return (
                          <TableRow key={key}>
                            <TableCell align="left">
                              <Typography variant="caption">{key}</Typography>
                            </TableCell>
                            <TableCell align="left" style={{ width: 300 }}>
                              <Typography variant="subtitle2">
                                {value}
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
              sx={(theme) => ({
                minWidth: "100%",
                padding: theme.spacing(1),
                borderRadius: 1,
                border: `1px solid ${
                  theme.palette.mode === "dark"
                    ? backgroundColorsDark[
                        epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA
                      ]
                    : backgroundColorsLight[
                        epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA
                      ]
                }`,
              })}
            >
              <Grid size={{ xs: 12 }}>
                <TipoTrasfertaComponent
                  tipotrasferta={epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA}
                >
                  {epsNestjsOrpEffCicliEsec.HYPSERV_REQ2_COD_CHIAVE !== null ||
                  epsNestjsOrpEffCicliEsec.APP_REQ3_HYPSERV_COD_CHIAVE !==
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
                <Typography variant="body2" textAlign="right">
                  {epsNestjsOrpEffCicliEsec?.COD_ART != null &&
                    `Targa mezzo : ${epsNestjsOrpEffCicliEsec?.COD_ART} · ${epsNestjsOrpEffCicliEsec?.KM} Km`}
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
          zIndex: 1000,
          padding: theme.spacing(1),
        })}
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
