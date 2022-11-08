import { createContext, ReactNode, useState, useEffect } from "react";

import * as AuthSession from 'expo-auth-session'

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google'

import { api } from '../services/api';

//Garante o redirecionamento do navegador
WebBrowser.maybeCompleteAuthSession();

interface UserProps {
    name: string;
    avatarUrl: string;
}

export interface AuthContextDataProps {
    user: UserProps;
    isUserLoading: boolean;
    signIn: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode
}

//Funcao de AuthContext é armazenar nosso contexto
export const AuthContext = createContext({} as AuthContextDataProps);

//A funcao abaixo é compartilhar o nosso contexto armazenado em AuthContext com toda nossa aplicacao
export function AuthContextProvider({ children }: AuthProviderProps){

//Criando um estado para o Usuario e compartilhar este com toda a aplicacao no return
const [user, setUser] = useState<UserProps>({} as UserProps);

//Criando um estado para ver se o usuario esta sendo autenticado
const [ isUserLoading, setIsUserLoadinhg ] = useState(false); 

// O retorno promptAsync permite iniciar o fluxo de autenticacao que sera realizado dentro da funcao signIn
const [ request, response, promptAsync] = Google.useAuthRequest({
        
        //Dado sensivel
        //clientId:'575410639923-t40rif0ueeeg5t0m28093l2fc0h2gu9r.apps.googleusercontent.com',
        clientId: process.env.CLIENT_ID,
        redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
        scopes: ['profile', 'email']
    });

    //console.log(AuthSession.makeRedirectUri({ useProxy: true }));

    async function signIn(){
        try {
            setIsUserLoadinhg(true);
            //Esta funcao inicia o processo de autenticacao
            await promptAsync();
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setIsUserLoadinhg(false);
        }
    }

    async function signInWithGoogle(access_token: string){
        try {
            
            setIsUserLoadinhg(true);
            //Obtendo o access_token do backend
            const tokenResponse = await api.post('/users', { access_token });

            //Colocar este token no header das requisicoes.
            // A partir de agora todas as requisicoes terao no header o access_token
            api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`;
            
            //Requisitando as informacoes do usuario para o backend
            const userInfoResponse = await api.get('/me');

            //console.log(userInfoResponse.data);
            
            //Agora vamos colocar as informacoes do usuario e colocaremos no estado setUser
            setUser(userInfoResponse.data.user);


        } catch (error) {
            console.log (error);
            throw error;
        } finally {
            setIsUserLoadinhg(false);
        }

    }


    //Esta funcao do react fica escutando se existe alguma resposta de autenticacao. 
    //Esta funcao sempre eh executada quando nosso componente é renderizado
    useEffect(() => {
        if (response?.type === 'success' && response.authentication?.accessToken){
            signInWithGoogle(response.authentication.accessToken);
        }

    }, [response]);

    return(
        // Declaracao children la emcima para que esta tag seja filha 
        <AuthContext.Provider value={{
            signIn,
            isUserLoading,
            user,
        }}>
            {children } 

        </AuthContext.Provider>
    )

}
