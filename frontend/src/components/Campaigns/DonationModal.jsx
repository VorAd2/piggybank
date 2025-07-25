/* eslint-disable react/prop-types */
//"success": "Doação realizada com sucesso!"
//"error": "Campanha inexistente!"
import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios'
const BACK_URL = import.meta.env.VITE_BACK_URL

function DonationModal({ show, onHide, campaignId, donatorId }) {
  const [value, setValue] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const handleCloseModal = () => {
    onHide(); 
    setValue('');
    setShowSuccessAlert(false);
    setShowErrorAlert(false); 
  };

  const handleChange = (e) => {
    const inputValor = e.target.value;
    const apenasNumeros = inputValor.replace(/\D/g, '');

    if (apenasNumeros) {
      const valorNumerico = parseFloat(apenasNumeros) / 100;
      setValue(valorNumerico.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
    } else {
      setValue('');
    }
  };

  const handleConfirm = async () => {
    const data = {
        idCampaign: campaignId,
        idDonor: donatorId,
        value: parseFloat(value.replace('R$', '').replace('.', '').replace(',', '.')) 
    }
    try {
        const response = await axios.post(
            `${BACK_URL}/donate`,
            data,
            { headers: {'Content-Type': 'application/json'} }   
        )
        if (response.data.success) {
            setShowSuccessAlert(true);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            console.log(JSON.stringify(response, null, 2))
            setShowErrorAlert(true);
             setTimeout(() => {
                 onHide(); 
             }, 3000);
        }
    } catch (err) {
        console.log(`Erro na doação: ${err}`)
        setShowErrorAlert(true);
        setTimeout(() => {
            onHide(); 
        }, 3000);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Informe o Valor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formValor">
            <Form.Label>Valor em Reais (R$)</Form.Label>
            <Form.Control
              type="text"
              placeholder="R$ 0,00"
              value={value}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleConfirm}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>

      {showSuccessAlert && (
        <Alert
          variant="success"
          onClose={() => setShowSuccessAlert(false)}
          dismissible
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1050,
          }}
        >
          Doação efetuada. Agradeçemos!
        </Alert>
      )}
      {showErrorAlert && (
        <Alert
          variant="danger"
          onClose={() => setShowErrorAlert(false)}
          dismissible
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1050,
          }}
        >
          Tivemos um problema ao efetuar sua doação. Por favor, tente novamente
        </Alert>
      )}
    </>
  );
}

export default DonationModal;