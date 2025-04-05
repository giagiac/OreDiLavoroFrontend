import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import { SortEnum } from "@/services/api/types/sort-type";
import { TargaMezzi } from "@/services/api/types/targa-mezzi";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import NoCrashTwoToneIcon from "@mui/icons-material/NoCrashTwoTone";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useGetTargaMezziQuery } from "../../admin-panel/targa-mezzi/queries/queries-eps-nestjs-targa-mezzi";

export const NO_TARGA_MEZZI_SELECTED = "NO_TARGA_MEZZI_SELECTED";

interface TargaMezziTableProps {
  storageKey: string;
  onTargaSelection: (COD_ART: string) => void;
  actionButton: (onClick: () => void) => React.ReactNode; // Modifica: accetta una funzione che riceve onClick
}

type EpsNestjsTargaMezziKeys = keyof TargaMezzi;

const TargaMezziTable: React.FC<TargaMezziTableProps> = ({
  onTargaSelection,
  storageKey,
  actionButton,
}) => {
  const searchParams = useSearchParams();

  const theme = useTheme();

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

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } =
    useGetTargaMezziQuery({ sort: { order, orderBy }, filters, othersFilters });

  const result = useMemo(() => {
    const result =
      (data?.pages.flatMap((page) => page?.data) as TargaMezzi[]) ??
      ([] as TargaMezzi[]);

    return removeDuplicatesFromArrayObjects(result, "COD_ART");
  }, [data, searchParams]);

  const [targaMezziSelected, setTargaMezziSelected] = useState<string>(
    NO_TARGA_MEZZI_SELECTED
  );
  useEffect(() => {
    const items = localStorage.getItem(storageKey) || NO_TARGA_MEZZI_SELECTED;
    if (items) {
      setTargaMezziSelected(items);
    }
  }, []);

  const [isAccordionExpanded, setIsAccordionExpanded] =
    useState<boolean>(false);

  return (
    <Grid container spacing={2} direction="column">
      <Grid size={{ xs: 12 }}>
        <Accordion
          expanded={isAccordionExpanded}
          onChange={() => setIsAccordionExpanded(!isAccordionExpanded)}
          sx={{p:1}}
        >
          <AccordionSummary
            sx={{
              flexDirection: "row-reverse", // Sposta l'icona a sinistra
              "& .MuiAccordionSummary-expandIconWrapper": {
                marginRight: "auto", // Allinea l'icona a sinistra
              },
            }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="table-content"
            id="table-header"
          >
            <Typography variant="subtitle2">
              {(targaMezziSelected === NO_TARGA_MEZZI_SELECTED &&
                "Procedi senza una targa") ||
                result.find((it) => it.COD_ART == targaMezziSelected)?.artAna
                  ?.DES_ART}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Table size="small">
              <TableBody
                style={{
                  borderBottom: "none",
                  borderCollapse: "collapse",
                }}
              >
                {/* ITEM DI DEFAULT */}
                <TableRow
                  style={{
                    backgroundColor: theme.palette.background.paper,
                  }}
                >
                  <TableCell>
                    <Typography variant="body1">Nessuna targa</Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      color="info"
                      variant="contained"
                      fullWidth
                      onClick={() => {
                        localStorage.setItem(
                          storageKey,
                          NO_TARGA_MEZZI_SELECTED
                        );
                        setTargaMezziSelected(NO_TARGA_MEZZI_SELECTED);
                        setIsAccordionExpanded(false); // Chiude l'accordion
                      }}
                    >
                      <NoCrashTwoToneIcon />
                    </Button>
                  </TableCell>
                </TableRow>
                {/* LISTA ARTICOLI TARGHE */}
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
                        <Typography variant="body1">
                          {targaMezzi?.COD_ART} · {targaMezzi.artAna?.DES_ART}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          color="info"
                          variant="contained"
                          fullWidth
                          onClick={() => {
                            localStorage.setItem(
                              storageKey,
                              targaMezzi.COD_ART
                            );
                            setTargaMezziSelected(targaMezzi.COD_ART);
                            setIsAccordionExpanded(false); // Chiude l'accordion
                          }}
                        >
                          <NoCrashTwoToneIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid size={{ xs: 12 }}>
        {/* Passa la funzione onClick al bottone */}
        {actionButton(() => onTargaSelection(targaMezziSelected))}
      </Grid>
    </Grid>
  );
};

export default TargaMezziTable;
