import './App.css'
import { useState } from 'react'
import TodosPage from './features/Todos/TodosPage'
import Header from './shared/Header'
import Logon from './features/Logon'

function App() {

  
  return (
    <div>
      <Header />
      <TodosPage />
    </div>
  )
}

export default App
