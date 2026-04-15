import React from 'react';

export default function Loading({ message = 'Carregando...' }) {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">{message}</p>
    </div>
  );
}
