import "styles/Explorer.scss";
import {AlbumForm, PopularSongOfArtist, AlbumOfArtist, SingleForm, SwitchTab} from "../components";
import {useEffect, useRef, useState} from "react";

interface Props {
    setCurrentSong: React.Dispatch<React.SetStateAction<any>>
    setSongs: React.Dispatch<React.SetStateAction<any>>
}

export const Profile: React.FC<Props> = ({setCurrentSong, setSongs}) => {

    const [showForm, setShowForm] = useState(true)

    return (
        <div className="contain-download" style={{width: '100%', height: '100%', background: 'white'}}>
            <SwitchTab FirstValue={'Overview'} SecondValue={'My Info'} showForm={showForm} setShowForm={setShowForm}/>
            {showForm ?
                <div className={'h-[97%] pt-[30px] pl-[20px]'}>
                    <div className={`w-full h-[90%] overflow-scroll`}>
                        <AlbumOfArtist/>
                        <PopularSongOfArtist setCurrentSong={setCurrentSong} setSongs={setSongs}/>
                    </div>
                </div>
                :
                null
            }
        </div>
    )
};
