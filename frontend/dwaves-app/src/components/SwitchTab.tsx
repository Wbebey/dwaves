import { responseRequest } from '../models'
import React from 'react'

interface Props {
  values: string[]
  showForm: string
  setShowForm: React.Dispatch<React.SetStateAction<string>>
}

export const SwitchTab: React.FC<Props> = ({
  values,
  showForm,
  setShowForm,
}) => {
  const widthOfComponent = `w-1/${values.length}`
  return (
    <div className="tabs">
      {values.map((value, index) => (
        <div
          key={index}
          className={`${widthOfComponent} tab tab-lg tab-lifted ${
            showForm === value ? 'tab-active' : ''
          }`}
          onClick={() => {
            setShowForm(value)
          }}
        >
          {value}
        </div>
      ))}
    </div>
  )
}
