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