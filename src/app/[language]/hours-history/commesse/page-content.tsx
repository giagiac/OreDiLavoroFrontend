"use client";

import Link from "@/components/link";
import TableComponents from "@/components/table/table-components";
import { RoleEnum } from "@/services/api/types/role";
import { SortEnum } from "@/services/api/types/sort-type";
import { User } from "@/services/api/types/user";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useTranslation } from "@/services/i18n/client";
import useLanguage from "@/services/i18n/use-language";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/it";
import { useRouter, useSearchParams } from "next/navigation";
import { PropsWithChildren, useCallback, useMemo, useState } from "react";
import { TableVirtuoso } from "react-virtuoso";
import { useGetUsersQuery } from "./queries/queries";
import UserFilter from "./user-filter";
import { UserFilterType } from "./user-filter-types";

type UsersKeys = keyof User;

const TableCellLoadingContainer = styled(TableCell)(() => ({
  padding: 0,
}));

function TableSortCellWrapper(
  props: PropsWithChildren<{
    width?: number;
    orderBy: UsersKeys;
    order: SortEnum;
    column: UsersKeys;
    handleRequestSort: (
      event: React.MouseEvent<unknown>,
      property: UsersKeys
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

// function Actions({ user }: { user: User }) {
//   const [open, setOpen] = useState(false);
//   const { user: authUser } = useAuth();
//   const { confirmDialog } = useConfirmDialog();
//   const fetchUserDelete = useDeleteUsersService();
//   const queryClient = useQueryClient();
//   const anchorRef = useRef<HTMLDivElement>(null);
//   const canDelete = user.id !== authUser?.id;
//   const { t: tUsers } = useTranslation("admin-panel-users");

//   const handleToggle = () => {
//     setOpen((prevOpen) => !prevOpen);
//   };

//   const handleClose = (event: Event) => {
//     if (
//       anchorRef.current &&
//       anchorRef.current.contains(event.target as HTMLElement)
//     ) {
//       return;
//     }

//     setOpen(false);
//   };

//   const handleDelete = async () => {
//     const isConfirmed = await confirmDialog({
//       title: tUsers("hours-history:confirm.delete.title"),
//       message: tUsers("hours-history:confirm.delete.message"),
//     });

//     if (isConfirmed) {
//       setOpen(false);

//       const searchParams = new URLSearchParams(window.location.search);
//       const searchParamsFilter = searchParams.get("filter");
//       const searchParamsSort = searchParams.get("sort");

//       let filter: UserFilterType | undefined = undefined;
//       let sort: UserSortType | undefined = {
//         order: SortEnum.DESC,
//         orderBy: "id",
//       };

//       if (searchParamsFilter) {
//         filter = JSON.parse(searchParamsFilter);
//       }

//       if (searchParamsSort) {
//         sort = JSON.parse(searchParamsSort);
//       }

//       const previousData = queryClient.getQueryData<
//         InfiniteData<{ nextPage: number; data: User[] }>
//       >(usersQueryKeys.list().sub.by({ sort, filter }).key);

//       await queryClient.cancelQueries({ queryKey: usersQueryKeys.list().key });

//       const newData = {
//         ...previousData,
//         pages: previousData?.pages.map((page) => ({
//           ...page,
//           data: page?.data.filter((item) => item.id !== user.id),
//         })),
//       };

//       queryClient.setQueryData(
//         usersQueryKeys.list().sub.by({ sort, filter }).key,
//         newData
//       );

//       await fetchUserDelete({
//         id: user.id,
//       });
//     }
//   };

//   const mainButton = (
//     <Button
//       size="small"
//       variant="contained"
//       LinkComponent={Link}
//       href={`/admin-panel/users/edit/${user.id}`}
//     >
//       {tUsers("hours-history:actions.edit")}
//     </Button>
//   );

//   return (
//     <>
//       {[!canDelete].every(Boolean) ? (
//         mainButton
//       ) : (
//         <ButtonGroup
//           variant="contained"
//           ref={anchorRef}
//           aria-label="split button"
//           size="small"
//         >
//           {mainButton}

//           <Button
//             size="small"
//             aria-controls={open ? "split-button-menu" : undefined}
//             aria-expanded={open ? "true" : undefined}
//             aria-label="select merge strategy"
//             aria-haspopup="menu"
//             onClick={handleToggle}
//           >
//             <ArrowDropDownIcon />
//           </Button>
//         </ButtonGroup>
//       )}
//       <Popper
//         sx={{
//           zIndex: 1,
//         }}
//         open={open}
//         anchorEl={anchorRef.current}
//         role={undefined}
//         transition
//         disablePortal
//       >
//         {({ TransitionProps, placement }) => (
//           <Grow
//             {...TransitionProps}
//             style={{
//               transformOrigin:
//                 placement === "bottom" ? "center top" : "center bottom",
//             }}
//           >
//             <Paper>
//               <ClickAwayListener onClickAway={handleClose}>
//                 <MenuList id="split-button-menu" autoFocusItem>
//                   {canDelete && (
//                     <MenuItem
//                       sx={{
//                         bgcolor: "error.main",
//                         color: `var(--mui-palette-common-white)`,
//                         "&:hover": {
//                           bgcolor: "error.light",
//                         },
//                       }}
//                       onClick={handleDelete}
//                     >
//                       {tUsers("hours-history:actions.delete")}
//                     </MenuItem>
//                   )}
//                 </MenuList>
//               </ClickAwayListener>
//             </Paper>
//           </Grow>
//         )}
//       </Popper>
//     </>
//   );
// }

function Commesse() {
  const { t: tHoursHistory } = useTranslation("hours-history");
  // const { t: tRoles } = useTranslation("admin-panel-roles");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [{ order, orderBy }, setSort] = useState<{
    order: SortEnum;
    orderBy: UsersKeys;
  }>(() => {
    const searchParamsSort = searchParams.get("sort");
    if (searchParamsSort) {
      return JSON.parse(searchParamsSort);
    }
    return { order: SortEnum.DESC, orderBy: "id" };
  });

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: UsersKeys
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
      return JSON.parse(searchParamsFilter) as UserFilterType;
    }

    return undefined;
  }, [searchParams]);

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetUsersQuery({ filter, sort: { order, orderBy } });

  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const result = useMemo(() => {
    const result =
      (data?.pages.flatMap((page) => page?.data) as User[]) ?? ([] as User[]);

    return removeDuplicatesFromArrayObjects(result, "id");
  }, [data]);

  // Date filter

  const { t } = useTranslation("hours-history");

  const language = useLanguage();

  const [value, setValue] = useState<Dayjs | null>(dayjs());

  return (
    <Container maxWidth="md">
      <Grid
        container
        direction="column"
        sx={{
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          mt: 2,
        }}
      >
        <Grid>
          <Typography variant="body1">
            {t("hours-history:formInputs.dateFilter.title")}
          </Typography>
        </Grid>
        <Grid>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={language}
          >
            <DatePicker
              label={t("hours-history:formInputs.dateFilter.label")}
              format="DD//MM//YYYY"
              value={value}
              onChange={(newValue) => setValue(newValue)}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
      <Grid container spacing={3} pt={3}>
        <Grid container spacing={3} size={{ xs: 12 }}>
          <Grid size="grow">
            <Typography variant="h6">
              {tHoursHistory("hours-history:totale")}
            </Typography>
            <Typography variant="h6">{`1234`}</Typography>
          </Grid>
          <Grid container size="auto" wrap="nowrap" spacing={2}>
            <Grid size="auto">
              <UserFilter />
            </Grid>
            <Grid size="auto">
              <Button
                variant="contained"
                LinkComponent={Link}
                href="/admin-panel/users/create"
                color="success"
              >
                {tHoursHistory("hours-history:actions.create")}
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12 }} mb={2}>
          <TableVirtuoso
            style={{ height: 500 }}
            data={result}
            components={TableComponents}
            endReached={handleScroll}
            overscan={20}
            useWindowScroll
            increaseViewportBy={400}
            fixedHeaderContent={() => (
              <>
                <TableRow>
                  {/* <TableCell style={{ width: 50 }}></TableCell> */}
                  <TableSortCellWrapper
                    width={100}
                    orderBy={orderBy}
                    order={order}
                    column="id"
                    handleRequestSort={handleRequestSort}
                  >
                    {tHoursHistory("hours-history:table.column1")}
                  </TableSortCellWrapper>
                  {/* <TableCell style={{ width: 200 }}>
                    {tHoursHistory("hours-history:table.column2")}
                  </TableCell>
                  <TableSortCellWrapper
                    orderBy={orderBy}
                    order={order}
                    column="email"
                    handleRequestSort={handleRequestSort}
                  >
                    {tHoursHistory("hours-history:table.column3")}
                  </TableSortCellWrapper>

                  <TableCell style={{ width: 80 }}>
                    {tHoursHistory("hours-history:table.column4")}
                  </TableCell>
                  <TableCell style={{ width: 130 }}></TableCell> */}
                </TableRow>
                {isFetchingNextPage && (
                  <TableRow>
                    <TableCellLoadingContainer colSpan={6}>
                      <LinearProgress />
                    </TableCellLoadingContainer>
                  </TableRow>
                )}
              </>
            )}
            itemContent={(index, user) => (
              <>
                <TableCell>
                  <Typography variant="body1">{user?.id}</Typography>
                  <Typography variant="body1">{user?.id}</Typography>
                  <Typography variant="body1">{user?.id}</Typography>
                  <Typography variant="body1">{user?.id}</Typography>
                </TableCell>
                {/* <TableCell style={{ width: 50 }}>
                  <Avatar
                    alt={user?.firstName + " " + user?.lastName}
                    src={user?.photo?.path}
                  />
                </TableCell>
                <TableCell style={{ width: 100 }}>{user?.id}</TableCell>
                <TableCell style={{ width: 200 }}>
                  {user?.firstName} {user?.lastName}
                </TableCell>
                <TableCell>{user?.email}</TableCell>
                <TableCell style={{ width: 80 }}>
                  {tRoles(`role.${user?.role?.id}`)}
                </TableCell>
                <TableCell style={{ width: 130 }}>
                  {!!user && <Actions user={user} />}
                </TableCell> */}
              </>
            )}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default withPageRequiredAuth(Commesse, {
  roles: [RoleEnum.USER, RoleEnum.ADMIN],
});
