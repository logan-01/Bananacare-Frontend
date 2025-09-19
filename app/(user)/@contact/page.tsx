"use client";

import React, { useState } from "react";

import { MdEmail, MdPhone, MdLocationOn, MdWarning } from "react-icons/md";
import {
  FaLinkedinIn,
  FaGithub,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa6";
import { isNative } from "@/lib/constant";

function Contact() {
  const contactInfo = [
    {
      title: "bananacare@gmail.com",
      icon: MdEmail,
    },
    {
      title: "+63 990 231 3429",
      icon: MdPhone,
    },
    {
      title: "Conrazon, Bansud Oriental Mindoro PH",
      icon: MdLocationOn,
    },
  ];
  const platforms = [
    {
      title: "Linkedin",
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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    message: "",
  });
  const [inputting, setInputting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error) {
      setError("");
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  //   if (!emailRegex.test(formData.email)) {
  //     setError("Please Enter A Valid Email");
  //     console.log("Incorrect Email");
  //     return;
  //   }

  //   try {
  //     setError("");
  //     setInputting(true);
  //     const sendEmail = await window.Email.send({
  //       Host: "smtp.elasticemail.com",
  //       Username: "salvabernardojr23@gmail.com",
  //       Password: "CA79F11AD2A118396C3F55B756267BB57AD8",
  //       To: "salvabernardojr23@gmail.com",
  //       From: "salvabernardojr23@gmail.com",
  //       Subject: `New Message from ${formData.name} via Your Portfolio"`,
  //       Body: `
  //       <html>
  //       <body style="font-family: Verdana, sans-serif;">
  //         <p style="font-weight: 600">Hello Bernardo,</p>
  //         <p>I hope this message finds you well.</p>
  //         <p>I’m reaching out to you through the contact form on your portfolio website to discuss potential opportunities for collaboration or to explore ways we might work together.</p>
  //         <p><strong>${`"${formData.message}"`}</strong></p>
  //         <p>Here are my details for reference:</p>
  //         <ul>
  //           <li><strong>Name:</strong> ${formData.name}</li>
  //           <li><strong>Email:</strong> ${formData.email}</li>
  //           <li><strong>Phone Number:</strong> ${formData.phoneNumber}</li>
  //         </ul>

  //         <p>I would appreciate your response at your earliest convenience. Please let me know if you need any additional information or have any questions.</p>
  //         <p>Thank you for your time and consideration.</p>
  //         <p>Best regards,<br>${formData.name}</p>
  //       </body>
  //     </html>`,
  //     });

  //     if (sendEmail === "OK") {
  //       const swalResult = await Swal.fire({
  //         title: "Message sent",
  //         text: "Your message has been sent successfully.",
  //         icon: "success",
  //         confirmButtonText: "OK",
  //         confirmButtonColor: "#CC001F",
  //         position: "center",
  //         background: darkMode ? "#1A2026" : "#F6F8F9",
  //         color: darkMode ? "#ffff" : "#111519",
  //         customClass: {
  //           container: "custom-swal-container",
  //           popup: `custom-modal-box swal-custom-padding`,
  //         },
  //       });

  //       if (swalResult.isConfirmed) {
  //         setFormData({ name: "", email: "", phoneNumber: "", message: "" });
  //       }
  //     } else console.log("Email send failed" + sendEmail);
  //   } catch (error) {
  //     console.error("Error sending email: " + error);
  //   }

  //   setInputting(false);
  // };

  return (
    <section
      className={`flex-1 scroll-m-16 px-4 md:px-10 lg:px-28 ${isNative ? "mt-6 pb-24" : "mb-16"}`}
      id="contact"
    >
      <div className={`mb-2 pb-5 text-center`}>
        <p className="font-clash-grotesk text-primary text-2xl font-semibold md:text-4xl">
          <span className="text-secondary">Contact</span> Bananacare
        </p>
        <p className="text-sm font-light md:text-base">
          Have questions, concern and inquiries? BananaCare love to hear from
          you—let's connect!
        </p>
      </div>

      <div className={`bg-primary/20 rounded-md`}>
        <div className="bg-primary/80 flex flex-col gap-10 rounded-md border border-gray-400 p-6 md:flex-row dark:border-none dark:shadow-none">
          <div className="flex basis-4/12 flex-col gap-4">
            <p className="text-light text-2xl font-semibold">
              Let's talk on something{" "}
              <span className="text-accent">great </span>
              together
            </p>
            <div className="text-light flex grow flex-col justify-center gap-6">
              {contactInfo.map((contact, index) => (
                <div className="flex items-center gap-4" key={index}>
                  <contact.icon className="text-accent text-2xl" />
                  <p className="">{contact.title}</p>
                </div>
              ))}
            </div>
            {/* <div className="flex items-center gap-3">
              {platforms.map((platform, index) => (
                <a
                  className="bg-dark rounded-full p-2 hover:cursor-pointer hover:opacity-70"
                  href={platform.link}
                  target="_blank"
                  // name={platform.title}
                  key={index}
                >
                  <platform.icon className="text-secondary bg-clip-content text-2xl" />
                </a>
              ))}
            </div> */}
          </div>

          <form
            action=""
            className="bg-accent dark:bg-dark-accent flex basis-8/12 flex-col gap-2 rounded-md px-0 py-5"
            // onSubmit={handleSubmit}
          >
            <div className="text-light">
              <p className="text-2xl font-semibold">Get In Touch</p>
              <p className="">Got a question? Reach out and let's connect!</p>
            </div>

            {error && (
              <div className={`flex items-center gap-2 rounded-md p-2`}>
                <MdWarning className="text-2xl" />
                <p>{error}</p>
              </div>
            )}

            <input
              className="bg-light rounded-md px-4 py-2 outline-none"
              onChange={handleChange}
              type="text"
              name="name"
              value={formData.name}
              placeholder="Full Name"
              required
            />
            <input
              className="bg-light rounded-md px-4 py-2 outline-none"
              onChange={handleChange}
              type="text"
              name="email"
              value={formData.email}
              placeholder="Email Address"
              required
            />

            <input
              className="bg-light rounded-md px-4 py-2 outline-none"
              onChange={handleChange}
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              placeholder="Phone number"
              required
            />

            <textarea
              className="bg-light h-[125px] rounded-md px-4 py-2 outline-none"
              onChange={handleChange}
              name="message"
              value={formData.message}
              placeholder="Type your message here"
              required
            ></textarea>
            <button
              className="bg-dark text-light rounded-md p-2 text-lg font-semibold hover:cursor-pointer hover:opacity-90"
              type="submit"
              disabled={inputting}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
