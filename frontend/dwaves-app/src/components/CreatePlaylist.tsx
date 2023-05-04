import React, {useEffect, useState} from "react";
import axios from "axios";
import {responseRequest} from "../models";

interface Props {
    setAlert: React.Dispatch<React.SetStateAction<responseRequest | undefined>>
}

export const CreatePlaylist: React.FC<Props> = ({setAlert}) => {

    const [playlistName, setPlaylistName] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const [image, setImage] = useState<any>([]);
    const [imageURL, setImageURL] = useState<string>()

    useEffect(() => {
        foundUserId()
    }, [])

    useEffect(() => {
        if (image.length < 1) return;

        setImageURL(URL.createObjectURL(image[0]))
    }, [image])

    function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        setImage([...e.target.files!])
    }

    const confirmPlaylist = async () => {
        const form = new FormData()
        form.append('creatorId', userId)
        form.append('name', playlistName!)
        form.append('cover', image[0])

        try {
            const res = await axios.post(`${import.meta.env.VITE_APP_BACK_URL}/playlists`, form, {
                    withCredentials: true,
                }
            )

            if (Array.isArray(res.data)) {
                displayAlert(res.data[0].msg, res.status)
            } else {
                displayAlert('Playlist created successfully', res.status)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const displayAlert = (msg: string, status: number) => {
        setAlert({response: msg, status: status, visible: true})
        setTimeout(() => {
            setAlert({response: "", status: 0, visible: false})
        }, 3000)
    }

    const foundUserId = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_APP_BACK_URL}/users/me`, {
                    withCredentials: true,
                }
            )
            setUserId(res.data.id)

        } catch (err) {
            console.log(err)
        }
        console.log(userId)
    }

    return (
        <div>
            <div className="flex flex-row">
                <div>
                    <h2 className="text-2xl font-medium pl-11 pb-3">Select the cover</h2>
                    <div className="bg-teal-300 rounded-lg w-64 h-64 flex items-center p-4 hover:bg-teal-200">
                        {image.length < 1 ?
                            <input type="file" accept="image/*" onChange={onImageChange}
                                   className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4
                               file:rounded-full file:border-0 file:text-sm file:font-semibold
                               file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                            />
                            :
                            <img src={imageURL} alt={''}/>
                        }
                    </div>
                </div>
                <div className="flex-col items-center justify-between pl-11">
                    <label className="block">
                        <span className="block text-2xl font-medium pl-11 pb-2">Playlist name</span>
                        <input type="email" className="bg-teal-100 h-28 w-50 pl-16 rounded-lg hover:bg-teal-200"
                               value={playlistName} onChange={(e) => setPlaylistName(e.target.value)}
                        />
                    </label>
                    <div className="mt-5 bg-teal-200 w-50 h-32 rounded-lg flex justify-center hover:bg-teal-300">
                        <button onClick={confirmPlaylist} disabled={image.length < 1 || playlistName === ''}>Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
