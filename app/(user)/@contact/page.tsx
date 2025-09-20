"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import {
  FaLinkedinIn,
  FaGithub,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Send, CheckCircle, XCircle } from "lucide-react";
import {
  sendInquiry,
  InquiryMessageType,
  getPriorityType,
  PriorityResult,
} from "@/lib/helper";

import { isNative } from "@/lib/constant";
import PlatformWrapper from "@/components/wrapper/PlatformWrapper"; // Adjust path as needed

// Zod validation schema
const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, "Please enter a valid phone number"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must be less than 500 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface SubmissionResult {
  success: boolean;
  error?: string;
}

function Contact() {
  const [modalOpen, setModalOpen] = useState(false);
  const [submissionResult, setSubmissionResult] =
    useState<SubmissionResult | null>(null);

  const contactInfo = [
    {
      title: "bananacare@gmail.com",
      icon: MdEmail,
      href: "mailto:bananacare@gmail.com",
    },
    {
      title: "+63 990 231 3429",
      icon: MdPhone,
      href: "tel:+639902313429",
    },
    {
      title: "Conrazon, Bansud Oriental Mindoro PH",
      icon: MdLocationOn,
      href: "https://maps.google.com/?q=Conrazon,+Bansud+Oriental+Mindoro+PH",
    },
  ];

  const platforms = [
    {
      title: "LinkedIn",
      icon: FaLinkedinIn,
      link: "https://www.linkedin.com/in/bernardo-salva-jr",
    },
    {
      title: "GitHub",
      icon: FaGithub,
      link: "https://github.com/bernbit",
    },
    {
      title: "Facebook",
      icon: FaFacebook,
      link: "https://www.facebook.com/salvabernardojr23/",
    },
    {
      title: "Instagram",
      icon: FaInstagram,
      link: "https://www.instagram.com/bernardosj75/",
    },
  ];

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      message: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: ContactFormValues) => {
    try {
      const priorityResult: PriorityResult = await getPriorityType(
        data.message.toString(),
      );

      const inquiryPayload: InquiryMessageType = {
        name: data.name,
        email: data.email,
        phone: data.phoneNumber || undefined,
        message: data.message,
        priority: priorityResult.labels[0] ?? "low",
      };

      const result = await sendInquiry(inquiryPayload);

      if (result.success) {
        form.reset();
        setSubmissionResult({ success: true });
      } else {
        setSubmissionResult({
          success: false,
          error: result.error || "Failed to send message",
        });
      }
    } catch (error) {
      console.error("Error sending inquiry:", error);
      setSubmissionResult({
        success: false,
        error: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setModalOpen(true);
    }
  };

  const handleModalClose = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      // Clear the result immediately when modal starts closing
      setSubmissionResult(null);
    }
  };

  return (
    <>
      <section
        className={`flex-1 scroll-m-16 px-4 md:px-10 lg:px-28 ${
          isNative ? "mt-6 pb-24" : "mb-16"
        }`}
        id="contact"
      >
        {/* Header */}
        <div className="mb-0 text-center md:mb-6">
          <h2 className="font-clash-grotesk text-primary mb-2 text-3xl font-semibold md:text-4xl">
            <span className="text-secondary">Contact</span> Bananacare
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-sm md:text-base">
            Have questions, concerns, or inquiries? BananaCare would love to
            hear from you—let's connect!
          </p>
        </div>

        <div className="md:bg-primary grid gap-8 overflow-hidden rounded-lg px-0 py-10 md:px-6 lg:grid-cols-5">
          {/* Contact Information */}
          <Card className="bg-primary flex flex-col border-0 shadow-none lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-light text-2xl font-semibold">
                Let's talk about something{" "}
                <span className="text-accent">great</span> together
              </CardTitle>
              <CardDescription className="text-light/80">
                Get in touch and let's make something amazing happen.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col space-y-6">
              {/* Contact Details */}
              <div className="flex flex-1 flex-col justify-center space-y-4">
                {contactInfo.map((contact, index) => (
                  <a
                    key={index}
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-light hover:text-accent group flex items-center gap-4 transition-colors"
                  >
                    <div className="bg-accent/20 group-hover:bg-accent/30 rounded-full p-2 transition-colors">
                      <contact.icon className="text-accent text-xl" />
                    </div>
                    <span className="text-sm md:text-base">
                      {contact.title}
                    </span>
                  </a>
                ))}
              </div>

              {/* Social Media Links */}
              <div className="border-light/20 border-t pt-4">
                <p className="text-light/80 mb-4 text-sm">
                  Follow us on social media
                </p>
                <div className="flex items-center gap-3">
                  {platforms.map((platform, index) => (
                    <a
                      key={index}
                      className="bg-dark/50 hover:bg-accent/20 rounded-full p-3 transition-all duration-200 hover:scale-110"
                      href={platform.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={platform.title}
                    >
                      <platform.icon className="text-light text-lg" />
                    </a>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className="bg-light border border-gray-300 shadow-md lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Get In Touch</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as
                possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-2"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Name Field */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              {...field}
                              disabled={isSubmitting}
                              className="ring-primary/80 border border-gray-300 focus-visible:ring-1"
                            />
                          </FormControl>
                          <div className="min-h-[20px]">
                            <FormMessage className="text-danger" />
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* Email Field */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john@example.com"
                              {...field}
                              disabled={isSubmitting}
                              className="ring-primary/80 border border-gray-300 focus-visible:ring-1"
                            />
                          </FormControl>
                          <div className="min-h-[20px]">
                            <FormMessage className="text-danger" />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Phone Number Field */}
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+63 990 231 3429"
                            {...field}
                            disabled={isSubmitting}
                            className="ring-primary/80 border border-gray-300 focus-visible:ring-1"
                          />
                        </FormControl>
                        <div className="min-h-[20px]">
                          <FormMessage className="text-danger" />
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Message Field */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your project, questions, or how we can help you..."
                            rows={5}
                            {...field}
                            disabled={isSubmitting}
                            className="ring-primary/80 border border-gray-300 focus-visible:ring-1"
                          />
                        </FormControl>
                        <FormDescription>
                          {field.value?.length || 0}/500 characters
                        </FormDescription>
                        <div className="min-h-[20px]">
                          <FormMessage className="text-danger" />
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-light w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <Alert className="my-2 flex items-center justify-center border-none shadow-none">
          <AlertDescription className="text-primary">
            We typically respond to all inquiries within 24 hours during
            business days. For urgent matters, please call us directly.
          </AlertDescription>
        </Alert>
      </section>

      {/* Success/Error Modal */}
      <PlatformWrapper
        open={modalOpen}
        onOpenChange={handleModalClose}
        title={submissionResult?.success ? "Message Sent!" : "Message Failed"}
        size="sm"
        className="bg-light"
        showHeader={true}
      >
        {submissionResult && (
          <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
            {submissionResult.success ? (
              <>
                <CheckCircle className="text-primary h-16 w-16" />
                <h3 className="text-primary text-xl font-semibold">
                  Thank you for reaching out!
                </h3>
                <p className="max-w-sm text-gray-600">
                  Your message has been successfully sent. We'll get back to you
                  within 24 hours during business days.
                </p>
                <Button
                  onClick={() => handleModalClose(false)}
                  className="bg-dark hover:bg-dark/90 text-light mt-4 w-[90%] py-4"
                >
                  Close
                </Button>
              </>
            ) : (
              <>
                <XCircle className="text-danger h-16 w-16" />
                <h3 className="text-danger text-xl font-semibold">
                  Something went wrong
                </h3>
                <p className="max-w-sm text-gray-600">
                  {submissionResult.error ||
                    "Failed to send your message. Please try again or contact us directly."}
                </p>
                <div className="test mt-4 grid w-full grid-cols-2 place-items-center gap-2">
                  <Button
                    onClick={() => handleModalClose(false)}
                    className="bg-dark hover:bg-dark/90 text-light mt-4 w-[90%] py-4"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => handleModalClose(false)}
                    className="bg-primary hover:bg-primary/90 text-light mt-4 w-[90%] py-4"
                  >
                    Try Again
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </PlatformWrapper>
    </>
  );
}

export default Contact;
