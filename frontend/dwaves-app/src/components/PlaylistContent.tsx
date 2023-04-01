import "styles/ContentAlbum.scss";
import { Icon } from "components/shared";
import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { SongList } from "./SongList";
import { AlbumDetail, responseRequest } from "../models";

interface Props {
  setCurrentSong: React.Dispatch<React.SetStateAction<any>>;
  setSongs: React.Dispatch<React.SetStateAction<any>>;
  audioElmt: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setArtist: React.Dispatch<React.SetStateAction<AlbumDetail | undefined>>;
  setAlert: React.Dispatch<React.SetStateAction<responseRequest | undefined>>;
  likedMusics: string[];
  likeOrDislikeMusic: (music: string) => void;
}

export const PlaylistContent: React.FC<Props> = ({
  setCurrentSong,
  setSongs,
  audioElmt,
  isPlaying,
  setIsPlaying,
  setArtist,
  setAlert,
  likedMusics,
  likeOrDislikeMusic,
}) => {
  const { id } = useParams();

  const [playlist, setPlaylist] = useState<any>();
  const [isLikedMusicsPlaylist, setIsLikedMusicsPlaylist] =
    useState<boolean>(false);

  const getPlaylistDetails = async (id: string) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACK_URL}/playlists/${id}`,
        {
          withCredentials: true,
        }
      );

      const resPlaylist = res.data;
      const coverUrl = `${import.meta.env.VITE_PINATA_GATEWAY_HOST}/${
        res.data.coverCID
      }`;
      const thePlaylist = { ...resPlaylist, cover: coverUrl, playlistId: id };
      console.log(thePlaylist);
      setPlaylist(thePlaylist);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMusicToThePlaylist = async (musicSrc: string) => {
    let musicsCid: string[] | undefined = [];
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACK_URL}/playlists/${playlist.id}`,
        {
          withCredentials: true,
        }
      );

      res.data.musics.forEach((music: any) => {
        const musicUrl = music.src.split("/");
        musicsCid!.push(musicUrl[musicUrl.length - 1])
      });

      const newMusicUrl = musicSrc.split("/");
      const newMusicCid = newMusicUrl[newMusicUrl.length - 1];

      let index = musicsCid!.indexOf(newMusicCid);

      if (index !== -1) {
        musicsCid!.splice(index, 1);
      }

      const data = { musics: musicsCid };
      const res2 = await axios.put(
        `${import.meta.env.VITE_APP_BACK_URL}/playlists/${playlist.id}`,
        data,
        {
          withCredentials: true,
        }
      );

      if (id) {
        getPlaylistDetails(id);
      }
      if (Array.isArray(res2.data)) {
        displayAlert(res2.data[0].msg, res2.status);
      } else {
        displayAlert(
          "Music deleted successfully from the playlist",
          res2.status
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getLikedMusics = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACK_URL}/users/me/likedMusics`,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      setIsLikedMusicsPlaylist(true);
      setPlaylist({
        name: "My liked musics",
        cover: "/playlistLiked.webp",
        musics: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id !== "likedMusicsPlaylist") {
      getPlaylistDetails(id!);
    } else {
      getLikedMusics();
    }
  }, [id]);

  const displayAlert = (msg: string, status: number) => {
    setAlert({ response: msg, status: status, visible: true });
    setTimeout(() => {
      setAlert({ response: "", status: 0, visible: false });
    }, 3000);
  };

  return (
    <div className="content-album">
      <header className="head">
        <Link to={"/"}>
          <Icon icon="return" size="Large" />
        </Link>
        <div className="divider divider-horizontal" />
        <div className="title">
          {playlist && (
            <>
              <img src={playlist.cover} alt="" />
              {/*<img src={`${import.meta.env.VITE_PINATA_GATEWAY_HOST}/${playlist.coverCID}`} alt=""/>*/}
              <h3>{playlist?.name}</h3>
            </>
          )}
        </div>
        <div className="avatar">
          <div className="w-14 h-14 rounded-full">
            <img src="https://placeimg.com/192/192/people" alt="" />
          </div>
        </div>
      </header>
      <SongList
        songs={playlist}
        setSongs={setSongs}
        setCurrentSong={setCurrentSong}
        audioElmt={audioElmt}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        setArtist={setArtist}
        deleteMusicToThePlaylist={deleteMusicToThePlaylist}
        isPlaylistSong={true}
        isLikedPlaylist={isLikedMusicsPlaylist}
        setAlert={setAlert}
        likedMusics={likedMusics}
        likeOrDislikeMusic={likeOrDislikeMusic}
        setPlaylist={setPlaylist}
      />
    </div>
  );
};
