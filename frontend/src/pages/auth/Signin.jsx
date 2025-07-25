
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { auth } from "../../data/data";
import axios from 'axios';
import { ProfileContext } from '../../contexts/ProfileContext'

const BACK_URL = import.meta.env.VITE_BACK_URL;

function Signin() {
  const [hidePB, setHidePB] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { setProfileData, clearProfileData } = useContext(ProfileContext);
  const navigate = useNavigate();
  const { tipo } = useParams();
  const forEntity = tipo === 'entidade' ? true : false;

  const backgroundColor = forEntity ? 'var(--blue-color1)' : 'var(--secondary-color)';
  const btnClass = forEntity ? 'btn-login-entidade' : 'btn-login-user';

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setHidePB(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target
    setEmailError('');
    setPasswordError('');
    switch (name) {
      case 'email':
        setEmail(value)
        break
      case 'password':
        setPassword(value)
        break
      default:
        break
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setEmailError('');
    setPasswordError('');
    const account = {
      email: email,
      password: password
    }
    try {
      const response = await axios.post(
        `${BACK_URL}/users/login`,
        account,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      const data = response.data

      // Se a credencial é inválida, existe error no response.data
      if (data.error) {
        const control1 = 'Este email não existe!'
        const control2 = 'Senha inválida'
        const warn = data.error === control1 ? control1 : control2
        setEmailError(warn === control1 ? warn : '');
        setPasswordError(warn === control2 ? warn : '');
      }
      // Se 'loggedIn' existe e é true, o login foi bem-sucedido
      else if (data.message && data.message.loggedIn === true) {
        clearProfileData()
        const response2 = await axios.get(`${BACK_URL}/users`)
        const data2 = response2.data
        console.log(`response2 data: ${JSON.stringify(data2, null, 2)}`)
        for (let acc of data2) {
          if (acc.email_usuario == email) {
            setProfileData(acc, (forEntity ? 'EntityData' : 'UserData'))
            navigate('/perfil')
          }
        }
      } else {
        setEmailError('Ocorreu um erro inesperado. Tente novamente.');
        setPasswordError('Ocorreu um erro inesperado. Tente novamente.');
      }
    } catch (err) {
      console.warn(`Erro na requisição de login: ${err.message}`);
      setEmailError('Problemas de conexão. Verifique sua internet.');
      setPasswordError('Problemas de conexão. Verifique sua internet.');
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100"
      style={{ backgroundColor: backgroundColor }}
    >
      <div
        id="login-box"
        className={`bg-light p-5 rounded-4 shadow ${hidePB ? "hidden" : ""}`}
      >
        <h2 className="text-center mt-5 py-5 mb-4" style={{ color: backgroundColor }}>
          {forEntity ? auth.title2 : auth.title1}
        </h2>
        <form className="mt-3" onSubmit={handleSubmit}>
          <div className="input-group bg-secondary-subtle rounded mb-1 p-2 align-items-center">
            <span className="me-2 text-success">
              <i className="fas fa-envelope"></i>
            </span>
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.9168 6.25002C22.9168 5.10419 21.9793 4.16669 20.8335 4.16669H4.16683C3.021 4.16669 2.0835 5.10419 2.0835 6.25002M22.9168 6.25002V18.75C22.9168 19.8959 21.9793 20.8334 20.8335 20.8334H4.16683C3.021 20.8334 2.0835 19.8959 2.0835 18.75V6.25002M22.9168 6.25002L12.5002 13.5417L2.0835 6.25002"
                stroke="#757575"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <input
              type="email"
              className="form-control mx-2 border-0 bg-transparent"
              placeholder="E-mail"
              name="email"
              value={email}
              onChange={handleChange}
              required
            />
          </div>
          {emailError && <div className="text-danger small mb-3">{emailError}</div>}

          <div className="input-group bg-secondary-subtle rounded mb-1 p-2 align-items-center">
            <span className="me-2 text-success">
              <i className="fas fa-lock"></i>
            </span>
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.29167 11.4583V7.29165C7.29167 5.91031 7.8404 4.58555 8.81715 3.6088C9.7939 2.63205 11.1187 2.08331 12.5 2.08331C13.8813 2.08331 15.2061 2.63205 16.1828 3.6088C17.1596 4.58555 17.7083 5.91031 17.7083 7.29165V11.4583M5.20833 11.4583H19.7917C20.9423 11.4583 21.875 12.3911 21.875 13.5416V20.8333C21.875 21.9839 20.9423 22.9166 19.7917 22.9166H5.20833C4.05774 22.9166 3.125 21.9839 3.125 20.8333V13.5416C3.125 12.3911 4.05774 11.4583 5.20833 11.4583Z"
                stroke="#757575"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <input
              type="password"
              className="form-control mx-2 border-0 bg-transparent"
              placeholder="Senha"
              name="password"
              value={password}
              onChange={handleChange}
              required
            />
          </div>
          {passwordError && <div className="text-danger small mb-3">{passwordError}</div>}

          <button type="submit" className={`w-100 py-2 rounded-3 mb-2 ${btnClass}`}>
            {auth.btnTitle3}
          </button>

          <Link
            to="#"
            className="d-block text-center small text-decoration-none"
            style={{ color: backgroundColor, }}
          >
            {auth.desc3}
          </Link>

          <Link
            to={`/cadastro/${tipo}`}
            className="d-block text-center small text-decoration-none mt-5"
            style={{ color: backgroundColor, }}
          >
            Criar uma conta
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Signin;