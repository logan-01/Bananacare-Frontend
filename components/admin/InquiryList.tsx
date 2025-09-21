import React from "react";
import { InquiryMessageType, StatusLabel } from "@/lib/helper";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Mail,
  Phone,
  CheckCircle,
  Eye,
  Trash2,
  MessageSquareReply,
  Calendar,
  AlertTriangle,
  Minus,
  ArrowDown,
} from "lucide-react";
import { getStatusColor, getPriorityColor, formatDate } from "@/lib/helper";

interface InquiryListProps {
  inquiries: InquiryMessageType[];
  selectedMessage: InquiryMessageType | null;
  onSelectMessage: (message: InquiryMessageType) => void;
  onUpdateStatus: (id: string, status: StatusLabel) => void;
  onDelete: () => void;
}

// Helper function for better date formatting
const formatMessageDate = (date: string) => {
  const messageDate = new Date(date);
  const now = new Date();
  const diffInMs = now.getTime() - messageDate.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  // Today
  if (diffInDays === 0) {
    if (diffInHours < 1) return "Just now";
    if (diffInHours === 1) return "1 hour ago";
    return `${diffInHours} hours ago`;
  }

  // Yesterday
  if (diffInDays === 1) {
    return `Yesterday at ${messageDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })}`;
  }

  // This week (within 7 days)
  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }

  // Older - show full date
  return messageDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// Priority badge component (using getPriorityColor function)
const PriorityBadge = ({ priority }: { priority?: string }) => {
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "high":
        return {
          icon: AlertTriangle,
          label: "High Priority",
        };
      case "medium":
        return {
          icon: Minus,
          label: "Medium Priority",
        };
      case "low":
        return {
          icon: ArrowDown,
          label: "Low Priority",
        };
      default:
        return {
          icon: Minus,
          label: "Normal Priority",
        };
    }
  };

  const config = getPriorityConfig(priority || "low");
  const IconComponent = config.icon;

  return (
    <span
      className="inline-flex items-center rounded px-2.5 py-1 text-xs font-medium text-white"
      style={{ backgroundColor: getPriorityColor(priority) }}
    >
      <IconComponent size={12} className="mr-1" />
      {config.label}
    </span>
  );
};

// Status badge component (using getStatusColor function)
const StatusBadge = ({ status }: { status?: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "unread":
        return { label: "Unread" };
      case "read":
        return { label: "Read" };
      case "replied":
        return { label: "Replied" };
      default:
        return { label: "Unknown" };
    }
  };

  const config = getStatusConfig(status || "unread");

  return (
    <span
      className="inline-flex items-center rounded px-2.5 py-1 text-xs font-medium text-white"
      style={{ backgroundColor: getStatusColor(status) }}
    >
      {config.label}
    </span>
  );
};

function InquiryList({
  inquiries,
  selectedMessage,
  onSelectMessage,
  onUpdateStatus,
  onDelete,
}: InquiryListProps) {
  return (
    <div className="space-y-4">
      {inquiries.map((message: InquiryMessageType) => (
        <Card
          key={message.id}
          className={`group cursor-pointer border-2 p-0 transition-all duration-200 hover:shadow-md ${
            selectedMessage?.id === message.id
              ? "ring-opacity-30 ring-primary bg-primary/5 border-primary/20 ring-2"
              : "bg-light border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => onSelectMessage(message)}
        >
          <CardContent className="p-6">
            {/* Header Row */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <PriorityBadge priority={message.priority} />
                <StatusBadge status={message.status} />
              </div>

              <div className="">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                      className="h-8 w-8 p-0"
                    >
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-light w-48 border-2 border-gray-300"
                  >
                    <DropdownMenuItem onClick={() => onSelectMessage(message)}>
                      <Eye size={16} className="text-dark mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onUpdateStatus(message.id ?? "", "read")}
                      className="text-neutral"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Mark as Read
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        onUpdateStatus(message.id ?? "", "replied")
                      }
                      className="text-primary"
                    >
                      <MessageSquareReply size={16} className="mr-2" />
                      Mark as Replied
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={onDelete}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Sender Information */}
            <div className="mb-4">
              <h3 className="text-primary mb-3 text-xl font-semibold">
                {message.name}
              </h3>

              <div className="text-primary/80 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Mail size={16} className="text-primary/80 flex-shrink-0" />
                  <span className="break-all">{message.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={16} className="text-primary/80 flex-shrink-0" />
                  <span>{message.phone}</span>
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="mb-4">
              <div className="border-primary bg-primary/5 relative rounded-r-lg border-l-4 p-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-1 flex-shrink-0">
                    <div className="bg-primary flex h-6 w-6 items-center justify-center rounded-full">
                      <span className="text-xs font-semibold text-white">
                        {message.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-primary mb-1 text-xs font-medium">
                      Message from {message.name}
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-800">
                      {message.message}
                    </p>
                  </div>
                </div>
                {/* Message bubble tail */}
                <div className="border-r-primary absolute top-4 left-0 h-0 w-0 -translate-x-1 border-t-4 border-r-4 border-b-4 border-t-transparent border-b-transparent"></div>
              </div>
            </div>

            {/* Date Information */}
            <div className="flex items-center border-t border-gray-100 pt-3 text-sm text-gray-500">
              <Calendar size={14} className="mr-2" />
              <span>{formatMessageDate(message.createdAt || "")}</span>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Empty State */}
      {inquiries.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100">
            <Mail className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No inquiries found
          </h3>
          <p className="text-gray-500">
            No messages match your current filters.
          </p>
        </div>
      )}
    </div>
  );
}

export default InquiryList;
