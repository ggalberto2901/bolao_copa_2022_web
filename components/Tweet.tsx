
//Componente sempre tem que iniciar com letra maiuscula para diferenciar de tag HTMl
export function Tweet(props){
    return(
        <div>
            <h1>Tweet</h1>
            <p>{props.text}</p>
            <button>Curtir</button>
        </div>
    )

}