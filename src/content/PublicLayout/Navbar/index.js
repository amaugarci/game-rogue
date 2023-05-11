import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Toolbar,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  OutlinedInput,
  Typography,
  FormControl,
  styled,
  useTheme,
} from "@mui/material";
import {
  Search,
  Logout,
  Login,
  Person,
  ArrowRight,
  ArrowRightAlt,
  ArrowRightOutlined,
  ArrowRightSharp,
  ChevronRight,
} from "@mui/icons-material";
import { useAuthContext } from "@/src/context/AuthContext";
import { useRouter } from "next/router";
import NavItem, { StyledMenu } from "@/src/content/PublicLayout/Navbar/NavItem";
import { useAppContext } from "@/src/context/app";

const Navbar = ({ sx }) => {
  const user = useAuthContext();
  const router = useRouter();
  const theme = useTheme();
  const [logoNav, setLogoNav] = useState(true);
  const [search, setSearch] = useState("");
  const [fund, setFund] = useState("");
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(router?.pathname);
  let currentHoverUser = false;

  useEffect(() => {
    if (router?.pathname) {
      const pathname = router.pathname;
      if (pathname === "/") setCurrentPage("home");
      else if (pathname.substring(1, 6) === "event") setCurrentPage("event");
      else if (pathname.substring(1, 6) === "rogue")
        setCurrentPage("rogue-social");
      else if (pathname.substring(1, 13) === "organization")
        setCurrentPage("organization");
      else if (pathname.substring(1, 5) === "tool") setCurrentPage("tool");
    }
  }, [router]);
  const handle = {
    switchLogoNav: (e) => {
      setLogoNav((prev) => !prev);
    },
    changeSearch: (e) => {
      setSearch(e.target.value);
    },
    changeFund: (e) => {
      setFund(e.target.value);
    },
  };

  const handleClickHome = (e) => {
    router.push("/");
  };

  const handleClickUser = (e) => {
    if (user?.user) router.push("/user/" + user.user.id);
  };
  const handleOpenUser = (e) => {
    currentHoverUser = true;
    if (anchorElUser !== e.currentTarget) setAnchorElUser(e.currentTarget);
  };
  const handleCloseUser = (e) => {
    setAnchorElUser(null);
  };
  const handleMouseOverUser = (e) => {
    currentHoverUser = true;
  };
  const handleMouseOutUser = (e) => {
    currentHoverUser = false;
    setTimeout(() => {
      if (currentHoverUser === false) {
        handleCloseUser();
      }
    }, 500);
  };

  const handleClickOrganize = (e) => {
    router.push("/organization");
  };
  const handleClickEvent = (e) => {
    router.push("/event");
  };
  const handleClickRogueSocial = (e) => {
    router.push("/rogue-social");
  };
  const handleClickSupport = (e) => {};
  const handleClickTools = (e) => {};
  const handleClickPlusPlans = (e) => {};

  return (
    <AppBar
      position="sticky"
      sx={{
        height: "73px",
        // backgroundColor: 'rgba(0, 0, 0, 0.2)'
        backgroundColor: "black",
        backgroundImage: "none",
        zIndex: 8000,
        ...sx,
      }}
    >
      <Container maxWidth="xxl" sx={{ borderBottom: "solid 3px #f5831f" }}>
        <Toolbar
          disableGutters
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 4,
              alignItems: "center",
            }}
          >
            <img src="/GR_Letters.png" height={40} />
            <FormControl>
              <OutlinedInput
                id="search"
                name="search"
                placeholder="Search"
                value={search}
                onChange={handle.changeSearch}
                sx={{
                  height: "40px",
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <Search fontSize="large" />
                  </InputAdornment>
                }
              />
            </FormControl>
            <NavItem
              name="HOME"
              active={currentPage === "home"}
              handleClick={handleClickHome}
            />
            <NavItem
              name="Events"
              active={currentPage === "event"}
              handleClick={handleClickEvent}
              isDropdown={true}
              items={[
                // TODO: Event Submenu comes here
                {
                  name: "Upcoming Matches",
                  key: "upcoming-matches",
                  isLink: true,
                  to: "/match/upcoming",
                },
                {
                  name: "Upcoming Events",
                  key: "upcoming-events",
                  isLink: true,
                  to: "/event/upcoming",
                },
                {
                  name: "Ongoing Events",
                  key: "ongoing-events",
                  isLink: true,
                  to: "/event/ongoing",
                },
                {
                  name: "Completed Events",
                  key: "completed-events",
                  isLink: true,
                  to: "/event/completed",
                },
              ]}
            />
            <NavItem
              name="Rogue Social"
              active={currentPage === "rogue-social"}
              handleClick={handleClickRogueSocial}
              isDropdown={true}
              items={[
                {
                  name: "Teams",
                  key: "teams",
                  isLink: true,
                  to: "/team",
                },
                {
                  name: "Scouting",
                  key: "scouting",
                  isLink: true,
                  to: "/team",
                },
              ]}
            />
            <NavItem name="ROGUE TV" handleClick={() => {}} />
            <NavItem name="ARTICLES" handleClick={() => {}} />
            <NavItem name="SHOP" handleClick={() => {}} />
          </Box>
          <Box sx={{ display: "flex", gap: 4 }}>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 4,
                alignItems: "center",
              }}
            >
              <NavItem
                name="Organize"
                active={currentPage === "organization"}
                handleClick={handleClickOrganize}
                isDropdown={true}
                items={[
                  {
                    name: "Create",
                    key: "organization-create",
                    isLink: true,
                    to: "/organization/create",
                  },
                  {
                    name: "Production Settings",
                    key: "production-settings",
                    isLink: true,
                    to: "/",
                  },
                ]}
              />
              {/* <NavItem
                name="Play"
                active={currentPage === "event"}
                handleClick={handleClickTools}
                isDropdown={true}
                items={[
                  {
                    name: "Upcoming Matches",
                    key: "upcoming-matches",
                    isLink: true,
                    to: "/match/upcoming",
                  },
                  {
                    name: "Upcoming Events",
                    key: "upcoming-events",
                    isLink: true,
                    to: "/event/upcoming",
                  },
                  {
                    name: "Ongoing Events",
                    key: "ongoing-events",
                    isLink: true,
                    to: "/event/ongoing",
                  },
                  {
                    name: "Completed Events",
                    key: "completed-events",
                    isLink: true,
                    to: "/event/completed",
                  },
                ]}
              /> */}
              <NavItem
                name="Tools"
                active={currentPage === "tool"}
                handleClick={handleClickTools}
                isDropdown={true}
                items={[
                  {
                    name: "Instant Video",
                    key: "instant-video",
                    isLink: true,
                    to: "/",
                  },
                  {
                    name: "Instant Media",
                    key: "instant-media",
                    isLink: true,
                    to: "/",
                  },
                  {
                    name: "Instant Articles",
                    key: "instant-articles",
                    isLink: true,
                    to: "/",
                  },
                  {
                    name: "Start Production",
                    key: "start-production",
                    isLink: true,
                    to: "/",
                  },
                ]}
              />
              <NavItem
                name="Plus Plans"
                active={currentPage === "plus-plans"}
                handleClick={handleClickPlusPlans}
              />
            </Box>
            {user.user ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <IconButton
                  id="user-button"
                  aria-controls={anchorElUser ? "user-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={Boolean(anchorElUser) ? "true" : undefined}
                  onClick={handleClickUser}
                  onMouseOver={handleOpenUser}
                  // onMouseOut={handleMouseOutUser}
                  sx={{
                    zIndex: 8500,
                    cursor: "pointer",
                  }}
                >
                  <Avatar alt={user.user?.name} src={user.user?.profilePic} />
                  <ChevronRight
                    sx={{
                      color: theme.palette.primary.main,
                      transform: Boolean(anchorElUser) ? "rotate(90deg)" : "",
                      transition: "all 0.2s",
                    }}
                  />
                </IconButton>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IconButton
                  id="user-button"
                  aria-controls={anchorElUser ? "user-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={Boolean(anchorElUser) ? "true" : undefined}
                  onClick={() => router.push("/auth")}
                  onMouseOver={handleOpenUser}
                  // onMouseOut={handleMouseOutUser}
                  sx={{
                    zIndex: 8500,
                    cursor: "pointer",
                  }}
                >
                  <img
                    src="/static/images/Profile_Picture.png"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <ChevronRight
                    sx={{
                      color: theme.palette.primary.main,
                      transform: Boolean(anchorElUser) ? "rotate(90deg)" : "",
                      transition: "all 0.2s",
                    }}
                  />
                </IconButton>
              </Box>
            )}
            {/* Begin User Submenu */}
            {!user.user ? (
              <StyledMenu
                id="user-menu"
                MenuListProps={{
                  "aria-labelledby": "user-button",
                  onMouseLeave: handleCloseUser,
                  onMouseOver: handleMouseOverUser,
                }}
                disablePortal={true}
                disableScrollLock={true}
                keepMounted
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUser}
              >
                <MenuItem onClick={handleCloseUser} key="signup" disableRipple>
                  <Link href={"/auth"}>Sign Up</Link>
                </MenuItem>
                <MenuItem onClick={handleCloseUser} key="login" disableRipple>
                  <Link href={"/auth"}>Log In</Link>
                </MenuItem>
              </StyledMenu>
            ) : (
              <StyledMenu
                id="user-menu"
                MenuListProps={{
                  "aria-labelledby": "user-button",
                  onMouseLeave: handleCloseUser,
                  onMouseOver: handleMouseOverUser,
                }}
                disablePortal={true}
                disableScrollLock={true}
                keepMounted
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUser}
              >
                <MenuItem
                  onClick={handleCloseUser}
                  key="user-profile"
                  disableRipple
                >
                  <Link href={"/user/" + user.user?.id}>PROFILE</Link>
                </MenuItem>
                <MenuItem
                  onClick={handleCloseUser}
                  key="edit-user"
                  disableRipple
                >
                  <Link href={"/user/" + user.user?.id + "/edit"}>EDIT</Link>
                </MenuItem>
                <MenuItem
                  onClick={(e) => {
                    handleCloseUser(e);
                    user.logout();
                  }}
                  key="logout-user"
                  disableRipple
                >
                  LOGOUT
                </MenuItem>
              </StyledMenu>
            )}
            {/* End User Submenu */}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
