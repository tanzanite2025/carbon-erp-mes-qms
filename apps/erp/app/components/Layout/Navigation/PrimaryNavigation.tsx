import { cn } from "@carbon/react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext
} from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import type { AnchorHTMLAttributes } from "react";
import { forwardRef, memo, useEffect } from "react";
import { LuSettings2 } from "react-icons/lu";
import { Link, useMatches } from "react-router";
import { useModules, useOptimisticLocation, useSettingsModule } from "~/hooks";
import type { Authenticated, NavItem } from "~/types";
import { HiddenModulesPopover } from "./HiddenModulesPopover";
import { NavigationEditBar } from "./NavigationEditBar";
import { SortableNavItem } from "./SortableNavItem";
import { useNavigationEditMode } from "./useNavigationEditMode";

const PrimaryNavigation = () => {
  const location = useOptimisticLocation();
  const currentModule = getModule(location.pathname);
  const links = useModules();
  const settingsModule = useSettingsModule();
  const matchedModules = useMatches().reduce((acc, match) => {
    const handle = match.handle as { module?: string } | undefined;

    if (handle && typeof handle.module === "string") {
      acc.add(handle.module);
    }

    return acc;
  }, new Set<string>());

  const editMode = useNavigationEditMode();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    if (!editMode.isEditing) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") editMode.cancelEditMode();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [editMode.isEditing, editMode.cancelEditMode]);

  return (
    <div className="w-full flex items-center justify-center py-2 z-50">
      <nav
        data-state="expanded"
        className={cn(
          "group flex flex-row items-center gap-1.5 p-1 bg-muted/40 dark:bg-muted/10 border border-dashed border-border/80 rounded-full w-fit max-w-full overflow-x-auto hide-scrollbar scrollbar-none"
        )}
      >
        {editMode.isEditing ? (
          <div className="flex items-center gap-1.5 px-1">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={editMode.handleDragEnd}
            >
              <SortableContext
                items={editMode.visibleDraft.map((m) => m.key)}
                strategy={horizontalListSortingStrategy}
              >
                {editMode.visibleDraft.map((module) => (
                  <SortableNavItem
                    key={module.key}
                    module={module}
                    isOpen={true}
                    onToggleHidden={editMode.toggleHidden}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            {links.map((link) => {
              const m = getModule(link.to);
              const moduleMatches = matchedModules.has(m);
              const isActive = currentModule === m || moduleMatches;
              return (
                <NavigationIconLink
                  key={link.name}
                  link={link}
                  isActive={isActive}
                  isOpen={true}
                />
              );
            })}
          </div>
        )}

        {editMode.isEditing && (
          <HiddenModulesPopover
            hiddenModules={editMode.hiddenDraft}
            onToggleHidden={editMode.toggleHidden}
          />
        )}

        {settingsModule &&
          !editMode.isEditing &&
          (() => {
            const m = getModule(settingsModule.to);
            const moduleMatches = matchedModules.has(m);
            const isActive = currentModule === m || moduleMatches;
            return (
              <NavigationIconLink
                link={settingsModule}
                isActive={isActive}
                isOpen={true}
              />
            );
          })()}

        {editMode.isEditing ? (
          <NavigationEditBar
            isSaving={editMode.isSaving}
            isDirty={editMode.isDirty}
            onSave={editMode.save}
            onCancel={editMode.cancelEditMode}
          />
        ) : (
          <button
            type="button"
            onClick={editMode.enterEditMode}
            className="h-9 w-9 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/40 dark:hover:bg-accent/20 transition-colors shrink-0 outline-none"
            title="Customize"
          >
            <LuSettings2 className="h-4 w-4" />
          </button>
        )}
      </nav>
    </div>
  );
};

interface NavigationIconButtonProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  link: Authenticated<NavItem>;
  isActive?: boolean;
  isOpen?: boolean;
}

const NavigationIconLink = forwardRef<
  HTMLAnchorElement,
  NavigationIconButtonProps
>(({ link, isActive = false, isOpen = false, onClick, ...props }, ref) => {
  return (
    <Link
      role="button"
      aria-current={isActive}
      ref={ref}
      to={link.to}
      {...props}
      onClick={onClick}
      className={cn(
        "relative h-9 px-4 flex items-center gap-1.5 rounded-full font-bold text-sm select-none transition-colors duration-200 outline-none z-10 whitespace-nowrap",
        isActive
          ? "text-emerald-800 dark:text-emerald-400"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/40 dark:hover:bg-accent/20",
        props.className
      )}
      prefetch="intent"
    >
      <link.icon className="h-3.5 w-3.5 shrink-0" />
      <span>{link.name}</span>
      {isActive && (
        <motion.div
          layoutId="active-nav-pill"
          className="absolute inset-0 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-500/20 rounded-full -z-10"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
});
NavigationIconLink.displayName = "NavigationIconLink";

export default memo(PrimaryNavigation);

export function getModule(link: string) {
  return link.split("/")?.[2];
}
