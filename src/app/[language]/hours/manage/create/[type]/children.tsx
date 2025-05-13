"use client";

import { FullPageLoader } from "@/components/full-page-loader";
import { TipoTrasferta } from "@/services/api/types/articoli-costi-cf-comm";
import { EpsNestjsOrpEffCicliEsecChild } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec-child";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import { SortEnum } from "@/services/api/types/sort-type";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import { useMemo, useState } from "react";
import { useGetEpsNestjsOrpEffCicliEsecChildQuery } from "../../queries/queries-eps-nestjs-orp-eff-cicli-esec-child";

type EpsNestjsOrpEffCicliEsecChildKeys = keyof EpsNestjsOrpEffCicliEsecChild;

interface Props {
  tipoTrasferta: TipoTrasferta;
  idfk: number;

  DOC_RIGA_ID: string;
  DOC_ID: string;
  AZIENDA_ID: number;

  // SEZIONE DEDICATA a KM AUTISTA
  COD_ART: string; // ATT.NE non è il COD_ART delle Esecuzioni (da inserire nei componenti)
  KM: number;
}

function Children({ idfk }: Props) {
  // FILTERS
  const [{ order, orderBy }] = useState<{
    order: SortEnum;
    orderBy: EpsNestjsOrpEffCicliEsecChildKeys;
  }>({ order: SortEnum.ASC, orderBy: "id" });

  const [filters, setFilters] = useState<
    Array<FilterItem<EpsNestjsOrpEffCicliEsecChild>>
  >([{ columnName: "idfk", value: idfk }]);
  const [othersFilters] = useState<Array<OthersFiltersItem>>([]);

  const { data, isFetched, isFetching, isLoading } =
    useGetEpsNestjsOrpEffCicliEsecChildQuery({
      sort: { order, orderBy },
      filters,
      othersFilters,
    });

  const result = useMemo(() => {
    const result =
      (data?.pages.flatMap(
        (page) => page?.data
      ) as EpsNestjsOrpEffCicliEsecChild[]) ??
      ([] as EpsNestjsOrpEffCicliEsecChild[]);

    return removeDuplicatesFromArrayObjects(result, "id");
  }, [data, filters]);

  return (
    <>
      <Container maxWidth="md">
        <Grid
          container
          spacing={2}
          mb={3}
          mt={3}
          justifyContent="center"
          alignItems="center"
        >
          <Grid size={{ xs: 12 }}></Grid>
        </Grid>
        <Grid container spacing={2} mb={3} mt={3}>
          {isFetched && <></>}
        </Grid>
      </Container>
      <FullPageLoader isLoading={isLoading || isFetching} />
    </>
  );
}

export default Children;
