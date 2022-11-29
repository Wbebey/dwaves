import "../styles/AlbumForm.scss"
import { Icon } from "components/shared";
import { ChangeEvent, useState } from "react";
import { useForm, UseFormSetValue } from "react-hook-form";
import axios from "axios";
import { truncate } from "fs";

interface Props {
    coverExist: boolean
    setCoverExist: React.Dispatch<React.SetStateAction<boolean>>
    setCover: React.Dispatch<React.SetStateAction<File>>
    setValue: UseFormSetValue<File>
}

type File = {
    src: any
}

const FormCover: React.FC<Props> = ({ coverExist, setCoverExist, setCover, setValue }) => {

    function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) {
            return;
        } else {
            setValue("src", e.target.files[0]);
            setCoverExist(true);
            const reader = new FileReader();
            reader.onload = (evt) => {
                setCover({ src: { object: e.target.files![0], preview: evt.target!.result } })
                console.log(evt.target!.result);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    return (
        <div className="form-cover">
            <div className="logo-upload">
                <Icon size="Large" icon="upload" />
            </div>
            <span>Upload Cover</span>
            <input
                type="file"
                name="cover"
                onChange={(e) => {
                    handleFile(e);
                }}
                className="input-file"
            />
        </div>
    )
}

const AlbumCover = () => {
    const { register, setValue, getValues, handleSubmit } = useForm<File>();
    const [cover, setCover] = useState<File>({ src: {} })
    const [coverExist, setCoverExist] = useState(false)

    const onSubmit = (data: any) => {
        const form = new FormData()
        form.append("cover", data.src)
        /*         axios.post(`${import.meta.env.VITE_APP_BACK_URL}/api/v1/musics/pinSingleMusic`, form)
                  .then(res => { console.log(res, 'worked') })
                  .catch(err => { console.log(err) }) */
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="contain-header">
            <div className="contain-icon">
                <Icon icon="return" size="Large" />
            </div>
            <div className="contain-cover">
                {
                    coverExist ?
                        <img src={cover.src.preview} alt="" />
                        :
                        <FormCover coverExist={coverExist} setCoverExist={setCoverExist} setCover={setCover} setValue={setValue} />
                }
            </div>
            <div className="contain-input">
                <input type="text" placeholder="Type here" className="input input-ghost w-full " />
            </div>
            <div className="contain-button">
                <button className="btn btn-active btn-primary">Save</button>
            </div>
        </form>
    )
}


export const AlbumForm = () => {
    const [property, setProperty] = useState({ title: {}, src: "" })
    const [arraySong, setArraySong] = useState(Array<any>)

    const handleSong = (e: ChangeEvent<HTMLInputElement>) => {
        setProperty({ title: e.target.files![0], src: "" })
    }

    const handleTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setProperty({ title: property.title, src: e.target.value })
    }

    const validSong = () => {
        if (arraySong.length == 1) {
            setArraySong([property])
        }
        else {
            setArraySong([...arraySong, property])
        }
        setProperty({ title: {}, src: "" })
        console.log(arraySong, "validSong")
    }

    const addSong = () => {
        if (arraySong.length == 0) {
            setArraySong([{ title: {}, src: "" }])
        } else {
            setArraySong([...arraySong, property])
        }
        console.log(arraySong, "addSong")
    }

    return (
        <section className="contain-album-form">
            <div className="header">
                <AlbumCover />
            </div>
            <div className="content-form-album">
                <ul className="list-form-album">
                    {
                        arraySong.map((song, i) => (
                            <li className="form-song-album">
                                <div className="number">
                                    {i + 1}
                                </div>
                                <div className="contain-input-audio">
                                    <div className="form-control w-full max-w-xs">
                                        <label className="label">
                                            <span className="label-text">Fichier</span>
                                            <span className="label-text-alt">*.mp3</span>
                                        </label>
                                        <input type="file" onChange={(e) => { handleSong(e) }} className="file-input bg-white-900 file-input-bordered file-input-primary w-full" />
                                    </div>
                                </div>
                                <div className="contain-input-audio">
                                    <div className="form-control w-full max-w-xs">
                                        <label className="label">
                                            <span className="label-text">Titre</span>
                                        </label>
                                        <input type="text" onChange={(e) => { handleTitle(e) }} placeholder="Type here" className="input input-ghost w-full" />
                                    </div>
                                </div>
                                <div className="contain-star">
                                    <Icon color="rgb(255, 174, 0)" icon="star" size="Large" />
                                </div>
                                <div className="contain-other-icon">
                                    <Icon color="red" icon="trash" size="Large" />
                                    <Icon onClick={validSong} color="green" icon="save" size="Large" />
                                </div>
                            </li>
                        ))
                    }
                    <li onClick={() => { addSong() }} className="form-song-album">
                        <Icon size="Large" icon="add" />
                    </li>
                </ul>
            </div>
        </section>
    )
}