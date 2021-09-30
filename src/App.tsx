import { BrowserRouter, Route } from "react-router-dom";
import {createContext, useState} from 'react'

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { auth, firebase } from "./services/firebase";

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>
}

type User = {
  id: string;
  name: string;
  avatar: string;
}

//cria um contexto tendo como tipo qualquer coisa
export const AuthContext = createContext({} as AuthContextType)

function App() {

  //Cria um estado para armazenar dados do usuário
  const [user, setUser] = useState<User>()

    //autenticação google
    /**Esta função estará sendo passada como propriedade
     * para que outras páginas possam usa-la.
     * Ela não será usada aqui.
     */
    async function signInWithGoogle(){
      const provider = new firebase.auth.GoogleAuthProvider()
      
      //auth com o pop do google
      const result = await auth.signInWithPopup(provider)

      //verifica se o usuário tem foto, nome e ID
      if(result.user){
        const {displayName, photoURL, uid} = result.user

        //se não tiver nome ou foto, lança um erro
        if(!displayName || !photoURL){
          throw new Error('Missing information from Google account.')
        }

        //Cria um objeto na variável 'user' contendo os dados do usuário
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    }

  return (
    <BrowserRouter>
      {/* Fornece acesso ao contexto para todas as páginas através de um obj*/}
      <AuthContext.Provider value={{user, signInWithGoogle}}>

        <Route path="/" exact component={Home}></Route>
        <Route path="/rooms/new" component={NewRoom}></Route>

      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
