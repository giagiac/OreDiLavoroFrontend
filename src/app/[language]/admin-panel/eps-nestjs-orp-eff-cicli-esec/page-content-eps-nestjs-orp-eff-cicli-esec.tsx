"use client";

import { EpsNestjsOrpEffCicliEsec } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec";
import { SortEnum } from "@/services/api/types/sort-type";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import {
  Button,
  Paper,
  TableContainer,
  TableHead,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useMemo } from "react";
import { useGetEpsNestjsOrpEffCicliEsecQuery } from "./queries/queries-eps-nestjs-orp-eff-cicli-esec";
import { Operatori } from "@/services/api/types/operatori";
import Grid from "@mui/material/Grid2";
import RefreshTwoToneIcon from "@mui/icons-material/RefreshTwoTone";

const TableCellLoadingContainer = styled(TableCell)(() => ({
  padding: 0,
}));

interface Props {
  operatore: Operatori;
}

export default function EpsNestjsOrpEffCicliEsecPage({ operatore }: Props) {
  const { data, isFetchingNextPage, refetch } =
    useGetEpsNestjsOrpEffCicliEsecQuery({
      sort: { order: SortEnum.ASC, orderBy: "id" },
      filters: [{ columnName: "COD_OP", value: operatore.COD_OP }],
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
      <Grid container size="auto" wrap="nowrap" justifyContent="flex-end" mb={1}>
        <Grid>
          <Button
            variant="contained"
            onClick={() => {
              //invalidate query
              refetch();
            }}
            sx={{
              minWidth: 0, // Allow button to shrink
              width: 48, // Set width
              height: 48, // Set height to match width for square shape
              marginLeft: 1, // Add some space from the ToggleButtonGroup
              padding: 0, // Remove default padding if needed
            }}
          >
            <RefreshTwoToneIcon />
          </Button>
        </Grid>
      </Grid>
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
            <TableRow>
              <TableCell colSpan={4} align="right">
                <Typography variant="h2">{data?.totale}</Typography>
              </TableCell>
            </TableRow>
            {result.map((epsNestjsOrpEffCicliEsec, index) => {
              return (
                <TableRow key={epsNestjsOrpEffCicliEsec.id}>
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
                            {epsNestjsOrpEffCicliEsec?.id}
                          </TableCell>
                          <TableCell
                            style={{ width: "45%", textAlign: "left" }}
                          >
                            {epsNestjsOrpEffCicliEsec?.TIPO_TRASFERTA}
                          </TableCell>
                          <TableCell
                            style={{ width: "45%", textAlign: "left" }}
                          >
                            {epsNestjsOrpEffCicliEsec?.DOC_RIGA_ID}
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            padding="none"
                            style={{ borderBottom: "none" }}
                          >
                            {/* <FormCreateEdit cfComm={epsNestjsOrpEffCicliEsec} /> */}
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
    </>
  );
}
