"use client";

import { Cf } from "@/services/api/types/cf";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import { RoleEnum } from "@/services/api/types/role";
import { SortEnum } from "@/services/api/types/sort-type";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useTranslation } from "@/services/i18n/client";
import ClearIcon from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LinkIcon from "@mui/icons-material/Link";
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
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { useRouter, useSearchParams } from "next/navigation";
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import FormCreateEdit from "./create/page-content-cf";
import CfCommPage from "./page-content-cf-comm";
import { useGetCfQuery } from "./queries/queries-cf";

type CfKeys = keyof Cf;

const TableCellLoadingContainer = styled(TableCell)(() => ({
  padding: 0,
}));

function TableSortFilterCellWrapper(
  props: PropsWithChildren<{
    width?: number | string;
    orderBy: CfKeys;
    order: SortEnum;
    column: CfKeys;
    handleRequestSort: (
      event: React.MouseEvent<unknown>,
      property: CfKeys
    ) => void;
    filters: Array<FilterItem<Cf>>;
    handleRequestFilter: (prop: FilterItem<Cf>) => void;
  }>
) {
  const value =
    props.filters?.find((it) => it.columnName === props.column)?.value || "";
  const [text, setText] = useState<string>(value);

  const handleCancellaTesto = () => {
    setText("");
    const currentProp = {
      value: "",
      columnName: props.column,
    } as FilterItem<Cf>;
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
            } as FilterItem<Cf>;
            props.handleRequestFilter(currentProp);
          }
          return false;
        }}
        onBlur={() => {
          const currentProp = {
            value: text,
            columnName: props.column,
          } as FilterItem<Cf>;
          props.handleRequestFilter(currentProp);
        }}
        value={text}
      />
    </TableCell>
  );
}

function Cfs() {
  const { t: tArticoliCosti } = useTranslation("admin-panel-articoli-costi");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    console.log("nav changed ", window.location.search);
    if (searchParams.size === 0) {
      setOthersFilters([]);
      setFilters([]);
      setSort({ order: SortEnum.ASC, orderBy: "COD_CF" });
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

  const handleRequestOthersFilters = (
    event: React.MouseEvent<HTMLElement>,
    newOthersFilters: string[]
  ) => {
    const searchParams = new URLSearchParams(window.location.search);

    const converted = newOthersFilters.map((it) => {
      return { key: it, value: "true" };
    });

    searchParams.set("othersFilters", JSON.stringify(converted));

    setOthersFilters(converted);

    router.push(window.location.pathname + "?" + searchParams.toString());
  };

  const [{ order, orderBy }, setSort] = useState<{
    order: SortEnum;
    orderBy: CfKeys;
  }>(() => {
    const searchParamsSort = searchParams.get("sort");
    if (searchParamsSort) {
      return JSON.parse(searchParamsSort);
    }
    return { order: SortEnum.ASC, orderBy: "COD_CF" };
  });

  const [filters, setFilters] = useState<Array<FilterItem<Cf>>>(() => {
    const searchParamsFilter = searchParams.get("filter");
    if (searchParamsFilter) {
      return JSON.parse(searchParamsFilter);
    }
    return [];
  });

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: CfKeys
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

  const handleRequestFilter = (prop: FilterItem<Cf>) => {
    const { value, columnName } = prop;
    const searchParams = new URLSearchParams(window.location.search);

    let oldFilter: Array<FilterItem<Cf>> = JSON.parse(
      searchParams.get("filter") || "[]"
    );

    const prev = oldFilter.find((it) => it.columnName === columnName);
    if (prev) {
      // Update
      prev.value = value;
    } else if (value.length > 0) {
      // New one
      oldFilter = [...oldFilter, { columnName, value }];
    }

    // se value è vuoto rimuovo tutto l'oggetto
    oldFilter = oldFilter.filter((it) => it.value.length > 0);

    searchParams.set("filter", JSON.stringify(oldFilter));

    setFilters(oldFilter);
    router.push(window.location.pathname + "?" + searchParams.toString());
  };

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetCfQuery({ sort: { order, orderBy }, filters, othersFilters });

  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const result = useMemo(() => {
    const result =
      (data?.pages.flatMap((page) => page?.data) as Cf[]) ?? ([] as Cf[]);

    return removeDuplicatesFromArrayObjects(result, "COD_CF");
  }, [
    data,
    // searchParams
  ]);

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
        <Grid container size={{ xs: 12 }}>
          <Grid size="grow">
            <Typography variant="h3">{tArticoliCosti("title")}</Typography>
          </Grid>
          <Grid container size="auto" wrap="nowrap">
            <Grid size="auto">
              <ToggleButtonGroup
                value={othersFilters.map((it) => it.key)}
                onChange={handleRequestOthersFilters}
                aria-label="join others tables"
              >
                <ToggleButton value="join" aria-label="join">
                  <LinkIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12 }} mb={2}>
          <TableContainer>
            <Table size="small" sx={{ "& > *": { borderBottom: "unset" } }}>
              <TableHead>
                <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                  <TableCell style={{ width: "10%" }} />
                  <TableSortFilterCellWrapper
                    width={"10%"}
                    orderBy={orderBy}
                    order={order}
                    column="COD_CF"
                    filters={filters}
                    handleRequestSort={handleRequestSort}
                    handleRequestFilter={handleRequestFilter}
                  >
                    {tArticoliCosti("table.column1")}
                  </TableSortFilterCellWrapper>
                  <TableSortFilterCellWrapper
                    width={"30%"}
                    orderBy={orderBy}
                    order={order}
                    column="RAG_SOC_CF"
                    filters={filters}
                    handleRequestSort={handleRequestSort}
                    handleRequestFilter={handleRequestFilter}
                  >
                    {tArticoliCosti("table.column2")}
                  </TableSortFilterCellWrapper>
                  <TableSortFilterCellWrapper
                    width={"50%"}
                    orderBy={orderBy}
                    order={order}
                    column="P_IVA_CF"
                    filters={filters}
                    handleRequestSort={handleRequestSort}
                    handleRequestFilter={handleRequestFilter}
                  >
                    {tArticoliCosti("table.column3")}
                  </TableSortFilterCellWrapper>
                </TableRow>
                {isFetchingNextPage && (
                  <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                    <TableCellLoadingContainer colSpan={4}>
                      <LinearProgress />
                    </TableCellLoadingContainer>
                  </TableRow>
                )}
              </TableHead>
              <TableBody sx={{ border: "none" }}>
                {result.map((cf, index) => {
                  return (
                    <TableRow
                      sx={{ "& > *": { borderBottom: "unset" } }}
                      key={cf.COD_CF}
                    >
                      <TableCell
                        colSpan={4}
                        sx={{ borderBottom: "none", padding: "8px" }}
                      >
                        <Paper
                          elevation={2}
                          sx={{
                            backgroundColor:
                              index % 2 === 0
                                ? theme.palette.action.hover
                                : theme.palette.background.paper,
                            padding: theme.spacing(1), // Add padding inside the Paper
                          }}
                        >
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
                                  {cf.COD_CF !== "DEFAULT_CF" &&
                                    cf.articoliCostiCf && (
                                      <IconButton
                                        aria-label="expand row"
                                        size="small"
                                        onClick={() => handleOpen(cf.COD_CF)}
                                      >
                                        {open[cf.COD_CF] ? (
                                          <KeyboardArrowUpIcon />
                                        ) : (
                                          <KeyboardArrowDownIcon />
                                        )}
                                      </IconButton>
                                    )}
                                </TableCell>
                                <TableCell
                                  style={{
                                    width: "10%",
                                    textAlign: "right",
                                    border: "none",
                                  }}
                                >
                                  <Typography variant="subtitle2">
                                    {cf?.COD_CF}
                                  </Typography>
                                </TableCell>
                                <TableCell
                                  style={{
                                    width: "30%",
                                    textAlign: "right",
                                    border: "none",
                                  }}
                                >
                                  {cf?.RAG_SOC_CF}
                                </TableCell>
                                <TableCell
                                  style={{
                                    width: "50%",
                                    textAlign: "right",
                                    border: "none",
                                  }}
                                >
                                  {cf?.P_IVA_CF}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell colSpan={4} padding="none">
                                  <FormCreateEdit cf={cf} />
                                </TableCell>
                              </TableRow>
                              {open[cf.COD_CF] && (
                                <TableRow
                                  sx={(theme) => ({
                                    padding: theme.spacing(0),
                                    "& > *": { borderBottom: "unset" },
                                  })}
                                >
                                  <TableCell colSpan={4}>
                                    <CfCommPage {...cf} />
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </Paper>
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

export default withPageRequiredAuth(Cfs, { roles: [RoleEnum.ADMIN] });
