import "styles/Explorer.scss";
import {AlbumForm, PopularSongOfArtist, SingleForm, SwitchTab} from "../components";
import {useState} from "react";

interface Props {
    setCurrentSong: React.Dispatch<React.SetStateAction<any>>
    setSongs: React.Dispatch<React.SetStateAction<any>>
}

export const Profile:React.FC<Props> = ({setCurrentSong, setSongs}) => {

    const [showForm, setShowForm] = useState(true)

    return (
        <div className="contain-download" style={{width: '100%', height: '100%', background: 'white'}}>

            <SwitchTab FirstValue={'Overview'} SecondValue={'My Info'} showForm={showForm} setShowForm={setShowForm}/>

            {showForm ?
                <PopularSongOfArtist setCurrentSong={setCurrentSong} setSongs={setSongs}/>
                :
                null
            }
        </div>
    )
};
