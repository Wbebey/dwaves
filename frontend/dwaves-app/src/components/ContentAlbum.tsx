import "styles/ContentAlbum.scss";
import {Icon} from "components/shared";

import { Link } from "react-router-dom";

import datasongs from "songs/datasongs";

export const ContentAlbum = () => {
  return (
    <div className="content-album">
      <header className="head">
        <Link to={"/"}>
          <Icon icon="return" size="Large" />
        </Link>
        <div className="divider divider-horizontal" />
        <div className="title">
          <img src={`${import.meta.env.VITE_APP_URL}/stamina1.jpg`} alt="" />
          <h3>Stamina</h3>
        </div>
        <div className="avatar">
          <div className="w-14 h-14 rounded-full">
            <img src="https://placeimg.com/192/192/people" alt="" />
          </div>
        </div>
      </header>
      <ul className="list-song">
        {datasongs.map((song, i) => (
          <li key={song.Title} className="song-li">
            <div className="avatar placeholder">
              <div className="text-neutral-content rounded-full w-10">
                <span className="text-xl">0{i + 1}</span>
              </div>
            </div>
            <div className="p-0 divider divider-horizontal" />
            <div className="song-li-info">
              <h4 style={{}}>{song.Title}</h4>
              <p>{song.Artist}</p>
            </div>
            <div className="song-li-action">
              <Icon icon="add" />
              <Icon icon="like" />
              <p>2 : 30</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
