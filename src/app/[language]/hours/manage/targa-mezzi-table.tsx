import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import { SortEnum } from "@/services/api/types/sort-type";
import { TargaMezzi } from "@/services/api/types/targa-mezzi";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import NoCrashTwoToneIcon from "@mui/icons-material/NoCrashTwoTone";
import Star from "@mui/icons-material/Star";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useGetTargaMezziQuery } from "../../admin-panel/targa-mezzi/queries/queries-eps-nestjs-targa-mezzi";

export const NO_TARGA_MEZZI_SELECTED = "NO_TARGA_MEZZI_SELECTED";

const AnelloGiallo = () => {
  const theme = useTheme();
  return (
    <div
      style={{
        backgroundColor: "#003DA3",
        height: "100%",
        paddingTop: theme.spacing(1),
      }}
    >
      <div
        style={{
          position: "relative",
          marginLeft: theme.spacing(0.75),
          width: theme.spacing(3.125),
          height: theme.spacing(3.125),
          borderRadius: "50%",
          border: 2,
          borderColor: "#FFC300",
          borderStyle: "solid",
        }}
      />
    </div>
  );
};

const StelleEuropee = () => {
  const numStars = 10; // Numero di stelle
  const radius = 16; // Raggio del cerchio
  const starSize = 8; // Dimensione delle stelle

  const stars = [];
  for (let i = 0; i < numStars; i++) {
    const angle = (i / numStars) * 2 * Math.PI;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    stars.push(
      <Star // Usa Star invece di StarFill e aggiungi fill="#FFC300"
        key={i}
        style={{
          position: "absolute",
          left: `calc(50% + ${x}px - ${starSize / 2}px)`,
          top: `calc(50% + ${y}px - ${starSize / 2}px)`,
          width: starSize,
          height: starSize,
          color: "#FFC300", // Colore delle stelle
        }}
      />
    );
  }

  return (
    <div style={{ backgroundColor: "#003DA3", width: 100, height: "100%" }}>
      <div
        style={{
          width: 45,
          height: 50,
          position: "absolute", // Importante per posizionare le stelle relativamente a questo div
          display: "inline-block",
        }}
      >
        {stars}
      </div>
    </div>
  );
};

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

  if (pathname.indexOf("step1_km_autista") > -1) {
    STORAGE_KEY = "TARGA_MEZZI_DEFAULT_KM_AUTISTA";
  }

  const targaSelected =
    localStorage.getItem(STORAGE_KEY) || NO_TARGA_MEZZI_SELECTED;

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

  const selectedItem = result.find((it) => it.COD_ART === targaMezziSelected);
  //const codArt = selectedItem?.artAna?.COD_ART ?? "";
  const desArt = selectedItem?.artAna?.DES_ART ?? "";

  return (
    <>
      <Grid
        container
        direction="row"
        style={{
          borderRadius: 6,
          borderWidth: 4,
          borderStyle: "solid",
          borderColor: "black",
          boxShadow: `4px 4px 4px gray`,
        }}
        sx={{ mb: 3 }}
      >
        <Grid size={{ xs: 1 }}>
          <StelleEuropee />
        </Grid>
        <Grid size={{ xs: 10 }}>
          <Accordion
            sx={{ minHeight: 120 }}
            elevation={0}
            expanded={isAccordionExpanded}
            onChange={() => setIsAccordionExpanded(!isAccordionExpanded)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{ flexFlow: "column", textAlign: "center" }}
            >
              <Typography variant="h4">
                {targaMezziSelected === NO_TARGA_MEZZI_SELECTED
                  ? "Seleziona una targa"
                  : desArt !== ""
                    ? `${desArt}`
                    : "Targa selezionata non trovata"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2} sx={{ width: "100%" }}>
                {result.map((targaMezzi) => (
                  <Grid
                    size={{ xs: 12, sm: 6 }}
                    key={targaMezzi.COD_ART}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderBottom: "1px solid #eee",
                      py: 1,
                    }}
                  >
                    <Typography variant="body1" sx={{ flex: 1 }}>
                      {targaMezzi.artAna?.DES_ART}
                    </Typography>
                    <Button
                      color="info"
                      variant="outlined"
                      onClick={() => {
                        localStorage.setItem(STORAGE_KEY, targaMezzi.COD_ART);
                        setTargaMezziSelected(targaMezzi.COD_ART);
                        setIsAccordionExpanded(false); // Chiude l'accordion
                      }}
                      sx={{ ml: 1 }}
                    >
                      <NoCrashTwoToneIcon />
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid size={{ xs: 1 }}>
          <AnelloGiallo />
        </Grid>
      </Grid>
      {targaMezziSelected !== NO_TARGA_MEZZI_SELECTED &&
        // codArt !== "" &&
        desArt !== "" &&
        children(targaMezziSelected)}
    </>
  );
};

export default TargaMezziTable;
