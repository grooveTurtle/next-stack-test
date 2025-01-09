"use client";

import { useEffect, useState } from "react";
import keyBindingList from "@/mock/keyOptions.json";
import style from "./temp.module.css";

// FIXME: 파일 분리 필요
type KeyBinding = {
  key: string;
  name: string;
  target: boolean;
  cooltime: number;
  remainingCooltime: number;
  image: string;
};

export default function Page() {
  const [isKeyPressed, setIsKeyPressed] = useState<boolean>(false);
  // FIXME: any 타입 수정
  const [keySequence, setKeySequence] = useState<KeyBinding | null>(null);
  const [eventList, setEventList] = useState<KeyBinding[]>([]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 키 유효성 검증
      const currentKey = keyBindingList.find(
        (data) => String(data.key) === event.key
      );

      console.log("currentKey", currentKey);

      if (!isKeyPressed) {
        // 키 유효성 검증
        if (currentKey) {
          setIsKeyPressed(true);
          setKeySequence(currentKey);

          // 즉발 스킬은 바로 프로세스 실행
          if (!currentKey.target) {
            setIsKeyPressed(false);
            setKeySequence(null); // 상태 초기화
            runSpecificProcess(currentKey);
          }
        }
      } else {
        if (event.key === "Escape") {
          setIsKeyPressed(false);
          setKeySequence(null); // 상태 초기화
          return;
        }

        // 스킬 단축키를 누른 이후 Enter 키가 눌렸을 때
        if (event.key === "Enter") {
          setIsKeyPressed(false);
          setKeySequence(null); // 상태 초기화
          runSpecificProcess(keySequence);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isKeyPressed, keySequence, eventList]);

  const runSpecificProcess = (skill: KeyBinding | null) => {
    if (!skill || !(skill.cooltime > 0)) return;

    if (eventList.some((item) => item.key === skill.key)) {
      console.log(`이미 실행 중입니다.`);
      return;
    }

    // 이벤트 리스트 변수에 해당 항목 추가
    setEventList((prevList) => [
      ...prevList,
      { ...skill, remainingCooltime: skill.cooltime },
    ]);

    // 매 초 마다 target.remainingCooltime을 갱신해줘
    const intervalId = setInterval(() => {
      setEventList((prevList) =>
        prevList.map((item) =>
          item.key === skill.key
            ? { ...item, remainingCooltime: item.remainingCooltime - 1 }
            : item
        )
      );
    }, 1000);

    const cooltimeDuration = skill.cooltime * 1000;

    // 쿨타임 적용 (종료시 이벤트리스트 변수에서 제거)
    setTimeout(() => {
      clearInterval(intervalId);
      setEventList((prevList) =>
        prevList.filter((item) => item.key !== skill.key)
      );
      // 알림!
      console.log(`${skill.name}이 종료 되었습니다`);
    }, cooltimeDuration);

    // 실행할 프로세스
    // alert(`${target.cooltime}초 후에 실행됩니다.`);
  };

  return (
    //     <body class="bg-gray-100 h-screen flex items-center justify-center">
    //   <!-- 중앙 정렬된 레이어 -->
    //   <div class="bg-white shadow-lg rounded-lg p-8 w-96">
    //     <h1 class="text-2xl font-semibold text-gray-800 mb-4">Centered Layer</h1>
    //     <p class="text-gray-600 mb-6">This is a simple layer centered on the screen. You can add more content here.</p>
    //     <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Click Me</button>
    //   </div>
    // </body>
    <div className="bg-gray-100 h-screen max-w-2xl mx-auto p-8 shadow-lg">
      <h1>Key Press Handler</h1>
      <div>
        <h2>Key Binding List</h2>
        <ul className="flex gap-3">
          {eventList.map((data) => (
            <li key={data.key}>
              <div className="flex gap-3">
                {/* <h3>{data.name}</h3> */}
                <div className="w-16 h-16 relative">
                  <img
                    className="w-full h-full object-cover brightness-80"
                    src={data.image}
                    alt={`${data.name} 이미지`}
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-tr from-transparent to-black opacity-50 rounded-full`}
                    style={{
                      maskImage: `conic-gradient(transparent ${
                        100 - (data.remainingCooltime / data.cooltime) * 100
                      }%, black 0)`,
                      WebkitMaskImage: `conic-gradient(transparent ${
                        100 - (data.remainingCooltime / data.cooltime) * 100
                      }%, black 0)`,
                    }}
                  ></div>
                </div>
                {/* <div>({data.remainingCooltime}초)</div> */}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p>Press key and then Enter to trigger a specific process.</p>
        <p>Current State: {isKeyPressed ? "Waiting for Enter" : "Idle"}</p>
      </div>
    </div>
  );
}
