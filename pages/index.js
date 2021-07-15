import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import {AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet} from '../src/lib/AlurakutCommons';
import {ProfileRelationsBoxWrapper} from '../src/components/ProfilesRelations';

function ProfileSidebar(propriedades){
  return(
    <Box>
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{borderRadius: '8px'}} />
      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
        </a>
      </p>
      <AlurakutProfileSidebarMenuDefault/>
    </Box>
  )
}

export default function Home() {
  const githubUser = 'Joao-Gontijo'
  const pessoasFavoritas = [
    'marc05v1', 
    'JhonatanGSantos', 
    'gabrielifg', 
    'aldo-pereira22', 
    'SamuelGomesRocha', 
    'EuripedesVieira']

  return (
    <>
      <AlurakutMenu/>
      <MainGrid>
        <div className="profileArea" style={{gridArea: 'profileArea'}}>
          <ProfileSidebar githubUser={githubUser}/>
        </div>
        <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
          <Box>
            <h1 className="title">
              Bem vindo
            </h1>
            <OrkutNostalgicIconSet/>
          </Box>
          <Box>
            <h2 className="subtitle">O que você deseja fazer?</h2>
            <form>
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
                  aria-label="Qual var ser o nome da sua comunidade?"/>
              </div>

              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da Comunidade ({pessoasFavoritas.length}) 
            </h2>
            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li>
                    <a href={`/users/${itemAtual}`} key={itemAtual}>
                      <img src={`https://github.com/${itemAtual}.png`}/>
                    <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <Box>
            Comunidades
          </Box>
        </div>     
      </MainGrid>
    </>
  )
}
