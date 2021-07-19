import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfilesRelations';

function ProfileSidebar(propriedades) {
    return (
        <Box as="aside">
            <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
            <hr/>
            <p>
                <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
                    @{propriedades.githubUser}
                </a>
            </p>
            <hr/>
                <AlurakutProfileSidebarMenuDefault />
        </Box>
    )
}

function ProfileRelationsBox(propriedades){
    return(
        <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
                {propriedades.title} ({propriedades.items.length})
            </h2>
            {/* <ul>
                {comunidades.map((itemAtual) => {
                    return (
                        <li key={itemAtual.id}>
                            <a href={`/users/${itemAtual.title}`}>
                                <img src={itemAtual.image} />
                                <span>{itemAtual.title}</span>
                            </a>
                        </li>
                    )
                })}
            </ul> */}
        </ProfileRelationsBoxWrapper>
    )
}

export default function Home(props) {
    const user = props.githubUser;
    const [comunidades, setComunidades] = React.useState([]);
    const pessoasFavoritas = [
        'marc05v1',
        'JhonatanGSantos',
        'gabrielifg',
        'aldo-pereira22',
        'SamuelGomesRocha',
        'EuripedesVieira'];

    const [seguidores, setSeguidores] = React.useState([]);

    React.useEffect(function(){
        const seguidores = fetch('https://api.github.com/users/Joao-Gontijo/followers').then(function (respostaDoServidor){
            return respostaDoServidor.json();
        }).then(function(respostaCompleta){
            setSeguidores(respostaCompleta);
        })
        fetch('https://graphql.datocms.com/', {
            method: 'POST',
            headers: {
                'Authorization': 'e0c8bf1b6af02aa206d797408fc382',
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ "query":`
                query {
                    allCommunities {
                        id
                        title
                        imageUrl
                        creatorSlug
                    }
                }`})
        }).then((response) => response.json())
        .then((respostaCompleta) => {
            const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
            setComunidades(comunidadesVindasDoDato)
            console.log(comunidadesVindasDoDato);
        })
    }, [])
    
    return (
        <>
            <AlurakutMenu githubUser={user}/>
            <MainGrid>
                <div className="profileArea" style={{ gridArea: 'profileArea' }}>
                    <ProfileSidebar githubUser={user} />
                </div>

                <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
                    <Box>
                        <h1 className="title">
                            Bem vindo
                        </h1>
                        <OrkutNostalgicIconSet/>
                    </Box>

                    <Box>
                        <h2 className="subtitle">O que você deseja fazer?</h2>
                        <form onSubmit={function handleCriaComunidade(e) {
                            e.preventDefault();
                            const dadosDoForm = new FormData(e.target); //transformando os dados do formulário e trazendo retorno  
                            const comunidade = {
                                title: dadosDoForm.get('title'),
                                imageUrl: dadosDoForm.get('image'),
                                creatorSlug: user,
                            }

                            fetch('/api/comunidades', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(comunidade)
                            }).then(async (response) => {
                                const dados = await response.json();
                                console.log(dados.registroCriado);
                                const comunidade = dados.registroCriado
                                const comunidadesAtualizadas = [...comunidades, comunidade]
                                setComunidades(comunidadesAtualizadas);
                            })

                            
                        }}>
                            <div>
                                <input
                                    placeholder="Qual var ser o nome da sua comunidade?"
                                    name="title"
                                    aria-label="Qual var ser o nome da sua comunidade?"
                                    type="text"
                                />
                            </div>
                            <div>
                                <input
                                    placeholder="Coloque uma URL para usarmos de capa"
                                    name="image"
                                    aria-label="Qual var ser o nome da sua comunidade?" />
                            </div>

                            <button>
                                Criar comunidade
                            </button>
                        </form>
                    </Box>
                </div>

                <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
                    <ProfileRelationsBox title="Seguidores" items={seguidores}/>
                    <ProfileRelationsBoxWrapper>
                        <h2 className="smallTitle">
                            Comunidades ({comunidades.length})
                        </h2>
                        <ul>
                            {comunidades.map((itemAtual) => {
                                return (
                                    <li key={itemAtual.id}>
                                        <a href={`/communities/${itemAtual.id}`}>
                                            <img src={itemAtual.imageUrl} />
                                            <span>{itemAtual.title}</span>
                                        </a>
                                    </li>
                                )
                            })}
                        </ul>
                    </ProfileRelationsBoxWrapper>
                    <ProfileRelationsBoxWrapper>
                        <h2 className="smallTitle">
                            Pessoas da Comunidade ({pessoasFavoritas.length})
                        </h2>
                        <ul>
                            {pessoasFavoritas.map((itemAtual) => {
                                return (
                                    <li key={itemAtual}>
                                        <a href={`https://github.com/${itemAtual}`}>
                                            <img src={`https://github.com/${itemAtual}.png`} />
                                            <span>{itemAtual}</span>
                                        </a>
                                    </li>
                                )
                            })}
                        </ul>
                    </ProfileRelationsBoxWrapper>
                </div>
            </MainGrid>
        </>
    )
}

export async function getServerSideProps(context){
    const cookies = nookies.get(context);
    const token = cookies.USER_TOKEN;
    

    const {isAuthenticated} = await fetch('https://alurakut.vercel.app/api/auth', {
        headers: {
            Authorization: token
        }
    }).then((resposta) => resposta.json())

    console.log(isAuthenticated);

    if(!isAuthenticated){
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            }
        }
    }

    const {githubUser} = jwt.decode(token);

    return {
        props: {
            githubUser
        },
    }
}