/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
"use client";

// Next
import { forwardRef, useImperativeHandle, useState } from "react";

export interface ModalHandle {
  openModal?: Function;
  closeModal?: Function;
  toggleModal?: Function;
}

export interface ModalProps {}

const Modal = forwardRef<ModalHandle, ModalProps>((props, ref) => {
  useImperativeHandle(ref, () => ({
    openModal: () => openModal(),
    closeModal: () => closeModal(),
    toggleModal: () => toggleModal(),
  }));

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleModal = () => setIsModalOpen((prev) => !prev);

  if (!isModalOpen) return <></>;

  return <div className="absolute top-0 left-0 h-full w-full bg-gray-500/[0.6] z-[100]">TEste</div>;
});

Modal.displayName = "Modal";
export default Modal;
