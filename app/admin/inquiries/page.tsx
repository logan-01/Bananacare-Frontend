"use client";

import React, { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  User,
  Clock,
  CheckCircle,
  X,
  Eye,
  Trash2,
  MessageSquare,
  ScanLine,
  MessageSquareReply,
  MessageSquareDot,
  MessageSquareText,
  MessageSquareWarning,
  AtSign,
  MessageCircle,
  BellDot,
  TriangleAlert,
  SlidersHorizontal,
  Calendar,
  Eraser,
  Download,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import StatCard from "@/components/admin/StatCard";
import DeleteModal from "@/components/modals/DeleteModal";
import {
  getInquiries,
  updateInquiry,
  deleteInquiry,
  InquiryMessageType,
  StatusLabel,
} from "@/lib/helper";

function Inquries() {
  const [selectedMessage, setSelectedMessage] =
    useState<InquiryMessageType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [inquiries, setInquiries] = useState<InquiryMessageType[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [contactInfoExpanded, setContactInfoExpanded] = useState(true); // true to start expanded
  const [messageContentExpanded, setMessageContentExpanded] = useState(true); // true to start expanded
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [dateFilter, setDateFilter] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const data = await getInquiries();
        setInquiries(data);
      } catch (err) {
        console.log("Failed to load inquiries.");
      }
    };

    // Initial fetch
    fetchInquiries();

    // Set interval to fetch every 10 seconds
    const interval = setInterval(fetchInquiries, 10000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  //Helpers Function
  const updateInquiriesStatus = async (
    id: string = "defaultId",
    newStatus: StatusLabel,
  ) => {
    try {
      // Call the API first
      await updateInquiry(id, { status: newStatus });

      // Then update local state
      setInquiries(
        inquiries.map((msg) =>
          msg.id === id ? { ...msg, status: newStatus } : msg,
        ),
      );
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
    } catch (error) {
      console.error("Failed to update inquiry status:", error);
    }
  };

  const deleteMessage = async (id: string = "defaultId") => {
    try {
      await deleteInquiry(id);

      // Then update local state
      setInquiries(inquiries.filter((msg) => msg.id !== id));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Failed to delete inquiry:", error);
      // Optionally show user feedback here
    }
  };

  const filteredinquiries = inquiries
    .filter((msg) => {
      const matchesSearch =
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || msg.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || msg.priority === priorityFilter;

      // Date filtering
      let matchesDate = true;
      if (dateFilter !== "all") {
        const messageDate = new Date(msg.createdAt ?? "");
        const now = new Date();

        switch (dateFilter) {
          case "today":
            matchesDate = messageDate.toDateString() === now.toDateString();
            break;
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = messageDate >= weekAgo;
            break;
          case "month":
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = messageDate >= monthAgo;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesPriority && matchesDate;
    })
    .sort((a, b) => {
      // Safely convert createdAt to numbers
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

      // Safe priority values
      const priorityOrder: Record<string, number> = {
        high: 3,
        medium: 2,
        low: 1,
      };
      const priorityA = a.priority ? (priorityOrder[a.priority] ?? 0) : 0;
      const priorityB = b.priority ? (priorityOrder[b.priority] ?? 0) : 0;

      // Safe string values
      const nameA = a.name ?? "";
      const nameB = b.name ?? "";
      const statusA = a.status ?? "";
      const statusB = b.status ?? "";

      switch (sortBy) {
        case "oldest":
          return dateA - dateB;
        case "newest":
          return dateB - dateA;
        case "priority":
          return priorityB - priorityA;
        case "name":
          return nameA.localeCompare(nameB);
        case "status":
          return statusA.localeCompare(statusB);
        default:
          return 0;
      }
    });

  const getStatusColor = (status: string = "unread") => {
    switch (status) {
      case "unread":
        return "#f97a00";
      case "read":
        return "#26333a";
      case "replied":
        return "#22b123";
      default:
        return "#26333a";
    }
  };

  const getPriorityColor = (priority: string = "low") => {
    switch (priority) {
      case "high":
        return "#f93827";
      case "medium":
        return "#feba17";
      case "low":
        return "#187498";
      default:
        return "outline";
    }
  };

  function formatDate(isoDate: string = "") {
    const date = new Date(isoDate);

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    // Format date to something like "December 30, 2021, 1:40 PM"
    const formatted = new Intl.DateTimeFormat("en-US", options).format(date);

    // Replace comma before time with a dash
    return formatted.replace(",", " -").toLowerCase();
  }

  const statsConfig = [
    {
      icon: MessageSquareText,
      title: "Total Messages",
      value: inquiries.length,
      subtitle: `All received inquiries`,
      subtitleIcon: MessageCircle,
      borderColor: "border-l-neutral",
      iconBgColor: "bg-neutral/20",
      iconColor: "text-neutral",
      subtitleColor: "text-neutral",
    },
    {
      icon: MessageSquareDot,
      title: "Unread Messages",
      value: inquiries.filter((m) => m.status === "unread").length,
      subtitle: `Awaiting your response`,
      subtitleIcon: BellDot,
      borderColor: "border-l-normal",
      iconBgColor: "bg-normal/20",
      iconColor: "text-normal",
      subtitleColor: "text-normal",
    },
    {
      icon: MessageSquareReply,
      title: "Replied Messages",
      value: inquiries.filter((m) => m.status === "replied").length,
      subtitle: `You've handled these`,
      subtitleIcon: CheckCircle,
      borderColor: "border-l-primary",
      iconBgColor: "bg-primary/20",
      iconColor: "text-primary",
      subtitleColor: "text-primary",
    },
    {
      icon: MessageSquareWarning,
      title: "High Priority",
      value: inquiries.filter((m) => m.priority === "high").length,
      subtitle: `Needs urgent attention`,
      subtitleIcon: TriangleAlert,
      borderColor: "border-l-danger",
      iconBgColor: "bg-danger/20",
      iconColor: "text-danger",
      subtitleColor: "text-danger",
    },
  ];

  // Calculate pagination values
  const totalItems = filteredinquiries.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInquiries = filteredinquiries.slice(startIndex, endIndex);

  // Add export function placeholder
  const handleExport = (format: any) => {
    console.log(`Exporting data in ${format} format`);
    // Implement your export logic here
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto px-6">
      {/* Header */}
      <div className="py-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <p className="font-clash-grotesk text-2xl font-semibold">
            Message Inquires
          </p>
        </div>
      </div>

      <div className="mb-10 space-y-4">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          {statsConfig.map((config, index) => (
            <StatCard key={index} {...config} />
          ))}
        </div>

        <div className="space-y-6 rounded-lg border-2 border-gray-300 p-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="bg-primary/30 rounded-lg p-2">
              <Filter className="text-primary h-6 w-6" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                Message Inquiries
                <CheckCircle className="text-primary h-5 w-5" />
              </CardTitle>
              <CardDescription>Latest message inquiries</CardDescription>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-2 space-y-4">
            {/* Filters and Search */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              {/* Search */}
              <div className="relative min-w-0 flex-1">
                <Search className="text-primary/60 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                <Input
                  placeholder="Search by name, email, or message content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-primary/60 ring-primary/80 w-full border-2 pl-10 focus-visible:ring-1"
                />
              </div>

              {/* Filters - Responsive Grid */}
              <div className="flex flex-wrap gap-2 lg:flex-nowrap lg:gap-3">
                {/* Status Filter */}
                <div className="min-w-0 flex-shrink-0">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger
                      className="w-full min-w-[120px] border border-gray-300 px-3 hover:cursor-pointer hover:opacity-70"
                      style={{
                        color:
                          statusFilter === "all"
                            ? "#22b123"
                            : getStatusColor(statusFilter),
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
                </div>

                {/* Priority Filter */}
                <div className="min-w-0 flex-shrink-0">
                  <Select
                    value={priorityFilter}
                    onValueChange={setPriorityFilter}
                  >
                    <SelectTrigger
                      className="w-full min-w-[130px] border border-gray-300 px-3 hover:cursor-pointer hover:opacity-70"
                      style={{
                        color:
                          priorityFilter === "all"
                            ? "#22b123"
                            : getPriorityColor(priorityFilter),
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
                </div>

                {/* Date Filter */}
                <div className="min-w-0 flex-shrink-0">
                  <Select value={dateFilter} onValueChange={setDateFilter}>
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
                            dateFilter === item.value ? "text-primary" : ""
                          }
                        >
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort Options */}
                <div className="min-w-0 flex-shrink-0">
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
                          onClick={() => setSortBy(item.key)}
                          className={`flex items-center justify-between ${
                            sortBy === item.key ? "text-primary" : ""
                          }`}
                        >
                          <span>{item.label}</span>
                          {sortBy === item.key && (
                            <CheckCircle className="text-primary h-4 w-4" />
                          )}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Items Per Page */}
                <div className="min-w-0 flex-shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      className="text-primary border border-gray-300 hover:cursor-pointer hover:opacity-70"
                    >
                      <Button variant="outline" className="min-w-[100px] px-3">
                        <Eye className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="hidden sm:inline">Show - </span>
                        {itemsPerPage}
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="bg-light w-[90px] border border-gray-300">
                      {[5, 10, 25, 50].map((num) => (
                        <DropdownMenuItem
                          key={num}
                          onClick={() => {
                            setItemsPerPage(num);
                            setCurrentPage(1);
                          }}
                          className={`flex items-center justify-between ${
                            itemsPerPage === num
                              ? "text-primary font-semibold"
                              : ""
                          }`}
                        >
                          {num}
                          {itemsPerPage === num && (
                            <CheckCircle className="text-primary h-4 w-4" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Clear Filters */}
                <div className="min-w-0 flex-shrink-0">
                  <Button
                    variant="outline"
                    className="text-danger min-w-[120px] border border-gray-300 px-3 hover:cursor-pointer hover:opacity-70"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      setPriorityFilter("all");
                      setDateFilter("all");
                      setSortBy("newest");
                      setCurrentPage(1);
                    }}
                  >
                    <Eraser className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Clear Filter</span>
                    <span className="sm:hidden">Clear</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="my-4 flex flex-col gap-2 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
                {totalItems} results
              </p>

              {/* Export Data Button */}
              <div className="flex-shrink-0">
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
                    <DropdownMenuItem
                      className="text-primary flex items-center hover:cursor-pointer hover:opacity-70"
                      onClick={() => handleExport("pdf")}
                    >
                      <span className="mr-2">📄</span>
                      <p className="font-medium">PDF</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-primary flex items-center hover:cursor-pointer hover:opacity-70"
                      onClick={() => handleExport("csv")}
                    >
                      <span className="mr-2">📊</span>
                      <p className="font-medium">CSV</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-primary flex items-center hover:cursor-pointer hover:opacity-70"
                      onClick={() => handleExport("excel")}
                    >
                      <span className="mr-2">📈</span>
                      <p className="font-medium">Excel</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-primary flex items-center hover:cursor-pointer hover:opacity-70"
                      onClick={() => handleExport("json")}
                    >
                      <span className="mr-2">🔗</span>
                      <p className="font-medium">JSON</p>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Inquiries List */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {filteredinquiries.map((message: InquiryMessageType) => (
                <Card
                  key={message.id}
                  className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-gray-300 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    selectedMessage?.id === message.id
                      ? "ring-opacity-50 shadow-lg ring-2"
                      : "hover:shadow-lg"
                  }`}
                  style={{
                    borderLeft:
                      selectedMessage?.id !== message.id
                        ? `4px solid ${getPriorityColor(message.priority)}`
                        : "",
                    boxShadow:
                      selectedMessage?.id === message.id
                        ? `0 0 0 2px ${getPriorityColor(message.priority)}`
                        : "",
                  }}
                  onClick={() => setSelectedMessage(message)}
                >
                  {/* Priority indicator dot - top right */}
                  <div
                    className="absolute top-4 right-4 h-3 w-3 rounded-full shadow-sm"
                    style={{
                      backgroundColor: getPriorityColor(message.priority),
                    }}
                  ></div>

                  {/* Status indicator - top left */}
                  <div
                    className="absolute top-4 left-4 h-2 w-2 animate-pulse rounded-full"
                    style={{ backgroundColor: getStatusColor(message.status) }}
                  ></div>

                  <CardContent className="p-6 pt-8">
                    <div className="mb-5 flex items-start justify-between">
                      <div className="flex-1 pr-4">
                        {/* Header with name and badges */}
                        <div className="mb-4">
                          <div className="mb-3 flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 transition-colors group-hover:bg-blue-200">
                                <User className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="text-lg font-bold text-gray-900">
                                {message.name}
                              </span>
                            </div>
                          </div>

                          {/* Status and Priority badges */}
                          <div className="flex gap-2">
                            <div
                              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white shadow-sm"
                              style={{
                                backgroundColor: getStatusColor(message.status),
                              }}
                            >
                              <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-white/30"></div>
                              {(message.status ?? "unknown")
                                .charAt(0)
                                .toUpperCase() +
                                (message.status ?? "unknown").slice(1)}
                            </div>
                            <div
                              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white shadow-sm"
                              style={{
                                backgroundColor: getPriorityColor(
                                  message.priority,
                                ),
                              }}
                            >
                              {message.priority.charAt(0).toUpperCase() +
                                message.priority.slice(1)}{" "}
                              Priority
                            </div>
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div className="mb-4 space-y-2">
                          <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 transition-colors group-hover:bg-gray-100">
                            <div className="flex h-6 w-6 items-center justify-center rounded bg-green-100">
                              <Mail className="h-3 w-3 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {message.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 transition-colors group-hover:bg-gray-100">
                            <div className="flex h-6 w-6 items-center justify-center rounded bg-purple-100">
                              <Phone className="h-3 w-3 text-purple-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {message.phone}
                            </span>
                          </div>
                        </div>

                        {/* Message preview */}
                        <div className="relative">
                          <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4">
                            <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm">
                              <MessageSquare className="h-2.5 w-2.5 text-gray-400" />
                            </div>
                            <p className="line-clamp-3 pr-6 text-sm leading-relaxed text-gray-700">
                              {message.message}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Dropdown menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                            className="h-8 w-8 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-100"
                          >
                            <MoreVertical className="h-4 w-4 text-gray-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-xl border-gray-200 bg-white shadow-lg"
                        >
                          <DropdownMenuItem
                            onClick={() => setSelectedMessage(message)}
                            className="rounded-lg hover:bg-gray-50"
                          >
                            <Eye className="mr-2 h-4 w-4 text-blue-500" />
                            <span className="font-medium">View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={async () =>
                              await updateInquiriesStatus(message.id, "read")
                            }
                            className="rounded-lg hover:bg-gray-50"
                          >
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            <span className="font-medium">Mark as Read</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={async () =>
                              await updateInquiriesStatus(message.id, "replied")
                            }
                            className="rounded-lg hover:bg-gray-50"
                          >
                            <MessageSquareReply className="mr-2 h-4 w-4 text-blue-500" />
                            <span className="font-medium">Mark as Replied</span>
                          </DropdownMenuItem>
                          <Separator className="my-1" />
                          <DropdownMenuItem
                            onClick={() => setShowDeleteModal(true)}
                            className="rounded-lg text-red-600 hover:bg-red-50 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span className="font-medium">Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Footer with timestamp */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <div className="flex h-5 w-5 items-center justify-center rounded bg-orange-100">
                          <Clock className="h-3 w-3 text-orange-600" />
                        </div>
                        <span className="font-medium uppercase">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>

                      {/* Quick action buttons */}
                      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateInquiriesStatus(message.id, "read");
                          }}
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
                          title="Mark as read"
                        >
                          <Eye className="h-3 w-3 text-gray-600" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateInquiriesStatus(message.id, "replied");
                          }}
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 transition-colors hover:bg-green-200"
                          title="Mark as replied"
                        >
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        </button>
                      </div>
                    </div>
                  </CardContent>

                  {/* Selection overlay */}
                  {selectedMessage?.id === message.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                  )}
                </Card>
              ))}
            </div>

            {/* Message Detail Panel */}
            <div className="lg:col-span-1">
              {selectedMessage ? (
                <Card className="sticky top-6 flex min-h-[95vh] flex-col overflow-hidden rounded-2xl border-2 border-gray-300">
                  {/* Header with gradient background */}
                  <div className="border-b border-gray-100 p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <CardTitle className="mb-1 text-xl font-semibold text-gray-900">
                          Message Details
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          View and manage this message
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedMessage(null)}
                        className="rounded-full p-2 transition-colors hover:bg-gray-100"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>

                    {/* Enhanced Status Badges */}
                    <div className="flex gap-2">
                      <div
                        className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium text-white shadow-sm"
                        style={{
                          backgroundColor: getStatusColor(
                            selectedMessage.status,
                          ),
                        }}
                      >
                        <div className="mr-2 h-1.5 w-1.5 rounded-full bg-white/30"></div>
                        {(selectedMessage.status ?? "unknown")
                          .charAt(0)
                          .toUpperCase() +
                          (selectedMessage.status ?? "unknown").slice(1)}
                      </div>

                      <div
                        className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium text-white shadow-sm"
                        style={{
                          backgroundColor: getPriorityColor(
                            selectedMessage.priority,
                          ),
                        }}
                      >
                        {selectedMessage.priority.charAt(0).toUpperCase() +
                          selectedMessage.priority.slice(1)}{" "}
                        Priority
                      </div>
                    </div>
                  </div>

                  <CardContent className="flex flex-1 flex-col space-y-8">
                    {/* Contact Information with enhanced styling - Collapsible */}
                    <div>
                      <button
                        onClick={() =>
                          setContactInfoExpanded(!contactInfoExpanded)
                        }
                        className="mb-4 flex w-full items-center justify-between rounded-lg p-2 text-left transition-colors duration-200 hover:bg-gray-50"
                      >
                        <h4 className="flex items-center text-lg font-semibold text-gray-900">
                          <div className="mr-3 h-2 w-2 rounded-full bg-blue-500"></div>
                          Contact Information
                        </h4>
                        <div
                          className={`transition-transform duration-300 ${contactInfoExpanded ? "rotate-180" : "rotate-0"}`}
                        >
                          <svg
                            className="h-5 w-5 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          contactInfoExpanded
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="space-y-3 pb-2">
                          <div className="group flex items-center rounded-xl p-3 transition-colors duration-200 hover:bg-gray-50">
                            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 transition-colors group-hover:bg-blue-200">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                                Name
                              </p>
                              <p className="text-sm font-semibold text-gray-900">
                                {selectedMessage.name}
                              </p>
                            </div>
                          </div>

                          <div className="group flex items-center rounded-xl p-3 transition-colors duration-200 hover:bg-gray-50">
                            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 transition-colors group-hover:bg-green-200">
                              <Mail className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                                Email
                              </p>
                              <p className="text-sm font-medium text-gray-700">
                                {selectedMessage.email}
                              </p>
                            </div>
                          </div>

                          <div className="group flex items-center rounded-xl p-3 transition-colors duration-200 hover:bg-gray-50">
                            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 transition-colors group-hover:bg-purple-200">
                              <Phone className="h-4 w-4 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                                Phone
                              </p>
                              <p className="text-sm font-medium text-gray-700">
                                {selectedMessage.phone}
                              </p>
                            </div>
                          </div>

                          <div className="group flex items-center rounded-xl p-3 transition-colors duration-200 hover:bg-gray-50">
                            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 transition-colors group-hover:bg-orange-200">
                              <Clock className="h-4 w-4 text-orange-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                                Received
                              </p>
                              <p className="text-sm font-medium text-gray-700">
                                {formatDate(selectedMessage.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Message Content with better styling */}
                    <div className="flex-1">
                      <button
                        onClick={() =>
                          setMessageContentExpanded(!messageContentExpanded)
                        }
                        className="mb-4 flex w-full items-center justify-between rounded-lg p-2 text-left transition-colors duration-200 hover:bg-gray-50"
                      >
                        <h4 className="flex items-center text-lg font-semibold text-gray-900">
                          <div className="mr-3 h-2 w-2 rounded-full bg-green-500"></div>
                          Message Content
                        </h4>
                        <div
                          className={`transition-transform duration-300 ${messageContentExpanded ? "rotate-180" : "rotate-0"}`}
                        >
                          <svg
                            className="h-5 w-5 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          messageContentExpanded
                            ? "max-h-[500px] opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="relative pb-2">
                          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                            <div className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm">
                              <MessageSquare className="h-3 w-3 text-gray-500" />
                            </div>
                            <p className="pr-8 leading-relaxed break-words whitespace-pre-wrap text-gray-700">
                              {selectedMessage.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div>
                      <h4 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
                        <div className="mr-3 h-2 w-2 rounded-full bg-purple-500"></div>
                        Quick Actions
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        <Button
                          onClick={async () =>
                            await updateInquiriesStatus(
                              selectedMessage.id,
                              "read",
                            )
                          }
                          className="group relative overflow-hidden rounded-xl px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                          style={{ backgroundColor: getStatusColor("read") }}
                        >
                          <div className="absolute inset-0 translate-x-[-100%] -skew-x-12 transform bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-[200%]"></div>
                          <span className="relative flex items-center justify-center gap-2">
                            <Eye className="h-4 w-4" />
                            Mark as Read
                          </span>
                        </Button>

                        <Button
                          onClick={async () =>
                            await updateInquiriesStatus(
                              selectedMessage.id,
                              "replied",
                            )
                          }
                          className="group relative overflow-hidden rounded-xl px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                          style={{ backgroundColor: getStatusColor("replied") }}
                        >
                          <div className="absolute inset-0 translate-x-[-100%] -skew-x-12 transform bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-[200%]"></div>
                          <span className="relative flex items-center justify-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Mark as Replied
                          </span>
                        </Button>

                        <Button
                          onClick={() => setShowDeleteModal(true)}
                          className="group relative overflow-hidden rounded-xl bg-red-500 px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:bg-red-600 hover:shadow-lg"
                        >
                          <div className="absolute inset-0 translate-x-[-100%] -skew-x-12 transform bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-[200%]"></div>
                          <span className="relative flex items-center justify-center gap-2">
                            <Trash2 className="h-4 w-4" />
                            Delete Message
                          </span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-light sticky top-6 overflow-hidden rounded-2xl border-2 border-gray-300">
                  <CardContent className="p-12 text-center">
                    <div className="bg-primary/20 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl">
                      <MessageSquare className="text-primary h-10 w-10" />
                    </div>
                    <CardTitle className="mb-3 text-xl font-semibold text-gray-900">
                      Select a Message
                    </CardTitle>
                    <CardDescription className="mx-auto max-w-sm leading-relaxed text-gray-600">
                      Choose a message from the list to view detailed
                      information and manage your communications
                    </CardDescription>
                    <div className="mt-6 flex justify-center">
                      <div className="flex space-x-1">
                        <div className="bg-primary h-2 w-2 animate-bounce rounded-full"></div>
                        <div
                          className="bg-primary h-2 w-2 animate-bounce rounded-full"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="bg-primary h-2 w-2 animate-bounce rounded-full"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <DeleteModal
        deleteTitle={"Delete Inquiry"}
        deleteDescription="This action cannot be undone. This inquiry and all related data will be permanently removed."
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          deleteMessage(selectedMessage?.id);
          setShowDeleteModal(false);
        }}
      />
    </div>
  );
}

export default Inquries;
