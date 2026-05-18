import { useState } from "react";

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

function Logon({
    onSetEmail = () => {},
    onSetToken = () => {},
  }) {
  
  }