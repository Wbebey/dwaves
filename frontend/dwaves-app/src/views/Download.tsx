import "styles/Explorer.scss";
import { SingleForm, AlbumForm, SwitchTab, CreatePlaylist } from "components";
import { useState } from "react";
import { responseRequest } from "models";

interface Props {
  setAlert: React.Dispatch<React.SetStateAction<responseRequest | undefined>>;
}

export const Download: React.FC<Props> = ({ setAlert }) => {
  const [showForm, setShowForm] = useState("Single");
  return (
    <div
      className="contain-download"
      style={{ width: "100%", height: "100%", background: "white" }}
    >
      <SwitchTab
        values={["Single", "Album", "Playlist"]}
        showForm={showForm}
        setShowForm={setShowForm}
      />

      {showForm === "Single" ? (
        <SingleForm setAlert={setAlert} />
      ) : showForm === "Album" ? (
        <AlbumForm setAlert={setAlert} />
      ) : (
        <CreatePlaylist setAlert={setAlert} />
      )}
    </div>
  );
};
