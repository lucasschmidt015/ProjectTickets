import './Header.css'
import { AuthContext } from '../../Contexts/auth';
import	{ useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiUser, FiSettings } from "react-icons/fi";

import AvatarDefault from '../../assets/avatar.png'

export default function Header(){

    const { user } = useContext(AuthContext);

    return(
        <div className='sidebar'>
            <div>
                <img src={user.avatarUrl === null ? AvatarDefault : user.avatarUrl } alt="Foto avatar"/>
            </div>            
            <Link to={"/deshboard"}>
              <FiHome color='#fff' size={24}/>
              Chamados
            </Link>

            <Link to={"/customers"}>
              <FiUser color='#fff' size={24}/>
              Clientes
            </Link>

            <Link to={"/profile"}>
              <FiSettings color='#fff' size={24}/>
              Configurações
            </Link>
        </div>
    );
}