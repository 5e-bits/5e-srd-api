import React from "react";
import ApiItem from "@theme-original/ApiItem";
import AiContextMenu from "@site/src/components/AiContextMenu";

type Props = React.ComponentProps<typeof ApiItem>;

export default function ApiItemWrapper(props: Props): JSX.Element {
  return (
    <div style={{ position: "relative" }}>
      <div className="ai-context-menu-wrapper">
        <AiContextMenu />
      </div>
      <ApiItem {...props} />
    </div>
  );
}
