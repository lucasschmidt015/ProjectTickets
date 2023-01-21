import './SignIn.css'
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { AuthContext } from '../../Contexts/auth';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { SignIn, loadingAuth } = useContext(AuthContext)

  function handleSubmit(e){
    e.preventDefault();
    if (email !== '' && password !== ''){
      SignIn(email, password)
    }
  }

    return (
      <div className='container-center'>
        <div className='login'>
          <div className='logo-area'>
            <img src={logo} alt="Sitema logo"/>
          </div>
          <form onSubmit={handleSubmit}>
            <h1>Entrar</h1>
            <input type="text" placeholder='email@email.com' value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" placeholder='**********' value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button type='submit'>{loadingAuth ? "Carregando..." : "Acessar"}</button>
          </form>

          <Link to="/register">Criar uma conta</Link>
        </div>
      </div>
    );
  }
  
  export default SignIn;
  