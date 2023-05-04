import "styles/Explorer.scss";
import { SingleForm, AlbumForm, SwitchTab } from "components";
import { useState } from "react";
import { responseRequest } from "models";

interface Props {
  setAlert: React.Dispatch<React.SetStateAction<responseRequest | undefined>>
}

export const Download : React.FC<Props> = ({ setAlert }) => {
  const [showForm, setShowForm]= useState(true)
  return (
    <div className="contain-download" style={{width: '100%', height: '100%', background: 'white'}}>

      <SwitchTab FirstValue={'Single'} SecondValue={'Album'} showForm={showForm} setShowForm={setShowForm}/>

      {
          showForm ?
              <SingleForm setAlert={setAlert} />
              :
              <AlbumForm setAlert={setAlert} />
      }
    </div>
  )
};
