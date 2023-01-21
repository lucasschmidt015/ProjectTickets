import './Deshboard.css'
import { useState, useEffect } from 'react';
import Header from "../../components/Header";
import Title from '../../components/Title'
import Modal from '../../components/Modal';
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import firebase from '../../services/FirebaseConnection';

import { format } from 'date-fns';

export default function Deshboard(){

    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isEmpty, setIsEmpty ] = useState(false);
    const [lastDoc, setLastDoc] = useState();
    const  [showModal, setShowModal] = useState(false);
    const [detail, setDetail] = useState();

    const listRef = firebase.firestore().collection('chamados').orderBy('created', 'desc');

    useEffect(() => {
        
        //Essa função vai fazer uma requisição ao banco e se obtiver sucesso, chamara a função que adiciona os dados retornados a uma state
        async function loadingChamados(){
            await listRef.limit(5)
            .get()
            .then((snapshot) => {
                updateState(snapshot);
            })
            .catch((erro) => {
                console.log("Error: ", erro)
                setLoadingMore(false);
            })
    
            setLoading(false);
        }
        
        
        loadingChamados();

        return () => {
            
        }
    }, []);

    
    // Essa função vai pegar o snapshot recebido na consulta ao banco e armazenar dentro da state
    async function updateState(snapshot){

        const isCollectionEmpty = snapshot.size === 0;

        if (!isCollectionEmpty)
        {
            let lista = [];

            snapshot.forEach((item) => {
                lista.push({
                    id: item.id,
                    assunto: item.data().assunto,
                    cliente: item.data().cliente,
                    clienteId: item.data().clienteId,
                    complemento: item.data().complemento,
                    created: item.data().created,
                    createdFormated: format(item.data().created.toDate(), 'dd/MM/yyyy'),
                    status: item.data().status,
                    userId: item.data().userId,
                })
            })

            const lastDocs = snapshot.docs[snapshot.docs.length - 1]; //Pegando o ultimo documento buscado para quando for buscar mais dados, saber a partir de qual buscar
            
            setChamados([...chamados, ...lista]);
            setLastDoc(lastDocs);
        }else{
            setIsEmpty(true);
        }

        setLoadingMore(false);

    }

    // Função de buscar mais registros
    async function handleMore(){
        setLoadingMore(true)
        await listRef.startAfter(lastDoc).limit(5)
        .get()
        .then((snapshot) => {
            console.log("Caiu no caso de sucesso")
            updateState(snapshot);
        })
        .catch(() => {
            setLoadingMore(false);
        })
    }

    //Função que vai abrir e fechar o modal de informações
    function togglePostModal(item){
        setShowModal(!showModal);
        setDetail(item)
    }

    if(loading){
        return(
            <div>
                <Header/>
                <div className='content'>
                    <Title name="Atendimentos">
                        <FiMessageSquare size={25}/>
                    </Title>
                    <div className='container deshboard'>
                        <span>buscado chamados...</span>
                    </div>
                </div>
            </div>
        )
    }

    return(
        <div>
            <Header/>
            <div className='content'>
                <Title name="Atendimentos">
                    <FiMessageSquare size={25}/>
                </Title>

                {chamados.length === 0 ? (

                    <div className='container deshboard'>
                        <span>Nenhum chamado registrado...</span>
                        <Link to="/new" className='new'>
                            <FiPlus size={25} color="#FFF"/>
                            Novo Chamado
                        </Link>
                    </div>)
                    : (
                    <>
                        <Link to="/new" className='new'>
                            <FiPlus size={25} color="#FFF"/>
                            Novo Chamado
                        </Link>

                        <table>
                            <thead>
                                <tr>
                                    <th scope='Col'>Cliente</th>
                                    <th scope='Col'>Assunto</th>
                                    <th scope='Col'>Status</th>
                                    <th scope='Col'>Cadastrado em</th>
                                    <th scope='Col'>#</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chamados.map((item, index) => {
                                    return(                                        
                                        <tr key={index}>
                                            <td data-Label="Cliente">{item.cliente}</td>
                                            <td data-Label="Assunto">{item.assunto}</td>
                                            <td data-Label="Status">
                                                <span className='badge' style={{backgroundColor: item.status ==='Aberto' ? '#5cb85c' : "#999"}}>{item.status}</span>
                                            </td>
                                            <td data-Label="Cadastrado">{item.createdFormated}</td>
                                            <td data-Label="#">
                                            <button className='action' onClick={() => togglePostModal(item)} style={{backgroundColor: '#3583f6'}}>
                                                <FiSearch color='#fff' size={17}/>
                                            </button>
                                            <Link className='action' style={{backgroundColor: '#f6af35'}} to={`/new/${item.id}`}>
                                                <FiEdit2 color='#fff' size={17}/>
                                            </Link>
                                            </td>
                                        </tr>                                        
                                    );
                                })}                                
                            </tbody>
                        </table>
                        {loadingMore && <h3 style={{textAlign: 'center', marginTop: 15}}>Buscando dados...</h3>}
                        { !loadingMore && !isEmpty && <button className='btn-more' onClick={handleMore}>Buscar mais</button>}                            
                    </>)                    
                }
                
            </div>
            {showModal && (
                <Modal
                  conteudo={detail}
                  close={togglePostModal}
                />
            )}
        </div>
    );
}