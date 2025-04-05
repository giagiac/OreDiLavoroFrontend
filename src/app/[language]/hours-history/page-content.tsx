"use client";

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
import useLanguage from "@/services/i18n/use-language";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
  Typography,
  useTheme,
} from "@mui/material";
import Container from "@mui/material/Container";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/it";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, PropsWithChildren, useMemo, useState } from "react";
import { useGetEpsNestjsOrpEffCicliEsecQuery } from "./queries/queries";
import imageLogo from "../../../../public/emotions.png";
import Image from "next/image";

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
  const [dateSelected, setDateSelected] = useState<Dayjs | null>(
    dayjs().subtract(1, "day")
  );

  const { t } = useTranslation("hours-history");

  const language = useLanguage();

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

  const filter = useMemo(() => {
    const searchParamsFilter = searchParams.get("filter");
    if (searchParamsFilter) {
      return JSON.parse(searchParamsFilter) as Array<
        FilterItem<EpsNestjsOrpEffCicliEsec>
      >;
    }
    return [
      {
        columnName: "DATA_INIZIO",
        value: dateSelected?.format("YYYY-MM-DD") || "",
        id: Math.random(),
      },
    ] as Array<FilterItem<EpsNestjsOrpEffCicliEsec>>;
  }, [searchParams]);

  const { data, isFetchingNextPage, isLoading } =
    useGetEpsNestjsOrpEffCicliEsecQuery({
      filters: filter,
      sort: { order, orderBy },
    });

  const [filters, setFilters] = useState<
    Array<FilterItem<EpsNestjsOrpEffCicliEsec>>
  >(() => {
    const searchParamsFilter = searchParams.get("filter");
    if (searchParamsFilter) {
      return JSON.parse(searchParamsFilter);
    }
    return [];
  });

  const handleRequestFilter = (value: string) => {
    const columnName = "DATA_INIZIO";
    const searchParams = new URLSearchParams(window.location.search);

    let oldFilter: Array<FilterItem<EpsNestjsOrpEffCicliEsec>> = [
      {
        columnName,
        value,
        id: Math.random(),
      },
    ];

    searchParams.set("filter", JSON.stringify(oldFilter));

    setFilters(oldFilter);
    router.push("/hours-history?" + searchParams.toString());
  };

  const result = useMemo(() => {
    const result =
      (data?.pages.flatMap(
        (page) => page?.data
      ) as EpsNestjsOrpEffCicliEsec[]) ?? ([] as EpsNestjsOrpEffCicliEsec[]);

    return removeDuplicatesFromArrayObjects(result, "id");
  }, [data]);

  const { user } = useAuth();

  const theme = useTheme();

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
                  alignItems="center"
                  spacing={2}
                >
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale={language}
                  >
                    <DatePicker
                      label={t("hours-history:formInputs.dateFilter.label")}
                      format="ddd DD MMM YYYY"
                      value={dateSelected}
                      onChange={(newValue) => {
                        setDateSelected(newValue);
                        handleRequestFilter(
                          newValue?.format("YYYY-MM-DD") || ""
                        );
                      }}
                      maxDate={dayjs().subtract(1, "day")} // Imposta maxDate a ieri
                    />
                  </LocalizationProvider>
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
                  <TableCell></TableCell>
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
              Nessuna registrazione effettuata!
            </Typography>
            <Image src={imageLogo} alt="No records image" height={200} />
          </Box>
        </Container>
      )}
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
