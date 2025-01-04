import "../style/Modal.css";

const Modal = ({ message, onConfirm, onCancel, isOpen }) => {
    if (!isOpen) return null; // Als het modaal niet open is, render dan niets

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{message}</h3>
                <div className="modal-actions">
                    <button className="modal-btn cancel" onClick={onCancel}>
                        Annuleren
                    </button>
                    <button className="modal-btn confirm" onClick={onConfirm}>
                        Bevestigen
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
