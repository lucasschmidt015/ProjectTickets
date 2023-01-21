import './Profile.css';

import Header from '../../components/Header';
import Title from '../../components/Title';

import { useState, useContext } from 'react';
import { FiSettings, FiUpload } from 'react-icons/fi';

import Avatar from '../../assets/avatar.png'

import { AuthContext } from '../../Contexts/auth';
import firebase from '../../services/FirebaseConnection';

export default function Profile(){

    const { user, setUser, storageUser, SignOut } = useContext(AuthContext);

    const [nome, setNome] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email);
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl); // Essa state vai armazenar a imagem do usuário já buscou direto do banco
    const [imageAvatar, setImageAvater] = useState(null); // Essa state vai armazenar temporariamente a foto carregada pelo usuário

    async function handleSubmit(e){
        e.preventDefault();

        if (imageAvatar === null && nome !== ''){
            await firebase.firestore().collection('users')
            .doc(user.uid)
            .update({
                nome: nome
            })
            .then(() => {
                let data = {
                    ...user,
                    nome: nome
                }
                setUser(data);
                storageUser(data);
            })
        }
        else if (nome !== '' && imageAvatar !== null){
            handleUpload();
        }
        
    }

    async function handleUpload(){
        const currentUid = user.uid;

        const uploadTask = await firebase.storage()
        .ref(`images/${currentUid}/${imageAvatar.name}`)
        .put(imageAvatar)
        .then(async () => {
            await firebase.storage().ref(`images/${currentUid}`)
            .child(imageAvatar.name).getDownloadURL()
            .then(async (url) => {
                let URLFoto = url;
                await firebase.firestore().collection('users').doc(user.uid).update({
                    avatarUrl: URLFoto,
                    nome: nome,
                })
                .then(() => {
                    let data = {
                        ...user,
                        avatarUrl: URLFoto,
                        nome: nome
                    };

                    setUser(data);
                    storageUser(data);
                })
            })            
        })

    }

    //Esse função é chamada no onChange do imput do tipo file, vai servir pra carregar uma imagem
    function handleFile(img){
        if(img.target.files[0]){
            const image = img.target.files[0];

            if (image.type === 'image/jpeg' || image.type === 'image/png'){
                setImageAvater(image)
                setAvatarUrl(URL.createObjectURL(img.target.files[0]))
            }else{
                alert("Envie uma imagem do tipo png ou jpeg")
                setImageAvater(null);
                return null;
            }
        }
    }

    return(
        <div>
            <Header/>
            <div className="content">
                <Title name="Meu perfil">
                    <FiSettings size={25}/>
                </Title>
                
                <div className='container'>
                    <form className='form-profile' onSubmit={handleSubmit}>
                        <label className='label-avatar'>
                            <span>
                                <FiUpload color='#fff' size={25}/>
                            </span>
                            <input type="file" accept="image/*" onChange={handleFile}/>
                            { avatarUrl === null ? 
                                <img src={Avatar} width="250" height="250" ald="Foto de perfil do usuário"/> 
                                : 
                                <img src={avatarUrl} width="250" height="250" ald="Foto de perfil do usuário"/> 
                            }
                        </label>

                        <label>Nome</label>
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)}/>
                        <label>Email</label>
                        <input type="text" value={email} disabled={true}/>

                        <button type='submit'>Salvar</button>
                    </form>
                </div>

                <div className='container'>
                    <button onClick={SignOut} className='LogOut_btn'>Sair</button>
                </div>

            </div>
        </div>
    );
}




