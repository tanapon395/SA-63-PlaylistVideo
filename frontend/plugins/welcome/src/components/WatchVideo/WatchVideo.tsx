import React, { FC, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Content, Header, Page, pageTheme } from '@backstage/core';
import SaveIcon from '@material-ui/icons/Save'; // icon save
import {
  Container,
  Grid,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  TextField,
  Avatar,
  Button,
} from '@material-ui/core';
import { DefaultApi } from '../../services/apis'; // Api Gennerate From Command
import { EntUser } from '../../services/models/EntUser'; // import interface User
import { EntVideo } from '../../services/models/EntVideo'; // import interface Video
import { EntResolution } from '../../services/models/EntResolution'; // import interface Resolution
import { EntPlaylist } from '../../services/models/EntPlaylist'; // import interface Playlist

const HeaderCustom = {
  minHeight: '50px',
};

// css style 
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  formControl: {
    width: 300,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    width: 300,
  },
}));

interface watchVideo {
  playlist: number;
  video: number;
  resolution: number;
  added: Date;
  create_by: number;
}

const WatchVideo: FC<{}> = () => {
  const classes = useStyles();
  const http = new DefaultApi();

  const [playlist_video, setPlaylistVideo] = React.useState<Partial<watchVideo>>({});

  const [users, setUsers] = React.useState<EntUser[]>([]);
  const [videos, setVideos] = React.useState<EntVideo[]>([]);
  const [resolutions, setResolutions] = React.useState<EntResolution[]>([]);
  const [playlists, setPlaylists] = React.useState<EntPlaylist[]>([]);

  const getUsers = async () => {
    const res = await http.listUser({ limit: 10, offset: 0 });
    setUsers(res);
  };

  const getPlaylist = async () => {
    const res = await http.listPlaylist({ limit: 10, offset: 0 });
    setPlaylists(res);
  };

  const getVideo = async () => {
    const res = await http.listVideo({ limit: 10, offset: 0 });
    setVideos(res);
  };

  const getResolution = async () => {
    const res = await http.listResolution({ limit: 10, offset: 0 });
    setResolutions(res);
  };

  // Lifecycle Hooks
  useEffect(() => {
    getUsers();
    getVideo();
    getResolution();
    getPlaylist();
  }, []);

  // set data to object playlist_video
  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
  ) => {
    const name = event.target.name as keyof typeof WatchVideo;
    const { value } = event.target;
    setPlaylistVideo({ ...playlist_video, [name]: value });
  };

  // function save data
  function save() {
    console.log(playlist_video)
  }

  return (
    <Page theme={pageTheme.home}>
      <Header style={HeaderCustom} title={`Watch Video`}>
        <Avatar alt="Remy Sharp" src="../../image/account.jpg" />
        <div style={{ marginLeft: 10 }}>Tanapon Kongjaroensuk</div>
      </Header>
      <Content>
        <Container maxWidth="sm">
          <Grid container spacing={3}>
            <Grid item xs={12}></Grid>
            <Grid item xs={3}>
              <div className={classes.paper}>วีดีโอ</div>
            </Grid>
            <Grid item xs={9}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel>เลือกวีดีโอ</InputLabel>
                <Select
                  name="video"
                  value={playlist_video.video || ''}
                  onChange={handleChange}
                >
                  {videos.map(item => {
                    return (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={3}>
              <div className={classes.paper}>เพลย์ลิสต์</div>
            </Grid>
            <Grid item xs={9}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel>เลือกเพลย์ลิสต์</InputLabel>
                <Select
                  name="playlist"
                  value={playlist_video.playlist || ''}
                  onChange={handleChange}
                >
                  {playlists.map(item => {
                    return (
                      <MenuItem key={item.id} value={item.id}>
                        {item.title}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={3}>
              <div className={classes.paper}>ความละเอียด</div>
            </Grid>
            <Grid item xs={9}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel>เลือกความละเอียด</InputLabel>
                <Select
                  name="resolution"
                  value={playlist_video.resolution || ''}
                  onChange={handleChange}
                >
                  {resolutions.map(item => {
                    return (
                      <MenuItem key={item.id} value={item.id}>
                        {item.value}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={3}>
              <div className={classes.paper}>สมาชิกระบบ</div>
            </Grid>
            <Grid item xs={9}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel>เลือกสมาชิกระบบ</InputLabel>
                <Select
                  value={playlist_video.create_by || ''}
                  onChange={handleChange}
                  name="create_by"
                >
                  {users.map(item => {
                    return (
                      <MenuItem key={item.id} value={item.id}>
                        {item.email}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <div className={classes.paper}>เวลา</div>
            </Grid>
            <Grid item xs={9}>
              <form className={classes.container} noValidate>
                <TextField
                  label="เลือกเวลา"
                  name="added"
                  type="datetime-local"
                  value={playlist_video.added}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleChange}
                />
              </form>
            </Grid>

            <Grid item xs={3}></Grid>
            <Grid item xs={9}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<SaveIcon />}
                onClick={save}
              >
                บันทึกการดู
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Content>
    </Page>
  );
};

export default WatchVideo;
