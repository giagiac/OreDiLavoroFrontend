"use client";

import { GruppoDiLavoro } from "@/components/gruppo-di-lavoro";
import { LogElaborazione } from "@/components/log-elaborazione";
import TipoTrasfertaComponent from "@/components/tipo-trasferta";
import { useSnackbar } from "@/hooks/use-snackbar";
import {
  EpsNestjsOrpEffCicliEsecPatchRequest,
  usePatchEpsNestjsOrpEffCicliEsecFailedService,
} from "@/services/api/services/eps-nestjs-orp-eff-cicli-esec-failed";
import { EpsNestjsOrpEffCicliEsecFailed } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec-failed";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { RoleEnum } from "@/services/api/types/role";
import { SortEnum } from "@/services/api/types/sort-type";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import RefreshTwoToneIcon from "@mui/icons-material/RefreshTwoTone";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { formatDate } from "date-fns";
import { it } from "date-fns/locale";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useGetEpsNestjsOrpEffCicliEsecFailedQuery } from "./queries/queries-eps-nestjs-orp-eff-cicli-esec-failed";

type EpsNestjsOrpEffCicliEsecFailedKeys = keyof EpsNestjsOrpEffCicliEsecFailed;

function EpsNestjsOrpEffCicliEsecComponent() {
  // const { t: tArticoliCosti } = useTranslation("admin-panel-articoli-costi");
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log("nav changed ", window.location.search);
    if (searchParams.size === 0) {
      setOthersFilters([]);
      setFilters([]);
      setSort({ order: SortEnum.ASC, orderBy: "COD_OP" });
    }
  }, [searchParams.size]);

  const [othersFilters, setOthersFilters] = useState<Array<OthersFiltersItem>>(
    () => {
      const searchParamsOthersFilters = searchParams.get("othersFilters");
      if (searchParamsOthersFilters) {
        const of = JSON.parse(searchParamsOthersFilters);
        return of;
      }
      return [];
    }
  );

  const [{ order, orderBy }, setSort] = useState<{
    order: SortEnum;
    orderBy: EpsNestjsOrpEffCicliEsecFailedKeys;
  }>(() => {
    const searchParamsSort = searchParams.get("sort");
    if (searchParamsSort) {
      return JSON.parse(searchParamsSort);
    }
    return { order: SortEnum.ASC, orderBy: "COD_OP" };
  });

  const [filters, setFilters] = useState<
    Array<FilterItem<EpsNestjsOrpEffCicliEsecFailed>>
  >(() => {
    const searchParamsFilter = searchParams.get("filter");
    if (searchParamsFilter) {
      return JSON.parse(searchParamsFilter);
    }
    return [];
  });

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } =
    useGetEpsNestjsOrpEffCicliEsecFailedQuery({
      sort: { order, orderBy },
      filters,
      othersFilters,
    });

  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const result = useMemo(() => {
    const result =
      (data?.pages.flatMap(
        (page) => page?.data
      ) as EpsNestjsOrpEffCicliEsecFailed[]) ??
      ([] as EpsNestjsOrpEffCicliEsecFailed[]);

    return removeDuplicatesFromArrayObjects(result, "id");
  }, [data]);

  interface ItemDetail {
    [key: string]: string;
  }

  const { enqueueSnackbar } = useSnackbar();

  const fetchPatchEpsNestjsOrpEffCicliEsecFailed =
    usePatchEpsNestjsOrpEffCicliEsecFailedService();

  const onUpdateResetErrori = async (
    id: string,
    COD_OP?: string | null
  ): Promise<boolean | void> => {
    if (COD_OP) {
      const formData: EpsNestjsOrpEffCicliEsecPatchRequest = {
        id,
      };

      const { status } =
        await fetchPatchEpsNestjsOrpEffCicliEsecFailed(formData);

      refetch();

      if (status === HTTP_CODES_ENUM.OK) {
        enqueueSnackbar("Reset completato correttamente", {
          variant: "success",
        });
        return Promise.resolve(true);
      }

      return Promise.resolve(false);
    }
  };

  return (
    <Container maxWidth="xl">
      <Grid container pt={3}>
        <Grid container spacing={0} size={{ xs: 12 }}>
          <Grid size="grow">
            <Typography variant="h3">
              {"Gestione esecuzioni fallite"}
            </Typography>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Grid container size="auto" wrap="nowrap" justifyContent="flex-end">
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
        </Grid>
        <Grid size={{ xs: 12 }} mb={2}>
          <TableContainer component={Paper} elevation={3}>
            <Table size="small" sx={{ m: 0, p: 0, borderCollapse: "separate" }}>
              {/* <TableHead>
                <TableRow>
                  <TableCell style={{ width: "10%" }} />
                  <TableSortFilterCellWrapper
                    width={"20%"}
                    orderBy={orderBy}
                    order={order}
                    column="id"
                    filters={filters}
                    handleRequestSort={handleRequestSort}
                    handleRequestFilter={handleRequestFilter}
                  >
                    id
                  </TableSortFilterCellWrapper>
                  <TableSortFilterCellWrapper
                    width={"20%"}
                    orderBy={orderBy}
                    order={order}
                    column="DOC_RIGA_ID"
                    filters={filters}
                    handleRequestSort={handleRequestSort}
                    handleRequestFilter={handleRequestFilter}
                  >
                    Ordine di Produzione
                  </TableSortFilterCellWrapper>
                  <TableSortFilterCellWrapper
                    width={"20%"}
                    orderBy={orderBy}
                    order={order}
                    column="COD_OP"
                    filters={filters}
                    handleRequestSort={handleRequestSort}
                    handleRequestFilter={handleRequestFilter}
                  >
                    Codice Operatore
                  </TableSortFilterCellWrapper>
                  <TableSortFilterCellWrapper
                    width={"30%"}
                    orderBy={orderBy}
                    order={order}
                    column="id"
                    filters={filters}
                    handleRequestSort={handleRequestSort}
                    handleRequestFilter={handleRequestFilter}
                  >
                    Tipo trasferta
                  </TableSortFilterCellWrapper>
                  <TableSortFilterCellWrapper
                    width={"30%"}
                    orderBy={orderBy}
                    order={order}
                    column="DATA_INIZIO"
                    filters={filters}
                    handleRequestSort={handleRequestSort}
                    handleRequestFilter={handleRequestFilter}
                  >
                    Data
                  </TableSortFilterCellWrapper>
                </TableRow>
                {isFetchingNextPage && (
                  <TableRow>
                    <TableCellLoadingContainer colSpan={6}>
                      <LinearProgress />
                    </TableCellLoadingContainer>
                  </TableRow>
                )}
              </TableHead> */}
              <TableBody>
                {result.map((item, index) => {
                  return (
                    <ItemDetail
                      key={item.id}
                      item={item}
                      index={index}
                      onUpdateResetErrori={onUpdateResetErrori} // Pass the function as a prop
                    />
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {hasNextPage && (
            <Grid mt={2} textAlign={"center"}>
              <Grid>
                <Button variant="contained" onClick={() => handleScroll()}>
                  NEXT
                </Button>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default withPageRequiredAuth(EpsNestjsOrpEffCicliEsecComponent, {
  roles: [RoleEnum.ADMIN],
});

interface ItemDetailProps {
  item: EpsNestjsOrpEffCicliEsecFailed;
  index: number;
  onUpdateResetErrori: (
    id: string,
    COD_OP?: string | null
  ) => Promise<boolean | void>;
}

const ItemDetail: React.FC<ItemDetailProps> = ({
  item,
  index,
  onUpdateResetErrori,
}) => {
  const theme = useTheme();

  interface ItemDetail {
    [key: string]: string;
  }

  const [open, setOpen] = useState<ItemDetail>({});

  const handleOpen = (id: string) => {
    setOpen(
      (prevOpen) =>
        ({
          ...prevOpen,
          [id]: !prevOpen[id],
        }) as ItemDetail
    );
  };

  return (
    <TableRow
      key={item.id}
      sx={{ pl: 3, "& > *": { borderBottom: "unset" }, py: 0 }}
      style={{
        backgroundColor:
          index % 2 === 0
            ? theme.palette.divider
            : theme.palette.background.paper,
      }}
    >
      <TableCell colSpan={6} padding="none" sx={{ py: 0 }}>
        <Table size="small" sx={{ m: 0, p: 0, borderCollapse: "separate" }}>
          <TableBody>
            <TableRow sx={{ "& > *": { borderBottom: "unset", py: 0.5 } }}>
              <TableCell sx={{ width: "10%", border: "none", py: 0.5 }}>
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => handleOpen(item.id)}
                  sx={{ p: 0.5 }}
                >
                  {open[item.id] ? (
                    <KeyboardArrowUpIcon fontSize="small" />
                  ) : (
                    <KeyboardArrowDownIcon fontSize="small" />
                  )}
                </IconButton>
              </TableCell>
              <TableCell
                sx={{
                  width: "10%",
                  textAlign: "right",
                  border: "none",
                  py: 0.5,
                }}
              >
                {item.id}
              </TableCell>
              <TableCell
                sx={{
                  width: "20%",
                  textAlign: "right",
                  border: "none",
                  py: 0.5,
                }}
              >
                <Typography variant="body2" noWrap>
                  {item?.DOC_ID}
                </Typography>
              </TableCell>
              <TableCell
                sx={{
                  width: "20%",
                  textAlign: "right",
                  border: "none",
                  py: 0.5,
                }}
              >
                <Typography variant="body2" noWrap>
                  {item?.operatori?.NOME_OP}
                </Typography>
              </TableCell>
              <TableCell
                sx={{
                  width: "20%",
                  textAlign: "right",
                  border: "none",
                  py: 0.5,
                }}
              >
                <TipoTrasfertaComponent tipotrasferta={item?.TIPO_TRASFERTA} />
              </TableCell>
              <TableCell
                sx={{
                  width: "30%",
                  textAlign: "right",
                  border: "none",
                  py: 0.5,
                }}
              >
                <Typography variant="body2">
                  {item?.DATA_INIZIO &&
                    formatDate(item?.DATA_INIZIO, "EEE dd MMM yy", {
                      locale: it,
                    })}
                </Typography>
              </TableCell>
            </TableRow>

            {open[item.id] && (
              <TableRow
                sx={{ "& > *": { borderBottom: "unset", py: 0 }, padding: 0 }}
              >
                <TableCell colSpan={6} sx={{ py: 0.5 }}>
                  {item.ERROR_SYNC_ESECUZIONE_OPERATORE && (
                    <>
                      <Typography variant="caption">
                        Esecuzione operatore:
                      </Typography>
                      <Typography variant="body2">
                        {item.ERROR_SYNC_ESECUZIONE_OPERATORE}
                      </Typography>
                    </>
                  )}
                  {item.hypServReq2 && (
                    <LogElaborazione
                      item={item.hypServReq2}
                      btnLabel="Esecuzione operatore"
                    />
                  )}
                  {item.ERROR_SYNC_COSTO_KM && (
                    <>
                      <Typography variant="caption">Costo km:</Typography>
                      <Typography variant="body2">
                        {item.ERROR_SYNC_COSTO_KM}
                      </Typography>
                    </>
                  )}
                  {item.appReq3HypServCostoKm && (
                    <>
                      <LogElaborazione
                        item={item.appReq3HypServCostoKm}
                        btnLabel="Costo trasferta"
                      />
                      <GruppoDiLavoro item={item} />
                    </>
                  )}
                  {item.ERROR_SYNC_COSTO_OPERATORE_TRASFERTA && (
                    <>
                      <Typography variant="caption">
                        Costo operatore:
                      </Typography>
                      <Typography variant="body2">
                        {item.ERROR_SYNC_COSTO_OPERATORE_TRASFERTA}
                      </Typography>
                    </>
                  )}
                  {item.appReq3HypServCostoOperatoreTrasferta && (
                    <LogElaborazione
                      item={item.appReq3HypServCostoOperatoreTrasferta}
                      btnLabel="Costo operatore"
                    />
                  )}

                  <Table sx={{ borderCollapse: "separate", mt: 0.5 }}>
                    <TableBody>
                      {item.epsNestjsOrpEffCicliEsecChild?.map(
                        (child, childIndex) => (
                          <ItemDetailNoReset
                            key={child.id}
                            item={child}
                            index={childIndex}
                          />
                        )
                      )}
                    </TableBody>
                  </Table>

                  <Button
                    sx={{ mt: 0.5 }}
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={() => onUpdateResetErrori(item.id, item.COD_OP)}
                    startIcon={<RefreshTwoToneIcon />}
                  >
                    Reset errori
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableCell>
    </TableRow>
  );
};

// Copy of ItemDetail without the "Reset errori" button.
// This component is intended for cases where we need the row to occupy
// the full width and not show the reset action.
const ItemDetailNoReset: React.FC<{
  item: EpsNestjsOrpEffCicliEsecFailed;
  index: number;
}> = ({ item, index }) => {
  const theme = useTheme();

  const [open, setOpen] = useState<{ [key: string]: string }>({});

  interface ItemDetail {
    [key: string]: string;
  }

  const handleOpen = (id: string) => {
    setOpen(
      (prevOpen) =>
        ({
          ...prevOpen,
          [id]: !prevOpen[id],
        }) as ItemDetail
    );
  };

  return (
    <TableRow
      key={item.id}
      sx={{ pl: 3, "& > *": { borderBottom: "unset" }, py: 0 }}
      style={{
        backgroundColor:
          index % 2 === 0
            ? theme.palette.divider
            : theme.palette.background.paper,
      }}
    >
      <TableCell colSpan={3} padding="none" sx={{ py: 0 }}>
        <Table size="small" sx={{ m: 0, p: 0, borderCollapse: "separate" }}>
          <TableBody>
            <TableRow sx={{ "& > *": { borderBottom: "unset", py: 0.5 } }}>
              <TableCell sx={{ width: "10%", border: "none", py: 0.5 }}>
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => handleOpen(item.id)}
                  sx={{ p: 0.5 }}
                >
                  {open[item.id] ? (
                    <KeyboardArrowUpIcon fontSize="small" />
                  ) : (
                    <KeyboardArrowDownIcon fontSize="small" />
                  )}
                </IconButton>
              </TableCell>
              <TableCell
                sx={{
                  width: "20%",
                  textAlign: "right",
                  border: "none",
                  py: 0.5,
                }}
              >
                {item.id}
              </TableCell>
              <TableCell
                sx={{
                  width: "80%",
                  textAlign: "right",
                  border: "none",
                  py: 0.5,
                }}
              >
                <Typography variant="body2">
                  {item?.DATA_INIZIO &&
                    formatDate(item?.DATA_INIZIO, "EEE dd MMM yy", {
                      locale: it,
                    })}
                </Typography>
              </TableCell>
            </TableRow>

            {open[item.id] && (
              <TableRow
                sx={{ "& > *": { borderBottom: "unset", py: 0 }, padding: 0 }}
              >
                <TableCell colSpan={6} sx={{ py: 0.5 }}>
                  {item.ERROR_SYNC_ESECUZIONE_OPERATORE && (
                    <>
                      <Typography variant="caption">
                        Esecuzione operatore:
                      </Typography>
                      <Typography variant="body2">
                        {item.ERROR_SYNC_ESECUZIONE_OPERATORE}
                      </Typography>
                    </>
                  )}
                  {item.hypServReq2 && (
                    <LogElaborazione
                      item={item.hypServReq2}
                      btnLabel="Esecuzione operatore"
                    />
                  )}
                  {item.ERROR_SYNC_COSTO_KM && (
                    <>
                      <Typography variant="caption">Costo km:</Typography>
                      <Typography variant="body2">
                        {item.ERROR_SYNC_COSTO_KM}
                      </Typography>
                    </>
                  )}
                  {item.appReq3HypServCostoKm && (
                    <>
                      <LogElaborazione
                        item={item.appReq3HypServCostoKm}
                        btnLabel="Costo trasferta"
                      />
                      <GruppoDiLavoro item={item} />
                    </>
                  )}
                  {item.ERROR_SYNC_COSTO_OPERATORE_TRASFERTA && (
                    <>
                      <Typography variant="caption">
                        Costo operatore:
                      </Typography>
                      <Typography variant="body2">
                        {item.ERROR_SYNC_COSTO_OPERATORE_TRASFERTA}
                      </Typography>
                    </>
                  )}
                  {item.appReq3HypServCostoOperatoreTrasferta && (
                    <LogElaborazione
                      item={item.appReq3HypServCostoOperatoreTrasferta}
                      btnLabel="Costo operatore"
                    />
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableCell>
    </TableRow>
  );
};
