import { Navigate } from "react-router-dom";
import { AuthContext } from '../Contexts/auth'
import { useContext } from "react";



export default function RouteWrapper({loggedComponent, defaultComponent, isPrivate}){

    const { signed, loading } = useContext(AuthContext);

    if (loading)
    {
        return(
            <div></div>
        );
    }

    if (!signed && isPrivate){
        return <Navigate to="/"/>
    }

    if (signed &&  !isPrivate){        
        return <Navigate to="/deshboard"/>
    }

    return signed ? loggedComponent : defaultComponent;
    
}

