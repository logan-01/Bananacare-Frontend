"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ChevronDown, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [activeFilters, setActiveFilters] = useState({
    disease: "",
    region: "all",
    municipality: "all",
    province: "all",
    barangay: "all",
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
  });

  // Extract unique values for dropdown filters
  const getUniqueAddressValues = (field: string) => {
    const values = new Set<string>();
    data.forEach((item: any) => {
      const address = item.address as Record<string, string>;
      let value = "";

      switch (field) {
        case "region":
          value = address?.region || "";
          break;
        case "municipality":
          value = address?.municipality || address?.city || "";
          break;
        case "province":
          value = address?.state || "";
          break;
        case "barangay":
          value = address?.village || address?.suburb || address?.town || "";
          break;
      }

      if (value && value !== "N/A") {
        values.add(value);
      }
    });
    return Array.from(values).sort();
  };

  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...activeFilters, [filterType]: value };
    setActiveFilters(newFilters);

    // Update column filters
    const updatedFilters = columnFilters.filter(
      (filter) =>
        ![
          "result",
          "state",
          "municipality",
          "province",
          "barangayTown",
        ].includes(filter.id as string),
    );

    if (newFilters.disease) {
      updatedFilters.push({ id: "result", value: newFilters.disease });
    }
    if (newFilters.region && newFilters.region !== "all") {
      updatedFilters.push({ id: "state", value: newFilters.region });
    }
    if (newFilters.municipality && newFilters.municipality !== "all") {
      updatedFilters.push({
        id: "municipality",
        value: newFilters.municipality,
      });
    }
    if (newFilters.province && newFilters.province !== "all") {
      updatedFilters.push({ id: "province", value: newFilters.province });
    }
    if (newFilters.barangay && newFilters.barangay !== "all") {
      updatedFilters.push({ id: "barangayTown", value: newFilters.barangay });
    }

    setColumnFilters(updatedFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters({
      disease: "",
      region: "all",
      municipality: "all",
      province: "all",
      barangay: "all",
    });
    setColumnFilters([]);
  };

  const hasActiveFilters =
    activeFilters.disease !== "" ||
    activeFilters.region !== "all" ||
    activeFilters.municipality !== "all" ||
    activeFilters.province !== "all" ||
    activeFilters.barangay !== "all";

  return (
    <div className="bg-light divide-none rounded-md px-2 py-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-clash-grotesk text-lg font-medium">Scan History</p>
      </div>

      {/* Enhanced Filter Section */}
      <div className="mb-4 space-y-4">
        {/* Disease Search and Column Selector Row */}
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Search diseases..."
            value={activeFilters.disease}
            onChange={(event) =>
              handleFilterChange("disease", event.target.value)
            }
            className="focus-visible:ring-primary focus-within:border-primary border-dark placeholder:text-dark/60 max-w-sm rounded-sm font-medium shadow-none focus-visible:ring-1"
          />

          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="text-light border-none focus:outline-none"
            >
              <Button className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-light">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Address Filters Row */}
        <div className="flex flex-wrap gap-2">
          <Select
            value={activeFilters.region}
            onValueChange={(value) => handleFilterChange("region", value)}
          >
            <SelectTrigger className="h-8 w-[140px]">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent className="bg-light">
              <SelectItem value="all">All Regions</SelectItem>
              {getUniqueAddressValues("region").map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={activeFilters.province}
            onValueChange={(value) => handleFilterChange("province", value)}
          >
            <SelectTrigger className="h-8 w-[140px]">
              <SelectValue placeholder="Province" />
            </SelectTrigger>
            <SelectContent className="bg-light">
              <SelectItem value="all">All Provinces</SelectItem>
              {getUniqueAddressValues("province").map((province) => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={activeFilters.municipality}
            onValueChange={(value) => handleFilterChange("municipality", value)}
          >
            <SelectTrigger className="h-8 w-[140px]">
              <SelectValue placeholder="Municipality" />
            </SelectTrigger>
            <SelectContent className="bg-light">
              <SelectItem value="all">All Municipalities</SelectItem>
              {getUniqueAddressValues("municipality").map((municipality) => (
                <SelectItem key={municipality} value={municipality}>
                  {municipality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={activeFilters.barangay}
            onValueChange={(value) => handleFilterChange("barangay", value)}
          >
            <SelectTrigger className="h-8 w-[140px]">
              <SelectValue placeholder="Barangay" />
            </SelectTrigger>
            <SelectContent className="bg-light">
              <SelectItem value="all">All Barangays</SelectItem>
              {getUniqueAddressValues("barangay").map((barangay) => (
                <SelectItem key={barangay} value={barangay}>
                  {barangay}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-xs text-gray-600">Active filters:</span>
            {Object.entries(activeFilters).map(([key, value]) =>
              value && value !== "all" ? (
                <span
                  key={key}
                  className="bg-primary/10 text-primary border-primary/20 inline-flex items-center rounded-full border px-2 py-1 text-xs"
                >
                  {key}: {value}
                  <button
                    onClick={() =>
                      handleFilterChange(key, key === "disease" ? "" : "all")
                    }
                    className="hover:text-primary/80 ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ) : null,
            )}

            <div
              className="bg-danger/20 text-danger border-primary/20 inline-flex items-center rounded-full border px-2 py-1 text-xs hover:cursor-pointer hover:opacity-70"
              onClick={clearAllFilters}
            >
              X Clear Filters
            </div>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-md">
        <Table>
          <TableHeader className="bg-primary text-light rounded-3xl">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-none">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="even:bg-primary/20 rounded-md border-none font-medium"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {hasActiveFilters
                    ? "No results match your filters"
                    : "No Data Currently Available"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results Summary */}
      <div className="mt-2 text-sm text-gray-600">
        Showing {table.getFilteredRowModel().rows.length} of {data.length}{" "}
        results
        {hasActiveFilters && " (filtered)"}
      </div>
    </div>
  );
}
