import { Heading, useToast, VStack } from "native-base";
import { useState } from "react";

import { api } from '../services/api';

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { useNavigation } from "@react-navigation/native";


export function Find(){

    const [isLoading, setIsLoading] = useState(false);

    const [code , setCode] = useState('');

    const toast = useToast();

    const { navigate } = useNavigation();


    async function handleJoinPool() {

        try {
            setIsLoading(true);

            if (!code.trim()){
                return toast.show({
                    title: 'Informe o código',
                    placement: 'top',
                    bgColor: 'red.500'
                }); 
            }

            //Chamar o endpoint para grava
            await api.post('/pools/join',{ code });
            
            //Depois de inserir levar o usuario para a tela de meus boloes.
            navigate('pools');

            return toast.show({
                title: 'Vc entrou no bolão com sucesso',
                placement: 'top',
                bgColor: 'green.500'
            }); 


        } catch (error) {
            console.log(error)
            setIsLoading(false);
            //No endpoint existe mensagens de erro normais. serao tratadas abaixo
            if (error.response?.data?.message === 'Pool not found.') {

                return toast.show({
                    title: 'Bolão não encontrado',
                    placement: 'top',
                    bgColor: 'red.500'
                }); 

            }

            //No endpoint existe mensagens de erro normais. serao tratadas abaixo
            if (error.response?.data?.message === 'You already joined this pool.') {

                return toast.show({
                    title: 'Voce já está neste bolão',
                    placement: 'top',
                    bgColor: 'red.500'
                }); 
            
            }

            toast.show({
                title: 'Não foi possível encontrar o bolão',
                placement: 'top',
                bgColor: 'red.500'
            });           
        } 
    }

    return(
        <VStack flex={1} bgColor="gray.900">
         <Header title="Buscar por código" showBackButton />

         <VStack mt={8} mx={5} alignItems="center">

            <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
                Encontre um bolão através de {'\n'}
                seu código único
            </Heading>

            <Input 
            mb={2} 
            placeholder="Qual o código do bolão?" 
            autoCapitalize="characters"
            onChangeText={setCode}
            />

            <Button 
            title="BUSCAR BOLÃO" 
            isLoading={isLoading}
            onPress={handleJoinPool}
            />

         </VStack>

        </VStack>
    );
}