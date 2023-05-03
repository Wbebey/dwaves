import {
  UserPlaylists,
} from "../components";
import React, { useState } from "react";
import { responseRequest } from "../models";

interface Props {
  setAlert: React.Dispatch<React.SetStateAction<responseRequest | undefined>>;
}

console.log("hello dwaves");

export const PlaylistPage: React.FC<Props> = ({ setAlert }) => {
  return (
    <div
      className="contain-download"
      style={{ width: "100%", height: "100%", background: "white" }}
    >
      <div className={"h-[97%] pt-[30px] pl-[20px]"}>
        <div className={`w-full h-[90%] overflow-scroll`}>
          <UserPlaylists setAlert={setAlert} />
        </div>
      </div>
    </div>
  );
};
