import { useEffect, useState } from "react"
import { database } from "../services/firebase"
import { useAuth } from "./useAuth"

type QuestionType = {
    author: {
        name: string;
        avatar: string;
    }
    id: string;
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean
    likeCount: number;
    likeId: string | undefined;
}

type FirebaseQuestions = Record<string, {
    author:{
        name: string;
        avatar: string;
    }

    content: string;
    isAnswered: boolean;
    isHighlighted: boolean
    likes:Record <string, {
        authorId: string;
    }>
}>

export function UseRoom(roomId: string){
    const [questions, setQuestions] = useState<QuestionType[]>([])
    const [title, setTitle] = useState('')
    
    const {user} = useAuth()

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
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
                }
            })
            
            setTitle(databaseRoom.title)
            //@ts-ignore
            setQuestions(parsedQuestions)
        } )

        return () =>{
            roomRef.off('value')
        }

    }, [roomId, user?.id])

    return {questions, title}
}