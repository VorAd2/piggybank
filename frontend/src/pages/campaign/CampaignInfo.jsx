/* eslint-disable no-unused-vars */
import { earthImage } from "../../assets";
import { GeoIcon, PersonOutlineIcon } from "../../assets";
import { Container, Row, Col, Spinner, ProgressBar } from "react-bootstrap";
import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const paragraf = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam euismod laoreet ipsum nec auctor.
 Proin pellentesque odio sit amet urna ultrices, id pulvinar enim venenatis. Sed quis fermentum 
 elit, a maximus nisi. Praesent congue libero id nunc sagittis, et venenatis enim luctus. Sed dui
  velit, semper at auctor eu, malesuada id mi. Praesent non arcu scelerisque, venenatis arcu vel, 
  interdum velit. Nulla vitae leo nec tellus cursus tristique. Aliquam eget justo in odio consequat
   semper. Nullam tristique, est eu viverra volutpat, dolor sapien dictum sem, id semper risus 
   neque sed augue. Sed et dignissim mi, dictum pretium ligula.
`

function CampaignInfo() {
    const location = useLocation()
    const campaign = location.state?.data
    const withHelp = location.state?.withHelp
    const recebido = campaign.recebido
    const meta = campaign.meta

    const fixedPercent = () =>
        Math.min(100, ((recebido / meta) * 100).toFixed(2));

    function getPrincipalPanel() {
        return (
            <div className="principalInfoPanel d-flex flex-column gap-1 justify-content-start align-items-start">
                <div className="progress-and-text mt-2">
                    <progress
                        max={campaign.meta}
                        value={campaign.recebido}
                        className="progress"
                    />
                    <span className="progress-percentage">
                        {fixedPercent(campaign)}%
                    </span>
                </div>
                <h5
                    style={{fontSize: '20px', fontWeight: '600', 
                        color: 'var(--primary-color)', marginBottom:'0'}}
                >
                    Arrecadado:
                </h5>
                <p  
                    className="m-0"
                    style={{fontWeight:'1000', fontSize: '32px', 
                        color: 'var(--secondary-color)'}}
                >
                    R${recebido}
                </p>
                <div id="principalInfoPanelSubtitles">
                    <p>Meta: R${meta}</p>
                    <p>Apoiadores: 6</p>
                </div>
                { withHelp ? <button className="wantHelpBtn" type="button">QUERO AJUDAR</button> : null }
                <hr className="principalInfoPanelHr"/>
                <div className="d-flex">
                    <PersonOutlineIcon style={{width:'25px', height:'25px', color:'#79747E'}} className='me-3'/>
                    <div className="d-flex flex-column justify-content-start align-items-start" >
                        <h5 
                        style={{color:'var(--gray-color)', fontWeight:'700', fontSize:'15px', marginBottom:'5px'}} 
                        > 
                            {campaign.entidade_nome} 
                        </h5>
                        <div id="principalInfoPanelDateTime">
                            <p>Fortaleza/Ceará</p>
                            <p>Campanha ativa desde {campaign.created_at}</p>
                        </div>  
                    </div>
                </div>
            </div>
        )
    }

    return (
        <Container className="px-5 py-3" style={{marginTop: '80px'}}>
            <Row className="mb-5">
                <div className="d-flex flex-column justify-content-center align-items-center g-3">
                    <h1 
                    style={{fontSize: '48px', fontWeight:'900', color:'var(--primary-color)'}} 
                    >
                        {campaign.titulo}</h1>
                    <p 
                    style={{fontSize:'20px', fontWeight:'700', color:'var(--primary-color'}} 
                    > 
                        <GeoIcon style={{color:'#45414A'}}/> Fortaleza/Ceará
                    </p>
                </div>
            </Row>
            <Row className="g-5 mb-4">
                <Col md={8} className="p-0"> 
                    <img
                    className="campaignInfoImage"
                    src={earthImage} 
                    alt="imagem-campanha" 
                    />
                </Col>
                <Col md={4} className="p-0">
                    {getPrincipalPanel()}
                </Col>
            </Row>
            <Row className="g-5">
                <Col md={6} className="p-0"> <p>{paragraf}</p> </Col>
                <Col md={6}> <p>{paragraf}</p> </Col>
            </Row>
        </Container>
    )

}

export default CampaignInfo;