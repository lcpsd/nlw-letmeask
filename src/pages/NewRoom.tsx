import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import '../styles/auth.scss'
import { Button } from '../components/Button'
import {Link, useHistory} from 'react-router-dom'
import {FormEvent, useState} from 'react'
import { database } from '../services/firebase'
import { useAuth } from '../hooks/useAuth'

export function NewRoom(){

    const history = useHistory()

    const {user} = useAuth()

    const [newRoom, setNewRoom] = useState('')

    async function handleCreateRoom(event: FormEvent){
        event.preventDefault()

        if(newRoom.trim() === ''){
            return
        }

        const roomRef = database.ref('rooms')

        const firebaseRoom = await roomRef.push({
            title:newRoom,
            authorId: user?.id
        })

        history.push(`/rooms/${firebaseRoom.key}`)
    }

    return (
        <div id="pageAuth">

            {/* Left section */}
            <aside>
                <img src={illustrationImg} alt="ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real</p>
            </aside>

            {/* Right section */}
            <main>
                <div className="mainContent">
                    <img src={logoImg} alt="logo letmeask" />
                    <h2>Criar uma nova sala</h2>
                    <div className="separator">
                        ou entre em uma sala
                    </div>

                    <form onSubmit={handleCreateRoom}>

                        <input type="text" 
                        placeholder="Nome da sala" 
                        onChange={event => setNewRoom(event.target.value)}
                        value={newRoom} />

                        <Button  type="submit">Criar sala</Button>
                    </form>

                    <p><Link to="/">Entrar em uma sala existente</Link></p>
                </div>
            </main>
        </div>
    )
}