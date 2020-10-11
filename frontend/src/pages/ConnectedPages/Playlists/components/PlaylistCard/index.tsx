import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { IPlaylist } from "../../types";
import "./playlistCard.css";
import { axiosRequest } from "../../../components/axiosRequest";
import { Method } from "axios";
import { IRoom } from "../../../components/types";

interface IProps {
  playlist: IPlaylist;
  numberSongsTen: number;
  numberSongsUnit: number;
}

type IPlaylistCardProp = IProps & RouteComponentProps;

const PlaylistCard: React.FC<IPlaylistCardProp> = ({
  playlist,
  history,
  numberSongsTen,
  numberSongsUnit,
}: IPlaylistCardProp): JSX.Element => {
  const handleRedirection = async (): Promise<void> => {
    const requestNewRoom = {
      data: {
        idSpotifyPlaylist: playlist.id,
        numberSongs: numberSongsTen*10+numberSongsUnit, 
      },
      method: "POST" as Method,
      url: "/games"
    };
    const responseNewRoom = await axiosRequest(requestNewRoom);

    if (responseNewRoom.complete && !responseNewRoom.error) {
      const room = responseNewRoom.data as IRoom;
      history.push(`/waitingRoom?roomId=${room.id}`);
    }

    return;
  };

  return (
    <div
      className="playlistCard"
      style={{
        backgroundImage: `url(${playlist.image})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
      }}
      onClick={handleRedirection}
    >
      <h3 className="playlistTitle">{playlist.name}</h3>
    </div>
  );
};

export default withRouter(PlaylistCard);
