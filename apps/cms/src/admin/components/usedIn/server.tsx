import type { UIFieldServerProps } from "payload";

import { isTenantEditorOrAbove } from "../../../access";
import { usedInFor } from "../products/server";
import { UsedInPanel } from "../kit/UsedInPanel";

async function render(props: UIFieldServerProps, collection: string) {
  const data = await usedInFor(props, collection);
  return (
    <UsedInPanel
      canReplace={
        Boolean(props.req.user) && isTenantEditorOrAbove(props.req.user!)
      }
      data={data}
    />
  );
}

export function SolutionUsedInField(props: UIFieldServerProps) {
  return render(props, "solutions");
}

export function DocumentUsedInField(props: UIFieldServerProps) {
  return render(props, "documents");
}
