import './Customers.css'

import Title from '../../components/Title'
import Header from '../../components/Header'

import { FiUser } from 'react-icons/fi';
import { useState } from 'react';
import { toast } from 'react-toastify';

import firebase from '../../services/FirebaseConnection';

export default function Customers(){

    const [nomeFantasia, setNomeFantasia] = useState('');
    const [CNPJ, setCNPJ] = useState('');
    const [endereco, setEndereco] = useState('');
    const [cadastrandoCliente, setCadastrandoCliente]  = useState(false);

    async function hendleAdd(e){
        e.preventDefault();
        setCadastrandoCliente(true);
        if (nomeFantasia !== '' && CNPJ !== '' && endereco !== '')
        {
            await firebase.firestore().collection('customers')
            .add({
                nomeFantasia: nomeFantasia,
                CNPJ: CNPJ,
                endereco: endereco,
            })
            .then(() => {
                setNomeFantasia('');
                setCNPJ('');
                setEndereco('');
                toast.info("Empresa cadastrada com sucesso.");
            })
            .catch((error) => {
                console.log(error);
                toast.error("Erro ao cadastrar essa empresa.");
            })
        }
        else{
            toast.error("Preencha todos os campos");
        }
        setCadastrandoCliente(false);
    }

    return(
        <div>
            <Header/>
            
            <div className='content'>
                <Title name = "Clientes">
                    <FiUser size={25} />
                </Title>

                <div className='container'>
                    <form className='form-profile customers' onSubmit={hendleAdd}>
                        <label>Nome fantasia</label>
                        <input type="text" placeholder='Nome da sua empresa' value={nomeFantasia} onChange={(e) => setNomeFantasia(e.target.value)}/>

                        <label>CNPJ</label>
                        <input type="text" placeholder='Seu CNPJ' value={CNPJ} onChange={(e) => setCNPJ(e.target.value)}/>

                        <label>Endere??o</label>
                        <input type="text" placeholder='Endere??o da empresa' value={endereco} onChange={(e) => setEndereco(e.target.value)}/>

                        <button type='submit' >{cadastrandoCliente ? "Cadastrando" : "Cadastrar"}</button>
                    </form>
                </div>
            </div>

        </div>
    );
}