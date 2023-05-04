import "styles/Explorer.scss";
import { AlbumForm, ArtistPopularSong, AlbumOfArtist, SingleForm, SwitchTab } from "../components";
import React, { useEffect, useRef, useState } from "react";
import { responseRequest } from "../models";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

interface Props {
  setCurrentSong: React.Dispatch<React.SetStateAction<any>>
  setSongs: React.Dispatch<React.SetStateAction<any>>
  setAlert: React.Dispatch<React.SetStateAction<responseRequest | undefined>>
}

export const Profile: React.FC<Props> = ({ setCurrentSong, setSongs, setAlert }) => {

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
            />
          </div>
        </div>
      ) : (
        <div>
          <div className="flex nowrap">
            <div className="py-0">
              <div className="avatar mx-auto item-end">
                <div className="w-24 rounded-full">
                  <img src="https://placeimg.com/192/192/people" alt="" />
                </div>
              </div>
            </div>
          </div>
          <Line options={options} data={data} />
        </div>
      )
      }
    </div>
  )
};
