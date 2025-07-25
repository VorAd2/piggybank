import { Link, useNavigate, useParams } from "react-router-dom";
import { auth } from "../../data/data";
import { useState, useContext } from 'react';
import axios from 'axios';
import { ProfileContext } from "../../contexts/ProfileContext";

const BACK_URL = import.meta.env.VITE_BACK_URL;

// Função para remover todos os caracteres não numéricos
const cleanNumber = (value) => {
  return value.replace(/\D/g, '');
};

const formatPhone = (value) => {
  const cleaned = cleanNumber(value).substring(0, 11);
  if (!cleaned) return '';

  let formatted = '';
  const ddd = cleaned.substring(0, 2);
  const firstPart = cleaned.substring(2, cleaned.length === 11 ? 7 : 6);
  const secondPart = cleaned.substring(cleaned.length === 11 ? 7 : 6, 11);

  if (ddd) formatted += `(${ddd}`;
  if (firstPart) formatted += `) ${firstPart}`;
  if (secondPart) formatted += `-${secondPart}`;

  return formatted;
};

// Função para formatar CPF (XXX.XXX.XXX-XX) ou CNPJ (XX.XXX.XXX/XXXX-XX)
const formatTaxIdentification = (value, isEntity) => {
  const cleaned = cleanNumber(value);
  if (!cleaned) return '';

  if (!isEntity) { // É um CPF (para usuários comuns)
    const limitedCleaned = cleaned.substring(0, 11);
    let formatted = limitedCleaned;
    if (limitedCleaned.length > 3) formatted = `${formatted.slice(0,3)}.${formatted.slice(3)}`;
    if (limitedCleaned.length > 6) formatted = `${formatted.slice(0,7)}.${formatted.slice(7)}`;
    if (limitedCleaned.length > 9) formatted = `${formatted.slice(0,11)}-${formatted.slice(11)}`;
    return formatted.substring(0, 14);
  } else { // É um CNPJ (para entidades)
    const limitedCleaned = cleaned.substring(0, 14);
    let formatted = limitedCleaned;
    if (limitedCleaned.length > 2) formatted = `${formatted.slice(0,2)}.${formatted.slice(2)}`;
    if (limitedCleaned.length > 5) formatted = `${formatted.slice(0,6)}.${formatted.slice(6)}`;
    if (limitedCleaned.length > 8) formatted = `${formatted.slice(0,10)}/${formatted.slice(10)}`;
    if (limitedCleaned.length > 12) formatted = `${formatted.slice(0,15)}-${formatted.slice(15)}`;
    return formatted.substring(0, 18);
  }
};

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [taxIdentification, setTaxIdentification] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const { setProfileData, clearProfileData } = useContext(ProfileContext);
  const { tipo } = useParams();
  const forEntity = tipo === 'entidade' ? true : false;
  const route = forEntity ? 'entidades/create' : 'users/create';
  const navigate = useNavigate();

  const backgroundColor = forEntity ? 'var(--blue-color1)' : 'var(--secondary-color)';

  const handleChange = (event) => {
    setEmailError('')
    const { name, value } = event.target
    let cleanedAndLimitedValue = value;
    switch (name) {
      case 'nome':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'telefone':
        cleanedAndLimitedValue = cleanNumber(value).substring(0, 11);
        setPhone(cleanedAndLimitedValue);
        break;
      case 'cpf': // Este campo trata tanto CPF quanto CNPJ
        { const rawValue = cleanNumber(value);
        cleanedAndLimitedValue = forEntity ? rawValue.substring(0, 14) : rawValue.substring(0, 11);
        setTaxIdentification(cleanedAndLimitedValue);
        break; }
      case 'senha':
        setPassword(value);
        break;
      default:
        break;
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const newUserOrEntity = {
      name: name,
      email: email,
      password: password,
      phone: phone,
    };
    forEntity ? newUserOrEntity.cnpj = taxIdentification : newUserOrEntity.cpf = taxIdentification;
    //console.log(`newUserOrEntity: ${JSON.stringify(newUserOrEntity, null, 2)}`);
    try {
      const response1 = await axios.post(`${BACK_URL}/${route}`, newUserOrEntity,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      const data1 = response1.data
      if (data1.error) {
        const control1 = 'Já existe um usuário com esse email!'
        if (data1.error === control1) {
          setEmailError(control1);
        } else {
          alert(`Erro de credencial: ${data1.error}`)
        }
      } else {
        const response2 = await axios.get(`${BACK_URL}/users`)
        const data2 = response2.data
        for (let acc of data2) {
          if (acc.email_usuario == email) {
            clearProfileData()
            setProfileData(acc, (forEntity ? 'EntityData' : 'UserData'))
            navigate(`/perfil`)
          }
        }
      }
    } catch (err) {
      console.warn(`Erro no cadastro: ${err}`);
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100"
      style={{ backgroundColor: backgroundColor }}
    >
      <div
        className="mt-5 d-flex shadow rounded-3 overflow-hidden"
        style={{ width: "1200px", height: "800px", backgroundColor: "#f0f0f5" }}
      >
        <div
          className="border-0 text-white d-flex flex-column justify-content-center align-items-center p-4"
          style={{ width: "30%", backgroundColor: backgroundColor, }}
        >
          <h2 className="mb-3 display-5 fw-bold">{auth.mainTitle}</h2>
          <p className="mb-4 text-light lead">{forEntity ? auth.mainEntityDesc : auth.mainUserDesc}</p>
          <Link to={`/login/${tipo}`}>
            <button
              className="btn btn-outline-light fw-bold px-4 py-2 rounded-3 hover-opacity"
              style={{ transition: "0.3s" }}
            >
              {auth.btnTitle1}
            </button>
          </Link>
        </div>

        <div
          className="d-flex flex-column justify-content-center align-items-center p-5"
          style={{ width: "70%" }}
        >
          <h2 className="mb-4" style={{ color: backgroundColor }}>{auth.desc2}</h2>
          <form className="w-100" style={{ maxWidth: "500px" }} onSubmit={handleSubmit}>
            <div className="input-group bg-secondary-subtle rounded p-2 mb-3 align-items-center">
              <span className="me-2 text-primary">
                <i className="fas fa-user"></i>
              </span>
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.09391 17.8125C6.97933 17.1355 7.96891 16.6016 9.06266 16.211C10.1564 15.8204 11.3022 15.625 12.5002 15.625C13.6981 15.625 14.8439 15.8204 15.9377 16.211C17.0314 16.6016 18.021 17.1355 18.9064 17.8125C19.5141 17.1007 19.9871 16.2934 20.3257 15.3907C20.6642 14.4879 20.8335 13.5243 20.8335 12.5C20.8335 10.191 20.0219 8.22487 18.3986 6.6016C16.7753 4.97834 14.8092 4.16671 12.5002 4.16671C10.1911 4.16671 8.22499 4.97834 6.60173 6.6016C4.97846 8.22487 4.16683 10.191 4.16683 12.5C4.16683 13.5243 4.3361 14.4879 4.67464 15.3907C5.01318 16.2934 5.48627 17.1007 6.09391 17.8125ZM12.5002 13.5417C11.4759 13.5417 10.6121 13.1901 9.90902 12.487C9.20589 11.7839 8.85433 10.9202 8.85433 9.89587C8.85433 8.87157 9.20589 8.00785 9.90902 7.30473C10.6121 6.6016 11.4759 6.25004 12.5002 6.25004C13.5245 6.25004 14.3882 6.6016 15.0913 7.30473C15.7944 8.00785 16.146 8.87157 16.146 9.89587C16.146 10.9202 15.7944 11.7839 15.0913 12.487C14.3882 13.1901 13.5245 13.5417 12.5002 13.5417ZM12.5002 22.9167C11.0592 22.9167 9.70502 22.6433 8.43766 22.0964C7.1703 21.5495 6.06787 20.8073 5.13037 19.8698C4.19287 18.9323 3.45068 17.8299 2.90381 16.5625C2.35693 15.2952 2.0835 13.941 2.0835 12.5C2.0835 11.0591 2.35693 9.7049 2.90381 8.43754C3.45068 7.17018 4.19287 6.06775 5.13037 5.13025C6.06787 4.19275 7.1703 3.45056 8.43766 2.90369C9.70502 2.35681 11.0592 2.08337 12.5002 2.08337C13.9411 2.08337 15.2953 2.35681 16.5627 2.90369C17.83 3.45056 18.9325 4.19275 19.87 5.13025C20.8075 6.06775 21.5496 7.17018 22.0965 8.43754C22.6434 9.7049 22.9168 11.0591 22.9168 12.5C22.9168 13.941 22.6434 15.2952 22.0965 16.5625C21.5496 17.8299 20.8075 18.9323 19.87 19.8698C18.9325 20.8073 17.83 21.5495 16.5627 22.0964C15.2953 22.6433 13.9411 22.9167 12.5002 22.9167Z"
                  fill="#79767D"
                />
              </svg>

              <input
                type="text"
                className="form-control mx-2 border-0 bg-transparent"
                placeholder="Nome"
                name="nome"
                value={name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group bg-secondary-subtle rounded p-2 mb-3 align-items-center">
              <span className="me-2 text-primary">
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

            <div className="input-group bg-secondary-subtle rounded p-2 mb-3 align-items-center">
              <span className="me-2 text-primary">
                <i className="fas fa-phone"></i>
              </span>
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_225_69)">
                  <path
                    d="M22.9165 17.625V20.75C22.9177 21.0401 22.8582 21.3273 22.742 21.5931C22.6258 21.8589 22.4553 22.0975 22.2416 22.2936C22.0278 22.4898 21.7754 22.6391 21.5006 22.732C21.2258 22.8249 20.9346 22.8595 20.6457 22.8334C17.4403 22.4851 14.3613 21.3898 11.6561 19.6354C9.13923 18.0361 7.00539 15.9023 5.40608 13.3854C3.64564 10.6679 2.55008 7.57397 2.20816 4.35419C2.18213 4.06613 2.21636 3.77581 2.30868 3.50171C2.401 3.22761 2.54938 2.97574 2.74438 2.76212C2.93937 2.54851 3.17671 2.37784 3.44128 2.26098C3.70585 2.14412 3.99185 2.08363 4.28108 2.08335H7.40608C7.91161 2.07838 8.40169 2.25739 8.785 2.58703C9.1683 2.91667 9.41866 3.37444 9.48941 3.87502C9.62131 4.87509 9.86592 5.85703 10.2186 6.8021C10.3587 7.17494 10.3891 7.58014 10.306 7.96969C10.2229 8.35923 10.0299 8.7168 9.74983 9.00002L8.42691 10.3229C9.90978 12.9308 12.0691 15.0901 14.6769 16.5729L15.9998 15.25C16.283 14.97 16.6406 14.7769 17.0302 14.6939C17.4197 14.6108 17.8249 14.6411 18.1977 14.7813C19.1428 15.1339 20.1248 15.3785 21.1248 15.5104C21.6308 15.5818 22.093 15.8367 22.4233 16.2266C22.7536 16.6165 22.9292 17.1142 22.9165 17.625Z"
                    stroke="#757575"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_225_69">
                    <rect width="25" height="25" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              <input
                type="tel"
                className="form-control mx-2 border-0 bg-transparent"
                placeholder="Telefone"
                name="telefone"
                value={formatPhone(phone)}
                onChange={handleChange}
                maxLength="15"
                required
              />
            </div>

            <div className="input-group bg-secondary-subtle rounded p-2 mb-3 align-items-center">
              <span className="me-2 text-primary">
                <i className="fas fa-id-card"></i>
              </span>
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.6665 4.16665H18.7498C19.3024 4.16665 19.8323 4.38614 20.223 4.77684C20.6137 5.16754 20.8332 5.69745 20.8332 6.24998V20.8333C20.8332 21.3858 20.6137 21.9158 20.223 22.3065C19.8323 22.6972 19.3024 22.9166 18.7498 22.9166H6.24984C5.6973 22.9166 5.1674 22.6972 4.7767 22.3065C4.386 21.9158 4.1665 21.3858 4.1665 20.8333V6.24998C4.1665 5.69745 4.386 5.16754 4.7767 4.77684C5.1674 4.38614 5.6973 4.16665 6.24984 4.16665H8.33317M9.37484 2.08331H15.6248C16.2001 2.08331 16.6665 2.54968 16.6665 3.12498V5.20831C16.6665 5.78361 16.2001 6.24998 15.6248 6.24998H9.37484C8.79954 6.24998 8.33317 5.78361 8.33317 5.20831V3.12498C8.33317 2.54968 8.79954 2.08331 9.37484 2.08331Z"
                  stroke="#757575"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <input
                type="text"
                className="form-control mx-2 border-0 bg-transparent"
                placeholder={forEntity ? 'CNPJ' : 'CPF'}
                name="cpf" // Mantém o nome 'cpf' para o switch case
                value={formatTaxIdentification(taxIdentification, forEntity)}
                onChange={handleChange}
                maxLength={forEntity ? 18 : 14}
                required
              />
            </div>

            <div className="input-group bg-secondary-subtle rounded p-2 mb-3 align-items-center">
              <span className="me-2 text-primary">
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
                name="senha"
                value={password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              id={forEntity ? 'cadastro-btn-entidade' : 'cadastro-btn-user'}
              className="btn text-white fw-bold px-4 py-2 rounded-3 mt-2"
            >
              {auth.btnTitle2}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
