import { Footer } from '../components'
import React from 'react'

interface Props {
  envName: string
  buildDate: string
  commitUrl: string
}

export const Settings: React.FC<Props> = ({
  buildDate,
  envName,
  commitUrl,
}) => {
  const date = new Date(buildDate)

  return (
    <div
      className="contain-download"
      style={{ width: '100%', height: '100%', background: 'white' }}
    >
      <div className="flex items-center flex-col justify-center h-full pb-40">
        <h3 className="text-2xl font-bold my-5">Application informations</h3>
        <p className="footer__item text-xl mb-3">Env : {envName}</p>
        <p className="footer__item text-xl">
          <a className="hover:underline underline-offset-2" href={commitUrl} target="_blank">
            Build Date : {date.toLocaleString()}
          </a>
        </p>
      </div>
    </div>
  )
}
