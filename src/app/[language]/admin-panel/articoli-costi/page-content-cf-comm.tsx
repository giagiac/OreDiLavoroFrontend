"use client";

import { Cf } from "@/services/api/types/cf";
import { CfComm } from "@/services/api/types/cfComm";
import { SortEnum } from "@/services/api/types/sort-type";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import { styled, useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useMemo } from "react";
import FormCreateEdit from "./create/page-content-cf-comm";
import { useGetCfCommQuery } from "./queries/queries-cf-comm";
import Typography from "@mui/material/Typography";

const TableCellLoadingContainer = styled(TableCell)(() => ({
  padding: 0,
}));

export default function CfCommPage(cf: Cf) {
  const theme = useTheme();
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
    <TableContainer sx={{ width: "100%" }}>
      <Table size="small" sx={{ borderBottom: "none", width: "100%" }}>
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
                <TableCell
                  colSpan={4}
                  sx={{ border: "none", padding: theme.spacing(0.5) }}
                >
                  <Paper elevation={0}>
                    <Table
                      style={{
                        borderCollapse: "separate",
                        borderBottom: "none",
                      }}
                    >
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ border: "none" }} colSpan={5}>
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{ color: "text.secondary" }}
                            >
                              {cfComm?.DES_SEDE}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ border: "none" }}>
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{
                                fontFamily: "Monospace, monospace",
                                fontWeight: 700,
                              }}
                            >
                              {cfComm?.NUM_SEDE}
                            </Typography>
                          </TableCell>
                          <TableCell
                            colSpan={4}
                            padding="none"
                            sx={{ border: "none" }}
                          >
                            <FormCreateEdit cfComm={cfComm} />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Paper>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
