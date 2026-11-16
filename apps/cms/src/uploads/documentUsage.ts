import type { CollectionAfterOperationHook } from "payload";

import { loadDocumentUsage } from "../admin/data/documentUsage";
import { usageStatus } from "../admin/components/documents/documents";

export const attachDocumentUsage: CollectionAfterOperationHook = async ({
  args,
  operation,
  req,
  result,
}) => {
  const paged = result as { docs?: { id: number | string }[] };
  const listArgs = args as {
    pagination?: boolean;
    limit?: number;
    trash?: boolean;
  };
  if (
    operation !== "find" ||
    req.payloadAPI !== "local" ||
    !req.user ||
    listArgs.pagination === false ||
    listArgs.limit === 0 ||
    listArgs.trash ||
    !Array.isArray(paged.docs) ||
    paged.docs.length === 0
  ) {
    return result;
  }
  try {
    const usage = await loadDocumentUsage(
      req.payload,
      req.user,
      paged.docs.map((doc) => String(doc.id)),
    );
    return {
      ...paged,
      docs: paged.docs.map((doc) => {
        const entry = usage.get(String(doc.id));
        return {
          ...doc,
          usedInCount: entry?.count ?? 0,
          linkStatus: usageStatus(entry?.count ?? 0, entry?.live ?? 0),
        };
      }),
    } as typeof result;
  } catch (error) {
    req.payload.logger.error({ err: error, msg: "Couldn't count Used in" });
    return result;
  }
};
