/* import axios from "axios" */
import { Back, DocumentUpload, MusicCircle } from "iconsax-react"
import { ChangeEvent, /* useEffect, */ useState } from "react"
import { useForm } from "react-hook-form"
import "../styles/Download.scss"

type Single = {
    title: string
    album: string
    genre: string
    artist: string
    cover: string
    src: string
}

export const Input = () => {

    const { register, setValue, getValues, handleSubmit } = useForm<Single>()
    const [filesExist, setFilesExist] = useState({src: false , cover: false})

    function handleFile(e: ChangeEvent<HTMLInputElement>) {

        switch (e.currentTarget.name) {
            case "src":
                if (!e.target.files) {
                    return
                } else {
                    setValue("src", e.target.files[0].name)
                    setFilesExist({src : true , cover: filesExist.cover})
                }
                break;
            case "cover":
                if (!e.target.files) {
                    return
                } else {
                    setValue("cover", e.target.files[0].name)
                    setFilesExist({src : filesExist.src , cover: true})
                }
                break;
            default:
                break;
        }


    }

    const onSubmit = (data: any) => {
        console.log(data)
    }


/*         useEffect(()=>{
            axios.post(`${import.meta.env.VITE_APP_URL}`, () => {
    
            })
        },[]) */

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%'}}>
            <section className="contain-download">
                <div className="header">
                    <div id="contain-title" className="flex row nowrap">
                        <Back style={{ color: 'black', width: '32px', height: '32px' }} />
                        <div className="divider divider-horizontal"></div>
                        <h1>
                            Upload a new file
                        </h1>
                    </div>
                    <div id="action" className="flex row">
                        <button className="clear">
                            Clear
                        </button>
                        <button type="submit" className="upload">
                            Upload
                        </button>
                    </div>
                </div>
                <div className="content">
                    <div className="form-file" >
                        <div className="logo-upload">
                            <MusicCircle className="icon" />
                        </div>
                        {
                            filesExist.src ?
                                <span>{getValues('src')}</span>
                                :
                                <span>Upload Music</span>
                        }
                        <input type="file" name="src" onChange={(e) => { handleFile(e) }} className="input-file" />
                        <p>Drop files directly here or <span>browse</span> from your device</p>
                    </div>
                    <br />
                    <div className="form-file" >
                        <div className="logo-upload">
                            <DocumentUpload className="icon" />
                        </div>
                        {
                            filesExist.cover ?
                                <span>{getValues('cover')}</span>
                                :
                                <span>Upload Cover</span> 
                        }
                        <input type="file" name="cover" onChange={(e) => { handleFile(e) }} className="input-file" />
                        <p>Drop files directly here or <span>browse</span> from your device</p>
                    </div>
                    <div id="input-text" className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Title</span>
                        </label>
                        <input type="text" {...register('title')} placeholder="Type here" className="input input-ghost" />
                    </div>
                    <div id="input-text" className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Album</span>
                        </label>
                        <input type="text" {...register('album')} placeholder="Type here" className="input input-ghost" />
                    </div>
                    <div id="input-text" className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Genre</span>
                        </label>
                        <input type="text" {...register('genre')} placeholder="Type here" className="input input-ghost" />
                    </div>
                </div>
            </section>
        </form>
    )
}