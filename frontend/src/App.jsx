import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header, Footer, Carousel } from "./components/index.js";
import "./styles/index.css";
import "./styles/Cadastro.css";
import "./styles/HomePage.css";
import "./styles/CampaignInfo.css";
import "./styles/CampaignsPage.css";
import "./styles/FormCampaign.css";
import {
  Campaigns,
  Support,
  Body,
  News,
  Signup,
  Signin,
  Profile,
  CampaignInfo,
  Formcampaign,
  Publishcampaign,
} from "./pages";
import { ProfileProvider } from "./contexts/ProfileContext.jsx";

function App() {
  return (
    <Router>
      <ProfileProvider>
        <Header />
          <main>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Body />
                    <Carousel />
                  </>
                }
              />
              <Route path="/noticias" element={<News />} />
              <Route path="/campanhas" element={<Campaigns />} />
              <Route path="/divulgue" element={<Publishcampaign />} />
              <Route path="/suporte" element={<Support />} />
              <Route path="/cadastro/:tipo" element={<Signup />} />
              <Route path="/login/:tipo" element={<Signin />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/campanha" element={<CampaignInfo />} />
              <Route path="/nova-campanha" element={<Formcampaign />} />
            </Routes>
          </main>
        <Footer />
      </ProfileProvider>
    </Router>
  );
}

export default App;
