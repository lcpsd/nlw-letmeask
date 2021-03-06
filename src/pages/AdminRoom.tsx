import { useHistory, useParams } from 'react-router'
import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { Question } from '../components/Question'
import { RoomCode } from '../components/RoomCode'
import { UseRoom } from '../hooks/useRoom'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import hamburguerImg from '../assets/images/hamburguer.svg'
import '../styles/room.scss'
import { database } from '../services/firebase'
import { Fragment } from 'react'
import { useAuth } from '../hooks/useAuth'


type RoomParams = {
    id: string;
}


export function AdminRoom() {

    const history = useHistory()

    const params = useParams<RoomParams>()
    const roomId = params.id

    const {title, questions} = UseRoom(roomId)

    const {user, googleSignout} = useAuth()
    
    async function handleEndRoom(){
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date()
        })

        history.push('/')
    }

    let isAdmin = false

    async function checkAdminRoom() {

        await database.ref(`rooms/${roomId}`).once('value', room => {
            const authorId = room.val().authorId

            isAdmin = (authorId === user?.id)
        })

        return isAdmin
    }

    checkAdminRoom()

    async function handleCheckQuestion(questionId:string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true
        })
    }

    //Highlight question
    async function handleHighLightQuestion(questionId:string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true
        })
    }

    //Delete question
    async function handleDeleteQuestion(questionId: string){
        if(window.confirm('Tem certeza que deseja excluir essa pergunta?')){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
        
    }

    function toggleMenu(){
        const menu = document.querySelector('.menu')
        menu?.classList.toggle('show')
    }

    function goToHome(){
        history.push('/')
    }

    return (

        <div id="page-room">
            {isAdmin ? 
                <>
                <header>
                    <div className="content">
                        <img src={logoImg} alt="" className="logo" onClick={goToHome}/>
                        <div>
                            <div className="hamburguer-menu">
                                <img src={hamburguerImg} alt="" onClick={toggleMenu} />
                            </div>
                            <RoomCode code={roomId}/>
                            <div className="menu">
                                <Button onClick={handleEndRoom}>Encerrar sala</Button>
                                <Button onClick={googleSignout} isOutlined>Sair da conta</Button> 
                            </div>
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

                    <div className="question-list">
                        {
                            questions.map(question => {
                                return(
                                    <Question
                                        content={question.content}
                                        author={question.author}
                                        key={question.id}
                                        isAnswered={question.isAnswered}
                                        isHighlighted={question.isHighlighted}
                                    >   
                                        {!question.isAnswered &&
                                            (
                                                <Fragment>
                                                    <button type="button" onClick={() => handleCheckQuestion(question.id)}>
                                                        <img src={checkImg} alt="" />
                                                    </button>

                                                    <button type="button" onClick={() => handleHighLightQuestion(question.id)}>
                                                        <img src={answerImg} alt="" />
                                                    </button>
                                                </Fragment>
                                            )
                                        
                                        }

                                        <button type="button" onClick={() => handleDeleteQuestion(question.id)}>
                                            <img src={deleteImg} alt="" />
                                        </button>
                                    </Question>
                                )
                            })
                        }
                    </div>
                </main>
        
                </>
             : 
                <div id="page-room">Voc?? n??o ?? o administrador!</div>
             }
        </div>
    )
}