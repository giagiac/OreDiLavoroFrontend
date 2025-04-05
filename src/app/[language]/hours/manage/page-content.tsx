"use client";

import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import { useSnackbar } from "@/hooks/use-snackbar";
import { useDeleteEpsNestjsOrpEffCicliEsecService } from "@/services/api/services/eps-nestjs-orp-eff-cicli-esec";
import { EpsNestjsOrpEffCicliEsec } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec";
import { FilterItem } from "@/services/api/types/filter";
import { LinkOrpOrd } from "@/services/api/types/link-orp-ord";
import { OrdCliTras } from "@/services/api/types/ord-cli-tras";
import { RoleEnum } from "@/services/api/types/role";
import { SortEnum } from "@/services/api/types/sort-type";
import useAuth from "@/services/auth/use-auth";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useTranslation } from "@/services/i18n/client";
import { DeleteForeverTwoTone } from "@mui/icons-material";
import AirportShuttleTwoToneIcon from "@mui/icons-material/AirportShuttleTwoTone";
import DomainAddTwoToneIcon from "@mui/icons-material/DomainAddTwoTone";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FlightTakeoffTwoToneIcon from "@mui/icons-material/FlightTakeoffTwoTone";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Fragment,
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useGetEpsNestjsOrpEffCicliEsecQuery } from "./queries/queries";
import imageLogo from "../../../../../public/emotions.png";

type EpsNestjsOrpEffCicliEsecKeys = keyof EpsNestjsOrpEffCicliEsec;

const TableCellLoadingContainer = styled(TableCell)(() => ({
  padding: 0,
}));

function TableSortCellWrapper(
  props: PropsWithChildren<{
    width?: number;
    orderBy: EpsNestjsOrpEffCicliEsecKeys;
    order: SortEnum;
    column: EpsNestjsOrpEffCicliEsecKeys;
    handleRequestSort: (
      event: React.MouseEvent<unknown>,
      property: EpsNestjsOrpEffCicliEsecKeys
    ) => void;
  }>
) {
  return (
    <TableCell
      style={{ width: props.width }}
      sortDirection={props.orderBy === props.column ? props.order : false}
    >
      <TableSortLabel
        active={props.orderBy === props.column}
        direction={props.orderBy === props.column ? props.order : SortEnum.ASC}
        onClick={(event) => props.handleRequestSort(event, props.column)}
      >
        {props.children}
      </TableSortLabel>
    </TableCell>
  );
}

function UserHours() {
  const { t: tEpsNestjsOrpEffCicliEsec } = useTranslation(
    "admin-panel-epsNestjsOrpEffCicliEsec"
  );
  const { t: tRoles } = useTranslation("admin-panel-roles");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [{ order, orderBy }, setSort] = useState<{
    order: SortEnum;
    orderBy: EpsNestjsOrpEffCicliEsecKeys;
  }>(() => {
    const searchParamsSort = searchParams.get("sort");
    if (searchParamsSort) {
      return JSON.parse(searchParamsSort);
    }
    return { order: SortEnum.DESC, orderBy: "id" };
  });

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: EpsNestjsOrpEffCicliEsecKeys
  ) => {
    const isAsc = orderBy === property && order === SortEnum.ASC;
    const searchParams = new URLSearchParams(window.location.search);
    const newOrder = isAsc ? SortEnum.DESC : SortEnum.ASC;
    const newOrderBy = property;
    searchParams.set(
      "sort",
      JSON.stringify({ order: newOrder, orderBy: newOrderBy })
    );
    setSort({
      order: newOrder,
      orderBy: newOrderBy,
    });
    router.push(window.location.pathname + "?" + searchParams.toString());
  };

  const filter = useMemo(() => {
    const searchParamsFilter = searchParams.get("filter");
    if (searchParamsFilter) {
      return JSON.parse(searchParamsFilter) as Array<
        FilterItem<EpsNestjsOrpEffCicliEsec>
      >;
    }

    return undefined;
  }, [searchParams]);

  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
    refetch,
  } = useGetEpsNestjsOrpEffCicliEsecQuery({
    filters: filter,
    sort: { order, orderBy },
  });

  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const result = useMemo(() => {
    const result =
      (data?.pages.flatMap(
        (page) => page?.data
      ) as EpsNestjsOrpEffCicliEsec[]) ?? ([] as EpsNestjsOrpEffCicliEsec[]);

    return removeDuplicatesFromArrayObjects(result, "id");
  }, [data]);

  const { user } = useAuth();

  const theme = useTheme();

  const { enqueueSnackbar } = useSnackbar();
  const { confirmDialog } = useConfirmDialog();
  const fetchEpsNestjsOrpEffCicliEsecDelete =
    useDeleteEpsNestjsOrpEffCicliEsecService();

  const onDelete = async (id: string) => {
    const isConfirmed = await confirmDialog({
      title: "Ore commessa",
      message: "Vuoi confermare la cancellazione?",
    });

    if (isConfirmed) {
      await fetchEpsNestjsOrpEffCicliEsecDelete({
        id,
      });
      enqueueSnackbar("Ore commessa eliminate!", {
        variant: "success",
      });
      refetch();
    }
  };

  return (
    <Container maxWidth="xl">
      <TableContainer
        component={Paper}
        style={{ marginTop: 20, marginBottom: 200 }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={4}>
                <Stack
                  textAlign="center"
                  direction="row"
                  justifyContent="center"
                  alignItems="baseline"
                  spacing={2}
                >
                  <Typography variant="h6">
                    <em>{data?.targetDateInizio}</em>
                  </Typography>
                  <Typography variant="h2">{data?.totale}</Typography>
                </Stack>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.map((epsNestjsOrpEffCicliEsec) => (
              <Fragment key={epsNestjsOrpEffCicliEsec?.id}>
                <TableRow
                  sx={{ "& td": { border: 0 } }}
                  style={{
                    backgroundColor:
                      epsNestjsOrpEffCicliEsec?.id != undefined &&
                      parseFloat(epsNestjsOrpEffCicliEsec?.id) % 2 == 0
                        ? theme.palette.divider
                        : theme.palette.background.paper,
                    width: "100%",
                  }}
                >
                  <TableCell style={{ width: 200 }}>
                    <Button
                      onClick={() => {
                        onDelete(epsNestjsOrpEffCicliEsec?.id);
                      }}
                      variant="contained"
                      endIcon={<DeleteForeverTwoTone />}
                    >
                      {epsNestjsOrpEffCicliEsec?.id}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      {epsNestjsOrpEffCicliEsec?.orpEffCicli?.linkOrpOrd?.map(
                        (it) => it.ordCliRighe?.cf.RAG_SOC_CF
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell style={{ width: 200 }}>
                    {epsNestjsOrpEffCicliEsec?.orpEffCicli?.linkOrpOrd &&
                      renderOrdCliTrasAccordion(
                        epsNestjsOrpEffCicliEsec?.orpEffCicli.linkOrpOrd
                      )}
                  </TableCell>
                </TableRow>
                <TableRow
                  style={{
                    backgroundColor:
                      Number(epsNestjsOrpEffCicliEsec?.id) % 2 == 0
                        ? theme.palette.divider
                        : theme.palette.background.paper,
                  }}
                >
                  <TableCell>{epsNestjsOrpEffCicliEsec?.DOC_RIGA_ID}</TableCell>
                  <TableCell>
                    {epsNestjsOrpEffCicliEsec?.orpEffCicli?.orpEff.DES_PROD}
                  </TableCell>
                  <TableCell>
                    <Typography variant="h4" textAlign={"right"}>
                      {epsNestjsOrpEffCicliEsec?.TEMPO_OPERATORE_SESSANTESIMI?.toString()}
                    </Typography>
                  </TableCell>
                </TableRow>
              </Fragment>
            ))}
            {isFetchingNextPage && (
              <TableRow>
                <TableCellLoadingContainer colSpan={6}>
                  <LinearProgress />
                </TableCellLoadingContainer>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {result.length == 0 && isLoading == false && (
        <Container maxWidth="sm">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="30vh"
            textAlign="center"
          >
            <Typography variant="h2">
              Nessuna registrazione effettuata!</Typography>
            <Image
              src={imageLogo}
              alt="No records image"
              height={200}
            />
          </Box>
        </Container>
      )}
      {[RoleEnum.AUTISTA, RoleEnum.ADMIN].includes(
        user?.role?.id as RoleEnum
      ) && (
        <Fab
          color="info"
          aria-label="add"
          style={{
            position: "fixed",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
          }}
          onClick={() => router.push("/hours/manage/step1_KmAutista")}
        >
          <Tooltip title="Km Autista" arrow open>
            <AirportShuttleTwoToneIcon />
          </Tooltip>
        </Fab>
      )}
      <Fab
        color="primary"
        aria-label="add"
        style={{
          position: "fixed",
          bottom: 16,
          right: 10,
          transform: "translateX(-50%)",
        }}
        onClick={() => router.push("/hours/manage/step1_FuoriSede")}
      >
        <Tooltip title="Fuori sede" arrow open>
          <FlightTakeoffTwoToneIcon />
        </Tooltip>
      </Fab>
      <Fab
        color="secondary"
        aria-label="add"
        style={{
          position: "fixed",
          bottom: 16,
          right: 100,
          transform: "translateX(-50%)",
        }}
        onClick={() => router.push("/hours/manage/create/in_sede")}
      >
        <Tooltip title="In sede" arrow open>
          <DomainAddTwoToneIcon />
        </Tooltip>
      </Fab>
    </Container>
  );
}

function renderOrdCliTrasAccordion(linkOrpOrd: Array<LinkOrpOrd>) {
  return linkOrpOrd?.map((it, index) => {
    const ordCliTras = it.ordCliRighe?.ordCliTras || ({} as OrdCliTras);
    return (
      <Accordion key={index} variant="elevation" style={{ margin: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color="primary">
            {ordCliTras.NUM_DEST} · {ordCliTras.DES_DEST_MERCE || "No Title"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Table size="small">
            <TableBody>
              {(Object.keys(ordCliTras) as (keyof OrdCliTras)[]).map((key) => {
                const value = ordCliTras[key];
                if (
                  value == null ||
                  key === "DES_DEST_MERCE" ||
                  key === "NUM_DEST"
                )
                  return null;
                return (
                  <TableRow key={key}>
                    <TableCell align="left">
                      <Typography variant="caption">{key}</Typography>
                    </TableCell>
                    <TableCell align="left" style={{ width: 300 }}>
                      <Typography variant="subtitle2">{value}</Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </AccordionDetails>
      </Accordion>
    );
  });
}

export default withPageRequiredAuth(UserHours, {
  roles: [RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.AUTISTA],
});
