import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputAdornment,
  Typography
} from "@mui/material";
import { EVENT_REGIONS, PLATFORMS } from "@/src/config/global";
import { ExpandMore, Search } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";

import CustomButton from "@/src/components/button/CustomButton";
import { GAMES } from "@/src/config/global";
import MatchItem from "@/src/components/widgets/rogue-social/MatchItem";
import SearchBox from "@/src/components/input/SearchBox";
import dayjs from "dayjs";
import { useAppContext } from "@/src/context/app";
import { useAuthContext } from "@/src/context/AuthContext";
import { useRouter } from "next/router";
import { useTournamentContext } from "@/src/context/TournamentContext";

const RightSidebar = ({ sx }) => {
  const router = useRouter();
  const { setTitle } = useAppContext();
  const { user } = useAuthContext();
  const { team, match, currentTime, setCurrentTime } = useTournamentContext();
  const [search, setSearch] = useState("");

  const onViewAllClick = (e) => {
    router.push("/rogue-social/matches");
  };

  const upcomingMatches = useMemo(() => {
    if (match?.matches) {
      const res = match.matches.filter(
        (item) => dayjs(item.start).isAfter(currentTime) && item.participants?.length === 2
        // isMyMatch(item, team.teams, user.id)
      );
      return res;
    }
    return [];
  }, [match?.matches, currentTime, team?.teams]);

  const onSearchChange = (e, newValue) => {
    setSearch(newValue);
  };

  return (
    <Box
      sx={{
        width: "400px",
        display: "flex",
        alignItems: "left",
        gap: 1,
        flexDirection: "column",
        ...sx
      }}
    >
      <Box className="search-box">
        <SearchBox
          id="search"
          name="search"
          placeholder="Search"
          value={search}
          onChange={onSearchChange}
          sx={{
            height: "40px"
          }}
          options={totalPlayers}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "left",
          gap: 1,
          flexDirection: "column"
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "left",
            gap: 0,
            flexDirection: "column",
            border: "solid 1px rgba(245,131,31,.6)",
            borderRadius: "5px"
          }}
        >
          {upcomingMatches.length < 4
            ? upcomingMatches.map((item) => (
                <MatchItem
                  key={"match_" + item.id}
                  item={item}
                  sx={{ border: "none", borderRadius: "none" }}
                />
              ))
            : upcomingMatches
                .slice(0, 4)
                .map((item) => (
                  <MatchItem
                    key={"match_" + item.id}
                    item={item}
                    sx={{ border: "none", borderRadius: "none" }}
                  />
                ))}
        </Box>
        {upcomingMatches.length >= 4 && (
          <Box textAlign="right">
            <CustomButton onClick={onViewAllClick}>VIEW ALL</CustomButton>
          </Box>
        )}
        {upcomingMatches.length === 0 && (
          <>
            <Typography variant="body1" color="white" align="center" fontSize={20} marginTop={2}>
              There are no current match-chats available for you.
            </Typography>
            <Button variant="contained" fullWidth sx={{ mt: 2 }}>
              Join an event
            </Button>
          </>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "left",
          gap: 1,
          flexDirection: "column",
          border: "solid 1px rgba(245,131,31,.6)",
          borderRadius: "5px"
        }}
      >
        <Accordion sx={{ background: "none" }}>
          <AccordionSummary expandIcon={<ExpandMore />}>Select Categories</AccordionSummary>
          <AccordionDetails>
            <Box>
              <Typography variant="h6" fontSize={24} fontWeight="bold">
                Game
              </Typography>
              {GAMES.map((item) => (
                <FormControlLabel
                  key={"game_select_" + item.id}
                  control={
                    <Checkbox sx={{ border: "none", borderRadius: "none", color: "white" }} />
                  }
                  label={item.name}
                />
              ))}
            </Box>

            <Box>
              <Typography variant="h6" fontSize={24} fontWeight="bold">
                Platform
              </Typography>
              {PLATFORMS.map((item) => (
                <FormControlLabel
                  key={"platform_select_" + item.id}
                  control={
                    <Checkbox sx={{ border: "none", borderRadius: "none", color: "white" }} />
                  }
                  label={item.name}
                />
              ))}
            </Box>

            <Box>
              <Typography variant="h6" fontSize={24} fontWeight="bold">
                Region
              </Typography>
              {EVENT_REGIONS.map((item) => (
                <FormControlLabel
                  key={"region_select_" + item.id}
                  control={
                    <Checkbox sx={{ border: "none", borderRadius: "none", color: "white" }} />
                  }
                  label={item.name}
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export default RightSidebar;
