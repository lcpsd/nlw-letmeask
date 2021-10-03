import { FormEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { Question } from '../components/Question'
import { RoomCode } from '../components/RoomCode'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'
import '../styles/room.scss'


type RoomParams = {
    id: string;
}

type FirebaseQuestions = Record<string, {
    author:{
        name: string;
        avatar: string;
    }

    content: string;
    isAnswered: boolean;
    isHighLighted: boolean
}>

type QuestionType = {
    author: {
        name: string;
        avatar: string;
    }
    id: string;
    content: string;
    isAnswered: boolean;
    isHighLighted: boolean
}

export function Room() {

    
    const {user} = useAuth()
    
    const params = useParams<RoomParams>()
    const roomId = params.id
    
    const [newQuestion, setNewQuestion] = useState('')
    const [questions, setQuestions] = useState<QuestionType[]>([])
    const [title, setTitle] = useState('')
    
    console.log(questions)
    useEffect(()=> {
        const roomRef = database.ref(`rooms/${roomId}`)

        roomRef.on('value', room => {
            const databaseRoom = room.val()

            const FirebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}

            const parsedQuestions = Object.entries(FirebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    author: value.author,
                    content: value.content,
                    isHighLighted: value.isHighLighted,
                    isAnswered: value.isAnswered,
                }
            })
            
            setTitle(databaseRoom.title)
            //@ts-ignore
            setQuestions(parsedQuestions)
        } )


    }, [roomId])

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
                    <RoomCode code={roomId} />
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

                <form onSubmit={handleSendQuestion}>
                    <textarea 
                    placeholder="O que você quer perguntar?" 
                    onChange={event => setNewQuestion(event.target.value)}
                    value={newQuestion}/>

                    <div className="form-footer">

                        {user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt=''/>
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span> Para enviar uma pergunta, <button>faça login</button></span>
                        )}

                        <Button type="submit" disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>

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