import { createContext, useReducer } from "react";
import { AuthReducer } from "./AuthReducer";


const INITIAL_STATE = {
    user: {
      _id:"64f1b138c01c25c5e94abbca",
      username:"hopago",
      email:"ghwns818@gmail.com",
      profilePicture:"",
      coverPicture:"",
      followings: ["64f1bde2b6001b98032261cf"],
      followers:["64f1bde2b6001b98032261cf"],
      "followings":[],
      "isAdmin":true
    },
    isFetching: false,
    error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    return (
        <AuthContext.Provider
          value={{
            user: state.user,
            isFetching: state.isFetching,
            error: state.error,
            dispatch
          }}
        >
            {children}
        </AuthContext.Provider>
    )

};