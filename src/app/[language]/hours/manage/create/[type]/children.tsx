"use client";

import { EpsNestjsOrpEffCicliEsec } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec";
import { SortEnum } from "@/services/api/types/sort-type";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { ChildEpsNestjsOrpEffCicliEsecCardMini } from "../../child-eps-nestjs-orp-eff-cicli-esec-card-mini";
import { useGetEpsNestjsOrpEffCicliEsecQuery } from "../../queries/queries";

interface Props {
  id: number;
  COD_OP: string;
  DATA_INIZIO: string;
}

function Children({ id, COD_OP, DATA_INIZIO }: Props) {
  // const searchParams = useSearchParams();
  // const COD_OP = searchParams.get("COD_OP") || "";
  // const ID = searchParams.get("ID") || "";

  const { data } = useGetEpsNestjsOrpEffCicliEsecQuery({
    sort: { order: SortEnum.ASC, orderBy: "id" },
    filters: [
      { columnName: "id", value: id },
      { columnName: "COD_OP", value: COD_OP },
      { columnName: "DATA_INIZIO", value: DATA_INIZIO },
    ],
    othersFilters: [],
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
    <Grid
      component={Paper}
      elevation={3}
      container
      spacing={1}
      mt={1}
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
  );
}

export default Children;
