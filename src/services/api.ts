import axios from 'axios';

export const api = axios.create({
    // No IOS funciona o localhost.
    // No caso do Android use o endereco fisico da sua maquina
    // Para saber o seu endereco IP quando vc executa npx expo start
    //Metro waiting on exp://192.168.0.189:19000

    baseURL: 'http://192.168.0.189:3333'
    //baseURL: 'http://localhost:3333'



});