import React from "react";
import PlatformWrapper from "../wrapper/PlatformWrapper";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "../ui/button";

function MessageStatusModal({ modalOpen, handleModalClose, submissionResult }) {
  return (
    <PlatformWrapper
      open={modalOpen}
      onOpenChange={handleModalClose}
      title={submissionResult?.success ? "Message Sent!" : "Message Failed"}
      size="sm"
      className="bg-light"
      showHeader={true}
    >
      <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
        {submissionResult?.success ? (
          <>
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h3 className="text-xl font-semibold text-green-700">
              Thank you for reaching out!
            </h3>
            <p className="max-w-sm text-gray-600">
              Your message has been successfully sent. We'll get back to you
              within 24 hours during business days.
            </p>
            <Button
              onClick={handleModalClose}
              className="bg-primary hover:bg-primary/90 text-light mt-4"
            >
              Close
            </Button>
          </>
        ) : (
          <>
            <XCircle className="h-16 w-16 text-red-500" />
            <h3 className="text-xl font-semibold text-red-700">
              Something went wrong
            </h3>
            <p className="max-w-sm text-gray-600">
              {submissionResult?.error ||
                "Failed to send your message. Please try again or contact us directly."}
            </p>
            <div className="mt-4 flex gap-2">
              <Button
                onClick={handleModalClose}
                variant="outline"
                className="border-gray-300"
              >
                Try Again
              </Button>
              <Button
                onClick={handleModalClose}
                className="bg-primary hover:bg-primary/90 text-light"
              >
                Close
              </Button>
            </div>
          </>
        )}
      </div>
    </PlatformWrapper>
  );
}

export default MessageStatusModal;
