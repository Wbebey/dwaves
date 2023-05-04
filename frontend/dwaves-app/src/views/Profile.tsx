import "styles/Explorer.scss";
import {AlbumForm, PopularSongOfArtist, SingleForm, SwitchTab} from "../components";
import {useState} from "react";

export const Profile = () => {

    const [showForm, setShowForm] = useState(true)

    return (
        <div className="contain-download" style={{width: '100%', height: '100%', background: 'white'}}>

            <SwitchTab FirstValue={'Overview'} SecondValue={'My Info'} showForm={showForm} setShowForm={setShowForm}/>

            {showForm ?
                <PopularSongOfArtist/>
                :
                null
            }
        </div>
    )
};
