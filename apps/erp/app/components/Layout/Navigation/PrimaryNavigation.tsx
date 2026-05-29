import { cn, useIsMobile, VStack } from "@carbon/react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import type { AnchorHTMLAttributes } from "react";
import { forwardRef, memo, useEffect } from "react";
import { LuChevronLeft, LuChevronRight, LuSettings2 } from "react-icons/lu";
import { Link, useMatches } from "react-router";
import { useModules, useOptimisticLocation, useSettingsModule } from "~/hooks";
import { useUIStore } from "~/stores/ui";
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

  // 使用 UI Store 管理固定状态（持久化）
  const isMobile = useIsMobile();
  const isPinned = useUIStore((state) => state.isSidebarPinned);
  const setSidebarPinned = useUIStore((state) => state.setSidebarPinned);

  // 移动端强制不固定
  const effectiveIsPinned = isMobile ? false : isPinned;

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

  // 展开状态：只有固定展开或编辑模式
  const isOpen = effectiveIsPinned || editMode.isEditing;

  // 点击切换按钮：直接设置相反的状态
  const handleTogglePin = () => {
    setSidebarPinned(!effectiveIsPinned);
  };

  return (
    <div className="w-14 h-full flex-col z-50 hidden sm:flex">
      <nav
        data-state={isOpen ? "expanded" : "collapsed"}
        className={cn(
          "bg-background py-2 group z-10 h-full w-14 data-[state=expanded]:w-[13rem]",
          "flex flex-col justify-between data-[state=expanded]:shadow-xl data-[state=expanded]:border-r data-[state=expanded]:border-border",
          "transition-width duration-200",
          "hide-scrollbar overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent"
        )}
      >
        <VStack
          spacing={1}
          className="flex flex-col justify-between h-full px-2"
        >
          <VStack spacing={1}>
            {/* 切换按钮 - 与其他导航项样式一致 */}
            {!isMobile && (
              <button
                type="button"
                onClick={handleTogglePin}
                className={cn(
                  "relative",
                  "h-10 w-10 group-data-[state=expanded]:w-full",
                  "flex items-center rounded-md",
                  "group-data-[state=collapsed]:justify-center",
                  "group-data-[state=expanded]:-space-x-2",
                  "font-medium shrink-0 inline-flex items-center justify-center select-none",
                  "transition-[background-color,color,width] duration-100 ease-out",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus:!outline-none focus:!ring-0 active:!outline-none active:!ring-0",
                  "after:pointer-events-none after:absolute after:-inset-[3px] after:rounded-lg after:border after:border-blue-500 after:opacity-0 after:ring-2 after:ring-blue-500/20 after:transition-opacity focus-visible:after:opacity-100 active:after:opacity-0"
                )}
                aria-label={effectiveIsPinned ? "收起侧边栏" : "展开侧边栏"}
                title={effectiveIsPinned ? "收起侧边栏" : "展开侧边栏"}
              >
                <div className="absolute left-3 top-3 flex items-center justify-center text-primary">
                  {effectiveIsPinned ? (
                    <LuChevronLeft className="h-5 w-5" />
                  ) : (
                    <LuChevronRight className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={cn(
                    "min-w-[128px] text-sm text-left",
                    "absolute left-7 group-data-[state=expanded]:left-12",
                    "opacity-0 group-data-[state=expanded]:opacity-100"
                  )}
                >
                  {effectiveIsPinned ? "收起" : "展开"}
                </span>
              </button>
            )}

            {editMode.isEditing ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={editMode.handleDragEnd}
              >
                <SortableContext
                  items={editMode.visibleDraft.map((m) => m.key)}
                  strategy={verticalListSortingStrategy}
                >
                  {editMode.visibleDraft.map((module) => (
                    <SortableNavItem
                      key={module.key}
                      module={module}
                      isOpen={isOpen}
                      onToggleHidden={editMode.toggleHidden}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            ) : (
              links.map((link) => {
                const m = getModule(link.to);
                const moduleMatches = matchedModules.has(m);
                const isActive = currentModule === m || moduleMatches;
                return (
                  <NavigationIconLink
                    key={link.name}
                    link={link}
                    isActive={isActive}
                    isOpen={isOpen}
                  />
                );
              })
            )}

            {editMode.isEditing && (
              <HiddenModulesPopover
                hiddenModules={editMode.hiddenDraft}
                onToggleHidden={editMode.toggleHidden}
              />
            )}
          </VStack>

          <VStack spacing={1}>
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
                    isOpen={isOpen}
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
                className={cn(
                  "relative",
                  "h-10 w-10 group-data-[state=expanded]:w-full",
                  "flex items-center rounded-md",
                  "group-data-[state=collapsed]:justify-center",
                  "group-data-[state=expanded]:-space-x-2",
                  "font-medium shrink-0 inline-flex select-none",
                  "text-muted-foreground",
                  "hover:bg-accent hover:text-accent-foreground",
                  "transition-[background-color,color,width] duration-100 ease-out",
                  "focus:!outline-none focus:!ring-0 active:!outline-none active:!ring-0",
                  "after:pointer-events-none after:absolute after:-inset-[3px] after:rounded-lg after:border after:border-blue-500 after:opacity-0 after:ring-2 after:ring-blue-500/20 after:transition-opacity focus-visible:after:opacity-100 active:after:opacity-0",
                  "group/item"
                )}
              >
                <LuSettings2 className="absolute left-3 top-3 flex items-center justify-center" />
                <span
                  className={cn(
                    "min-w-[128px] text-sm text-left",
                    "absolute left-7 group-data-[state=expanded]:left-12",
                    "opacity-0 group-data-[state=expanded]:opacity-100"
                  )}
                >
                  Customize
                </span>
              </button>
            )}
          </VStack>
        </VStack>
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
  const iconClasses = [
    "absolute left-3 top-3 flex items-center items-center justify-center"
  ];

  const classes = [
    "relative",
    "h-10 w-10 group-data-[state=expanded]:w-full",
    "flex items-center rounded-md",
    "group-data-[state=collapsed]:justify-center",
    "group-data-[state=expanded]:-space-x-2",
    "font-medium shrink-0 inline-flex items-center justify-center select-none",
    "disabled:opacity-50",
    "transition-[background-color,color,width] duration-100 ease-out",
    "focus:!outline-none focus:!ring-0 active:!outline-none active:!ring-0",
    "after:pointer-events-none after:absolute after:-inset-[3px] after:rounded-lg after:border after:border-blue-500 after:opacity-0 after:ring-2 after:ring-blue-500/20 after:transition-opacity focus-visible:after:opacity-100 active:after:opacity-0",
    !isActive && "hover:bg-accent hover:text-accent-foreground",
    isActive && "bg-active text-active-foreground dark:shadow-button-base",
    "group/item"
  ];

  return (
    <Link
      role="button"
      aria-current={isActive}
      ref={ref}
      to={link.to}
      {...props}
      onClick={onClick}
      className={cn(classes, props.className)}
      prefetch="intent"
    >
      <link.icon className={cn(...iconClasses)} />

      <span
        aria-hidden={isOpen || undefined}
        className={cn(
          "min-w-[128px] text-sm text-left",
          "absolute left-7 group-data-[state=expanded]:left-12",
          "opacity-0 group-data-[state=expanded]:opacity-100"
        )}
      >
        {link.name}
      </span>
    </Link>
  );
});
NavigationIconLink.displayName = "NavigationIconLink";

export default memo(PrimaryNavigation);

export function getModule(link: string) {
  return link.split("/")?.[2];
}
