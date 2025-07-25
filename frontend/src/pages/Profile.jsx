import { userData as userInfoMock} from "../data/data";
import { body } from "../data/data";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileContext } from "../contexts/ProfileContext";
import { Container, Spinner } from "react-bootstrap";
import styles from '../styles/ProfilePage.module.css'
import axios from 'axios';
const BACK_URL = import.meta.env.VITE_BACK_URL

function Profile() {
  const {
    username,
    bio,
    email,
    interests,
    notifications,
    activity,
  } = userInfoMock;
  const [avatar, setAvatar] = useState(userInfoMock.avatar);
  const [showEditModal, setShowEditModal] = useState(false);
  const [hidePB, setHidePB] = useState(false);
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate();
  
  const profileType = localStorage.getItem('profileType')
  const forEntity = profileType === 'entity';
  const profileData = JSON.parse(localStorage.getItem(forEntity ? 'EntityData' : 'UserData'))
  const [campaigns, setCampaigns] = useState([])
  const { clearProfileData } = useContext(ProfileContext);

  async function fetchCampForDonator() {
    try {
      const response = await axios.get(`${BACK_URL}/users`)
      const data = response.data
      let control = []
      for (let user of data) {
        if (user.id_usuario === profileData.id_usuario) {
          for (let c of user.campanhas) {
            control.push(c)
          }
        }
      }
      setCampaigns(control)
    } catch(err) {
      console.warn(`Erro ao consultar campanhas do perfil: ${err}`)
    }finally {
      setIsLoading(false)
    }
  }

  async function fetchCampForEntity() {
    try {
      const response = await axios.get(`${BACK_URL}/campanhas`)
      const data = response.data
      console.log(`data: ${JSON.stringify(data, null, 2)}`)
      let control = []
      for (let camp of data) {
        if (camp.fk_id_entidade_criadora_campanha == profileData.id_usuario){
          control.push(camp)
        }
      }
      setCampaigns(control)
    } catch(err) {
      console.warn(`Erro ao consultar campanhas do perfil: ${err}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    window.scrollTo(0,0)
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setHidePB(scrollTop > 100);
    };
    console.log(`profileData: ${JSON.stringify(profileData, null, 2)}`)
    forEntity ? fetchCampForEntity() : fetchCampForDonator()
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    clearProfileData()
    navigate('/')
  }

  const handleCampaignClick = (camp) => {
    navigate('/campanha', {state: {data: camp, withHelp: !forEntity}})
  }

  function getCampaignsSection() {
    if (campaigns.length === 0) {
      return <span>Nenhum campanha até o momento</span>
    }
    return campaigns.map((c, i) => (
      <li
        key={i}
        className={`list-group-item d-flex justify-content-between align-items-center ${styles.campaign}`}
        style={{cursor: 'pointer'}}
        onClick={() => handleCampaignClick(c)}
      >
          {c.titulo}{" "}
          <span className="badge text-dark bg-warning">
            {c.recebido}
          </span>
      </li>
    ))
  }

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

  function getMainSection() {
    return (
      <section className="p-5 bgsecclr">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4 mt-4">
              <div className="card text-center shadow-sm py-5 mt-5">
                <div
                  className="card-body py-5"
                  style={{ color: "rgb(15, 55, 63)" }}
                >
                  <img src={avatar} 
                  className="rounded-circle mb-3"
                  width={"200px"}
                  height={"200px"}
                  alt="avatar" 
                  />
                  <h4 className="card-title">{profileData.nome_usuario}</h4>
                  <p>{bio}</p>
                  <button
                    className="btn btn-outline-warning w-100 mt-3"
                    onClick={() => setShowEditModal(true)}
                  >
                    {userInfoMock.btn}
                  </button>
                  <button 
                  className="btn btn-outline-danger w-100 mt-3"
                  onClick={handleLogout}
                  >
                    Sair da Conta
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-8">
              <div className="card shadow-sm mb-4">
                <div
                  className="card-header text-white"
                  style={{ backgroundColor: "rgb(15, 55, 63)" }}
                >
                  <strong>{userInfoMock.mainDesc}</strong>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-md-4">
                      <h5>{activity.donations}</h5>
                      <p className="text-muted">Doações</p>
                    </div>
                    <div className="col-md-4">
                      <h5>{activity.total}</h5>
                      <p className="text-muted">Total Contribuído</p>
                    </div>
                    <div className="col-md-4">
                      <h5>{activity.favorites}</h5>
                      <p className="text-muted">Causas Favoritas</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card shadow-sm mb-4">
                <div
                  className="card-header text-white"
                  style={{ backgroundColor: "rgb(15, 55, 63)" }}
                >
                  <strong>{forEntity ? userInfoMock.desc2 : userInfoMock.desc1}</strong>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    {getCampaignsSection()}
                  </ul>
                </div>
              </div>

              <div className="card shadow-sm">
                <div
                  className="card-header text-white"
                  style={{ backgroundColor: "rgb(15, 55, 63)" }}
                >
                  <strong>{userInfoMock.desc3}</strong>
                </div>
                <div className="card-body">
                  <p>
                    <strong>Áreas de interesse:</strong> {interests.join(", ")}
                  </p>
                  <p>
                    <strong>Notificações:</strong>{" "}
                    {notifications ? "Ativadas" : "Desativadas"}
                  </p>
                  <p>
                    <strong>Contato:</strong> {profileData.email_usuario}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!profileData) return null;

  
  return (
    <>
      <section id="div1" className="d-flex align-items-start text-white">
        <div
          className="overlay"
          style={{
            backgroundImage: `url(${body.bg3})`,
            backgroundPosition: "center",
          }}
        />

        <div className="content container-fluid m-5 p-5">
          <div className="row mt-5">
            <div id="pb" className={`col-md-6 mt-5 ${hidePB ? "hidden" : ""}`}>
              <img
                src={avatar}
                className="rounded-circle mb-3"
                alt="Foto do usuário"
                width={"200px"}
                height={"200px"}
              />
              <h1 className="display-3">{profileData.nome_usuario}</h1>
            </div>
          </div>
        </div>
      </section>

      {isLoading ? getSpinner() : getMainSection()}

      {showEditModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{
                  backgroundColor: "var(--primary-color)",
                  color: "white",
                }}
              >
                <h5 className="modal-title">Editar Perfil</h5>
                <button
                  type="button"
                  className="btn-close bg-light"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3 text-center">
                  <img
                    src={avatar}
                    alt="Avatar atual"
                    className="rounded-circle mb-3"
                    width="100"
                    height="100"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control mb-3"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setAvatar(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nome</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={username}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">E-mail</label>
                  <input
                    type="email"
                    className="form-control"
                    defaultValue={email}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Biografia</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    defaultValue={bio}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </button>
                <button className="btn btn-success">Salvar Alterações</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
