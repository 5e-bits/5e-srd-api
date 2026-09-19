import React from "react";
import Layout from "@theme-original/DocItem/Layout";
import type LayoutType from "@theme/DocItem/Layout";
import AiContextMenu from "@site/src/components/AiContextMenu";

type Props = React.ComponentProps<typeof LayoutType>;

export default function LayoutWrapper(props: Props): JSX.Element {
  return (
    <div style={{ position: "relative" }}>
      <div className="ai-context-menu-wrapper">
        <AiContextMenu />
      </div>
      <Layout {...props} />
    </div>
  );
}
