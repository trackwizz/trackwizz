import React, { useState, useEffect } from "react";
import { RouteComponentProps, withRouter } from "react-router";

import { IPlaylist, IPlaylistRequest } from "./types";
import PlaylistContainer from "./components/PlaylistContainer";
import { axiosRequest, createHeader } from "../components/Dancers/axiosRequest";
import { getToken } from "../../../utils/auth";
import { Method } from "axios";

const MusicImage = require("./MusicImage.jpg");

const Playlists: React.FC<RouteComponentProps> = () => {
  const [yourPlaylists, setYourPlaylists] = useState<IPlaylist[] | null>(null);
  const [mostPopularPlaylists, setMostPopularPlaylists] = useState<
    IPlaylist[] | null
  >(null);

  // TODO: Fix this when final request is operational
  const [testRequest, setTestRequest] = useState<any>(null);

  useEffect(() => {
    requestPlaylists();

    // TODO: Prepare to delete this
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

  const requestPlaylists = async () => {
    const header = createHeader(getToken());
    const request = {
      header,
      method: "GET" as Method,
      url: "http://localhost:5000/spotify/playlists"
    };
    const response = await axiosRequest(request);

    setTestRequest(response);
  };
  console.log(testRequest);

  return (
    <div className="all-playlists">
      <PlaylistContainer
        title="Your playlists"
        playlists={yourPlaylists || []}
      />
      <div style={{ marginBottom: "5rem" }}>
        <PlaylistContainer
          title="Most popular playlists"
          playlists={mostPopularPlaylists || []}
        />
      </div>
    </div>
  );
};

export default withRouter(Playlists);
