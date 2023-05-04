import {AlbumOfArtist, PopularSongOfArtist, SwitchTab, CreatePlaylist} from "../components";
import React, {useState} from "react";
import {responseRequest} from "../models";

interface Props {
    setAlert: React.Dispatch<React.SetStateAction<responseRequest | undefined>>
}
const Playlist: React.FC<Props> = ({setAlert}) => {
    const [showForm, setShowForm] = useState(true)
    return (
        <div className="contain-download" style={{width: '100%', height: '100%', background: 'white'}}>
            <SwitchTab FirstValue={'My playlists'} SecondValue={'Create a playlist'}
                       showForm={showForm} setShowForm={setShowForm}/>

            {showForm ?
                <div className={'h-[97%] pt-[30px] pl-[20px]'}>
                    <div className={`w-full h-[90%] overflow-scroll`}>
                    </div>
                </div>
                :
                <div className={'h-[97%] pt-[30px] pl-[20px]'}>
                    <div className={`w-full h-[90%] overflow-scroll`}>
                        <CreatePlaylist setAlert={setAlert}/>
                    </div>
                </div>
            }
        </div>
    )
}

export default Playlist