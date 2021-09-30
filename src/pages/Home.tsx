//React
import {useHistory} from 'react-router-dom'
import { Button } from '../components/Button'

//Outros
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIcon from '../assets/images/google-icon.svg'
import '../styles/auth.scss'
import { useAuth } from '../hooks/useAuth'

export function Home(){
    
    //importa os dados do usuário e a função de login google
    const {user, signInWithGoogle} = useAuth()

    const history = useHistory()

    //verifica se o usuário está logado, se não estiver, espera logar
    async function handleCreateRoom(){

        if(!user){
            await signInWithGoogle()
        }

        //encaminha o usuário para a criação das telas se logado
        history.push('/rooms/new')
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
                    <button className="createRoomButton" onClick={handleCreateRoom}>
                        <img src={googleIcon} alt="Logo do google" />
                        Criar sala com o google
                    </button>

                    <div className="separator">
                        ou entre em uma sala
                    </div>

                    <form action="">
                        <input type="text" placeholder="Digite o código da sala" name="" id="" />
                        <Button  type="submit">Entrar na sala</Button>
                    </form>
                </div>
            </main>
        </div>
    )
}