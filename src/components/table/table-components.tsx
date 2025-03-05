import Paper from "@mui/material/Paper";
import Table, { TableProps } from "@mui/material/Table";
import TableBody, { TableBodyProps } from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { forwardRef } from "react";
import { TableComponents as TableComponentsType } from "react-virtuoso";

const TableComponents = {
  Scroller: forwardRef<HTMLDivElement>(function Scroller(props, ref) {
    return <TableContainer component={Paper} {...props} ref={ref} />;
  }),
  Table: (props: TableProps) => (
    <Table stickyHeader {...props} style={{ borderCollapse: "separate" }} />
  ),
  TableHead: TableHead as unknown as TableComponentsType["TableHead"],
  TableFoot: TableFooter as unknown as TableComponentsType["TableFoot"],
  TableRow: TableRow,
  TableBody: forwardRef<HTMLTableSectionElement, TableBodyProps>(
    function BodyTable(props, ref) {
      return <TableBody {...props} ref={ref} />;
    }
  ),
};

export default TableComponents;
