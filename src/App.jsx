import './App.css'
import { Routes, Route } from 'react-router';
import Header from './shared/Header'
import TodosPage from './features/Todos/TodosPage'
import Logon from './features/Logon'


function App() {
  

  return (
    <>
      <Header />
      {isAuthenticated ? <TodosPage /> : <Logon />}
    </>
  );
}

export default App;