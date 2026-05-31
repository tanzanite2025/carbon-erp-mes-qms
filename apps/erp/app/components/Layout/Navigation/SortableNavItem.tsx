import { cn } from "@carbon/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LuEyeOff, LuGripVertical } from "react-icons/lu";
import type { DraftModule } from "./useNavigationEditMode";

type SortableNavItemProps = {
  module: DraftModule;
  isOpen: boolean;
  onToggleHidden: (key: string) => void;
};

export function SortableNavItem({
  module,
  isOpen,
  onToggleHidden
}: SortableNavItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: module.key });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative h-9 px-3 flex items-center gap-1.5 rounded-full font-bold text-sm select-none transition-colors duration-200 bg-accent/20 border border-border/40 hover:bg-accent/40",
        isDragging && "opacity-50 border-primary",
        "group/item"
      )}
    >
      {/* Drag handle */}
      <div
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground shrink-0 flex items-center"
        {...attributes}
        {...listeners}
      >
        <LuGripVertical className="w-3.5 h-3.5" />
      </div>

      {/* Module icon */}
      <module.icon className="h-3.5 w-3.5 shrink-0" />

      {/* Module name */}
      <span className="whitespace-nowrap">{module.name}</span>

      {/* Hide button */}
      <button
        type="button"
        onClick={() => onToggleHidden(module.key)}
        className="text-muted-foreground hover:text-destructive p-0.5 rounded transition-colors shrink-0 flex items-center"
      >
        <LuEyeOff className="w-3 h-3" />
      </button>
    </div>
  );
}
