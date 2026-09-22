import React from "react";
import ApiItem from "@theme-original/ApiItem";
import AiContextMenuOverlay from "@site/src/components/AiContextMenuOverlay";

type Props = React.ComponentProps<typeof ApiItem>;

export default function ApiItemWrapper(props: Props): JSX.Element {
  return (
    <AiContextMenuOverlay>
      <ApiItem {...props} />
    </AiContextMenuOverlay>
  );
}
