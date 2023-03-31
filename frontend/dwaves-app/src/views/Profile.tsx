import "styles/Explorer.scss";
import {AlbumForm, ArtistPopularSong, AlbumOfArtist, SingleForm, SwitchTab} from "../components";
import React, {useEffect, useRef, useState} from "react";
import {responseRequest} from "../models";

interface Props {
    setCurrentSong: React.Dispatch<React.SetStateAction<any>>
    setSongs: React.Dispatch<React.SetStateAction<any>>
    setAlert: React.Dispatch<React.SetStateAction<responseRequest | undefined>>
}

export const Profile: React.FC<Props> = ({setCurrentSong, setSongs, setAlert}) => {

    const [showForm, setShowForm] = useState(true)

    return (
        <div className="contain-download" style={{width: '100%', height: '100%', background: 'white'}}>
            <SwitchTab FirstValue={'Overview'} SecondValue={'My Info'} showForm={showForm} setShowForm={setShowForm}/>
            {showForm ?
                <div className={'h-[97%] pt-[30px] pl-[20px]'}>
                    <div className={`w-full h-[90%] overflow-scroll`}>
                        <AlbumOfArtist setAlert={setAlert}/>
                        <ArtistPopularSong setCurrentSong={setCurrentSong} setSongs={setSongs}/>
                    </div>
                </div>
                :
                null
            }
        </div>
    )
};
