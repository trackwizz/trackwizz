import React, { useState, useEffect } from "react";
import { RouteComponentProps, withRouter } from "react-router";

import { IPlaylist, IPlaylistRequest } from "./types";
import PlaylistContainer from "./components/PlaylistContainer";

const MusicImage = require("./MusicImage.jpg");

const Playlists: React.FC<RouteComponentProps> = () => {
  const [yourPlaylists, setYourPlaylists] = useState<IPlaylist[] | null>(null);
  const [mostPopularPlaylists, setMostPopularPlaylists] = useState<
    IPlaylist[] | null
  >(null);

  useEffect(() => {
    // TODO: Get user playlists
    // GET https://api.spotify.com/v1/users/{user_id}/playlists
    const yourPlaylistRequest: IPlaylistRequest = {
      data: {
        yourPlaylistsRequest: [
          {
            id: "efuhef",
            name: "This is a playlist",
            image: MusicImage
          },
          {
            id: "efuhefde",
            name: "This is a playlist",
            image: MusicImage
          },
          {
            id: "efuheffef",
            name: "This is a playlist",
            image: MusicImage
          },
          {
            id: "efuhefqwed",
            name: "This is a playlist",
            image: MusicImage
          },
          {
            id: "efuhefasd",
            name: "This is a playlist",
            image: MusicImage
          },
          {
            id: "efuhefsdv",
            name: "This is a playlist",
            image: MusicImage
          }
        ],
        mostPopularPlaylists: [
          {
            id: "efuhefvwdewn",
            name: "This is a playlist",
            image: MusicImage
          }
        ]
      },
      complete: true,
      error: false
    };

    if (
      yourPlaylistRequest.complete === true &&
      yourPlaylistRequest.error === false
    ) {
      setYourPlaylists(yourPlaylistRequest.data.yourPlaylistsRequest);
      setMostPopularPlaylists(yourPlaylistRequest.data.mostPopularPlaylists);
    }
  }, []);

  return (
<<<<<<< HEAD
    <React.Fragment>
=======
    <div className="flex-container column">
>>>>>>> Add selection playlist
      <PlaylistContainer
        title="Your playlists"
        playlists={yourPlaylists || []}
      />
      <PlaylistContainer
        title="Most popular playlists"
        playlists={mostPopularPlaylists || []}
      />
<<<<<<< HEAD
    </React.Fragment>
=======
    </div>
>>>>>>> Add selection playlist
  );
};

export default withRouter(Playlists);
