"use client";

import * as React from "react";

interface CalendarProps {
  selected?: Date;
  onSelect: (date: Date) => void;
}

export function Calendar({ selected, onSelect }: CalendarProps) {
  return (
    <input
      type="date"
      value={selected ? selected.toISOString().split("T")[0] : ""}
      onChange={(e) => onSelect(new Date(e.target.value))}
      className="border rounded-lg p-2 w-full"
    />
  );
}
