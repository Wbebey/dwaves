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

  let widthOfComponent: string;
  switch (values.length) {
    case 2:
      widthOfComponent = 'w-1/2'
      break;
    case 3:
      widthOfComponent = 'w-1/3'
      break;
    case 4:
      widthOfComponent = 'w-1/4'
      break;
  }

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
