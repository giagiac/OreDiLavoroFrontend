"use client";

import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import { Operatori } from "@/services/api/types/operatori";
import { RoleEnum } from "@/services/api/types/role";
import { SortEnum } from "@/services/api/types/sort-type";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import ClearIcon from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import RefreshTwoToneIcon from "@mui/icons-material/RefreshTwoTone";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import { styled, useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter, useSearchParams } from "next/navigation";
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import EpsNestjsOrpEffCicliEsecPage from "./page-content-eps-nestjs-orp-eff-cicli-esec";
import { useGetOperatoriEsecuzioniQuery } from "./queries/queries-operatori";
type OperatoriKeys = keyof Operatori;

const TableCellLoadingContainer = styled(TableCell)(() => ({
  padding: 0,
}));

function TableSortFilterCellWrapper(
  props: PropsWithChildren<{
    width?: number | string;
    orderBy: OperatoriKeys;
    order: SortEnum;
    column: OperatoriKeys;
    handleRequestSort: (
      event: React.MouseEvent<unknown>,
      property: OperatoriKeys
    ) => void;
    filters: Array<FilterItem<Operatori>>;
    handleRequestFilter: (prop: FilterItem<Operatori>) => void;
  }>
) {
  const value =
    props.filters?.find((it) => it.columnName === props.column)?.value || "";
  const [text, setText] = useState<string | number>(value);

  const handleCancellaTesto = () => {
    setText("");
    const currentProp = {
      value: "",
      columnName: props.column,
    } as FilterItem<Operatori>;
    props.handleRequestFilter(currentProp);
  };

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
      <br />
      <TextField
        slotProps={{
          input: {
            endAdornment: (
              <IconButton
                onClick={handleCancellaTesto}
                edge="end"
                aria-label="cancella testo"
              >
                <ClearIcon />
              </IconButton>
            ),
          },
        }}
        autoComplete="off"
        size="small"
        fullWidth
        variant="standard"
        onChange={(event) => {
          setText(event.target.value);
        }}
        onKeyUp={(event) => {
          if (event.key === "Enter" || event.keyCode === 13) {
            const currentProp = {
              value: text,
              columnName: props.column,
            } as FilterItem<Operatori>;
            props.handleRequestFilter(currentProp);
          }
          return false;
        }}
        onBlur={() => {
          const currentProp = {
            value: text,
            columnName: props.column,
          } as FilterItem<Operatori>;
          props.handleRequestFilter(currentProp);
        }}
        value={text}
      />
    </TableCell>
  );
}

function Operatoris() {
  // const { t: tArticoliCosti } = useTranslation("admin-panel-articoli-costi");
  const searchParams = useSearchParams();
  const router = useRouter();

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

  // const handleRequestOthersFilters = (
  //   event: React.MouseEvent<HTMLElement>,
  //   newOthersFilters: string[]
  // ) => {
  //   const searchParams = new URLSearchParams(window.location.search);

  //   const converted = newOthersFilters.map((it) => {
  //     return { key: it, value: "true" };
  //   });

  //   searchParams.set("othersFilters", JSON.stringify(converted));

  //   setOthersFilters(converted);

  //   router.push(window.location.pathname + "?" + searchParams.toString());
  // };

  const [{ order, orderBy }, setSort] = useState<{
    order: SortEnum;
    orderBy: OperatoriKeys;
  }>(() => {
    const searchParamsSort = searchParams.get("sort");
    if (searchParamsSort) {
      return JSON.parse(searchParamsSort);
    }
    return { order: SortEnum.ASC, orderBy: "COD_OP" };
  });

  const [filters, setFilters] = useState<Array<FilterItem<Operatori>>>(() => {
    const searchParamsFilter = searchParams.get("filter");
    if (searchParamsFilter) {
      return JSON.parse(searchParamsFilter);
    }
    return [];
  });

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: OperatoriKeys
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

  const handleRequestFilter = (prop: FilterItem<Operatori>) => {
    const { value, columnName } = prop;
    const searchParams = new URLSearchParams(window.location.search);

    let oldFilter: Array<FilterItem<Operatori>> = JSON.parse(
      searchParams.get("filter") || "[]"
    );

    const prev = oldFilter.find((it) => it.columnName === columnName);
    if (prev) {
      // Update
      prev.value = value;
    } else if (String(value).length > 0) {
      // New one
      oldFilter = [...oldFilter, { columnName, value }];
    }

    // se value è vuoto rimuovo tutto l'oggetto
    oldFilter = oldFilter.filter((it) => String(it.value).length > 0);

    searchParams.set("filter", JSON.stringify(oldFilter));

    setFilters(oldFilter);
    router.push(window.location.pathname + "?" + searchParams.toString());
  };

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } =
    useGetOperatoriEsecuzioniQuery({
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
      (data?.pages.flatMap((page) => page?.data) as Operatori[]) ??
      ([] as Operatori[]);

    return removeDuplicatesFromArrayObjects(result, "COD_OP");
  }, [data]);

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

  const theme = useTheme();

  return (
    <Container maxWidth="xl">
      <Grid container pt={3}>
        <Grid container spacing={3} size={{ xs: 12 }}>
          <Grid size="grow">
            <Typography variant="h3">{"Gestione ore operatori"}</Typography>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12 }}>
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
        </Grid>
        <Grid size={{ xs: 12 }} mb={2}>
          <TableContainer component={Paper} elevation={3}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "10%" }} />
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
                    column="NOME_OP"
                    filters={filters}
                    handleRequestSort={handleRequestSort}
                    handleRequestFilter={handleRequestFilter}
                  >
                    Nome Operatore
                  </TableSortFilterCellWrapper>
                  <TableSortFilterCellWrapper
                    width={"50%"}
                    orderBy={orderBy}
                    order={order}
                    column="X_COD_BADGE"
                    filters={filters}
                    handleRequestSort={handleRequestSort}
                    handleRequestFilter={handleRequestFilter}
                  >
                    Codice Badge
                  </TableSortFilterCellWrapper>
                </TableRow>
                {isFetchingNextPage && (
                  <TableRow>
                    <TableCellLoadingContainer colSpan={4}>
                      <LinearProgress />
                    </TableCellLoadingContainer>
                  </TableRow>
                )}
              </TableHead>
              <TableBody>
                {result.map((operatore, index) => {
                  return (
                    <TableRow
                      key={operatore.COD_OP}
                      style={{
                        backgroundColor:
                          index % 2 === 0
                            ? theme.palette.divider
                            : theme.palette.background.paper,
                      }}
                    >
                      <TableCell colSpan={4}>
                        <Table
                          style={{
                            borderCollapse: "separate",
                            borderBottom: "none",
                          }}
                        >
                          <TableBody>
                            <TableRow
                              sx={{ "& > *": { borderBottom: "unset" } }}
                            >
                              <TableCell
                                style={{ width: "10%", border: "none" }}
                              >
                                <IconButton
                                  aria-label="expand row"
                                  size="small"
                                  onClick={() => handleOpen(operatore.COD_OP)}
                                >
                                  {open[operatore.COD_OP] ? (
                                    <KeyboardArrowUpIcon />
                                  ) : (
                                    <KeyboardArrowDownIcon />
                                  )}
                                </IconButton>
                              </TableCell>
                              <TableCell
                                style={{
                                  width: "10%",
                                  textAlign: "right",
                                  border: "none",
                                }}
                              >
                                <Typography variant="subtitle2">
                                  {operatore?.COD_OP}
                                </Typography>
                              </TableCell>
                              <TableCell
                                style={{
                                  width: "30%",
                                  textAlign: "right",
                                  border: "none",
                                }}
                              >
                                {operatore?.NOME_OP}
                              </TableCell>
                              <TableCell
                                style={{
                                  width: "50%",
                                  textAlign: "right",
                                  border: "none",
                                }}
                              >
                                {operatore?.X_COD_BADGE}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell colSpan={4} padding="none"></TableCell>
                            </TableRow>
                            {open[operatore.COD_OP] && (
                              <TableRow
                                sx={(theme) => ({
                                  "& > *": { borderBottom: "unset" },
                                  padding: theme.spacing(0),
                                })}
                              >
                                <TableCell colSpan={4}>
                                  <EpsNestjsOrpEffCicliEsecPage
                                    operatore={operatore}
                                  />
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Grid mt={2} textAlign={"center"}>
            <Grid>
              <Button variant="contained" onClick={() => handleScroll()}>
                NEXT
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default withPageRequiredAuth(Operatoris, { roles: [RoleEnum.ADMIN] });
