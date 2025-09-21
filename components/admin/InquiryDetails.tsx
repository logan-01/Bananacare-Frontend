import React from "react";
import { InquiryMessageType, StatusLabel } from "@/lib/helper";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Eye,
  CheckCircle,
  Trash2,
  AlertTriangle,
  Minus,
  ArrowDown,
} from "lucide-react";
import { getStatusColor, getPriorityColor } from "@/lib/helper";

interface InquiryDetailsProps {
  selectedMessage: InquiryMessageType | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: StatusLabel) => void;
  onDelete: () => void;
}

// Helper function for better date formatting (matching InquiryList)
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

function InquiryDetails({
  selectedMessage,
  onClose,
  onUpdateStatus,
  onDelete,
}: InquiryDetailsProps) {
  if (!selectedMessage) {
    return (
      <Card className="sticky top-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
        <CardContent className="p-12 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-green-100">
            <MessageSquare className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="mb-3 text-lg font-semibold text-gray-900">
            Select a Message
          </CardTitle>
          <CardDescription className="mx-auto max-w-sm text-gray-500">
            Choose a message from the list to view detailed information and
            manage your communications
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-6 flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <CardTitle className="mb-1 text-lg font-semibold text-gray-900">
              Message Details
            </CardTitle>
            <CardDescription className="text-gray-500">
              View and manage this message
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X className="h-4 w-4 text-gray-500" />
          </Button>
        </div>

        {/* Status and Priority Badges */}
        <div className="flex gap-2">
          <PriorityBadge priority={selectedMessage.priority} />
          <StatusBadge status={selectedMessage.status} />
        </div>
      </div>

      <CardContent className="flex-1 space-y-6 p-6">
        {/* Sender Information */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            {selectedMessage.name}
          </h3>

          <div className="space-y-3">
            <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
              <div className="bg-primary/10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
                <Mail size={16} className="text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                  Email Address
                </p>
                <p className="text-sm break-all text-gray-900">
                  {selectedMessage.email}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
              <div className="bg-primary/10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
                <Phone size={16} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                  Phone Number
                </p>
                <p className="text-sm text-gray-900">{selectedMessage.phone}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
              <div className="bg-primary/10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
                <Calendar size={16} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                  Date Received
                </p>
                <p className="text-sm text-gray-900">
                  {formatMessageDate(selectedMessage.createdAt || "")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Content (matching InquiryList design) */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-gray-700">
            Message Content
          </h4>
          <div className="border-primary bg-primary/5 relative rounded-r-lg border-l-4 p-4">
            <div className="flex items-start space-x-3">
              <div className="mt-1 flex-shrink-0">
                <div className="bg-primary flex h-6 w-6 items-center justify-center rounded-full">
                  <span className="text-xs font-semibold text-white">
                    {selectedMessage.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-primary mb-1 text-xs font-medium">
                  Message from {selectedMessage.name}
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-800">
                  {selectedMessage.message}
                </p>
              </div>
            </div>
            {/* Message bubble tail */}
            <div className="border-r-primary absolute top-4 left-0 h-0 w-0 -translate-x-1 border-t-4 border-r-4 border-b-4 border-t-transparent border-b-transparent"></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 border-t border-gray-100 pt-4">
          <h4 className="mb-3 text-sm font-medium text-gray-700">
            Quick Actions
          </h4>

          <div className="space-y-2">
            <Button
              onClick={() => onUpdateStatus(selectedMessage.id ?? "", "read")}
              className="w-full text-white"
              style={{
                backgroundColor: getStatusColor("read"),
                opacity:
                  selectedMessage.status === "read" ||
                  selectedMessage.status === "replied"
                    ? 0.7
                    : 1,
              }}
              disabled={
                selectedMessage.status === "read" ||
                selectedMessage.status === "replied"
              }
            >
              <Eye className="mr-2 h-4 w-4" />
              {selectedMessage.status === "read" ||
              selectedMessage.status === "replied"
                ? "Already Read"
                : "Mark as Read"}
            </Button>

            <Button
              onClick={() =>
                onUpdateStatus(selectedMessage.id ?? "", "replied")
              }
              className="w-full text-white"
              style={{
                backgroundColor: getStatusColor("replied"),
                opacity: selectedMessage.status === "replied" ? 0.7 : 1,
              }}
              disabled={selectedMessage.status === "replied"}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {selectedMessage.status === "replied"
                ? "Already Replied"
                : "Mark as Replied"}
            </Button>

            <Button
              onClick={onDelete}
              variant="outline"
              className="w-full border-red-500 bg-red-500 text-white hover:bg-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Message
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default InquiryDetails;
