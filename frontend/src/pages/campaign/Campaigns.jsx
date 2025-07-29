import { Button, Form, InputGroup, Container, Spinner } from "react-bootstrap";
import { CampaignsList, ScrollTopButton } from "../../components/index";
import { body } from "../../data/data";
import { useEffect, useState } from "react";
import axios from 'axios'

const BACK_URL = import.meta.env.VITE_BACK_URL;

function Campaigns() {
  const [hidePB, setHidePB] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [campaignsList, setCampaignsList] = useState([])
  const entityData = JSON.parse(localStorage.getItem('EntityData'))
  const isEntity = entityData !== null


  useEffect(() => {
    window.scrollTo(0,0)
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setHidePB(scrollTop > 100);
    };
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    const fetchData = async () => {
      await delay(2000)
      try {
        console.log(`BACK_URL: ${BACK_URL}`)
        const response = await axios.get(`${BACK_URL}/campanhas`)
        setCampaignsList(response.data)
        setLoading(false)
        console.log(`response.data: ${JSON.stringify(response.data, null, 2)}`)
      } catch (err) {
        console.warn(`Erro no fetch de campanhas: ${err.message}`)
      }
    }
    fetchData()
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  }, []);

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

  function getContent() {
    return (
      <>
        <div className="d-flex justify-content-center mb-4">
          <InputGroup
            className="search-tool"
            style={{ maxWidth: "700px"}}
          >
            <Form.Control className="fs-5" placeholder="Buscar campanhas..." />
            <Button className="filtering-btn fs-5">Filtros</Button>
          </InputGroup>
        </div>
        <CampaignsList campaigns={campaignsList} withHelp={!isEntity}/>
      </>
    )
  }

  return (
    <>
      <section
        id="div1"
        className="d-flex align-items-start bg-dark text-white"
      >
        <div
          className="overlay"
          style={{
            backgroundImage: `url(${body.bg4})`,
            backgroundPosition: "bottom",
          }}
        />

        <div className="content container-fluid m-5 p-5">
          <div className="row py-5 mt-5">
            <div
              id="pb"
              className={`col-md-6 mt-5 py-5 ${hidePB ? "hidden" : ""}`}
            >
              <h1 className="display-1 mt-5">{body.titleCamp}</h1>
              <p className="lead text-light">{body.descCamp}</p>
            </div>
          </div>
        </div>
      </section>
      <div className="container-fluid bgsecclr py-4">
        {isLoading ? getSpinner() : getContent()}
        <ScrollTopButton />
      </div>
    </>
  );
}

export default Campaigns;
