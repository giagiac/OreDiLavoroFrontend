"use client";

import { ButtonDelete } from "@/app/[language]/admin-panel/targa-mezzi/button-delete";
import { useGetTargaMezziQuery } from "@/app/[language]/admin-panel/targa-mezzi/queries/queries-eps-nestjs-targa-mezzi";
import { NumericKeypadKm } from "@/components/numeric-keypad-km";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import { SortEnum } from "@/services/api/types/sort-type";
import { TargaMezzi } from "@/services/api/types/targa-mezzi";
import useAuth from "@/services/auth/use-auth";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  useTheme,
} from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import ForwardTwoToneIcon from "@mui/icons-material/ForwardTwoTone";

type EpsNestjsTargaMezziKeys = keyof TargaMezzi;

function FormCreateUser() {
  const searchParams = useSearchParams();

  const { user } = useAuth();

  const theme = useTheme();

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
      oldFilter = [...oldFilter, { columnName, value }];
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

  const [km, setKm] = useState("0");

  return (
    <Container maxWidth="md">
      <Grid container pt={3}>
        <Grid textAlign={{ xs: "right" }} size={12}>
          <Typography variant="h3" gutterBottom>
            {`${user?.firstName} ${user?.lastName}`}
          </Typography>
          <Typography variant="h4">Aggiungi solo i Km Autista</Typography>
        </Grid>
        <Grid size={12}>
          <Container maxWidth="sm">
            <Grid container justifyContent="center" alignItems="center">
              <Grid size={{ xs: 12 }}>
                <NumericKeypadKm
                  onChange={(value) => {
                    console.log(value);
                    setKm(value);
                  }}
                />
              </Grid>
            </Grid>
          </Container>
        </Grid>
        <Grid size={{ xs: 12 }} mb={10} mt={3}>
          <TableContainer component={Paper}>
            <Table size="small">
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
                          index % 2 == 0
                            ? theme.palette.divider
                            : theme.palette.background.paper,
                      }}
                    >
                      <TableCell>
                        <Typography variant="body1">
                          {targaMezzi?.COD_ART} · {targaMezzi.artAna?.DES_ART}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          color="info"
                          variant="contained"
                          fullWidth
                          onClick={() =>
                            router.push(
                              `/hours/manage/create/step1_KmAutista?COD_ART=${targaMezzi.COD_ART}&KM=${km}`
                            )
                          }
                        >
                          <ForwardTwoToneIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
}

function CreateUser() {
  return <FormCreateUser />;
}

export default withPageRequiredAuth(CreateUser);
