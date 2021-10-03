import { FormEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { Question } from '../components/Question'
import { RoomCode } from '../components/RoomCode'
import { useAuth } from '../hooks/useAuth'
import { UseRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'
import '../styles/room.scss'


type RoomParams = {
    id: string;
}


export function AdminRoom() {
    const params = useParams<RoomParams>()
    const roomId = params.id

    const {title, questions} = UseRoom(roomId)
    
    const {user} = useAuth()
    
    
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

        setNewQuestion('')
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined>Encerrar sala</Button>
                    </div>

                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>

                    {
                        questions.length < 1 && 
                        <i></i>
                    }

                    {
                        questions.length > 1 && 
                        <span>{questions.length} perguntas</span>
                    }

                    {
                        questions.length === 1 && questions.length < 2 ?
                        <span>{questions.length} pergunta</span> 
                        :
                        <i></i>
                    }
                </div>

                <div className="question-lis">
                    {
                        questions.map(question => {
                            return(
                                <Question
                                    content={question.content}
                                    author={question.author}
                                    key={question.id}
                                />
                            )
                        })
                    }
                </div>
            </main>
        </div>
    )
}