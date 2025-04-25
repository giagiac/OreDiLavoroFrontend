import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import { SortEnum } from "@/services/api/types/sort-type";
import { TargaMezzi } from "@/services/api/types/targa-mezzi";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import NoCrashTwoToneIcon from "@mui/icons-material/NoCrashTwoTone";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid2";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useGetTargaMezziQuery } from "../../admin-panel/targa-mezzi/queries/queries-eps-nestjs-targa-mezzi";

export const NO_TARGA_MEZZI_SELECTED = "NO_TARGA_MEZZI_SELECTED";

type EpsNestjsTargaMezziKeys = keyof TargaMezzi;

interface TargaMezziTableProps {
  childrenCallBack: (COD_ART: string) => React.ReactElement;
}

const TargaMezziTable = ({
  childrenCallBack: children,
}: TargaMezziTableProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  let STORAGE_KEY = "TARGA_MEZZI_DEFAULT";

  if (pathname.indexOf("step1_KmAutista") > -1) {
    STORAGE_KEY = "TARGA_MEZZI_DEFAULT_KM_AUTISTA";
  }

  const targaSelected =
    localStorage.getItem(STORAGE_KEY) || NO_TARGA_MEZZI_SELECTED;

  const theme = useTheme();

  useEffect(() => {
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

  const { data } = useGetTargaMezziQuery({
    sort: { order, orderBy },
    filters,
    othersFilters,
  });

  const result = useMemo(() => {
    const result =
      (data?.pages.flatMap((page) => page?.data) as TargaMezzi[]) ??
      ([] as TargaMezzi[]);

    return removeDuplicatesFromArrayObjects(result, "COD_ART");
  }, [data]);

  const [targaMezziSelected, setTargaMezziSelected] =
    useState<string>(targaSelected);

  const [isAccordionExpanded, setIsAccordionExpanded] =
    useState<boolean>(false);

  return (
    <Grid container spacing={2} direction="column">
      <Grid size={{ xs: 12 }}>
        <Accordion
          expanded={isAccordionExpanded}
          onChange={() => setIsAccordionExpanded(!isAccordionExpanded)}
          sx={{ p: 1 }}
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
              {targaMezziSelected === NO_TARGA_MEZZI_SELECTED
                ? "Procedi senza una targa"
                : (() => {
                    const selectedItem = result.find(
                      (it) => it.COD_ART === targaMezziSelected
                    );
                    const codArt = selectedItem?.artAna?.COD_ART ?? "";
                    const desArt = selectedItem?.artAna?.DES_ART ?? "";
                    return codArt && desArt
                      ? `${codArt} · ${desArt}`
                      : "Targa selezionata non trovata";
                  })()}
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
                          STORAGE_KEY,
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
                {result.map((targaMezzi) => {
                  return (
                    <TableRow
                      key={targaMezzi.COD_ART}
                      style={{
                        backgroundColor:
                          Number(targaMezzi.id) % 2 === 0
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
                              STORAGE_KEY,
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
        <Grid>{children(targaMezziSelected)}</Grid>
      </Grid>
    </Grid>
  );
};

export default TargaMezziTable;
