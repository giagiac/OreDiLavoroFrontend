"use client";

import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import TipoTrasfertaComponent from "@/components/tipo-trasferta";
import { useSnackbar } from "@/hooks/use-snackbar";
import { useScheduleTaskService } from "@/services/api/services/schedule-task";
import { EpsNestjsOrpEffCicliEsec } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { Operatori } from "@/services/api/types/operatori";
import { SortEnum } from "@/services/api/types/sort-type";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import DoubleArrowTwoToneIcon from "@mui/icons-material/DoubleArrowTwoTone";
import LockTwoToneIcon from "@mui/icons-material/LockTwoTone";
import RefreshTwoToneIcon from "@mui/icons-material/RefreshTwoTone";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Icon from "@mui/material/Icon";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";
import { useGetEpsNestjsOrpEffCicliEsecQuery } from "./queries/queries-eps-nestjs-orp-eff-cicli-esec";

const TableCellLoadingContainer = styled(TableCell)(() => ({
  padding: 0,
}));

interface Props {
  operatore: Operatori;
}

export default function EpsNestjsOrpEffCicliEsecPage({ operatore }: Props) {
  const { data, isFetchingNextPage, refetch } =
    useGetEpsNestjsOrpEffCicliEsecQuery({
      sort: { order: SortEnum.ASC, orderBy: "id" },
      filters: [{ columnName: "COD_OP", value: operatore.COD_OP }],
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
  const fetchScheduleTask = useScheduleTaskService();

  const onScheduleTask = async (id: string) => {
    const isConfirmed = await confirmDialog({
      title: "Ore commessa",
      message: "Vuoi confermare l'esecuzione?",
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

  return (
    <>
      <Grid
        container
        size="auto"
        wrap="nowrap"
        justifyContent="flex-end"
        mb={1}
      >
        <Grid>
          <Button
            variant="contained"
            onClick={() => {
              //invalidate query
              refetch();
            }}
          >
            <RefreshTwoToneIcon />
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} elevation={5}>
        <Table size="small">
          {isFetchingNextPage && (
            <TableHead>
              <TableRow>
                <TableCellLoadingContainer colSpan={4}>
                  <LinearProgress />
                </TableCellLoadingContainer>
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} align="right">
                <Stack textAlign="right" direction="column">
                  <Typography variant="h6">{data?.targetDateInizio}</Typography>
                  <Typography variant="subtitle2">
                    ore totali della giornata
                  </Typography>
                  <Typography variant="h2">{data?.totale}</Typography>
                </Stack>
              </TableCell>
            </TableRow>
            {result.map((epsNestjsOrpEffCicliEsec) => {
              return (
                <TableRow key={epsNestjsOrpEffCicliEsec.id}>
                  <TableCell colSpan={4}>
                    <Table
                      sx={(theme) => ({
                        borderCollapse: "separate",
                        borderBottom: theme.spacing(0),
                        padding: theme.spacing(0),
                      })}
                    >
                      <TableBody>
                        <TableRow sx={{ "& > *": { borderBottom: "none" } }}>
                          <TableCell
                            style={{ width: "45%", textAlign: "left" }}
                          >
                            {epsNestjsOrpEffCicliEsec?.DOC_RIGA_ID}
                          </TableCell>
                          <TableCell
                            style={{ width: "10%", textAlign: "left" }}
                          >
                            {
                              epsNestjsOrpEffCicliEsec?.TEMPO_OPERATORE_SESSANTESIMI
                            }
                          </TableCell>
                          {epsNestjsOrpEffCicliEsec?.COD_ART !== null && (
                            <TableCell
                              style={{ width: "10%", textAlign: "left" }}
                            >
                              {`${epsNestjsOrpEffCicliEsec?.COD_ART} · ${epsNestjsOrpEffCicliEsec?.KM} Km`}
                            </TableCell>
                          )}
                          <TableCell
                            style={{ width: "20%", textAlign: "left" }}
                          >
                            <TipoTrasfertaComponent
                              tipotrasferta={
                                epsNestjsOrpEffCicliEsec.TIPO_TRASFERTA
                              }
                            >
                              {epsNestjsOrpEffCicliEsec?.HYPSERV_REQ2_COD_CHIAVE !==
                                null ||
                              epsNestjsOrpEffCicliEsec?.APP_REQ3_HYPSERV_COD_CHIAVE !==
                                null ? (
                                <Icon>
                                  <LockTwoToneIcon />
                                </Icon>
                              ) : (
                                <Button
                                  disabled={true}
                                  onClick={() => {
                                    onScheduleTask(epsNestjsOrpEffCicliEsec.id);
                                  }}
                                  variant="contained"
                                  endIcon={<DoubleArrowTwoToneIcon />}
                                >
                                  {epsNestjsOrpEffCicliEsec?.id}
                                </Button>
                              )}
                            </TipoTrasfertaComponent>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            padding="none"
                            style={{ borderBottom: "none" }}
                          >
                            {/* <FormCreateEdit cfComm={epsNestjsOrpEffCicliEsec} /> */}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
