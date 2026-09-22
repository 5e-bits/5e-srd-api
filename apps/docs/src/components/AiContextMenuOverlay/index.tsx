import React from "react";
import AiContextMenu from "@site/src/components/AiContextMenu";

/** Wraps `children` with the floating AI-context menu, for the swizzled theme pages. */
export default function AiContextMenuOverlay({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div style={{ position: "relative" }}>
      <div className="ai-context-menu-wrapper">
        <AiContextMenu />
      </div>
      {children}
    </div>
  );
}
