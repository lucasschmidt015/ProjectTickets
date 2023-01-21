import { Routes, Route } from "react-router-dom";

import SignIn from '../Pages/SignIn';
import SignUp from '../Pages/SignUp';
import Deshboard from "../Pages/Deshboard/index.js";
import Profile from '../Pages/Profile'
import Customers from "../Pages/Customers";
import New from "../Pages/New";

import RouteWrapper from "./Route";

export default function AllRoutes(){
    return (
        <Routes>
            <Route path="/" element={<RouteWrapper loggedComponent={<Deshboard/>} defaultComponent={<SignIn />}/>}/>
            <Route path="/register" element={<RouteWrapper loggedComponent={<Deshboard/>} defaultComponent={<SignUp />}/>}/>
            <Route path="/deshboard" element={<RouteWrapper loggedComponent={<Deshboard/>} defaultComponent={<Deshboard />} isPrivate />}/>
            <Route path="/profile" element={<RouteWrapper loggedComponent={<Profile/>} defaultComponent={<Deshboard/>} isPrivate />}/>
            <Route path="/customers" element={<RouteWrapper loggedComponent={<Customers/>} defaultComponent={<Deshboard/>} isPrivate />}/>
            <Route path="/new" element={<RouteWrapper loggedComponent={<New/>} defaultComponent={<Deshboard/>} isPrivate />}/>
            <Route path="/new/:id" element={<RouteWrapper loggedComponent={<New/>} defaultComponent={<Deshboard/>} isPrivate />}/>
        </Routes>
    );
}