import { useState } from "react";

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [authError, setAuthError] = useState('');
const [isLoggingOn, setIsLoggingOn] = useState(false);

function Logon({
    onSetEmail = () => {},
    onSetToken = () => {},
  }) {
  
  }

async function handleSubmit(event) {
    event.preventDefault();

    setIsLoggingOn(true);

    try {
        const response = await fetch('/api/users/logon', {
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({email, password}),
        })
    } catch (error) {
        
    } finally {
        
    }

    
}