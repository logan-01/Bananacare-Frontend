import { useState, useMemo } from "react";
import { InquiryMessageType } from "@/lib/helper";

export interface FilterState {
  searchTerm: string;
  statusFilter: string;
  priorityFilter: string;
  dateFilter: string;
  sortBy: string;
  currentPage: number;
  itemsPerPage: number;
}

function useInquiryFilters(inquiries: InquiryMessageType[]) {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    statusFilter: "all",
    priorityFilter: "all",
    dateFilter: "all",
    sortBy: "newest",
    currentPage: 1,
    itemsPerPage: 10,
  });

  const filteredInquiries = useMemo(() => {
    return inquiries
      .filter((msg) => {
        const matchesSearch =
          msg.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          msg.email.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          msg.message.toLowerCase().includes(filters.searchTerm.toLowerCase());

        const matchesStatus =
          filters.statusFilter === "all" || msg.status === filters.statusFilter;
        const matchesPriority =
          filters.priorityFilter === "all" ||
          msg.priority === filters.priorityFilter;

        let matchesDate = true;
        if (filters.dateFilter !== "all") {
          const messageDate = new Date(msg.createdAt ?? "");
          const now = new Date();

          switch (filters.dateFilter) {
            case "today":
              matchesDate = messageDate.toDateString() === now.toDateString();
              break;
            case "week":
              const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              matchesDate = messageDate >= weekAgo;
              break;
            case "month":
              const monthAgo = new Date(
                now.getTime() - 30 * 24 * 60 * 60 * 1000,
              );
              matchesDate = messageDate >= monthAgo;
              break;
          }
        }

        return matchesSearch && matchesStatus && matchesPriority && matchesDate;
      })
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

        const priorityOrder: Record<string, number> = {
          high: 3,
          medium: 2,
          low: 1,
        };
        const priorityA = a.priority ? (priorityOrder[a.priority] ?? 0) : 0;
        const priorityB = b.priority ? (priorityOrder[b.priority] ?? 0) : 0;

        switch (filters.sortBy) {
          case "oldest":
            return dateA - dateB;
          case "newest":
            return dateB - dateA;
          case "priority":
            return priorityB - priorityA;
          case "name":
            return (a.name ?? "").localeCompare(b.name ?? "");
          case "status":
            return (a.status ?? "").localeCompare(b.status ?? "");
          default:
            return 0;
        }
      });
  }, [inquiries, filters]);

  const paginatedInquiries = useMemo(() => {
    const startIndex = (filters.currentPage - 1) * filters.itemsPerPage;
    const endIndex = startIndex + filters.itemsPerPage;
    return filteredInquiries.slice(startIndex, endIndex);
  }, [filteredInquiries, filters.currentPage, filters.itemsPerPage]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      statusFilter: "all",
      priorityFilter: "all",
      dateFilter: "all",
      sortBy: "newest",
      currentPage: 1,
      itemsPerPage: 10,
    });
  };

  return {
    filters,
    filteredInquiries,
    paginatedInquiries,
    updateFilter,
    clearFilters,
    totalItems: filteredInquiries.length,
    startIndex: (filters.currentPage - 1) * filters.itemsPerPage,
    endIndex: Math.min(
      filters.currentPage * filters.itemsPerPage,
      filteredInquiries.length,
    ),
  };
}

export default useInquiryFilters;
