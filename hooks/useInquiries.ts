import { useState, useEffect } from "react";
import {
  getInquiries,
  updateInquiry,
  deleteInquiry,
  InquiryMessageType,
  StatusLabel,
} from "@/lib/helper";

function useInquiries() {
  const [inquiries, setInquiries] = useState<InquiryMessageType[]>([]);
  const [selectedMessage, setSelectedMessage] =
    useState<InquiryMessageType | null>(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const data = await getInquiries();
        setInquiries(data);
      } catch (err) {
        console.log("Failed to load inquiries.");
      }
    };

    fetchInquiries();
    const interval = setInterval(fetchInquiries, 10000);
    return () => clearInterval(interval);
  }, []);

  const updateInquiryStatus = async (id: string, newStatus: StatusLabel) => {
    try {
      await updateInquiry(id, { status: newStatus });
      setInquiries((prev) =>
        prev.map((msg) =>
          msg.id === id ? { ...msg, status: newStatus } : msg,
        ),
      );
      if (selectedMessage?.id === id) {
        setSelectedMessage((prev) =>
          prev ? { ...prev, status: newStatus } : null,
        );
      }
    } catch (error) {
      console.error("Failed to update inquiry status:", error);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      await deleteInquiry(id);
      setInquiries((prev) => prev.filter((msg) => msg.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Failed to delete inquiry:", error);
    }
  };

  return {
    inquiries,
    selectedMessage,
    setSelectedMessage,
    updateInquiryStatus,
    deleteMessage,
  };
}

export default useInquiries;
