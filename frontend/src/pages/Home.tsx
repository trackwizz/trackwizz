import React, {useEffect, useState} from "react";
import axios from "axios";
import {Redirect} from "react-router";
import {CookieKey, isTokenValid} from "../utils/auth";
import Cookies from 'universal-cookie';

const cookies = new Cookies();


const Home: React.FC = () => {
  const [track, setTrack] = useState(null);

  useEffect( () => {
    (async () => {
      if (isTokenValid()) {
        const res = await axios.get(`https://api.spotify.com/v1/search?q=acdc&type=track&market=FR`, {
          headers: { Authorization: `Bearer ${cookies.get(CookieKey.ACCESS_TOKEN)}`}
        });
        setTrack(res.data.tracks.items[1].uri);
      }
    })();
  });

  if (!isTokenValid()) {
    return <Redirect to="/login" />
  }

  return (
    <div>
      <h1>Home!</h1>
      <p>Track uri: {track}</p>
    </div>
  );
};

export default Home;
