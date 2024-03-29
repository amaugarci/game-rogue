import { Box, Button, Tab, Typography, styled, useTheme } from "@mui/material";
import { EVENT_REGIONS, GAMES, PLATFORMS } from "@/src/config/global";
import { LoadingButton, TabContext, TabList, TabPanel } from "@mui/lab";
import { createPost, readPost } from "@/src/redux/features/postSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";

import DropdownMenu from "@/src/components/DropdownMenu";
import PostList from "@/src/components/widgets/rogue-social/PostList";
import RichTextInput from "@/src/components/input/RichTextInput";
import RightSidebar from "@/src/components/widgets/rogue-social/RightSidebar";
import { htmlToMarkdown } from "@/src/utils/html-markdown";
import { nanoid } from "nanoid";
import { setPost } from "@/src/redux/features/postSlice";
import { useAuthContext } from "@/src/context/AuthContext";
import { useTournamentContext } from "@/src/context/TournamentContext";

const StyledTabList = styled(TabList)(({ theme }) => ({
  ".MuiTabs-flexContainer": {
    width: "100%",
    display: "flex",
    justifyContent: "center"
  },
  ".MuiTab-root": {
    flexGrow: 1
  }
}));

const Home = () => {
  const { user } = useAuthContext();
  const theme = useTheme();
  const dispatch = useDispatch();
  const post = useSelector((state) => state.post);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const { post: postController } = useTournamentContext();
  const [tab, setTab] = useState("1");
  const [game, setGame] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [region, setRegion] = useState(null);

  const onTabChange = (e, newTab) => {
    setTab(newTab);
  };

  const onContentChange = (newContent) => {
    setContent(newContent);
  };

  const onPost = async (e) => {
    setSaving(true);
    const res = await postController.create({
      uid: user.id,
      // title: user.userName,
      text: htmlToMarkdown(content),
      reply: 0,
      reshare: 0,
      vote: 0,
      view: 0,
      replies: [],
      reshares: [],
      votes: [],
      views: [],
      createdAt: new Date(),
      deleted: false
    });
    if (res.code === "succeed") {
      dispatch(setPost(res.data));
    }
    setSaving(false);
  };

  useEffect(() => {
    dispatch(readPost());
  }, []);

  const onGameChange = (newGame) => {
    setGame(newGame);
  };
  
  const onPlatformChange = (newPlatform) => {
    setPlatform(newPlatform);
  };

  const onRegionChange = (newRegion) => {
    setRegion(newRegion);
  };

  const filteredPosts = useMemo(() => {
    if (postController?.posts) {
      let posts = postController.posts;
      if (game) {
        posts = _.filter(posts, (val) => val.game == game.value);
      }
      if (region) {
        posts = _.filter(posts, (val) => val.region == region.value);
      }
      if (platform) {
        posts = _.filter(posts, (val) => val.platform == platform.value);
      }
      return posts;
    }
    return [];
  }, [game, region, platform, postController?.posts]);
  
  return (
    <Box sx={{ width: "100%", display: "flex" }}>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h4" color="white">
            Home
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <DropdownMenu
              name="game"
              title={game ? game.name : "Change Game"}
              items={GAMES}
              onChange={onGameChange}
            />
            <DropdownMenu
              name="region"
              title={region ? region.name : "Change Region"}
              items={EVENT_REGIONS}
              onChange={onRegionChange}
            />
            <DropdownMenu
              name="platform"
              title={platform ? platform.name : "Change Platform"}
              items={PLATFORMS}
              onChange={onPlatformChange}
            />
          </Box>
        </Box>
        <TabContext value={tab}>
          <StyledTabList
            onChange={onTabChange}
            aria-label="Tab List"
            className="rogue-social-home-tabs"
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Tab label="Recommended" value="1" />
            <Tab label="Following" value="2" />
          </StyledTabList>
          <Box
            sx={{
              position: "relative",
              px: 0,
              py: 2
            }}
          >
            <div className="tweet-container">
              <RichTextInput
                content={content}
                className="tweet-textedit"
                placeholder="What's new?"
                handleContentChange={onContentChange}
              />
              <Box
                sx={{
                  position: "absolute",
                  right: "16px",
                  bottom: "10px"
                }}
              >
                <LoadingButton
                  loading={saving}
                  variant="contained"
                  sx={{ borderRadius: 20, height: 40, color: "white" }}
                  onClick={onPost}
                >
                  Post
                </LoadingButton>
              </Box>
            </div>
            {/* <TextField
            variant="outlined"
            placeholder="What's happening?"
            multiline={true}
            rows={5}
            sx={{
              width: "100%",
              ".MuiOutlinedInput-notchedOutline": {
                border: "none"
              }
            }}
            InputProps={{
              sx: {
                resize: "block",
                alignItems: "baseline",
                width: "100%"
              }
            }}
          /> */}
          </Box>
          <TabPanel value="1" sx={{ p: 0 }}>
            <PostList posts={filteredPosts} loading={post.status === "loading"} />
          </TabPanel>
          <TabPanel value="2"></TabPanel>
        </TabContext>
      </Box>
      <Box
        sx={{
          borderLeft: "solid 1px rgba(255,255,255,.2)",
          p: 1
        }}
      >
        <RightSidebar />
      </Box>

      {/* <Box mt={5}>
        <Typography variant="h4" color="white">
          Home
        </Typography>
        <Typography
          variant="h3"
          textAlign="center"
          textTransform="uppercase"
          marginTop="30px"
          color="white"
        >
          WELCOME TO <span style={{ color: theme.palette.primary.main }}>ROGUE SOCIAL!</span>
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          fontSize="24px"
          marginTop="20px"
          color="white"
        >
          Expore the world of esports with no limits. Create account, follow friends, join a team,
          or search for the perfect event all in one place! Join the game now!
        </Typography>
      </Box> */}
    </Box>
  );
};

export default Home;
