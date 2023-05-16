import React from "react";
import { useRecoilState } from "recoil";
import Modal from "react-modal";
import { modalStateAtom } from "../../../../states/recoilAlarmState";

function Alarm() {
  const [IsOpen, setIsOpen] = useRecoilState(modalStateAtom);

  // Modal을 Open하는 함수
  const openModal = () => {
    setIsOpen(true);
  };

  // Modal을 Close하는 함수
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div>
        <Modal
          ariaHideApp={false}
          isOpen={IsOpen}
          onRequestClose={closeModal}
          contentLabel="Example Modal"
        >
          <button
            onClick={() => {
              closeModal();
            }}
            className="rounded hover:rounded-lg bg-blue-300 mr-3 pl-4 pr-4 pt-1 pb-1 font-new"
          >
            확인
          </button>
          <button
            onClick={closeModal}
            className="rounded hover:rounded-lg bg-red-300 mr-3 pl-4 pr-4 pt-1 pb-1 font-new"
          >
            취소
          </button>
        </Modal>
      </div>
    </>
  );
}

export default Alarm;
