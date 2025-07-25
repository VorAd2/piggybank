import { Container, Button, Spinner } from "react-bootstrap";
import { CampaignsList, ScrollTopButton } from "../../components/index";
import { body, publishCamp } from "../../data/data";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/PublishCampaign.css";
import axios from 'axios'
const BACK_URL = import.meta.env.VITE_BACK_URL

function PublishCampaign() {
  const [hideHeroText, setHideHeroText] = useState(false);
  const [isLoading, setIsLoading] = useState(true)
  const [campaigns, setCampaigns] = useState([])
  const EntityData = JSON.parse(localStorage.getItem('EntityData'))
  const isEntity = EntityData != null
  const entityId = isEntity && EntityData.id_usuario
  const navigate = useNavigate()

  const [campanhaToDelete, setCampanhaToDelete] = useState(null);

  useEffect(() => {
    window.scrollTo(0,0)
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setHideHeroText(scrollTop > 100);
    };
    const fetchCamp = async () => {
      try {
        const response = await axios.get(`${BACK_URL}/campanhas`)
        const camps = response.data
        const control = []
        for (let c of camps) {
          if (c.fk_id_entidade_criadora_campanha === entityId) {
            control.push(c)
          }
        }
        setCampaigns(control)
      } catch (err) {
        console.log(`Erro ao consultar campanhas cadastradas: ${err}`)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCamp()
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function getHeroButton() {
    return (
      <button
      onClick={() => navigate(isEntity ? '/nova-campanha': '/cadastro/entidade')}
      className="btn-new-campaign mt-4 registerCampaignBtn"
      >
      {isEntity ? publishCamp.heroBtnTitle2 : publishCamp.heroBtnTitle1}
      </button>
    )
  }

  function getHeroTitle() {
    return isEntity ? publishCamp.title2 : publishCamp.title1
  }

  const handleDelete = () => {

  };

  function getSpinner() {
    return (
      <>
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <Spinner animation="grow" role="status">
              <span className="visually-hidden">Carregando...</span>
          </Spinner>
        </Container>
      </>
    )
  }

  return (
    <>
      <section
        id="div1"
        className="d-flex align-items-start bg-dark text-white mb-3"
      >
        <div
          className="overlay"
          style={{
            backgroundImage: `url(${body.bg4})`,
          }}
        />
        <div
          className="content container-fluid m-5 p-5"
          style={{ position: "relative", zIndex: 1 }}
        >
          <div className="row py-5 mt-5">
            <div
              id="hero-text"
              className={`col-md-6 mt-2 py-5 ${hideHeroText ? "hidden" : ""}`}
            >
              <h1 className="display-1 mt-3">{getHeroTitle()}</h1>
              <p className="lead text-light">
                Aqui você cria e gerencia suas campanhas!
              </p>
              {getHeroButton()}
            </div>
          </div>
        </div>
      </section>

      {isLoading ? getSpinner() : <CampaignsList campaigns={campaigns} withDelete={true} withHelp={false}/>}
      
      <ScrollTopButton />

      {/* Modal para confirmar exclusão de cmp*/}
      {campanhaToDelete && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <p className="fw-bold mb-3">
              Tem certeza de que deseja excluir a campanha ${}
            </p>
            <div className="d-flex justify-content-between">
              <Button
                variant="secondary"
                onClick={() => setCampanhaToDelete(null)}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(campanhaToDelete.id)}
              >
                Apagar campanha
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PublishCampaign;
