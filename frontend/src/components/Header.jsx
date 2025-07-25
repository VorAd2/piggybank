import { useEffect, useState, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import logo from "../assets/pb logo.png";
import { ProfileContext } from "../contexts/ProfileContext";
import { EntityIcon } from "../assets";

function Header() {
  const [hideNav, setHideNav] = useState(false);
  const location = useLocation();
  const forEntity = localStorage.getItem('profileType') === 'entity'
  const profileData = localStorage.getItem(forEntity ? 'EntityData' : 'UserData');

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setHideNav(scrollTop > 700);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const Cadastro = location.pathname === "/cadastro";
  const Suporte = location.pathname === "/suporte";

  
  const handleScrollToSection = (id) => {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarToggler && navbarCollapse && navbarCollapse.classList.contains('show')) {
      navbarToggler.click(); // Simula um clique para fechar
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" }); // Rola suavemente
    }
  };

  function verifyProfileLink() {
    const Icon = forEntity
      ? <i> <EntityIcon/> </i>
      : <i className="bi bi-person-circle fs-4"></i>
    if (profileData) {
      return (
        <li className="nav-item me-1">
          <Link to="/perfil" className="nav-link text-light">
            {Icon}
          </Link>
        </li>
      )
    }
  }

  return (
    <nav
      id="nav"
      className={`navbar fixed-top navbar-expand-sm navbar-dark p-1 ${
        hideNav ? "hidden" : ""
      } ${Cadastro ? "cadastro-header" : ""} ${
        Suporte ? "suporte-header" : ""
      }`}
    >
      <div className="container-fluid">
        <Link to="/" className="navbar-brand text-light mx-5">
          PiggyBank
          <img src={logo} width="45px" height="45px" alt="PiggyBank Logo" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav" 
          aria-expanded="false"     
          aria-label="Toggle navigation" 
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse mx-5 g-5" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item mx-5">
              <Link to="/campanhas" className="nav-link text-light">
                Campanhas
              </Link>
            </li>
            <li className="nav-item mx-5">
              <Link to="/divulgue" className="nav-link text-light">
                Divulgue Conosco
              </Link>
            </li>
            <li className="nav-item mx-5">
              {/* Mudança aqui: de <a> para <li> com onClick */}
              <li className="nav-link text-light" onClick={() => handleScrollToSection("carouselNoticias")} style={{ cursor: 'pointer' }}>
                Notícias
              </li>
            </li>
            <li className="nav-item mx-5">
              {/* Mudança aqui: de <a> para <li> com onClick */}
              <li className="nav-link text-light" onClick={() => handleScrollToSection("div3")} style={{ cursor: 'pointer' }}>
                Sobre nós
              </li>
            </li>
            <li className="nav-item mx-5">
              <Link to="/suporte" className="nav-link text-light">
                Suporte
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
            {verifyProfileLink()}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;