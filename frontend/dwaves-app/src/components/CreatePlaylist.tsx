import React, { useEffect, useState } from "react";
import axios from "axios";
import { responseRequest } from "../models";

interface Props {
  setAlert: React.Dispatch<React.SetStateAction<responseRequest | undefined>>;
}

export const CreatePlaylist: React.FC<Props> = ({ setAlert }) => {
  const [playlistName, setPlaylistName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [image, setImage] = useState<any>([]);
  const [imageURL, setImageURL] = useState<string>();

  useEffect(() => {
    if (image.length < 1) return;

    setImageURL(URL.createObjectURL(image[0]));
  }, [image]);

  function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    setImage([...e.target.files!]);
  }

  const confirmPlaylist = async () => {
    const form = new FormData();
    form.append("creatorId", userId);
    form.append("name", playlistName!);
    form.append("description", description!);
    form.append("cover", image[0]);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BACK_URL}/users/me/playlists`,
        form,
        {
          withCredentials: true,
        }
      );
      setPlaylistName("");
      setDescription("");
      setImage([]);
      setImageURL("");
      if (Array.isArray(res.data)) {
        displayAlert(res.data[0].msg, res.status);
      } else {
        displayAlert("Playlist created successfully", res.status);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const displayAlert = (msg: string, status: number) => {
    setAlert({ response: msg, status: status, visible: true });
    setTimeout(() => {
      setAlert({ response: "", status: 0, visible: false });
    }, 3000);
  };

  return (
    <div>
      <div className="flex flex-row items-stretch pt-10 justify-center">
        <div className="flex flex-col items-center">
          <label className="text-l font-medium">Select the cover</label>
          <div className="bg-teal-300 rounded-lg w-80 h-80 flex items-center p-4 hover:bg-teal-200">
            {image.length < 1 ? (
              <input
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="self-center block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4
                               file:rounded-full file:border-0 file:text-sm file:font-semibold
                               file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              />
            ) : (
              <img src={imageURL} alt={""} />
            )}
          </div>
        </div>
        <div className="flex-col items-center w-80 pl-11">
          <label className="block flex flex-col items-center">
            <span className="block text-l font-medium">Name</span>
            <input
              type="email"
              className="bg-teal-100 w-full h-16 text-center rounded-lg hover:bg-teal-200"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            />
          </label>
          <label className="block flex flex-col items-center mt-4">
            <span className="block text-l font-medium">Description</span>
            <textarea
              className="bg-teal-100 resize-none w-full h-32 text-center pt-5 rounded-lg hover:bg-teal-200"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <div className="mt-6 bg-teal-200 w-50 h-16 rounded-lg flex justify-center hover:bg-teal-300">
            <button
              onClick={confirmPlaylist}
              disabled={image.length < 1 || playlistName === ""}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
