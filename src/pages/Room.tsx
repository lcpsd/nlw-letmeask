import { FormEvent, useState } from 'react'
import { useParams } from 'react-router'
import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'
import '../styles/room.scss'


type roomParams = {
    id: string;
}

export function Room() {

    const {user} = useAuth()

    const params = useParams<roomParams>()
    const roomId = params.id

    const [newQuestion, setNewQuestion] = useState('')

    async function handleSendQuestion(event: FormEvent){

        event.preventDefault()

        if(newQuestion.trim() === ''){
            return
        }

        if(!user){
            throw new Error('não logado')
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighLighted: false,
            isAnswered: false
        }
        
        await database.ref(`rooms/${roomId}/questions`).push(question)
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="" />
                    <RoomCode code={roomId} />
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala -nome-  </h1>
                    <span>X perguntas</span>
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea 
                    placeholder="O que você quer perguntar?" 
                    onChange={event => setNewQuestion(event.target.value)}
                    value={newQuestion}/>

                    <div className="form-footer">
                        <span>Para enviar uma pergunta, <button>faça login</button></span>
                        <Button type="submit">Enviar pergunta</Button>
                    </div>
                </form>
            </main>
        </div>
    )
}