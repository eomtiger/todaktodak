import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Modal from "react-modal";
import {
  alarmDataAtom,
  modalStateAtom,
  isReadAlarmAtom,
} from "../../../../states/recoilAlarmState";
import ReadAlarm from "../../../../assets/ReadAlarm.png";
import unReadAlarm from "../../../../assets/unReadAlarm.png";

function Alarm() {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      height: "80%",
      width: "85%",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const [alarmData, setAlarmData] = useRecoilState(alarmDataAtom);
  const [isReadAlarm, setIsReadAlarm] = useRecoilState(isReadAlarmAtom);
  const IsOpen = useRecoilValue(modalStateAtom);

  let readCount = 0;
  for (let i = 0; i < alarmData.length; i++) {
    if (alarmData[i].isRead === true) {
      readCount++;
    }
  }

  if (readCount === alarmData.length) {
    setIsReadAlarm(true);
  }

  return (
    <>
      <div className="h-[8vh]">
        <Modal
          ariaHideApp={false}
          isOpen={IsOpen}
          style={customStyles}
          contentLabel="Example Modal"
        >
          {alarmData.map((alarm, idx) => {
            return (
              <div
                className="grid items-center justify-center text-center bg-white rounded-t-lg md:rounded-t-none md:rounded-tl-lg md:border-r dark:bg-gray-800 dark:border-gray-700 font-mun"
                key={idx}
              >
                {alarm.isRead === false ? (
                  <a
                    onClick={() => {
                      const updatedAlarm = { ...alarm, isRead: true };
                      const updatedAlarmData = alarmData.map((a) =>
                        a.id === alarm.id ? updatedAlarm : a
                      );
                      setAlarmData(updatedAlarmData);
                    }}
                    href="/video"
                    className="pt-5 pl-3 pr-3 mb-5 block max-w-l items-center bg-gray-200 border border-gray-200 rounded-lg shadow hover:bg-blue-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                  >
                    <img src={unReadAlarm} alt="" className="w-10 h-10" />
                    <p className="text-xs">{alarm.body.split(",")[0]}</p>
                    <p>{alarm.body.split(",")[1]}</p>
                  </a>
                ) : (
                  <a
                    href="/video"
                    className="pt-5 pl-3 pr-3 mb-5 block max-w-l items-center bg-gray-200 border border-gray-200 rounded-lg shadow hover:bg-blue-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                  >
                    <img src={ReadAlarm} alt="" className="w-10 h-10" />
                    <p className="text-xs">{alarm.body.split(",")[0]}</p>
                    <p>{alarm.body.split(",")[1]}</p>
                  </a>
                )}
              </div>
            );

            // <div>{alarm["title"]}</div>;
          })}
        </Modal>
      </div>
    </>
  );
}

export default Alarm;
