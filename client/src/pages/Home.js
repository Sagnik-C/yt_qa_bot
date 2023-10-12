import React, { useContext, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import YouTube from "react-youtube";
import { Helmet } from "react-helmet";
// contexts
import AppContext from "../contexts/AppContext";
// constants
import { COMPANY } from "../constants/vars";
import { QUERY_ENDPOINT } from "../constants/endpoints";
// mui
import { Box, Container, Grid, Paper, TextField, Typography, Button, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// vars
const opts = {
  height: "390",
  width: "100%",
  playerVars: {
    autoplay: 1,
  },
};

const Home = () => {
  const { user } = useContext(AppContext);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState(null);

  console.log(id);

  const handleQuery = (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      axios
        .post(QUERY_ENDPOINT, { userId: user._id, user_name: user.email, video_link: "https://www.youtube.com/watch?v=" + id, user_query: query })
        .then((res) => {
          setAnswer(res.data.data?.output || "No answer found!");
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="100%">
      <Helmet>
        <title>Home | {COMPANY}</title>
      </Helmet>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper>
            {id ? (
              <YouTube style={{ width: "100%" }} videoId={id} opts={opts} onReady={(event) => event.target.pauseVideo()} />
            ) : (
              <Box sx={{ p: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  No Video Found
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Please provide a video id in the url ...
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        {id ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Stack spacing={2} direction="row">
                <Stack spacing={2} flex={1}>
                  <TextField fullWidth name="query" label="Question" variant="outlined" value={query} onChange={e => setQuery(e.target.value)} />
                  <Stack direction="row" spacing={2}>
                    <Button fullWidth onClick={() => setQuery("")} color="error" variant="contained">
                      Clear
                    </Button>
                    <LoadingButton fullWidth loading={loading} onClick={handleQuery} variant="contained">
                      Ask
                    </LoadingButton>
                  </Stack>
                </Stack>
                <TextField fullWidth multiline sx={{ flex: 1 }} inputProps={{ readOnly: true }} value={answer} rows={4} label="Answer" />
              </Stack>
            </Paper>
          </Grid>
        ) : null}
      </Grid>
    </Container>
  );
};

export default Home;
