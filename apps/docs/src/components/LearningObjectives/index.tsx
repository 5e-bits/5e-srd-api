import React from "react";

export default function LearningObjectives({
  children,
  objectives,
}: {
  children: React.ReactNode;
  objectives: string[];
}) {
  return (
    <>
      <h2>✅ Learning Objectives</h2>
      <ol>
        {objectives.map((obj, i) => {
          return <li key={i}>{obj}</li>;
        })}
      </ol>
      <div>{children}</div>
    </>
  );
}
