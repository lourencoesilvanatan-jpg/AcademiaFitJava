import React from 'react';

export default function ConfirmDialog({
  show,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Sim, Excluir',
  cancelLabel = 'Cancelar',
  variant = 'danger',
}) {
  if (!show) return null;

  const confirmClass = variant === 'primary' ? 'btn-save' : 'btn-danger';

  return (
    <div className="modal-overlay modal-overlay-top" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>{title || 'Confirmar'}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className={`btn ${confirmClass}`} onClick={onConfirm}>{confirmLabel}</button>
          <button className="btn btn-cancel" onClick={onCancel}>{cancelLabel}</button>
        </div>
      </div>
    </div>
  );
}
