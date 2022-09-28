import { useContext } from "react";
import Authcontext from '../components/AuthContext'

const useAuth = () => {
    const { user, setUser, token, setToken, isLoggedIn, setIsLoggedIn, item } = useContext(Authcontext);
    return { user, setUser, token, setToken, isLoggedIn, setIsLoggedIn, item };
}
export default useAuth;