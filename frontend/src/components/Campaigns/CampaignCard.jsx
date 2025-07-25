/* eslint-disable react/prop-types */
import { GeoIcon, TrashIcon }from '../../assets/index'
import earthImage from "../../assets/earth.jpg";
import {Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function CampaignCard({ campanha, withDelete, withHelp}) {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate('/campanha', {state: {data: campanha, withHelp: withHelp}})
    }

    const porcentagemArrecadado = (campanha) =>
        Math.min(100, ((campanha.recebido / campanha.meta) * 100).toFixed(2));

    return (
        <div 
        className="campaign-container"
        role='button'
        tabIndex={0}
        onClick={handleClick}
        >
            <div className="campaign-content">
                <div className="campaign-image">
                    <img src={earthImage} alt={campanha.titulo} />
                </div>
                <div className="campaign-info ms-4">
                    <h5 className='fs-2'>{campanha.titulo}</h5>
                    <p className="text-muted fs-5 my-2">
                        <GeoIcon /> {campanha.entidade_nome} • Fortaleza/Ceará
                    </p>
                    <p style={{fontSize:'1.1rem'}}>{campanha.descricao}</p>

                    <div className="donation-progress mt-3">
                        <p className='fw-medium'>
                            <span className='me-2'>META:</span> R${campanha.meta}{" "}
                            <span className='ms-5 me-2'>ARRECADADO:</span> R${campanha.recebido}
                        </p>
                        <div className="progress-and-text mt-2">
                            <progress
                                max={campanha.meta}
                                value={campanha.recebido}
                                className="progress"
                            />
                            <span className="progress-percentage">
                                {porcentagemArrecadado(campanha)}%
                            </span>
                        </div>
                    </div>
                </div>
                {withDelete && <Button variant='outline-danger'> <TrashIcon/> </Button>}
            </div>
        </div>
    )
}

export default CampaignCard