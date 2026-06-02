import './App.css'
import Header from './shared/Header'
import TodosPage from './features/Todos/TodosPage'
import Logon from './features/Auth/Logon'

function App() {
  return (
    <div>
      <Header />
      <Logon />
      <TodosPage />
    </div>
  )
}

export default App