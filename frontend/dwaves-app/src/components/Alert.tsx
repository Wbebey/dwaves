import { responseRequest } from "models"

interface Props {
    alert: responseRequest | undefined
  }

/* 400 422 409 401 500 */

export const Alert : React.FC<Props> = ({ alert }) => {

    let color:string
    if (alert?.status == 400 || alert?.status == 422 || alert?.status == 409 || alert?.status == 401 || alert?.status == 500) {
        color =  "bg-red-500"
    } else if(alert?.status == 200) {
        color= "bg-green-500"
    }else {
        color= "bg-green-500"
    }

    return (
        <div className={`absolute bottom-2 z-30 alert ${color} shadow-lg`}>
            <div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current flex-shrink-0 h-6 w-6"
                    fill="none" viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <span>{alert?.response}</span>
            </div>
        </div>
    )
}