import React from "react";
import {
  Search,
  Filter,
  TriangleAlert,
  Calendar,
  SlidersHorizontal,
  Eye,
  Eraser,
  Download,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle } from "lucide-react";
import { FilterState } from "@/hooks/useInquiryFilters";
import { getStatusColor, getPriorityColor } from "@/lib/helper";

interface InquiryFiltersProps {
  filters: FilterState;
  updateFilter: (key: keyof FilterState, value: any) => void;
  clearFilters: () => void;
  totalItems: number;
  startIndex: number;
  endIndex: number;
}

function InquiryFilters({
  filters,
  updateFilter,
  clearFilters,
  totalItems,
  startIndex,
  endIndex,
}: InquiryFiltersProps) {
  const handleExport = (format: string) => {
    console.log(`Exporting data in ${format} format`);
  };

  return (
    <div className="mb-2 space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {/* Search */}
        <div className="relative min-w-0 flex-1">
          <Search className="text-primary/60 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Search by name, email, or message content..."
            value={filters.searchTerm}
            onChange={(e) => updateFilter("searchTerm", e.target.value)}
            className="border-primary/60 ring-primary/80 w-full border-2 pl-10 focus-visible:ring-1"
          />
        </div>

        <div className="flex flex-wrap gap-2 lg:flex-nowrap lg:gap-3">
          {/* Status Filter */}
          <Select
            value={filters.statusFilter}
            onValueChange={(value) => updateFilter("statusFilter", value)}
          >
            <SelectTrigger
              className="w-full min-w-[120px] border border-gray-300 px-3 hover:cursor-pointer hover:opacity-70"
              style={{
                color:
                  filters.statusFilter === "all"
                    ? "#22b123"
                    : getStatusColor(filters.statusFilter),
              }}
            >
              <Filter className="mr-2 h-4 w-4 flex-shrink-0" />
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-light border border-gray-300">
              <SelectItem value="all" className="text-primary">
                All Status
              </SelectItem>
              {["unread", "read", "replied"].map((status) => (
                <SelectItem
                  key={status}
                  value={status}
                  style={{ color: getStatusColor(status) }}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Priority Filter */}
          <Select
            value={filters.priorityFilter}
            onValueChange={(value) => updateFilter("priorityFilter", value)}
          >
            <SelectTrigger
              className="w-full min-w-[130px] border border-gray-300 px-3 hover:cursor-pointer hover:opacity-70"
              style={{
                color:
                  filters.priorityFilter === "all"
                    ? "#22b123"
                    : getPriorityColor(filters.priorityFilter),
              }}
            >
              <TriangleAlert className="mr-2 h-4 w-4 flex-shrink-0" />
              <SelectValue placeholder="All Priority" />
            </SelectTrigger>
            <SelectContent className="bg-light border border-gray-300">
              <SelectItem value="all" className="text-primary">
                All Priority
              </SelectItem>
              {["high", "medium", "low"].map((priority) => (
                <SelectItem
                  key={priority}
                  value={priority}
                  style={{ color: getPriorityColor(priority) }}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Filter */}
          <Select
            value={filters.dateFilter}
            onValueChange={(value) => updateFilter("dateFilter", value)}
          >
            <SelectTrigger className="text-primary w-full min-w-[120px] border border-gray-300 px-3 hover:cursor-pointer hover:opacity-70">
              <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
              <SelectValue placeholder="All Dates" />
            </SelectTrigger>
            <SelectContent className="bg-light border border-gray-300">
              {[
                { value: "all", label: "All Dates" },
                { value: "today", label: "Today" },
                { value: "week", label: "Past Week" },
                { value: "month", label: "Past Month" },
              ].map((item) => (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  className={
                    filters.dateFilter === item.value ? "text-primary" : ""
                  }
                >
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Options */}
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="text-primary border border-gray-300 hover:cursor-pointer hover:opacity-70"
            >
              <Button variant="outline" className="min-w-[100px] px-3">
                <SlidersHorizontal className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-light w-48 border border-gray-300"
            >
              {[
                { key: "newest", label: "Sort by Newest" },
                { key: "oldest", label: "Sort by Oldest" },
                { key: "priority", label: "Sort by Priority" },
                { key: "name", label: "Sort by Name" },
                { key: "status", label: "Sort by Status" },
              ].map((item) => (
                <DropdownMenuItem
                  key={item.key}
                  onClick={() => updateFilter("sortBy", item.key)}
                  className={`flex items-center justify-between ${filters.sortBy === item.key ? "text-primary" : ""}`}
                >
                  <span>{item.label}</span>
                  {filters.sortBy === item.key && (
                    <CheckCircle className="text-primary h-4 w-4" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Items Per Page */}
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="text-primary border border-gray-300 hover:cursor-pointer hover:opacity-70"
            >
              <Button variant="outline" className="min-w-[100px] px-3">
                <Eye className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">Show - </span>
                {filters.itemsPerPage}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-light w-[90px] border border-gray-300">
              {[5, 10, 25, 50].map((num) => (
                <DropdownMenuItem
                  key={num}
                  onClick={() => {
                    updateFilter("itemsPerPage", num);
                    updateFilter("currentPage", 1);
                  }}
                  className={`flex items-center justify-between ${filters.itemsPerPage === num ? "text-primary font-semibold" : ""}`}
                >
                  {num}
                  {filters.itemsPerPage === num && (
                    <CheckCircle className="text-primary h-4 w-4" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear Filters */}
          <Button
            variant="outline"
            className="text-danger min-w-[120px] border border-gray-300 px-3 hover:cursor-pointer hover:opacity-70"
            onClick={clearFilters}
          >
            <Eraser className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="hidden sm:inline">Clear Filter</span>
            <span className="sm:hidden">Clear</span>
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="my-4 hidden flex-col gap-2 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-gray-600">
          Showing {startIndex + 1}-{endIndex} of {totalItems} results
        </p>

        {/* Export Data Button */}
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="text-light bg-primary border border-gray-300 hover:cursor-pointer hover:opacity-70"
          >
            <Button variant="outline" className="px-3">
              <Download className="mr-2 h-4 w-4 flex-shrink-0" />
              Export Data
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-light w-[120px] border border-gray-300">
            {[
              { format: "pdf", icon: "📄", label: "PDF" },
              { format: "csv", icon: "📊", label: "CSV" },
              { format: "excel", icon: "📈", label: "Excel" },
              { format: "json", icon: "🔗", label: "JSON" },
            ].map((item) => (
              <DropdownMenuItem
                key={item.format}
                className="text-primary flex items-center hover:cursor-pointer hover:opacity-70"
                onClick={() => handleExport(item.format)}
              >
                <span className="mr-2">{item.icon}</span>
                <p className="font-medium">{item.label}</p>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default InquiryFilters;
