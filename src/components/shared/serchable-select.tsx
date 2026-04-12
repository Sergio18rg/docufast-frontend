"use client";

import { useMemo, useState } from "react";
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";

const SearchableSelect = <T,>({
  label,
  placeholder,
  searchPlaceholder,
  items,
  selectedId,
  onSelect,
  getId,
  getLabel,
  getDescription,
  getColor,
  disabled,
}: {
  label: string;
  placeholder: string;
  searchPlaceholder: string;
  items: T[];
  selectedId: number | null | undefined;
  onSelect: (value: number | null) => void;
  getId: (item: T) => number;
  getLabel: (item: T) => string;
  getDescription?: (item: T) => string;
  getColor?: (item: T) => string | undefined;
  disabled?: boolean;
}) => {
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        getLabel(item).toLowerCase().includes(search.toLowerCase()),
      ),
    [items, search, getLabel],
  );

  const selectedItem = items.find((item) => getId(item) === selectedId) ?? null;
  const triggerStyle =
    selectedItem && getColor
      ? {
          backgroundColor: `${getColor(selectedItem)}22`,
          borderColor: getColor(selectedItem),
          color: getColor(selectedItem),
        }
      : undefined;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select
        disabled={disabled}
        value={selectedId ? String(selectedId) : "__none__"}
        onValueChange={(value) =>
          onSelect(value === "__none__" ? null : Number(value))
        }
      >
        <SelectTrigger style={triggerStyle} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <div className="p-2">
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <SelectItem value="__none__">Unassigned</SelectItem>
          {filteredItems.map((item) => (
            <SelectItem key={getId(item)} value={String(getId(item))}>
              <div className="flex items-center gap-2">
                {getColor ? (
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: getColor(item) }}
                  />
                ) : null}
                <span>{getLabel(item)}</span>
                {getDescription ? (
                  <span className="text-xs text-muted-foreground">
                    {getDescription(item)}
                  </span>
                ) : null}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export { SearchableSelect };
