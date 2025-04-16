"use client";

import { ArtAna } from "@/services/api/types/art-ana";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import { RoleEnum } from "@/services/api/types/role";
import { SortEnum } from "@/services/api/types/sort-type";
import { TargaMezzi } from "@/services/api/types/targa-mezzi";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useTranslation } from "@/services/i18n/client";
import ClearIcon from "@mui/icons-material/Clear";
import { Paper, TableContainer, TableHead, useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
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
import { ButtonDelete } from "./button-delete";
import FormCreateEdit from "./create/page-content";
import { useGetTargaMezziQuery } from "./queries/queries-eps-nestjs-targa-mezzi";

type EpsNestjsTargaMezziKeys = keyof TargaMezzi;

const TableCellLoadingContainer = styled(TableCell)(() => ({
  padding: 0,
}));

function TableSortFilterCellWrapper(
  props: PropsWithChildren<{
    width?: number | string;
    orderBy: EpsNestjsTargaMezziKeys;
    order: SortEnum;
    column: EpsNestjsTargaMezziKeys;
    handleRequestSort: (
      event: React.MouseEvent<unknown>,
      property: EpsNestjsTargaMezziKeys
    ) => void;
    filters: Array<FilterItem<TargaMezzi>>;
    handleRequestFilter: (prop: FilterItem<TargaMezzi>) => void;
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
    } as FilterItem<TargaMezzi>;
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
            } as FilterItem<TargaMezzi>;
            props.handleRequestFilter(currentProp);
          }
          return false;
        }}
        onBlur={() => {
          const currentProp = {
            value: text,
            columnName: props.column,
          } as FilterItem<TargaMezzi>;
          props.handleRequestFilter(currentProp);
        }}
        value={text}
      />
    </TableCell>
  );
}

function TargaMezziPage() {
  const theme = useTheme();

  const { t: tArticoliCosti } = useTranslation("admin-panel-articoli-costi");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    console.log("nav changed ", window.location.search);
    if (searchParams.size === 0) {
      setOthersFilters([]);
      setFilters([]);
      setSort({ order: SortEnum.ASC, orderBy: "COD_ART" });
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
    orderBy: EpsNestjsTargaMezziKeys;
  }>(() => {
    const searchParamsSort = searchParams.get("sort");
    if (searchParamsSort) {
      return JSON.parse(searchParamsSort);
    }
    return { order: SortEnum.ASC, orderBy: "createdAt" };
  });

  const [filters, setFilters] = useState<Array<FilterItem<TargaMezzi>>>(() => {
    const searchParamsFilter = searchParams.get("filter");
    if (searchParamsFilter) {
      return JSON.parse(searchParamsFilter);
    }
    return [];
  });

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: EpsNestjsTargaMezziKeys
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

  const handleRequestFilter = (prop: FilterItem<TargaMezzi>) => {
    const { value, columnName } = prop;
    const searchParams = new URLSearchParams(window.location.search);

    let oldFilter: Array<FilterItem<TargaMezzi>> = JSON.parse(
      searchParams.get("filter") || "[]"
    );

    const prev = oldFilter.find((it) => it.columnName === columnName);
    if (prev) {
      // Update
      prev.value = value;
    } else if (value.length > 0) {
      // New one
      oldFilter = [...oldFilter, { columnName, value, id: 0 }];
    }

    // se value è vuoto rimuovo tutto l'oggetto
    oldFilter = oldFilter.filter((it) => it.value.length > 0);

    searchParams.set("filter", JSON.stringify(oldFilter));

    setFilters(oldFilter);
    router.push(window.location.pathname + "?" + searchParams.toString());
  };

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } =
    useGetTargaMezziQuery({ sort: { order, orderBy }, filters, othersFilters });

  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const result = useMemo(() => {
    const result =
      (data?.pages.flatMap((page) => page?.data) as TargaMezzi[]) ??
      ([] as TargaMezzi[]);

    return removeDuplicatesFromArrayObjects(result, "COD_ART");
  }, [data, searchParams]);

  // const fetchPostTargaMezzi = useDeleteTargaMezziService();

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} pt={3}>
        <Grid container spacing={3} size={{ xs: 12 }}>
          <Grid size="grow">
            <Typography variant="h3">{"Targa mezzi"}</Typography>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12 }} mb={2}>
          <FormCreateEdit
            onChangeCallback={(artAna: ArtAna) => {
              console.log(artAna);
              refetch();
            }}
          />
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableSortFilterCellWrapper
                    orderBy={orderBy}
                    order={order}
                    column="COD_ART"
                    filters={filters}
                    handleRequestSort={handleRequestSort}
                    handleRequestFilter={handleRequestFilter}
                  >
                    {"Codice articoli"}
                  </TableSortFilterCellWrapper>
                </TableRow>
                {isFetchingNextPage && (
                  <TableRow>
                    <TableCellLoadingContainer>
                      <LinearProgress />
                    </TableCellLoadingContainer>
                  </TableRow>
                )}
              </TableHead>
              <TableBody
                style={{
                  borderBottom: "none",
                  borderCollapse: "collapse",
                }}
              >
                {result.map((targaMezzi, index) => {
                  return (
                    <TableRow
                      key={targaMezzi.COD_ART}
                      style={{
                        backgroundColor:
                          Number(targaMezzi.id) % 2 == 0
                            ? theme.palette.divider
                            : theme.palette.background.paper,
                      }}
                    >
                      <TableCell>
                        <Grid container direction="row">
                          <Grid size={{ xs: 11 }}>
                            <Typography variant="body2">
                              {targaMezzi?.COD_ART} ·{" "}
                              {targaMezzi.artAna?.DES_ART}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 1 }}>
                            {/* // TODO: 
                            <ButtonDeleteConfirm
                              item={targaMezzi}
                              refetch={() => {
                                refetch();
                              }}
                              useDeleteService={() =>
                                (params: { id: string }) => {
                                  return fetchPostTargaMezzi({
                                    id: params.id,
                                  });
                                }}
                              confirmTitle={"Confermi l'eliminazione"}
                              confirmMessage={"Vuoi confermare?"}
                              successMessage={"Articolo cancellato"}
                            /> */}
                            <ButtonDelete
                              targaMezzi={targaMezzi}
                              refetch={() => {
                                refetch();
                              }}
                            />
                          </Grid>
                        </Grid>
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

export default withPageRequiredAuth(TargaMezziPage, {
  roles: [RoleEnum.ADMIN],
});
