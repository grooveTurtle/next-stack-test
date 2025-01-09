"use client";

import { useEffect, useState } from "react";
import keyBindingList from "@/mock/keyOptions.json";

// FIXME: 파일 분리 필요
type KeyBinding = {
  key: string;
  name: string;
  target: boolean;
  cooltime: number;
};

export default function Page() {
  const [isKeyPressed, setIsKeyPressed] = useState<boolean>(false);
  // FIXME: any 타입 수정
  const [keySequence, setKeySequence] = useState<KeyBinding | null>(null);
  const [eventList, setEventList] = useState<KeyBinding[]>([]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isKeyPressed) {
        // 키 유효성 검증
        const currentKey = keyBindingList.find((data) => {
          return String(data.key) === event.key;
        });
        if (currentKey) {
          setIsKeyPressed(true);
          setKeySequence(currentKey);

          // 즉발 스킬은 바로 프로세스 실행
          if (!currentKey.target) {
            runSpecificProcess(currentKey);
          }
        }
      } else {
        // 스킬 단축키를 누른 이후 Enter 키가 눌렸을 때
        if (event.key === "Enter") {
          console.log("Enter key pressed after:", keySequence);
          setIsKeyPressed(false);
          setKeySequence(null); // 상태 초기화
          // 여기서 특정 프로세스를 실행
          runSpecificProcess(keySequence);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isKeyPressed, keySequence]);

  const runSpecificProcess = (target: KeyBinding | null) => {
    if (!target) return;

    // 이벤트 리스트 변수에 해당 항목 추가
    setEventList((prevList) => [...prevList, target]);

    // 스킬 아이콘 출력
    console.log(`Skill icon for ${target.name} displayed`);

    // 쿨타임 적용 (종료시 이벤트리스트 변수에서 제거)
    setTimeout(() => {
      setEventList((prevList) =>
        prevList.filter((item) => item.key !== target.key)
      );
      console.log(`${target.name}이 종료 되었습니다`);
    }, target.cooltime * 1000);

    // 실행할 프로세스
    alert(`${target.cooltime}초 후에 실행됩니다.`);
  };

  return (
    <div>
      <h1>Key Press Handler</h1>
      <p>Press key and then Enter to trigger a specific process.</p>
      <p>Current State: {isKeyPressed ? "Waiting for Enter" : "Idle"}</p>
    </div>
  );
}
