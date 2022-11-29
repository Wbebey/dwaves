import "styles/Explorer.scss";
import { SingleForm } from "components";
import { AlbumForm } from "components";
import { useState } from "react";

export const Download = () => {
  const [showForm, setShowForm]= useState(true)
  return (
    <div className="contain-download" style={{width: '100%', height: '100%', background: 'white'}}>
      <div className="tabs">
        <div
          onClick={() => {
            setShowForm(true);
          }}
          className={`w-1/2 tab tab-lg tab-lifted ${showForm ? "tab-active" : ""
            }`}
        >
          Single
        </div>
        <div
          onClick={() => {
            setShowForm(false);
          }}
          className={`w-1/2 tab tab-lg tab-lifted ${showForm ? "" : "tab-active"
            }`}
        >
          Album
        </div>
      </div>
      { showForm ?
        <SingleForm /> 
        :
        <AlbumForm />
      }   
    </div>
  )
};
