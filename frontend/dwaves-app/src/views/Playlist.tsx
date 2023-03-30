import "styles/Explorer.scss";
import React from "react";
import {AlbumDetail, responseRequest} from "../models";
import {ContentOfPlaylist} from "../components";

interface Props {
    setCurrentSong: React.Dispatch<React.SetStateAction<any>>
    setSongs: React.Dispatch<React.SetStateAction<any>>
    audioElmt: React.RefObject<HTMLAudioElement>
    isPlaying: boolean
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
    setArtist: React.Dispatch<React.SetStateAction<AlbumDetail | undefined>>;
    setAlert: React.Dispatch<React.SetStateAction<responseRequest | undefined>>
}

export const Playlist: React.FC<Props> = ({
                                              setCurrentSong,
                                              setSongs,
                                              audioElmt,
                                              isPlaying,
                                              setIsPlaying,
                                              setArtist,
                                              setAlert
                                          }) => {
    return <ContentOfPlaylist setCurrentSong={setCurrentSong}
                              setSongs={setSongs}
                              audioElmt={audioElmt}
                              isPlaying={isPlaying}
                              setIsPlaying={setIsPlaying}
                              setArtist={setArtist} setAlert={setAlert}/>;
};
