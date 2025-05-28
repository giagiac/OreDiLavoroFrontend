"use client";

import { FullPageLoader } from "@/components/full-page-loader";
import { EpsNestjsOrpEffCicliEsec } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import { SortEnum } from "@/services/api/types/sort-type";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import Grid from "@mui/material/Grid2";
import { useMemo, useState } from "react";
import { ChildEpsNestjsOrpEffCicliEsecCardMini } from "../../child-eps-nestjs-orp-eff-cicli-esec-card-mini";
import { useGetEpsNestjsOrpEffCicliEsecQuery } from "../../queries/queries";

type EpsNestjsOrpEffCicliEsecKeys = keyof EpsNestjsOrpEffCicliEsec;

interface Props {
  id: number;
}

function Children({ id }: Props) {
  // FILTERS
  const [{ order, orderBy }] = useState<{
    order: SortEnum;
    orderBy: EpsNestjsOrpEffCicliEsecKeys;
  }>({ order: SortEnum.ASC, orderBy: "id" });

  const [filters] = useState<Array<FilterItem<EpsNestjsOrpEffCicliEsec>>>([
    { columnName: "id", value: id },
  ]);
  const [othersFilters] = useState<Array<OthersFiltersItem>>([]);

  const { data, isFetching, isLoading } = useGetEpsNestjsOrpEffCicliEsecQuery({
    sort: { order, orderBy },
    filters,
    othersFilters,
  });

  const result = useMemo(() => {
    const result =
      (data?.pages.flatMap(
        (page) => page?.data
      ) as EpsNestjsOrpEffCicliEsec[]) ?? ([] as EpsNestjsOrpEffCicliEsec[]);

    return removeDuplicatesFromArrayObjects(result, "id");
  }, [data]);

  return (
    <>
      <Grid
        container
        spacing={1}
        direction="row"
        wrap="nowrap"
        sx={{
          overflowX: "auto",
          flexWrap: "nowrap",
          flexDirection: "row",
          scrollbarWidth: "auto",
        }}
      >
        {result.map((item) => (
          <ChildEpsNestjsOrpEffCicliEsecCardMini
            key={item.id}
            epsNestjsOrpEffCicliEsec={item}
            onDelete={() => {}}
            renderOrdCliTrasDialog={() => null}
          />
        ))}
      </Grid>
      <FullPageLoader isLoading={isLoading || isFetching} />
    </>
  );
}

export default Children;
