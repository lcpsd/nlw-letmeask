import '../styles/button.scss'
import {ButtonHTMLAttributes} from 'react'

type buttonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean
}

export function Button({isOutlined=false, ...props}: buttonProps){
    return (
        <button className={`button ${isOutlined ? 'outlined' : ''}`} {...props} ></button>
    )
}