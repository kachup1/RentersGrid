import React from 'react';
import styles from './ConfirmationModal.module.css';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3>{message}</h3>
                <div className={styles.buttons}>
                    <button className={styles.confirmButton} onClick={onConfirm}>Yes</button>
                    <button className={styles.cancelButton} onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;