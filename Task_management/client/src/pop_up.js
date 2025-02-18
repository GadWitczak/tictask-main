import React from 'react';
import './pop_up.css';

export default function Pop_up(props) {
  return (props.trigger) ? (
    <div className='pop-up'>
      <div className='pop-inner'>
        <button 
          onClick={() => props.Setrigger(false)} 
          className="close-btn"
        >
          Fechar
        </button>
        {props.children}
      </div>
    </div>
  ) : "";
}
