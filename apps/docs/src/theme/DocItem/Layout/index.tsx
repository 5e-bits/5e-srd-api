import React from "react";
import Layout from "@theme-original/DocItem/Layout";
import type LayoutType from "@theme/DocItem/Layout";
import AiContextMenuOverlay from "@site/src/components/AiContextMenuOverlay";

type Props = React.ComponentProps<typeof LayoutType>;

export default function LayoutWrapper(props: Props): JSX.Element {
  return (
    <AiContextMenuOverlay>
      <Layout {...props} />
    </AiContextMenuOverlay>
  );
}
