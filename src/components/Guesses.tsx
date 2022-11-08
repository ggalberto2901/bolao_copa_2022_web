import { useToast, FlatList } from 'native-base';
import { useEffect, useState } from 'react';

import { api } from '../services/api';

import { Game, GameProps  } from '../components/Game';
import { Loading } from './Loading';

interface Props {
  poolId: string;
}

export function Guesses({ poolId }: Props) {

  const [isLoading, setIsLoading] = useState(true);
  const[games, setGames] = useState<GameProps[]>([]);

  const [firstTeamPoints, setFirstTeamPoints] = useState('');

  const [secondTeamPoints, setSecondTeamPoints] = useState('');

  const toast = useToast();

  async function fecthGames () {

    try {
      setIsLoading(true);

      const response = await api.get(`/pools/${poolId}/games`);
      setGames(response.data.games);
      
    } catch (error) {
      console.log(error);
            toast.show({
                title: 'Não foi possível carregar os detalhes do bolão selecionado',
                placement: 'top',
                bgColor: 'red.500'
            });

    } finally {
        setIsLoading(false);
      }
    
  }

  async function handGuessConfirm (gameId: string){

    try {

      if(!firstTeamPoints.trim() || !secondTeamPoints.trim()){
         return toast.show({
          title: 'Informe o placar do palpite',
          placement: 'top',
          bgColor: 'red.500'
      });
      }

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      });

      toast.show({
        title: 'Palpite realizado com sucesso!',
        placement: 'top',
        bgColor: 'green.500'
      });

      fecthGames();
      
    } catch (error) {
      console.log(error);
            toast.show({
                title: 'Não foi possível enviar o palpite',
                placement: 'top',
                bgColor: 'red.500'
            });

    } finally {
        setIsLoading(false);
      }

  }

  useEffect(() => {
    fecthGames();
}, [poolId]);

if (isLoading){
  return <Loading />
}

  return (
   <FlatList 
    data ={games}
    keyExtractor={item => item.id}
    renderItem={({ item }) => (
      <Game 
        data ={item}
        setFirstTeamPoints ={setFirstTeamPoints}
        setSecondTeamPoints ={setSecondTeamPoints}
        onGuessConfirm={() => handGuessConfirm(item.id) }
      />
    )}
   />
  );
}
