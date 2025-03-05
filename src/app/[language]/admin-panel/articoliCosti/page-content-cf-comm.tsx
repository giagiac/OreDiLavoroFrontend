"use client";

import TableComponents from "@/components/table/table-components";
import { Cf } from "@/services/api/types/cf";
import { CfComm } from "@/services/api/types/cfComm";
import { SortEnum } from "@/services/api/types/sort-type";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useTranslation } from "@/services/i18n/client";
import TableBody from "@mui/material/TableBody";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";
import { TableVirtuoso } from "react-virtuoso";
import FormCreateUser from "./create/page-content";
import { useGetCfCommQuery } from "./queries/queries-cf-comm";

type CfCommKeys = keyof CfComm;

export type FilterItem = {
  columnName: CfCommKeys;
  value: string;
};

const TableCellLoadingContainer = styled(TableCell)(() => ({
  padding: 0,
}));

export default function CfCommPage(cf: Cf) {
  const { t: tArticoliCosti } = useTranslation("admin-panel-articoli-costi");

  const { data, isFetchingNextPage } = useGetCfCommQuery({
    sort: { order: SortEnum.ASC, orderBy: "NUM_SEDE" },
    filters: [{ columnName: "COD_CF", value: cf.COD_CF }],
  });

  const result = useMemo(() => {
    const result =
      (data?.pages.flatMap((page) => page?.data) as CfComm[]) ??
      ([] as CfComm[]);

    return removeDuplicatesFromArrayObjects(result, "NUM_SEDE");
  }, [data]);

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3} pt={3}>
        <Grid container spacing={3} size={{ xs: 12 }}>
          <Grid size="grow">
            <Typography variant="h3">{tArticoliCosti("title")}</Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid size={{ xs: 12 }} mb={2}>
        <TableVirtuoso
          style={{ height: 500 }}
          data={result}
          components={TableComponents}
          //endReached={handleScroll}
          // overscan={20}
          useWindowScroll
          // increaseViewportBy={400}
          fixedHeaderContent={() => (
            <>
              <TableRow>
                <TableCell style={{ width: "10%" }} />
                <TableCell style={{ width: "30%" }} />
                <TableCell style={{ width: "30%" }} />
                <TableCell style={{ width: "20%" }} />
              </TableRow>
              {isFetchingNextPage && (
                <TableRow>
                  <TableCellLoadingContainer colSpan={4}>
                    <LinearProgress />
                  </TableCellLoadingContainer>
                </TableRow>
              )}
            </>
          )}
          itemContent={(index, cfComm) => {
            return (
              <TableCell colSpan={4} key={cfComm.COD_CF}>
                <Table style={{ borderCollapse: "separate", border: "none" }}>
                  <TableBody>
                    <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                      <TableCell style={{ width: "10%", textAlign: "right" }}>
                        {cfComm?.NUM_SEDE}
                      </TableCell>
                      <TableCell style={{ width: "30%", textAlign: "left" }}>
                        {cfComm?.DES_SEDE}
                      </TableCell>
                      <TableCell style={{ width: "30%", textAlign: "left" }}>
                        {cfComm?.INDI_SEDE}
                      </TableCell>
                      <TableCell style={{ width: "20%", textAlign: "right" }}>
                        <FormCreateUser {...cfComm} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableCell>
            );
          }}
        />
      </Grid>
    </Container>
  );
}
