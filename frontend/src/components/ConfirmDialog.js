import React from 'react';

export default function ConfirmDialog({ show, title, message, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>{title || 'Confirmar'}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn btn-danger" onClick={onConfirm}>Sim, Excluir</button>
          <button className="btn btn-cancel" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
