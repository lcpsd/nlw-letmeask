import copyImg from '../assets/images/copy.svg'
import '../styles/roomCode.scss'

type RoomCodeProps= {
    code: string;
}

export function RoomCode(props: RoomCodeProps){

    function copyRoomCode(){
        navigator.clipboard.writeText(props.code)
    }

    return (
        <button className="room-code" onClick={copyRoomCode}>
            <div>
                <img src={copyImg} alt="" />
            </div>
            <span>
                sala #{props.code}
            </span>
        </button>
    )
}