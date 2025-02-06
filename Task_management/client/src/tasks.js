import React from 'react';
import { useLocation } from 'react-router-dom';

const Tasks = () => {
  // Obtendo os parâmetros da URL
  const search = useLocation().search;
  const tasks = new URLSearchParams(search).get('task'); // Obtém o valor do parâmetro 'task'

  // Se não houver tarefas, exiba uma mensagem de aviso
  if (!tasks) {
    return <p>Nenhuma tarefa encontrada.</p>;
  }

  // Separando as tarefas por um delimitador, se necessário
  const taskList = tasks.split(':'); // Supondo que ':' seja o delimitador

  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#1a202c', borderRadius: '10px' }}>
      <h2>Lista de Tarefas</h2>
      <ul>
        {taskList.map((task, index) => (
          <li key={index} style={{ marginBottom: '10px' }}>
            {task.trim() || 'Tarefa vazia'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
