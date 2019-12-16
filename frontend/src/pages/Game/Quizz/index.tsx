import React, { useEffect, useState } from "react";
import dancers from "../../../utils/dancers";
import axios from "axios";
import "./quizz.css";
import { CookieKey, isTokenValid } from "../../../utils/auth";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const Quizz: React.FC<{ choices: string[] }> = ({ choices }) => {
  const [dancer] = useState<string>(
    dancers[Math.floor(Math.random() * dancers.length)]
  );
  const [track, setTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  useEffect(() => {
    (async (): Promise<void> => {
      if (isTokenValid()) {
        const res = await axios.get(
          "https://api.spotify.com/v1/search?q=muse&type=track&market=FR",
          {
            headers: {
              Authorization: `Bearer ${cookies.get(CookieKey.ACCESS_TOKEN)}`
            }
          }
        );
        console.log(res.data.tracks.items[2]);
        setTrack(res.data.tracks.items[2].preview_url);
      }
    })();
  }, []);

  const onPlayClicked = (): void => {
    (document.getElementById("player") as HTMLAudioElement).play();
  };
  const onPausedClicked = (): void => {
    (document.getElementById("player") as HTMLAudioElement).pause();
  };

  const onButtonClick = (): void => {
    if (isPlaying) {
      onPausedClicked();
    } else {
      onPlayClicked();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex-container column">
      <div className="text-center">
        <h2 className="fancy-text">Which song is currently playing?</h2>
        <img
          height="180px"
          src={dancer}
          alt="dancer"
          className={isPlaying ? "" : "hidden"}
        />
      </div>
      <button
        className="play-button"
        onClick={onButtonClick}
        style={{
          margin: "0 0 0.5rem",
          padding: isPlaying ? "0" : "0 0 0 0.4rem"
        }}
      >
        {isPlaying ? "❙❙" : "►"}
      </button>
      <div className="grid-container">
        <div>
          <div className="grid">
            {choices.map((c, index) => (
              <button key={index}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      <div>
        {track && (
          <audio id="player" autoPlay={true} data-vscid="obacc5arn">
            <source src={track} type="audio/mpeg" />
          </audio>
        )}
      </div>
    </div>
  );
};

export default Quizz;
