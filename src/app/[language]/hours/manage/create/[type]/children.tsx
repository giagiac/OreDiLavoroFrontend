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
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import { useSearchParams } from "next/navigation";

type EpsNestjsOrpEffCicliEsecKeys = keyof EpsNestjsOrpEffCicliEsec;

interface Props {
  id: number;
}

function Children({ id }: Props) {
  const searchParams = useSearchParams();
  const COD_OP = searchParams.get("COD_OP") || "";

  // FILTERS
  const [{ order, orderBy }] = useState<{
    order: SortEnum;
    orderBy: EpsNestjsOrpEffCicliEsecKeys;
  }>({ order: SortEnum.ASC, orderBy: "id" });

  const [filters] = useState<Array<FilterItem<EpsNestjsOrpEffCicliEsec>>>([
    { columnName: "id", value: id },
    { columnName: "COD_OP", value: COD_OP },
  ]);
  const [othersFilters] = useState<Array<OthersFiltersItem>>([]);

  const { data, isFetching, isLoading, isFetched } =
    useGetEpsNestjsOrpEffCicliEsecQuery({
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

  const theme = useTheme();

  return (
    <>
      {/* Gradient overlay, fixed to the right, not scrolling with content */}

      {isFetched && (
        <Grid
          component={Paper}
          elevation={3}
          container
          spacing={1}
          direction="row"
          wrap="nowrap"
          sx={{
            padding: theme.spacing(1),
            overflowX: "auto",
            flexWrap: "nowrap",
            flexDirection: "row",
            scrollbarWidth: "auto",
            position: "relative",
          }}
        >
          {result.map((item) => (
            <ChildEpsNestjsOrpEffCicliEsecCardMini
              key={item.id}
              epsNestjsOrpEffCicliEsec={item}
            />
          ))}
        </Grid>
      )}
      <FullPageLoader isLoading={isLoading || isFetching} />
    </>
  );
}

export default Children;
