//Comentei a pedido do Diego
//import Head from 'next/head'
//import Image from 'next/image'
//import styles from '../styles/Home.module.css'

//COmo usar um componente criado por vc
//import { Tweet } from "../components/Tweet"

//Comentar abaixo quando pensar apenas no HTML
interface HomeProps {
  poolCount: number;
  guessCount: number;
  usersCount: number;
}

import Image from 'next/image'
import appPreviewImg from '../assets/app-nlw-copa-preview.png'
import logoImg from '../assets/logo.svg'
import usersAvatarExampleImg from '../assets/users-avatar-example.png'
import iconCheckImg from '../assets/icon-check.svg'

import { api } from '../lib/axios';
import { FormEvent, useState } from 'react';
import { PollingWatchKind } from 'typescript';

export default function Home(props: HomeProps) {

  //Cria um State. No State temos acesso em tempo real nela
  //  O useState Retorna um array onde na primeira posicao o valor da variavel 
  //  e no segundo uma funcao para atualizacao desta variavel
  // Assim para alterar o valor desta variavel vc precisa usar o metodo setPoolTitle
  const [poolTitle, setPoolTitle] = useState('')

  console.log(poolTitle)

  async function createPool(event: FormEvent){
    //Este evento previne o comportamento padrao do formulario e nao deixa recarregar
    event.preventDefault()
    
    try{
      const response = await api.post('/pools', {
        title: poolTitle,
      })

      const { code } = response.data

      //Copia para a area de transferencia do usuario
      await navigator.clipboard.writeText(code)

      alert('Bolao criado com sucesso. O Codigo foi copiado para a area de transferencia')

      //Limpa o campo texto depois
      setPoolTitle('')

    }catch (err){
      console.log(err)
      alert('Falha ao criar o bolao')
    }
 
    
  }
  
  //Abaixo faz uma requisicao HTTP para nosso backend sem uso do Nextjs. Usa Reactive puro
  //Da forma como o comando esta abaixo só sera executado se o javascript estiver habilitado
  /*
  fetch('http://localhost:3333/pools/count')
  .then(response => response.json())
  .then(data => {
    console.log(data)
  })
  //Este console log sai la no browser
  */

 

  return (
   /* <div>
      <Tweet text="Meu primeiro componente" />
      <Tweet text="Meu segundo componente" />
      <Tweet text="Meu terceiro componente" />
    </div>
    */
   //<h1 className="text-violet-500 font-bold text-xl">Contagem XXX: {props.count}</h1>

   

   //Abaixo a HTML principal do projeto
   <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
    <main>
      <Image src={logoImg} alt="NLW Copa" />

      <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
        Crie seu proprio bolao da copa e compartilhe entre amigos!
      </h1>

      <div className='mt-10 flex items-center gap-2 '>
      <Image src={usersAvatarExampleImg} alt="" />
      <strong className='text-gray-100 text-xl'>
        <span className='text-ignite-500 text-xl'>+{props.usersCount}</span> pessoas já estão usando
      </strong>
      </div>

      <form onSubmit={createPool} className='mt-10 flex gap-2'>
        <input 
        className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
        type="text" 
        required 
        placeholder="Qual o nome do seu bolão?"
        onChange={event => setPoolTitle(event.target.value)}
        value={poolTitle}
        />
        <button 
        className='bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase'
        type="submit">
          Criar meu bolão
        </button>
      </form>

      <p className='mt-4 text-sm text-gray-300 leading-relaxed' > 
      Após criar seu bolão, vc receberá um código único que poderá usar para convidar outras pessoas
      </p>

      <div className='mt-10 pt-10 border-t border-gray-600 items-center flex justify-between text-gray-100'>
        <div className='flex items-center gap-6'>
          <Image src={iconCheckImg} alt="" />
          <div className='flex flex-col'>
            <span className='font-bold text-2xl'>+{props.poolCount}</span>
            <span className='text-base'>Bolões Criados</span>
          </div>
        </div>

        <div className='w-px h-14 bg-gray-600'/>

        <div className='flex items-center gap-6'>
        <Image src={iconCheckImg} alt="" />
          <div className='flex flex-col'>
            <span className='font-bold text-2xl'>+{props.guessCount}</span>
            <span>Palpites Enviados</span>
          </div>
        </div>
      </div>

    </main>

    <Image 
    src={appPreviewImg} 
    alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa"
    quality={100}
    />
   </div>

  )
}

//Usando o nextjs
//Comentar abaixo quando pensar apenas no HTML

export const getServerSideProps = async () => {
  // As duas linhas abaixo nao sao performaticas. Entao usar o promise para executar em paralelo
  //const poolCountResponse = await api.get('/pools/count')
  //const guessCountResponse = await api.get('/guesses/count')

  const [poolCountResponse, guessCountResponse, usersCountResponse] = await Promise.all([
    api.get('/pools/count'),
    api.get('/guesses/count'),
    api.get('/users/count')
  ])
  

  // Este console log saiu do lado do servidor e nao mais no browser
  //console.log(data)
  
  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      usersCount: usersCountResponse.data.count,
    }
  }
  
  

}


