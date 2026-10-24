"use client";
import { ArrowIcon } from "@/components/arrow-icon";
import { useState } from "react";
import { curriculum } from "@/lib/content";
export function Curriculum() {
  const [selected, setSelected] = useState(1);
  const lesson = curriculum[selected];
  return (
    <div className="curriculum-layout">
      <div
        className="day-list"
        role="tablist"
        aria-label="Explore the seven-day curriculum"
        aria-orientation="vertical"
      >
        {curriculum.map((item, index) => (
          <button
            key={item.day}
            role="tab"
            id={`day-tab-${index}`}
            aria-controls="lesson-panel"
            aria-selected={selected === index}
            tabIndex={selected === index ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => {
              let next = index;
              if (event.key === "ArrowDown")
                next = (index + 1) % curriculum.length;
              else if (event.key === "ArrowUp")
                next = (index - 1 + curriculum.length) % curriculum.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = curriculum.length - 1;
              else return;
              event.preventDefault();
              setSelected(next);
              document.getElementById(`day-tab-${next}`)?.focus();
            }}
          >
            <span className="day-number">DAY {item.day}</span>
            <span>{item.title}</span>
            <ArrowIcon />
          </button>
        ))}
      </div>
      <div
        className="lesson-panel"
        id="lesson-panel"
        role="tabpanel"
        aria-labelledby={`day-tab-${selected}`}
      >
        <div className="lesson-meta">
          <span className="eyebrow">YOUR DAILY PRACTICE</span>
          <span className="lesson-day">
            {String(lesson.day).padStart(2, "0")}
            <span>/07</span>
          </span>
        </div>
        <div className="lesson-sprout" aria-hidden="true">
          ✳
        </div>
        <h3>{lesson.short}</h3>
        <p>{lesson.body}</p>
        <div className="lesson-output">
          <span className="eyebrow">WHAT YOU’LL LEAVE WITH</span>
          <strong>{lesson.output}</strong>
          <span className="lesson-time">◷ {lesson.time}</span>
        </div>
      </div>
    </div>
  );
}
