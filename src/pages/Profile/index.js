import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi'

import api from '../../services/api';

import './styles.css';
import logoImg from '../../assets/logo.svg';

export default function Profile() {
  const history = useHistory();

  const [incidents, setIncidents] = useState([]);
  const ongName = localStorage.getItem('ongName');
  const ongId = localStorage.getItem('ongId');

  useEffect(() => {
    api.get('profile', {
      headers: {
        Authorization: ongId
      }
    }).then(response => {
      setIncidents(response.data)
    })
  }, [ongId]);

  async function handleDeleteIncident(id) {
    try {
      if (window.confirm('Tem certeza que quer deletar esse item?')) {
        await api.delete(`incidents/${id}`, { headers: { Authorization: ongId } });
        setIncidents(incidents.filter(incident => incident.id !== id));
      }
    } catch (error) {
      alert('Erro ao deletar o caso, tente novamente!');
    }
  }

  function handleLogout() {
    localStorage.clear();
    history.push('/');
  }

  return (
    <div className="profile-container">
      <header>
        <img src={logoImg} alt="Be The Hero" />
        <span>Bem-Vindo(a), {ongName}</span>

        <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>
        <button type="button" onClick={handleLogout}>
          <FiPower size={18} color="#e02041" />
        </button>
      </header>

      <h1>Casos Cadastrados</h1>

      <ul>
        {incidents.map(incident => (
          <li>
            <strong>CASO</strong>
            <p>{incident.title}</p>

            <strong>Descrição</strong>
            <p>{incident.description}</p>

            <strong>Valor</strong>
            <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(incident.value)}</p>

            <button type="button" onClick={() => handleDeleteIncident(incident.id)}>
              <FiTrash2 size={20} color="#a8a8b3" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
