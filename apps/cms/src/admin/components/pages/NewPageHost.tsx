"use client";

import { useModal } from "@payloadcms/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ActionButton } from "../kit/ActionButton";
import { NewPageDialog, type NewPageTenant } from "./NewPageDialog";
import { NEW_PAGE_MODAL } from "./newPage";

type Opener = (parentId?: string) => void;

const NewPageContext = createContext<Opener | null>(null);

export function useNewPage(): Opener | null {
  return useContext(NewPageContext);
}

export function NewPageHost({
  tenant,
  children,
}: {
  tenant: NewPageTenant;
  children: ReactNode;
}) {
  const { openModal } = useModal();
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const [parentId, setParentId] = useState<string>();
  const asked = useRef(false);

  const open = useCallback<Opener>(
    (parent) => {
      setParentId(parent);
      openModal(NEW_PAGE_MODAL);
    },
    [openModal],
  );

  useEffect(() => {
    if (asked.current || search.get("newPage") !== "1") return;
    asked.current = true;
    const parent = search.get("parent");
    open(parent && /^\d+$/.test(parent) ? parent : undefined);
    router.replace(pathname);
  }, [open, pathname, router, search]);

  const value = useMemo(() => open, [open]);

  return (
    <NewPageContext.Provider value={value}>
      {children}
      <NewPageDialog parentId={parentId} tenant={tenant} />
    </NewPageContext.Provider>
  );
}

export function NewPageButton({ fallbackHref }: { fallbackHref: string }) {
  const open = useNewPage();
  return open ? (
    <ActionButton icon="add" onClick={() => open()} type="button">
      New page
    </ActionButton>
  ) : (
    <ActionButton el="link" icon="add" url={fallbackHref}>
      New page
    </ActionButton>
  );
}
