"use client";

import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import Link from "@/components/link";
import { useDeleteEpsNestjsOrpEffCicliEsecService } from "@/services/api/services/epsNestjsOrpEffCicliEsec";
import { EpsNestjsOrpEffCicliEsec } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec";
import { FilterItem } from "@/services/api/types/filter";
import { RoleEnum } from "@/services/api/types/role";
import { SortEnum, SortGeneric } from "@/services/api/types/sort-type";
import { User } from "@/services/api/types/user";
import useAuth from "@/services/auth/use-auth";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useTranslation } from "@/services/i18n/client";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Table, TableBody, Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";
import Grid from "@mui/material/Grid2";
import Grow from "@mui/material/Grow";
import LinearProgress from "@mui/material/LinearProgress";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import { styled } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  epsNestjsOrpEffCicliEsecQueryKeys,
  useGetEpsNestjsOrpEffCicliEsecQuery,
} from "./queries/queries";
import { EpsNestjsOrpEffCicliEsecFilterType } from "./user-filter-types";
import AirportShuttleTwoToneIcon from "@mui/icons-material/AirportShuttleTwoTone";
import DomainAddTwoToneIcon from "@mui/icons-material/DomainAddTwoTone";
import FlightTakeoffTwoToneIcon from "@mui/icons-material/FlightTakeoffTwoTone";
import { OrdCliTras } from "@/services/api/types/ord-cli-tras";
import { LinkOrpOrd } from "@/services/api/types/link-orp-ord";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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

function Actions({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const { user: authUser } = useAuth();
  const { confirmDialog } = useConfirmDialog();
  const fetchUserDelete = useDeleteEpsNestjsOrpEffCicliEsecService();
  const queryClient = useQueryClient();
  const anchorRef = useRef<HTMLDivElement>(null);
  const canDelete = user.id !== authUser?.id;
  const { t: tEpsNestjsOrpEffCicliEsec } = useTranslation(
    "admin-panel-epsNestjsOrpEffCicliEsec"
  );

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const handleDelete = async () => {
    const isConfirmed = await confirmDialog({
      title: tEpsNestjsOrpEffCicliEsec(
        "admin-panel-epsNestjsOrpEffCicliEsec:confirm.delete.title"
      ),
      message: tEpsNestjsOrpEffCicliEsec(
        "admin-panel-epsNestjsOrpEffCicliEsec:confirm.delete.message"
      ),
    });

    if (isConfirmed) {
      setOpen(false);

      const searchParams = new URLSearchParams(window.location.search);
      const searchParamsFilter = searchParams.get("filter");
      const searchParamsSort = searchParams.get("sort");

      let filter: EpsNestjsOrpEffCicliEsecFilterType | undefined = undefined;
      let sort: SortGeneric<EpsNestjsOrpEffCicliEsec> | undefined = {
        order: SortEnum.DESC,
        orderBy: "id",
      };

      if (searchParamsFilter) {
        filter = JSON.parse(searchParamsFilter);
      }

      if (searchParamsSort) {
        sort = JSON.parse(searchParamsSort);
      }

      const previousData = queryClient.getQueryData<
        InfiniteData<{ nextPage: number; data: User[] }>
      >(epsNestjsOrpEffCicliEsecQueryKeys.list().sub.by({ sort, filter }).key);

      await queryClient.cancelQueries({
        queryKey: epsNestjsOrpEffCicliEsecQueryKeys.list().key,
      });

      const newData = {
        ...previousData,
        pages: previousData?.pages.map((page) => ({
          ...page,
          data: page?.data.filter((item) => item.id !== user.id),
        })),
      };

      queryClient.setQueryData(
        epsNestjsOrpEffCicliEsecQueryKeys.list().sub.by({ sort, filter }).key,
        newData
      );

      await fetchUserDelete({
        id: user.id,
      });
    }
  };

  const mainButton = (
    <Button
      size="small"
      variant="contained"
      LinkComponent={Link}
      href={`/admin-panel/epsNestjsOrpEffCicliEsec/edit/${user.id}`}
    >
      {tEpsNestjsOrpEffCicliEsec(
        "admin-panel-epsNestjsOrpEffCicliEsec:actions.edit"
      )}
    </Button>
  );

  return (
    <>
      {[!canDelete].every(Boolean) ? (
        mainButton
      ) : (
        <ButtonGroup
          variant="contained"
          ref={anchorRef}
          aria-label="split button"
          size="small"
        >
          {mainButton}

          <Button
            size="small"
            aria-controls={open ? "split-button-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
      )}
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {canDelete && (
                    <MenuItem
                      sx={{
                        bgcolor: "error.main",
                        color: `var(--mui-palette-common-white)`,
                        "&:hover": {
                          bgcolor: "error.light",
                        },
                      }}
                      onClick={handleDelete}
                    >
                      {tEpsNestjsOrpEffCicliEsec(
                        "admin-panel-epsNestjsOrpEffCicliEsec:actions.delete"
                      )}
                    </MenuItem>
                  )}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
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

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetEpsNestjsOrpEffCicliEsecQuery({
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

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3} pt={3}>
        <Grid size={{ xs: 12 }} mb={50}>
          <Table>
            <TableBody>
              {result.map((epsNestjsOrpEffCicliEsec, index) => (
                <TableRow key={epsNestjsOrpEffCicliEsec.id}>
                  <TableCell>{epsNestjsOrpEffCicliEsec.id}</TableCell>
                  <TableCell>
                    {epsNestjsOrpEffCicliEsec.orpEffCicli?.linkOrpOrd?.map(
                      (it) => it.ordCliRighe?.cf.RAG_SOC_CF
                    )}
                  </TableCell>
                  <TableCell>
                    {epsNestjsOrpEffCicliEsec.orpEffCicli?.linkOrpOrd?.map(
                      (it) => it.ordCliRighe?.cf.RAG_SOC_CF
                    )}
                  </TableCell>
                  {epsNestjsOrpEffCicliEsec.orpEffCicli?.linkOrpOrd &&
                    renderOrdCliTrasAccordion(
                      epsNestjsOrpEffCicliEsec.orpEffCicli.linkOrpOrd
                    )}
                  <TableCell>{epsNestjsOrpEffCicliEsec.DOC_RIGA_ID}</TableCell>
                  <TableCell>
                    {epsNestjsOrpEffCicliEsec.TEMPO_OPERATORE?.toString()}
                  </TableCell>
                  <TableCell>
                    {epsNestjsOrpEffCicliEsec.orpEffCicli?.orpEff.DES_PROD}
                  </TableCell>
                </TableRow>
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
        </Grid>
      </Grid>
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

function renderOrdCliTrasAccordion(linkOrpOrd:Array<LinkOrpOrd>) {
  return linkOrpOrd?.map((it, index) => {
    const ordCliTras = it.ordCliRighe?.ordCliTras || {} as OrdCliTras;
    return (
      <Accordion key={index}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{ordCliTras.DES_DEST_MERCE || "No Title"}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            {(Object.keys(ordCliTras) as (keyof OrdCliTras)[]).map((key) => (
              <Typography key={key}>
                <strong>{key}:</strong> {ordCliTras[key]}
              </Typography>
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>
    );
  });
}

export default withPageRequiredAuth(UserHours, { roles: [RoleEnum.ADMIN] });
