import { BrowserRouter, Route } from "react-router-dom";

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";

import { AuthContextProvider } from "./contexts/AuthContext";

function App() {


  return (
    <BrowserRouter>
      {/* Fornece acesso ao contexto para todas as páginas através de um obj*/}
      <AuthContextProvider>
        <Route path="/" exact component={Home}></Route>
        <Route path="/rooms/new" component={NewRoom}></Route>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
