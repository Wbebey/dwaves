import "styles/Explorer.scss";
import React from "react";
import {responseRequest} from "../models";
import {ContentOfPlaylist} from "../components";

interface Props {
    setCurrentSong: React.Dispatch<React.SetStateAction<any>>
    setSongs: React.Dispatch<React.SetStateAction<any>>
    setAlert: React.Dispatch<React.SetStateAction<responseRequest | undefined>>
}

export const Playlist:React.FC<Props> = ({setCurrentSong, setSongs, setAlert}) => {
    return <ContentOfPlaylist setCurrentSong={setCurrentSong} setSongs={setSongs} setAlert={setAlert} />;
};
