"use client";

import React, { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Filter,
  CheckCircle,
  MessageSquareText,
  MessageCircle,
  MessageSquareDot,
  BellDot,
  MessageSquareReply,
  MessageSquareWarning,
  TriangleAlert,
} from "lucide-react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import DeleteModal from "@/components/modals/DeleteModal";

import StatCard from "@/components/admin/StatCard";
import useInquiries from "@/hooks/useInquiries";
import useInquiryFilters from "@/hooks/useInquiryFilters";
import InquiryFilters from "@/components/admin/InquiryFilters";
import InquiryList from "@/components/admin/InquiryList";
import InquiryDetails from "@/components/admin/InquiryDetails";

function Inquiries() {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const {
    inquiries,
    selectedMessage,
    setSelectedMessage,
    updateInquiryStatus,
    deleteMessage,
  } = useInquiries();

  const {
    filters,
    paginatedInquiries,
    updateFilter,
    clearFilters,
    totalItems,
    startIndex,
    endIndex,
  } = useInquiryFilters(inquiries);

  const handleDeleteConfirm = () => {
    if (selectedMessage?.id) {
      deleteMessage(selectedMessage.id);
    }
    setShowDeleteModal(false);
  };

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

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto px-6">
      {/* Header */}
      <div className="py-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <p className="font-clash-grotesk text-2xl font-semibold">
            Message Inquiries
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

          {/* Filters */}
          <InquiryFilters
            filters={filters}
            updateFilter={updateFilter}
            clearFilters={clearFilters}
            totalItems={totalItems}
            startIndex={startIndex}
            endIndex={endIndex}
          />

          {/* Content Grid */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <InquiryList
                inquiries={paginatedInquiries}
                selectedMessage={selectedMessage}
                onSelectMessage={setSelectedMessage}
                onUpdateStatus={updateInquiryStatus}
                onDelete={() => setShowDeleteModal(true)}
              />
            </div>

            <div className="lg:col-span-1">
              <InquiryDetails
                selectedMessage={selectedMessage}
                onClose={() => setSelectedMessage(null)}
                onUpdateStatus={updateInquiryStatus}
                onDelete={() => setShowDeleteModal(true)}
              />
            </div>
          </div>
        </div>
      </div>

      <DeleteModal
        deleteTitle="Delete Inquiry"
        deleteDescription="This action cannot be undone. This inquiry and all related data will be permanently removed."
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

export default Inquiries;
