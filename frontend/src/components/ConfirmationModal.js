import React from 'react';
import styles from './ConfirmationModal.module.css';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
    const handleOverlayClick = (e) => {
        e.stopPropagation(); // Prevent event from bubbling up
        onCancel(); // Call the cancel function when clicked outside
    };

    const handleModalClick = (e) => {
        e.stopPropagation(); // Prevent click inside modal from closing it
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal} onClick={handleModalClick}>
                <h3>{message}</h3>
                <div className={styles.buttons}>
                    <button className={styles.confirmButton} onClick={onConfirm}>
                        Yes
                    </button>
                    <button className={styles.cancelButton} onClick={onCancel}>
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
