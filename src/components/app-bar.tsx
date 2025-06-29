"use client";
import Link from "@/components/link";
import ThemeSwitchButton from "@/components/switch-theme-button";
import { RoleEnum } from "@/services/api/types/role";
import { IS_SIGN_UP_ENABLED } from "@/services/auth/config";
import useAuth from "@/services/auth/use-auth";
import useAuthActions from "@/services/auth/use-auth-actions";
import { useTranslation } from "@/services/i18n/client";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useState } from "react";

function ResponsiveAppBar() {
  const { t } = useTranslation("common");
  const { user, isLoaded } = useAuth();
  const { logOut } = useAuthActions();
  const [anchorElementNav, setAnchorElementNav] = useState<null | HTMLElement>(
    null
  );
  const [anchorElementUser, setAnchorElementUser] =
    useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElementNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElementUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElementNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElementUser(null);
  };

  return (
    <Box
      sx={(theme) => ({
        position: "fixed",
        top: 0, // Add some space from the bottom edge
        left: 0,
        width: "100%", // Adjust width to content
        // Apply card-like styling with backdrop effect
        backgroundColor: (theme) => {
          return theme.palette.mode === "dark"
            ? theme.palette.grey[600] + "80" // Semi-transparent dark background
            : theme.palette.grey[300] + "80"; // Semi-transparent light background
          // theme.palette.mode === "dark"
          //   ? "rgba(255, 255, 255, 0.3)" // Semi-transparent dark background
          //   : "rgba(84, 84, 84, 0.3)", // Semi-transparent light background
        },
        backdropFilter: "blur(5px)", // Backdrop blur effect
        borderRadius: (theme) => theme.shape.borderRadius, // Rounded corners like a Card
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        boxShadow: (theme) => theme.shadows[10], // Elevation effect
        zIndex: 1000,
        padding: theme.spacing(0),
      })}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {t("common:app-name")}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElementNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElementNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {!!user?.role &&
                [RoleEnum.ADMIN, RoleEnum.AUTISTA, RoleEnum.USER].includes(
                  Number(user?.role?.id)
                ) && (
                  <MenuItem
                    onClick={handleCloseNavMenu}
                    component={Link}
                    href="/"
                  >
                    <Typography textAlign="center">
                      {t("common:navigation.home")}
                    </Typography>
                  </MenuItem>
                )}
              {!!user?.role &&
                [RoleEnum.BADGE, RoleEnum.ADMIN].includes(
                  Number(user?.role?.id)
                ) && [
                  <MenuItem
                    key="badge"
                    onClick={handleCloseNavMenu}
                    component={Link}
                    href="/hours/manage-badge"
                  >
                    <Typography textAlign="center">{"Badge"}</Typography>
                  </MenuItem>,
                ]}

              {!!user?.role &&
                [RoleEnum.ADMIN].includes(Number(user?.role?.id)) && [
                  <MenuItem
                    key="users"
                    onClick={handleCloseNavMenu}
                    component={Link}
                    href="/admin-panel/users"
                  >
                    <Typography textAlign="center">
                      {t("common:navigation.users")}
                    </Typography>
                  </MenuItem>,
                  <MenuItem
                    key="articoliCosti"
                    onClick={handleCloseNavMenu}
                    component={Link}
                    href="/admin-panel/articoli-costi"
                  >
                    <Typography textAlign="center">
                      {t("common:navigation.articoliCosti")}
                    </Typography>
                  </MenuItem>,
                  <MenuItem
                    key="targaMezzi"
                    onClick={handleCloseNavMenu}
                    component={Link}
                    href="/admin-panel/targa-mezzi"
                  >
                    <Typography textAlign="center">{"Targhe mezzi"}</Typography>
                  </MenuItem>,
                  <MenuItem
                    key="EpsNestjsOrpEffCicli"
                    onClick={handleCloseNavMenu}
                    component={Link}
                    href="/admin-panel/eps-nestjs-orp-eff-cicli-esec"
                  >
                    <Typography textAlign="center">
                      {"Gestione Ore Operatori"}
                    </Typography>
                  </MenuItem>,
                ]}
              {!!user?.role &&
                [
                  // mobile-menu-items
                  // <MenuItem
                  //   key="home"
                  //   onClick={handleCloseNavMenu}
                  //   component={Link}
                  //   href="/home-panel"
                  // >
                  //   <Typography textAlign="center">
                  //     {t("common:navigation.homePanel")}
                  //   </Typography>
                  // </MenuItem>,
                ]}
              {isLoaded &&
                !user && [
                  <Divider key="divider" />,
                  <MenuItem
                    key="sign-in"
                    onClick={handleCloseNavMenu}
                    component={Link}
                    href="/sign-in"
                  >
                    <Typography textAlign="center">
                      {t("common:navigation.signIn")}
                    </Typography>
                  </MenuItem>,
                  IS_SIGN_UP_ENABLED ? (
                    <MenuItem
                      key="sign-up"
                      onClick={handleCloseNavMenu}
                      component={Link}
                      href="/sign-up"
                    >
                      <Typography textAlign="center">
                        {t("common:navigation.signUp")}
                      </Typography>
                    </MenuItem>
                  ) : null,
                ]}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {t("common:app-name")}
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {!!user?.role &&
              [RoleEnum.ADMIN, RoleEnum.AUTISTA, RoleEnum.USER].includes(
                Number(user?.role?.id)
              ) && (
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "inherit", display: "block" }}
                  component={Link}
                  href="/"
                >
                  {t("common:navigation.home")}
                </Button>
              )}
            {!!user?.role &&
              [RoleEnum.BADGE, RoleEnum.ADMIN].includes(
                Number(user?.role?.id)
              ) && (
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "inherit", display: "block" }}
                  component={Link}
                  href="/hours/manage-badge"
                >
                  Badge
                </Button>
              )}
            {!!user?.role &&
              [RoleEnum.ADMIN].includes(Number(user?.role?.id)) && (
                <>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "inherit", display: "block" }}
                    component={Link}
                    href="/admin-panel/users"
                  >
                    {t("common:navigation.users")}
                  </Button>
                  {/* desktop-menu-items */}
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "inherit", display: "block" }}
                    component={Link}
                    href="/admin-panel/articoli-costi"
                  >
                    {t("common:navigation.articoliCosti")}
                  </Button>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "inherit", display: "block" }}
                    component={Link}
                    href="/admin-panel/targa-mezzi"
                  >
                    {"Targhe mezzi"}
                  </Button>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "inherit", display: "block" }}
                    component={Link}
                    href="/admin-panel/eps-nestjs-orp-eff-cicli-esec"
                  >
                    {"Gestione Ore Operatori"}
                  </Button>
                </>
              )}
            {!!user?.role && (
              <>
                {/* desktop-menu-items */}
                {/* <Button
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "inherit", display: "block" }}
                  component={Link}
                  href="/home-panel"
                >
                  {t("common:navigation.homePanel")}
                </Button> */}
              </>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              mr: 1,
            }}
          >
            <ThemeSwitchButton />
          </Box>

          {!isLoaded ? (
            <CircularProgress color="inherit" />
          ) : user ? (
            <>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Profile menu">
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{ p: 0 }}
                    data-testid="profile-menu-item"
                  >
                    <Avatar
                      alt={user?.firstName + " " + user?.lastName}
                      src={user.photo?.path}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: 5.5 }}
                  id="menu-appbar"
                  anchorEl={anchorElementUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElementUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem
                    onClick={handleCloseUserMenu}
                    component={Link}
                    href="/profile"
                    data-testid="user-profile"
                  >
                    <Typography textAlign="center">
                      {t("common:navigation.profile")}
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      logOut();
                      // if (typeof window !== "undefined" && window.history && window.history.pushState) {
                      //   window.history.pushState(null, "", "/");
                      //   window.history.go(-(window.history.length - 1));
                      // }
                      handleCloseUserMenu();
                    }}
                    data-testid="logout-menu-item"
                  >
                    <Typography textAlign="center">
                      {t("common:navigation.logout")}
                    </Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </>
          ) : (
            <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
              <Button
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "inherit", display: "block" }}
                component={Link}
                href="/sign-in"
              >
                {t("common:navigation.signIn")}
              </Button>
              {IS_SIGN_UP_ENABLED && (
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "inherit", display: "block" }}
                  component={Link}
                  href="/sign-up"
                >
                  {t("common:navigation.signUp")}
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>
    </Box>
  );
}
export default ResponsiveAppBar;
