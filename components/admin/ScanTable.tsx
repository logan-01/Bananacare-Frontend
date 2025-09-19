"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  MapPin,
  Eye,
  CheckCircle,
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal,
  Download,
  Database,
  Columns2,
  Eraser,
  Check,
} from "lucide-react";
import { FaFileCsv, FaRegFileExcel, FaRegFilePdf } from "react-icons/fa";
import { BsFiletypeCsv, BsFiletypeJson } from "react-icons/bs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import ResultModal from "../modals/ResultModal";
import { bananaDiseases, ScanResultType } from "@/lib/constant";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import * as XLSX from "xlsx";

// Main component
interface ScanTableProps {
  data: ScanResultType[];
}

function ScanTable({ data }: ScanTableProps) {
  const diseaseTypes = bananaDiseases
    .filter((disease) => disease.id !== "not-banana")
    .map((disease) => disease.id);

  const diseaseColors = bananaDiseases.reduce<Record<string, string>>(
    (acc, d) => {
      if (d.id !== "not-banana") {
        acc[d.id] = d.color;
      }
      return acc;
    },
    {},
  );

  const [showModal, setShowModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState<ScanResultType | null>(
    null,
  );

  // Table state
  const [searchTerm, setSearchTerm] = useState("");
  const [resultFilter, setResultFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Helper Functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString); // parse ISO string
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString); // parse ISO string
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true, // ensures AM/PM format
    });
  };

  const truncateLocation = (location: string, maxLength = 10) => {
    return location.length > maxLength
      ? `${location.substring(0, maxLength)}...`
      : location;
  };

  // Filter and search logic
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.address.display_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item.result.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Result filter
    if (resultFilter !== "all") {
      filtered = filtered.filter(
        (item) => item.result.toLowerCase() === resultFilter.toLowerCase(),
      );
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case "today":
          filterDate.setDate(now.getDate());
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }

      if (dateFilter !== "all") {
        filtered = filtered.filter(
          (item) => new Date(item.createdAt) >= filterDate,
        );
      }
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "date":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case "confidence":
          aValue = a.percentage;
          bValue = b.percentage;
          break;
        case "result":
          aValue = a.result;
          bValue = b.result;
          break;
        case "location":
          aValue = a.address.display_name;
          bValue = b.address.display_name;
          break;
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [data, searchTerm, resultFilter, dateFilter, sortBy, sortOrder]);

  // Pagination logic
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setResultFilter("all");
    setDateFilter("all");
    setCurrentPage(1);
  };

  // Export functions
  const downloadCSV = (data: ScanResultType[], filename = "scan-results") => {
    const headers = ["Date", "Time", "Location", "Confidence (%)", "Result"];
    const csvContent = [
      headers.join(","),
      ...data.map((item) =>
        [
          formatDate(item.createdAt),
          formatTime(item.createdAt),
          `"${item.address.display_name}"`,
          item.percentage,
          item.result,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJSON = (data: ScanResultType[], filename = "scan-results") => {
    const exportData = data.map((item) => ({
      id: item.id,
      date: formatDate(item.createdAt),
      time: formatTime(item.createdAt),
      location: item.address.display_name,
      confidence: item.percentage,
      result: item.result,
      imageUrl: item.imgUrl,
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.json`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadExcel = (data: ScanResultType[], filename = "scan-results") => {
    // 1. Map data to a proper sheet format
    const sheetData = data.map((item) => ({
      Date: formatDate(item.createdAt),
      Time: formatTime(item.createdAt),
      Location: item.address.display_name,
      "Confidence (%)": item.percentage,
      Result: item.result,
    }));

    // 2. Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(sheetData);

    // 3. Create workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Scan Results");

    // 4. Export as XLSX
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  const downloadPDF = (data: ScanResultType[], filename = "scan-results") => {
    // Create a simple HTML table for PDF conversion
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Scan Results Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; border-bottom: 2px solid #22c55e; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f8f9fa; font-weight: bold; }
          .healthy { background-color: #dcfce7; color: #166534; }
          .warning { background-color: #fef3c7; color: #92400e; }
          .diseased { background-color: #fecaca; color: #991b1b; }
          .summary { margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; }
        </style>
      </head>
      <body>
        <h1>Scan Results Report</h1>
        <div class="summary">
          <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Total Records:</strong> ${data.length}</p>
          <p><strong>Healthy:</strong> ${data.filter((item) => item.result === "Healthy").length}</p>
          <p><strong>Warning:</strong> ${data.filter((item) => item.result === "Warning").length}</p>
          <p><strong>Diseased:</strong> ${data.filter((item) => item.result === "Diseased").length}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Location</th>
              <th>Confidence (%)</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (item) => `
              <tr>
                <td>${formatDate(item.createdAt)}</td>
                <td>${formatTime(item.createdAt)}</td>
                <td>${item.address.display_name}</td>
                <td>${item.percentage}%</td>
                <td class="${item.result.toLowerCase()}">${item.result}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.html`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = (format: string) => {
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `scan-results-${timestamp}`;

    switch (format) {
      case "csv":
        downloadCSV(filteredData, filename);
        break;
      case "excel":
        downloadExcel(filteredData, filename);
        break;
      case "json":
        downloadJSON(filteredData, filename);
        break;
      case "pdf":
        downloadPDF(filteredData, filename);
        break;
      default:
        console.error("Unsupported export format");
    }
  };

  return (
    <>
      <Card className="min-h-[80vh] border-2 border-gray-300">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/30 rounded-lg p-2">
              <Database className="text-primary h-6 w-6" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                Overall Scan
                <CheckCircle className="text-primary h-5 w-5" />
              </CardTitle>
              <CardDescription>
                Latest scan records and analysis results
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Search and Filter Bar */}
          <div className="mb-2 space-y-4">
            {/* Filters and Search */}
            <div className="flex flex-col gap-4 sm:flex-row">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="text-primary/60 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                <Input
                  placeholder="Search by location or result..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-primary/60 ring-primary/80 border-2 pl-10 focus-visible:ring-1"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-2 flex-wrap gap-2 md:grid-cols-5">
                <Select value={resultFilter} onValueChange={setResultFilter}>
                  <SelectTrigger
                    className="w-full border border-gray-300 px-2 hover:cursor-pointer hover:opacity-70"
                    style={{
                      color:
                        resultFilter === "all"
                          ? "#22b123"
                          : diseaseColors[resultFilter],
                    }}
                  >
                    <Columns2 className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="All Results" />
                  </SelectTrigger>
                  <SelectContent className="bg-light border border-gray-300">
                    <SelectItem value="all" className="text-primary">
                      All Results
                    </SelectItem>
                    {diseaseTypes.map((type, index) => (
                      <SelectItem
                        key={index}
                        value={type}
                        style={{ color: diseaseColors[type] }}
                      >
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="text-primary flex h-4 w-full items-center border border-gray-300 hover:cursor-pointer hover:opacity-70">
                    <Calendar className="text-lg" />
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

                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    className="text-primary border border-gray-300 hover:cursor-pointer hover:opacity-70"
                  >
                    <Button variant="outline">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="bg-light w-48 border border-gray-300"
                  >
                    {/* Optional: sort order toggle
                    <DropdownMenuItem
                      onClick={() =>
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      }
                    >
                      {sortOrder === "asc" ? "Descending" : "Ascending"}
                    </DropdownMenuItem> */}

                    {["date", "confidence", "result", "location"].map((key) => (
                      <DropdownMenuItem
                        key={key}
                        onClick={() => setSortBy(key)}
                        className={`flex items-center justify-between ${
                          sortBy === key ? "text-primary" : ""
                        }`}
                      >
                        <span>
                          {key === "date" && "Sort by Date"}
                          {key === "confidence" && "Sort by Confidence"}
                          {key === "result" && "Sort by Result"}
                          {key === "location" && "Sort by Location"}
                        </span>
                        {sortBy === key && (
                          <Check className="text-primary h-4 w-4" />
                        )}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    className="text-primary border border-gray-300 px-2 hover:cursor-pointer hover:opacity-70"
                  >
                    <Button variant="outline">
                      <Eye className="mr-2 h-4 w-4" />
                      Show - {itemsPerPage}
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
                          <Check className="text-primary h-4 w-4" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="outline"
                  className="text-danger col-span-2 border border-gray-300 hover:cursor-pointer hover:opacity-70 md:col-auto"
                  onClick={clearFilters}
                >
                  <Eraser className="mr-2 h-4 w-4" />
                  Clear Filter
                </Button>
              </div>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <p className="text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
                {totalItems} results
              </p>
              {/* Download Button */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  className="text-light bg-primary border border-gray-300 px-2 hover:cursor-pointer hover:opacity-70"
                >
                  <Button variant="outline" className="">
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="bg-light w-[90px] border border-gray-300">
                  <DropdownMenuItem
                    className="text-primary flex items-center hover:cursor-pointer hover:opacity-70"
                    onClick={() => handleExport("pdf")}
                  >
                    <FaRegFilePdf />
                    <p className="font-medium">PDF</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-primary flex items-center hover:cursor-pointer hover:opacity-70"
                    onClick={() => handleExport("csv")}
                  >
                    <BsFiletypeCsv />
                    <p className="font-medium">CSV</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-primary flex items-center hover:cursor-pointer hover:opacity-70"
                    onClick={() => handleExport("excel")}
                  >
                    <FaRegFileExcel />
                    <p className="font-medium">Excel</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-primary flex items-center hover:cursor-pointer hover:opacity-70"
                    onClick={() => handleExport("json")}
                  >
                    <BsFiletypeJson />
                    <p className="font-medium">JSON</p>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Image
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Confidence
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Result
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {currentData.map((item) => (
                    <tr
                      key={item.id}
                      className="transition-colors duration-200 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={item.imgUrl}
                          alt="Field analysis"
                          className="h-12 w-12 rounded-lg border border-gray-200 object-cover"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                          {formatDate(item.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Clock className="mr-2 h-4 w-4 text-gray-400" />
                          {formatTime(item.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex cursor-help items-center text-sm text-gray-900">
                                <MapPin className="mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
                                <span className="truncate">
                                  {truncateLocation(item.address.display_name)}
                                </span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              className="x-3 bg-primary-var py-2 text-sm whitespace-nowrap text-white shadow-lg"
                              arrowClassName="bg-primary-var fill-primary-var"
                            >
                              <p>{item.address.display_name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <span className="min-w-[3rem] text-sm font-medium text-gray-900">
                            {item.percentage}%
                          </span>
                          <div className="w-20">
                            <Progress value={item.percentage} className="h-2" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          style={{
                            backgroundColor: item.resultArr[0].color,
                            color: item.resultArr[0].textColor,
                          }}
                        >
                          {item.result}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-white"
                          onClick={() => {
                            setShowModal(true);
                            setSelectedResult(item);
                          }}
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="flex-1 text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <Pagination className="flex flex-1 justify-end">
                <PaginationContent className="gap-0">
                  {/* First page button */}
                  <PaginationItem className="">
                    <PaginationLink
                      className={`${currentPage === 1 ? "pointer-events-none opacity-70" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage(1);
                      }}
                    >
                      <ChevronsLeft className="text-lg" />
                    </PaginationLink>
                  </PaginationItem>

                  {/* Previous button */}
                  <PaginationItem>
                    <PaginationPrevious
                      className={`${currentPage === 1 ? "pointer-events-none opacity-70" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) goToPage(currentPage - 1);
                      }}
                    />
                  </PaginationItem>

                  {/* Page numbers */}
                  {(() => {
                    const pages: (number | "ellipsis")[] = [];
                    if (totalPages <= 5) {
                      for (let i = 1; i <= totalPages; i++) pages.push(i);
                    } else {
                      pages.push(1);
                      if (currentPage > 3) pages.push("ellipsis");

                      const start = Math.max(2, currentPage - 1);
                      const end = Math.min(totalPages - 1, currentPage + 1);
                      for (let i = start; i <= end; i++) pages.push(i);

                      if (currentPage < totalPages - 2) pages.push("ellipsis");
                      pages.push(totalPages);
                    }
                    return pages.map((page, idx) =>
                      page === "ellipsis" ? (
                        <PaginationItem key={`ellipsis-${idx}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={page} className="px-0.5">
                          <PaginationLink
                            className={`${currentPage === page ? "bg-primary text-light" : "bg-light text-dark"} border border-gray-300`}
                            isActive={currentPage === page}
                            onClick={(e) => {
                              e.preventDefault();
                              goToPage(Number(page));
                            }}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    );
                  })()}

                  {/* Next button */}
                  <PaginationItem className="">
                    <PaginationNext
                      className={`${currentPage === totalPages ? "pointer-events-none opacity-70" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) goToPage(currentPage + 1);
                      }}
                    />
                  </PaginationItem>

                  {/* Last page button */}
                  <PaginationItem className="">
                    <PaginationLink
                      className={`${currentPage === totalPages ? "pointer-events-none opacity-70" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage(totalPages);
                      }}
                    >
                      <ChevronsRight className="text-lg" />
                    </PaginationLink>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {/* No Results */}
          {filteredData.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              <Search className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <h3 className="mb-2 text-lg font-medium">No results found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear all filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <ResultModal
        open={showModal}
        onClose={() => setShowModal(false)}
        rankedResults={selectedResult?.resultArr || []}
        previewImg={selectedResult?.imgUrl || null}
      />
    </>
  );
}

export default ScanTable;
