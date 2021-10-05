import { createContext, ReactNode, useEffect, useState } from "react"
import { auth, firebase } from "../services/firebase"

type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>
  }
  
  type User = {
    id: string;
    name: string;
    avatar: string;
  }
  
type AuthContextProviderProps = {
    children: ReactNode
}


//cria um contexto tendo como tipo qualquer coisa
export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider(props: AuthContextProviderProps){

    //Cria um estado para armazenar dados do usuário
  const [user, setUser] = useState<User>()

  /**
   * Procura no banco de dados do firebase
   * um login ja existente para aquele usuário
   */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {

      if(user){
        const {displayName, photoURL, uid} = user

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

    })

    return () => {
      unsubscribe()
    }
  }, [])

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

      return(
          <AuthContext.Provider value={{user, signInWithGoogle}}>
              {props.children}
          </AuthContext.Provider>
      )
}