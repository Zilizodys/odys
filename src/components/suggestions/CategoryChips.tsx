import React, { useRef } from "react";

interface CategoryChipsProps {
  categories: string[];
  activeCategory: string;
  onSelect: (cat: string) => void;
}

export default function CategoryChips({
  categories,
  activeCategory,
  onSelect,
}: CategoryChipsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  // Drag to scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    isDown = true;
    startX = e.pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeft = scrollRef.current?.scrollLeft || 0;
    document.body.style.cursor = "grabbing";
  };
  const handleMouseLeave = () => {
    isDown = false;
    document.body.style.cursor = "";
  };
  const handleMouseUp = () => {
    isDown = false;
    document.body.style.cursor = "";
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      ref={scrollRef}
      className="flex space-x-2 overflow-x-auto py-2 no-scrollbar select-none"
      style={{ cursor: "grab" }}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-1 rounded-full font-semibold text-sm transition
            ${cat === activeCategory
              ? 'bg-indigo-600 text-white shadow'
              : 'bg-gray-100 text-gray-700 hover:bg-indigo-100'}
          `}
        >
          {cat}
        </button>
      ))}
    </div>
  );
} 