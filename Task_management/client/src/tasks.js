import React from 'react';
import { useLocation } from 'react-router-dom';

const Tasks = () => {
  // Obtendo os parâmetros da URL
  const search = useLocation().search;
  const tasks = new URLSearchParams(search).get('task'); // Obtém o valor do parâmetro 'task'

  // Se não houver tarefas, exiba uma mensagem de aviso
  if (!tasks) {
    return <p style={{ color: 'white' }}>Nenhuma tarefa encontrada.</p>;
  }

  // Separando as tarefas por um delimitador, se necessário
  const taskList = tasks.split(':'); // Supondo que ':' seja o delimitador

  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#1a202c', borderRadius: '10px' }}>
      <h2 style={{ textAlign: 'center' }}>Lista de Tarefas</h2>
      <div
        style={{
          display: 'flex',
          gap: '15px',
          overflowX: 'auto',
          padding: '10px 0',
          whiteSpace: 'nowrap',
        }}
      >
        {taskList.map((task, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#2d3748',
              padding: '15px',
              borderRadius: '8px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              minWidth: '200px', // Garantindo largura mínima de cada bloco
              flexShrink: '0', // Impede que os itens encolham
            }}
          >
            <strong>Tarefa {index + 1}:</strong>
            <p>{task.trim() || 'Tarefa vazia'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
