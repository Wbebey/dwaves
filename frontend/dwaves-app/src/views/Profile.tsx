import "styles/Explorer.scss";
import { AlbumForm, ArtistPopularSong, AlbumOfArtist, SingleForm, SwitchTab } from "../components";
import React, { useEffect, useRef, useState } from "react";
import { MostPopularSong, responseRequest } from "../models";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

import { Line, Pie } from 'react-chartjs-2';
import { faker } from '@faker-js/faker'
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Props {
  setCurrentSong: React.Dispatch<React.SetStateAction<any>>
  setSongs: React.Dispatch<React.SetStateAction<any>>
  setAlert: React.Dispatch<React.SetStateAction<responseRequest | undefined>>
  currentUserData?: any
}

export const Profile: React.FC<Props> = ({ setCurrentSong, setSongs, setAlert, currentUserData }) => {

  const [mostPopularSong, setMostPopularSong] = useState<MostPopularSong[]>([])

  const getMostPopularSong = async () => {
      try {
          const res = await axios.get(
              `${import.meta.env.VITE_APP_BACK_URL}/users/me/popular?limit=10`,
              {
                  withCredentials: true,
              }
          )
          setMostPopularSong(res.data)
      } catch (error) {
          console.log(error)
      }
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Stats de mes musiques les plus écoutés',
      },
    },
  };
  
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  
  const data = {
    labels,
    datasets: [
      {
        label: mostPopularSong[0] && mostPopularSong[0].name,
        data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: mostPopularSong[1] && mostPopularSong[1].name,
        data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };
  
  const dataPie = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    getMostPopularSong()
}, [])

  const [showForm, setShowForm] = useState('Overview')
  return (
    <div
      className="contain-download"
      style={{ width: '100%', height: '100%', background: 'white' }}
    >
      <SwitchTab
        values={['Overview', 'My Info']}
        showForm={showForm}
        setShowForm={setShowForm}
      />
      {showForm === 'Overview' ? (
        <div className={'h-[97%] pt-[30px] pl-[20px]'}>
          <div className={`w-full h-[90%] overflow-scroll`}>
            <AlbumOfArtist setAlert={setAlert} />
            <ArtistPopularSong
              setCurrentSong={setCurrentSong}
              setSongs={setSongs}
              mostPopularSong={mostPopularSong}
            />
          </div>
        </div>
      ) : (
        <div>
          <div className="flex nowrap items-center justify-around p-4">
            <div className="py-0">
              <div className="avatar mx-auto item-end">
                <div className="w-24 rounded-full">
                  <img src="https://placeimg.com/192/192/people" alt="" />
                </div>
              </div>
            </div>
            <div className="w-4/5">
              <div>
                <h3 className="text-7xl">{currentUserData && currentUserData.username}</h3>
              </div>
            </div>
          </div>
          <div className="w-full h-full flex nowrap justify-around">
            <div className="w-1/2 p-5">
              <Line options={options} data={data} />
            </div>
            <div className="w-1/3 p-10">
              <Pie data={dataPie} />
            </div>
          </div>
          <div>
            <div className="flex nowrap justify-around">
              <h3 className="text-xl">
                Modifier mes informations
              </h3>
            </div>
          </div>
        </div>
      )
      }
    </div>
  )
};
