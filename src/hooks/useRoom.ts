import { useEffect, useState } from "react"
import { database } from "../services/firebase"

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

type FirebaseQuestions = Record<string, {
    author:{
        name: string;
        avatar: string;
    }

    content: string;
    isAnswered: boolean;
    isHighLighted: boolean
}>

export function UseRoom(roomId: string){
    const [questions, setQuestions] = useState<QuestionType[]>([])
    const [title, setTitle] = useState('')
    
        
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

    return {questions, title}
}