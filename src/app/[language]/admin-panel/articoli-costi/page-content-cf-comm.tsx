"use client";

import TableComponents from "@/components/table/table-components";
import { Cf } from "@/services/api/types/cf";
import { CfComm } from "@/services/api/types/cfComm";
import { SortEnum } from "@/services/api/types/sort-type";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useTranslation } from "@/services/i18n/client";
import Container from "@mui/material/Container";
import LinearProgress from "@mui/material/LinearProgress";
import { styled, useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useMemo } from "react";
import { TableVirtuoso } from "react-virtuoso";
import FormCreateEdit from "./create/page-content-cf-comm";
import { useGetCfCommQuery } from "./queries/queries-cf-comm";
import { Paper, TableContainer, TableHead } from "@mui/material";

type CfCommKeys = keyof CfComm;

const TableCellLoadingContainer = styled(TableCell)(() => ({
  padding: 0,
}));

export default function CfCommPage(cf: Cf) {
  const { t: tArticoliCosti } = useTranslation("admin-panel-articoli-costi");

  const { data, isFetchingNextPage } = useGetCfCommQuery({
    sort: { order: SortEnum.ASC, orderBy: "NUM_SEDE" },
    filters: [{ columnName: "COD_CF", value: cf.COD_CF, id: Math.random() }],
  });

  const result = useMemo(() => {
    const result =
      (data?.pages.flatMap((page) => page?.data) as CfComm[]) ??
      ([] as CfComm[]);

    return removeDuplicatesFromArrayObjects(result, "NUM_SEDE");
  }, [data]);

  const theme = useTheme();

  return (
    <TableContainer component={Paper}>
        <Table size="small">
          {isFetchingNextPage && (
            <TableHead>
              <TableRow>
                <TableCellLoadingContainer colSpan={4}>
                  <LinearProgress />
                </TableCellLoadingContainer>
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {result.map((cfComm, index) => {
              return (
                <TableRow key={cfComm.CF_COMM_ID}>
                  <TableCell colSpan={4}>
                    <Table
                      style={{
                        borderCollapse: "separate",
                        borderBottom: "none",
                        padding: "none",
                      }}
                    >
                      <TableBody>
                        <TableRow sx={{ "& > *": { borderBottom: "none" } }}>
                          <TableCell
                            style={{ width: "10%", textAlign: "left" }}
                          >
                            {cfComm?.NUM_SEDE}
                          </TableCell>
                          <TableCell
                            style={{ width: "45%", textAlign: "left" }}
                          >
                            {cfComm?.DES_SEDE}
                          </TableCell>
                          <TableCell
                            style={{ width: "45%", textAlign: "left" }}
                          >
                            {cfComm?.INDI_SEDE}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            padding="none"
                            style={{ borderBottom: "none" }}
                          >
                            <FormCreateEdit cfComm={cfComm} />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
  );
}
