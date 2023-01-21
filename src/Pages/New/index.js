import './New.css';

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../Contexts/auth';
import Header  from '../../components/Header';
import  Title  from '../../components/Title'

import { FiPlusCircle } from 'react-icons/fi';

import firebase from '../../services/FirebaseConnection';
import { toast } from 'react-toastify';

import { useParams, useNavigate } from 'react-router-dom'

export default function New(){
    const { id } = useParams();
    const Navegar = useNavigate();
    const { user } = useContext(AuthContext);

    const [customers, setCustomers] = useState([])
    const [loadingCustomers, setLoadingCustomers] = useState(true);
    const [customerSelected, setCurstomerSelected] = useState(0);

    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus ]  = useState('Aberto');
    const [complemento, setComplemento] = useState('');

    const [idCustomer, setIdCustomer] = useState(false);


    useEffect(() => {
        //Essa função vai buscar os clientes cadastrados no banco
        async function loadingCustomers(){
            await firebase.firestore().collection('customers')
            .get()
            .then((snapshot) => {
                let lista = [];
                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia,

                    })
                })

                if (lista.length === 0){
                    console.log("Nenhuma empresa encontrada");
                    setLoadingCustomers(false);
                    setCustomers([{id: 1, nomeFantasia: 'Freela'}]);
                    return;
                }

                setCustomers(lista);
                setLoadingCustomers(false);

                //Vai passar a lista para a state loadId quando estiver recebendo o parms id, isso significa que é uma edição e não um cadastro
                if (id){
                    loadId(lista)
                }
            })
            .catch((error) => {
                console.log("Deu algum erro, " + error);
                setLoadingCustomers(false);

                setCustomers([{id: 1, nomeFantasia: ''}]);
            })
        }

        loadingCustomers();
    }, []);

    //Quando for uma edição, essa função vai ir no banco e buscar os dados do chamado especifico que está em edição e setalos para a state
    async function loadId(lista){
        await firebase.firestore().collection('chamados').doc(id)
        .get()
        .then((snapshot) => {
            setAssunto(snapshot.data().assunto);
            setStatus(snapshot.data().status);
            setComplemento(snapshot.data().complemento);

            let index = lista.findIndex(item => item.id === snapshot.data().clienteId);

            setCurstomerSelected(index);

            setIdCustomer(true);
        })
        .catch((error) => {
            console.log("Erro no id passado ", error);
            setIdCustomer(false);
        })
    }

    //vai chamar quando clicar em registrar
    async function handleRegister(e){
        e.preventDefault();

        //Se tivar alguma coisa na state IdCustomers, significa que se trata de uma edição 
        if (idCustomer){
            await firebase.firestore().collection('chamados').doc(id)
            .update({
                cliente: customers[customerSelected].nomeFantasia,
                clienteId: customers[customerSelected].id,
                assunto: assunto,
                status: status,
                complemento: complemento,
                userId: user.uid,
            })
            .then(() => {
                toast.success("Chamado editado com sucesso.");
                setComplemento('');
                setCurstomerSelected(0);
                Navegar('/deshboard');
            })
            .catch((erro) => {
                toast.error("Ops, erro ao atualizar");
                console.log("Erro ao cadastrar: ", erro);
            })
            return;
        }
        
        await firebase.firestore().collection('chamados')
        .add({
            created: new Date(),
            cliente: customers[customerSelected].nomeFantasia,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            status: status,
            complemento: complemento,
            userId: user.uid,
        })
        .then(() => {
            toast.success("Chamado criado com sucesso!");
            setComplemento('');
            setCurstomerSelected(0);
        })
        .catch((error) => {
            toast.error("Ops, erro ao registrar, tente mais tarde.")
            console.log("Error");
        })

    }

    //Chama quando troca o status
    function handleChangeSelect(e){
        setAssunto(e.target.value);
    }


    //Chama quando troca o assunto
    function handleOptionChange(e){
        console.log(e.target.value);
        setStatus(e.target.value);
    }

    //Vai ser chamada sempre que um cliente for selecionado na listagem
    function handleChangeCustomers(e){
        // console.log("Index do cliente selecionado: ", e.target.value);
        // console.log("Cliente selecionado: ", customers[e.target.value])
        setCurstomerSelected(e.target.value);
    }

    return(
        <div>
            <Header/>

            <div className='content'>
                <Title name="Novo chamado">
                    <FiPlusCircle size={25}/>
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleRegister}>
                        <label>Cliente:</label>
                        {loadingCustomers ? (
                            <input type="text" disabled={true} value="Carregando clientes..."/>
                        )
                        :
                        (
                            <select value={customerSelected} onChange={handleChangeCustomers}>
                            {
                                customers.map((doc, index) => {
                                    return(
                                        <option key={doc.id} value={index}>
                                            {doc.nomeFantasia}
                                        </option>
                                    );
                                })
                            }
                        </select>
                        )}
                        <label>Assunto:</label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option value='Suporte'>Suporte</option>
                            <option value="Visita Técnica">Visita Técnica</option>
                            <option value="Financeiro">Financeiro</option>
                        </select>

                        <label>Status</label>

                        <div className='status'>
                            <input 
                              type="radio"
                              name='radio'
                              value="Aberto"
                              onChange={handleOptionChange}
                              checked={status === 'Aberto'}
                              />
                              <span>Em aberto</span>

                            <input 
                              type="radio"
                              name='radio'
                              value="Progresso"
                              onChange={handleOptionChange}
                              checked={status === 'Progresso'}
                              />
                              <span>Progresso</span>

                            <input 
                              type="radio"
                              name='radio'
                              value="Atendido"
                              onChange={handleOptionChange}
                              checked={status === 'Atendido'}
                              />
                              <span>Atendido</span>
                        </div>     
                        <label>Complemento</label>           
                        <textarea
                          type="text"
                          placeholder='Descreva seu problema (Opcional).'
                          value={complemento}
                          onChange={(e) => setComplemento(e.target.value)}
                        />
                        <button type='submit'>Registrar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}