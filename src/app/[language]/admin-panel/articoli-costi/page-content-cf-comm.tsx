"use client";

import { Cf } from "@/services/api/types/cf";
import { CfComm } from "@/services/api/types/cfComm";
import { SortEnum } from "@/services/api/types/sort-type";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useMemo } from "react";
import FormCreateEdit from "./create/page-content-cf-comm";
import { useGetCfCommQuery } from "./queries/queries-cf-comm";

const TableCellLoadingContainer = styled(TableCell)(() => ({
  padding: 0,
}));

export default function CfCommPage(cf: Cf) {
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
    <TableContainer component={Paper} elevation={5}>
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
          {result.map((cfComm) => {
            return (
              <TableRow key={cfComm.CF_COMM_ID}>
                <TableCell colSpan={4}>
                  <Table
                    sx={(theme) => ({
                      borderCollapse: "separate",
                      borderBottom: "none",
                      padding: theme.spacing(0),
                    })}
                  >
                    <TableBody>
                      <TableRow sx={{ "& > *": { borderBottom: "none" } }}>
                        <TableCell sx={{ width: "10%", textAlign: "left" }}>
                          {cfComm?.NUM_SEDE}
                        </TableCell>
                        <TableCell sx={{ width: "45%", textAlign: "left" }}>
                          {cfComm?.DES_SEDE}
                        </TableCell>
                        <TableCell sx={{ width: "45%", textAlign: "left" }}>
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
