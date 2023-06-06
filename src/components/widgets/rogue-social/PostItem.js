import {
  Autorenew,
  BarChart,
  Delete,
  Edit,
  Favorite,
  MoreVert,
  Report,
  Sms
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  ButtonBase,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useTheme
} from "@mui/material";

import Link from "next/link";
import { markdownToHtml } from "@/src/utils/html-markdown";
import { setPost } from "@/src/redux/features/postSlice";
import { useAuthContext } from "@/src/context/AuthContext";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useTournamentContext } from "@/src/context/TournamentContext";

const PostItem = ({ item, onEdit, onDelete, onReport }) => {
  const theme = useTheme();
  const { user } = useAuthContext();
  const { player, post } = useTournamentContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const dispatch = useDispatch();

  const onOpenMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const onCloseMenu = (e) => {
    setAnchorEl(null);
  };

  const onEditPost = (e) => {
    onEdit(item.id);
    onCloseMenu(e);
  };
  const onDeletePost = (e) => {
    onDelete(item.id);
    onCloseMenu(e);
  };
  const onReportPost = (e) => {
    onReport(item.id);
    onCloseMenu(e);
  };

  return (
    <Box
      sx={{
        position: "relative",
        marginInline: "auto",
        width: "100%",
        borderBottom: "solid 1px rgb(255,255,255,0.2)",
        padding: 2,
        zIndex: 0,
        ":hover": {
          backgroundColor: "rgba(255,255,255,0.2)"
        }
      }}
    >
      <Grid container spacing={2}>
        <Grid item>
          <Avatar src={player?.players[item.uid]?.profilePic} sx={{ width: 50, height: 50 }} />
        </Grid>
        <Grid item xs>
          <Box>
            <Typography variant="h5" color="white">
              {player?.players[item.uid]?.userName || player?.players[item.uid]?.name}
            </Typography>
            <Typography style={{ color: "grey" }}>{player?.players[item.uid]?.name}</Typography>
          </Box>
          <div
            className="html-wrapper"
            style={{
              color: "white"
            }}
            dangerouslySetInnerHTML={{
              __html: markdownToHtml(item?.text)
            }}
          ></div>
          <Box sx={{ marginTop: 2, display: "flex", gap: 4, color: "white" }}>
            <ButtonBase onClick={(e) => {}}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: item?.reply ? theme.palette.primary.main : "white"
                }}
              >
                <Sms />
                <Typography variant="body1">{item?.reply}</Typography>
              </Box>
            </ButtonBase>
            <ButtonBase
              onClick={(e) => {
                const temp = item.reshare + 1;
                post.update(item.id, { reshare: temp });
                dispatch(setPost({ id: item.id, data: { reshare: temp } }));
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: item?.reshare ? theme.palette.primary.main : "white"
                }}
              >
                <Autorenew />
                <Typography variant="body1">{item?.reshare}</Typography>
              </Box>
            </ButtonBase>
            <ButtonBase
              onClick={(e) => {
                const temp = item.vote + 1;
                post.update(item.id, { vote: temp });
                dispatch(setPost({ id: item.id, data: { vote: temp } }));
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: item?.vote ? theme.palette.primary.main : "white"
                }}
              >
                <Favorite />
                <Typography variant="body1">{item?.vote}</Typography>
              </Box>
            </ButtonBase>
            <ButtonBase
              onClick={(e) => {
                const temp = item.view + 1;
                post.update(item.id, { view: temp });
                dispatch(setPost({ id: item.id, data: { view: temp } }));
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: item?.view ? theme.palette.primary.main : "white"
                }}
              >
                <BarChart />
                <Typography variant="body1">{item?.view}</Typography>
              </Box>
            </ButtonBase>
          </Box>
        </Grid>
        <Grid item xs="auto">
          <IconButton
            id={item.id + "-more-btn"}
            aria-controls={openMenu ? item.id + "-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu ? "true" : undefined}
            onClick={onOpenMenu}
          >
            <MoreVert />
          </IconButton>
          <Menu
            id={item.id + "_menu"}
            anchorEl={anchorEl}
            open={openMenu}
            onClose={onCloseMenu}
            disableScrollLock={true}
            MenuListProps={{
              "aria-labelledby": item.id + "-more-btn"
            }}
          >
            {item.uid === user.id ? (
              <>
                <MenuItem onClick={onEditPost}>
                  <ListItemIcon>
                    <Edit fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem onClick={onDeletePost}>
                  <ListItemIcon>
                    <Delete fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Delete</ListItemText>
                </MenuItem>
              </>
            ) : (
              <MenuItem onClick={onReportPost}>
                <ListItemIcon>
                  <Report fontSize="small" />
                </ListItemIcon>
                <ListItemText>Report</ListItemText>
              </MenuItem>
            )}
          </Menu>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PostItem;
