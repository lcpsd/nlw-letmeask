import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIcon from '../assets/images/google-icon.svg'
import '../styles/auth.scss'
import { Button } from '../components/Button'
import {Link} from 'react-router-dom'

export function NewRoom(){
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

                    <form action="">
                        <input type="text" placeholder="Nome da sala" name="" id="" />
                        <Button  type="submit">Criar sala</Button>
                    </form>

                    <p><Link to="/">Entrar em uma sala existente</Link></p>
                </div>
            </main>
        </div>
    )
}