"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Currency, Time, Calendar, ArrowRight } from "@carbon/icons-react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
  useDroppable,
} from "@dnd-kit/core";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface PipelineCard {
  id: string;
  client: string;
  initial: string;
  rfqCode: string;
  service: string;
  budget: string;
  timeline: string;
  date: string;
}

interface ColumnConfig {
  id: string;
  label: string;
  dotColor: string;
  badgeBg: string;
  badgeText: string;
  avatarBg: string;
  tagBg: string;
  tagText: string;
  borderColor: string;
}

const columnConfigs: ColumnConfig[] = [
  { id: "new-lead", label: "New Lead", dotColor: "bg-[#2D2555]", badgeBg: "bg-[#2D2555]/[0.07]", badgeText: "text-[#2D2555]", avatarBg: "bg-[#2D2555]", tagBg: "bg-[#2D2555]/[0.07]", tagText: "text-[#2D2555]", borderColor: "border-l-[#2D2555]" },
  { id: "in-review", label: "In Review", dotColor: "bg-[#F59E0B]", badgeBg: "bg-[#F59E0B]/10", badgeText: "text-[#F59E0B]", avatarBg: "bg-[#F59E0B]", tagBg: "bg-[#F59E0B]/10", tagText: "text-[#F59E0B]", borderColor: "border-l-[#F59E0B]" },
  { id: "proposal-sent", label: "Proposal Sent", dotColor: "bg-[#A855F7]", badgeBg: "bg-[#A855F7]/10", badgeText: "text-[#A855F7]", avatarBg: "bg-[#A855F7]", tagBg: "bg-[#A855F7]/10", tagText: "text-[#A855F7]", borderColor: "border-l-[#A855F7]" },
  { id: "won", label: "Won", dotColor: "bg-[#068653]", badgeBg: "bg-[#068653]/10", badgeText: "text-[#068653]", avatarBg: "bg-[#068653]", tagBg: "bg-[#068653]/10", tagText: "text-[#068653]", borderColor: "border-l-[#068653]" },
  { id: "lost", label: "Lost", dotColor: "bg-[#EF4444]", badgeBg: "bg-[#EF4444]/10", badgeText: "text-[#EF4444]", avatarBg: "bg-[#EF4444]", tagBg: "bg-[#EF4444]/10", tagText: "text-[#EF4444]", borderColor: "border-l-[#EF4444]" },
];

const initialCards: Record<string, PipelineCard[]> = {
  "new-lead": [
    { id: "card-1", client: "LogistiCore Nigeria", initial: "L", rfqCode: "RFQ-2026-003", service: "AI Solutions", budget: "$50K–100K", timeline: "6–12 mo", date: "Mar 6, 2026" },
  ],
  "in-review": [
    { id: "card-2", client: "TechBridge Ghana", initial: "T", rfqCode: "RFQ-2026-001", service: "Cloud Solutions", budget: "$15K–50K", timeline: "3–6 mo", date: "Mar 6, 2026" },
    { id: "card-3", client: "NileHealth Sudan", initial: "N", rfqCode: "RFQ-2026-004", service: "Cybersecurity", budget: "$15K–50K", timeline: "3–6 mo", date: "Mar 6, 2026" },
  ],
  "proposal-sent": [
    { id: "card-4", client: "Sahel Agri Solutions", initial: "S", rfqCode: "RFQ-2026-002", service: "Web Development", budget: "$15K–50K", timeline: "3–6 mo", date: "Mar 6, 2026" },
  ],
  "won": [
    { id: "card-5", client: "Savanna Capital Kenya", initial: "S", rfqCode: "RFQ-2026-005", service: "Mobile App", budget: "$50K–100K", timeline: "6–12 mo", date: "Mar 6, 2026" },
  ],
  "lost": [
    { id: "card-6", client: "FinanceCore Inc.", initial: "F", rfqCode: "RFQ-2026-006", service: "Cloud Solutions", budget: "$50K–100K", timeline: "6–12 mo", date: "Mar 6, 2026" },
  ],
};

// ── Draggable Card ──
function SortableCard({ card, col, onViewDetails }: { card: PipelineCard; col: ColumnConfig; onViewDetails?: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    boxShadow: "0px 1px 2px rgba(0,0,0,0.05)",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CardContent card={card} col={col} onViewDetails={onViewDetails} />
    </div>
  );
}

// ── Card UI (shared between sortable + overlay) ──
function CardContent({ card, col, onViewDetails }: { card: PipelineCard; col: ColumnConfig; onViewDetails?: () => void }) {
  return (
    <div className={`flex flex-col gap-3 p-4 bg-white rounded-2xl border-l-[3px] ${col.borderColor} cursor-grab active:cursor-grabbing`}>
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 ${col.avatarBg} rounded-xl flex items-center justify-center`}>
          <span className="text-[12px] font-bold text-white">{card.initial}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-bold leading-[14px] text-[#0F172A]">{card.client}</span>
          <span className="text-[9px] leading-[14px] text-[#94A3B8]">{card.rfqCode}</span>
        </div>
      </div>
      <div className="pt-1">
        <span className={`inline-flex px-2 py-[1px] ${col.tagBg} rounded-md text-[10px] font-semibold leading-[15px] capitalize ${col.tagText}`}>
          {card.service}
        </span>
      </div>
      <div className="flex flex-col gap-[3px]">
        <div className="flex items-center gap-1.5">
          <Currency size={12} className="text-[#64748B]" />
          <span className="text-[10px] leading-[15px] text-[#64748B]">{card.budget}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Time size={12} className="text-[#64748B]" />
          <span className="text-[10px] leading-[15px] text-[#64748B]">{card.timeline}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar size={12} className="text-[#94A3B8]" />
          <span className="text-[10px] leading-[15px] text-[#94A3B8]">{card.date}</span>
        </div>
      </div>
      <div
        className="flex items-center justify-between pt-2 border-t border-[#F8FAFC] cursor-pointer hover:opacity-70 transition-opacity"
        onPointerDown={(e) => { e.stopPropagation(); onViewDetails?.(); }}
      >
        <span className="text-[10px] leading-[15px] text-[#94A3B8]">View details</span>
        <ArrowRight size={14} className="text-[#94A3B8]" />
      </div>
    </div>
  );
}

// ── Droppable Column ──
function DroppableColumn({ col, cards, colIdx, onCardClick }: { col: ColumnConfig; cards: PipelineCard[]; colIdx: number; onCardClick?: (card: PipelineCard, colId: string) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });

  return (
    <motion.div
      className="flex flex-col flex-1 min-w-[242px] rounded-[18px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 * colIdx }}
    >
      <div className="flex items-center justify-between px-1 pb-3">
        <div className="flex items-center gap-2">
          <div className={`w-[10px] h-[10px] ${col.dotColor} rounded-full`} />
          <span className="text-[12px] font-bold leading-[16px] text-[#334155]">{col.label}</span>
        </div>
        <div className={`w-6 h-6 flex items-center justify-center ${col.badgeBg} rounded-full`}>
          <span className={`text-[12px] font-semibold ${col.badgeText}`}>{cards.length}</span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 flex flex-col gap-3 p-[10px] rounded-2xl overflow-y-auto min-h-[200px] transition-colors duration-200 ${
          isOver ? "bg-black/[0.06] ring-2 ring-[#2D2555]/20" : "bg-black/[0.02]"
        }`}
      >
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <SortableCard key={card.id} card={card} col={col} onViewDetails={() => onCardClick?.(card, col.id)} />
          ))}
        </SortableContext>
        {cards.length === 0 && (
          <div className="flex-1 flex items-center justify-center py-10">
            <span className="text-[11px] text-[#94A3B8]">Drop cards here</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Main Board ──
export default function PipelineBoard({ searchQuery = "", onCardClick }: { searchQuery?: string; onCardClick?: (card: PipelineCard, colId: string) => void }) {
  const [cardsByColumn, setCardsByColumn] = useState(initialCards);
  const [activeCard, setActiveCard] = useState<PipelineCard | null>(null);
  const [activeColId, setActiveColId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const findColumn = (cardId: string): string | null => {
    for (const [colId, cards] of Object.entries(cardsByColumn)) {
      if (cards.some((c) => c.id === cardId)) return colId;
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const cardId = event.active.id as string;
    const colId = findColumn(cardId);
    if (!colId) return;
    const card = cardsByColumn[colId].find((c) => c.id === cardId);
    if (card) {
      setActiveCard(card);
      setActiveColId(colId);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const fromCol = findColumn(activeId);
    // Check if dropping over a column directly or over another card
    const toCol = columnConfigs.find((c) => c.id === overId) ? overId : findColumn(overId);

    if (!fromCol || !toCol || fromCol === toCol) return;

    setCardsByColumn((prev) => {
      const fromCards = [...prev[fromCol]];
      const toCards = [...prev[toCol]];
      const cardIndex = fromCards.findIndex((c) => c.id === activeId);
      if (cardIndex === -1) return prev;

      const [movedCard] = fromCards.splice(cardIndex, 1);
      toCards.push(movedCard);

      return { ...prev, [fromCol]: fromCards, [toCol]: toCards };
    });
  };

  const handleDragEnd = (_event: DragEndEvent) => {
    setActiveCard(null);
    setActiveColId(null);
  };

  const activeColConfig = activeColId ? columnConfigs.find((c) => c.id === activeColId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 h-full min-w-0">
        {columnConfigs.map((col, colIdx) => {
          const cards = (cardsByColumn[col.id] || []).filter(
            (c) =>
              c.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
              c.rfqCode.toLowerCase().includes(searchQuery.toLowerCase())
          );
          return <DroppableColumn key={col.id} col={col} cards={cards} colIdx={colIdx} onCardClick={onCardClick} />;
        })}
      </div>

      <DragOverlay>
        {activeCard && activeColConfig ? (
          <div className="rotate-[3deg] scale-105">
            <CardContent card={activeCard} col={activeColConfig} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
