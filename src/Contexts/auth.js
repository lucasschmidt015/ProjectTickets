import { createContext, useState, useEffect } from "react"; 
import firebase from "../services/FirebaseConnection"
import { toast } from "react-toastify";


export const AuthContext = createContext({});

// Esse operador !! no user serve para converter para boleano, se tiver algum dado dentro do objeto user vai retornar true, se não tiver nenhum dado vai retornar false

function AuthProvider({children}){
    
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    function loadStorage(){
        const storageUser = localStorage.getItem("SistemaUser");

        if(storageUser){
            setUser(JSON.parse(storageUser))
            setLoading(false);
        }

        setLoading(false);
    }


    useEffect(() => {
        loadStorage();    

    }, [])

    //Fazendo login de um usuário
    async function SignIn(email, password){
        setLoadingAuth(true);
        await firebase.auth().signInWithEmailAndPassword(email, password)
        .then( async (value) => {
            let uid = value.user.uid;
            const userProfile = await firebase.firestore().collection('users').doc(uid).get();
            
            let data = {
                uid: uid,
                nome: userProfile.data().nome,
                avatarUrl: userProfile.data().avatarUrl,
                email: value.user.email,
            }

            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
            toast.success("Bem vindo de volta!");

        })
        .catch((error) => {
            console.log("Erro:" + error)
            toast.error("Ops, algo deu errado!");
            setLoadingAuth(false);
        })
    }

    //Cadastrando um novo usuário
    async function SignUp(email, password, name){
        setLoadingAuth(true);
        await firebase.auth().createUserWithEmailAndPassword(email, password)
        .then( async (value) => {
            let uid = value.user.uid;

            await firebase.firestore().collection('users')
            .doc(uid).set({
                nome: name,
                avatarUrl: null,                
            })
            .then(() => {
                let data = {
                    uid: uid,
                    nome: name,
                    email: value.user.email,
                    avatarUrl: null,
                };

                setUser(data);
                storageUser(data);
                setLoadingAuth(false);
                toast.success("Bem vindo a plataforma!");
            })
        })
        .catch((error) => {
            console.log(error);
            toast.error("Ops, algo deu errado!")
            setLoadingAuth(false);
        })
    }

    function storageUser(data){
        localStorage.setItem('SistemaUser', JSON.stringify(data));
    }

    async function SignOut(){
        await firebase.auth().signOut();
        localStorage.removeItem('SistemaUser');
        setUser(null);
    }


    return(
        <AuthContext.Provider 
        value={{signed: !!user,
           user,
           loading,
           SignUp,
           SignOut,
           SignIn,
           loadingAuth,
           setUser,
           storageUser}}
        >
            {children}
        </AuthContext.Provider>
    );
}


export default AuthProvider;