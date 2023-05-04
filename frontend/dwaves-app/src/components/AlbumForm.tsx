import "../styles/AlbumForm.scss"
import { Icon } from "components/shared";
import { ChangeEvent, useState } from "react";
import { useForm, UseFormSetValue } from "react-hook-form";

interface Props {
    setCoverExist: React.Dispatch<React.SetStateAction<boolean>>
    setCover: React.Dispatch<React.SetStateAction<CoverFile>>
    setValue: UseFormSetValue<CoverFile>
}

type CoverFile = {
    src: any
}

const FormCover: React.FC<Props> = ({ setCoverExist, setCover, setValue }) => {

    function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) {
            return;
        } else {
            setValue("src", e.target.files[0]);
            setCoverExist(true);
            const reader = new FileReader();
            reader.onload = (evt) => {
                setCover({ src: { object: e.target.files![0], preview: evt.target!.result } })
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
    const { register, setValue, getValues, handleSubmit } = useForm<CoverFile>();
    const [cover, setCover] = useState<CoverFile>({ src: {} })
    const [coverExist, setCoverExist] = useState(false)

    const onSubmit = (data: any) => {
        const form = new FormData()
        form.append("cover", data.src)

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
                        <FormCover setCoverExist={setCoverExist} setCover={setCover} setValue={setValue} />
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

type SongData = { title: string, src: File | null }

export const AlbumForm = () => {
    const [arraySong, setArraySong] = useState<SongData[]>([{title: '', src: null}])

    const handleSong = (e: ChangeEvent<HTMLInputElement>, i: number) => {
        setArraySong(arraySong.map((song, j) =>  {
            if (i !== j) {
                return song
            }
            const src = e.target.files === null ? null : e.target.files[0]
            return {...song, src}
        }))
    }

    const handleTitle = (e: ChangeEvent<HTMLInputElement>, i: number) => {
        setArraySong(arraySong.map((song, j) =>  {
            if (i !== j) {
                return song
            }
            return {...song, title: e.target.value}
        }))
    }

    const addSong = () => {
        setArraySong([...arraySong, {title: '', src: null}])
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
                                        <input type="file" onChange={(e) => { handleSong(e, i) }} className="file-input bg-white-900 file-input-bordered file-input-primary w-full" />
                                    </div>
                                </div>
                                <div className="contain-input-audio">
                                    <div className="form-control w-full max-w-xs">
                                        <label className="label">
                                            <span className="label-text">Titre</span>
                                        </label>
                                        <input type="text" onChange={(e) => { handleTitle(e, i) }} placeholder="Type here" className="input input-ghost w-full" />
                                    </div>
                                </div>
                                <div className="contain-star">
                                    <Icon color="rgb(255, 174, 0)" icon="star" size="Large" />
                                </div>
                                <div className="contain-other-icon">
                                    <Icon color="red" icon="trash" size="Large" />
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