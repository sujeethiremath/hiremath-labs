"use client";
import { useState } from "react";

// Define a type for the errors object to tell TypeScript what to expect.
type FormErrors = {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
};

export default function ContactSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  // Use the FormErrors type here to avoid the TypeScript error.
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear a specific error when the user starts typing
    if (errors[e.target.name as keyof FormErrors]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleOpenModal = () => {
    setIsOpen(true);
    // Clear any previous status or form data when the modal is opened
    setStatus("");
    setIsRateLimited(false);
    setIsSuccess(false);
    setForm({ name: "", phone: "", email: "", message: "" });
    setErrors({});
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    // Clear any status messages or form data when the modal is closed
    setStatus("");
    setIsRateLimited(false);
    setIsSuccess(false);
    setForm({ name: "", phone: "", email: "", message: "" });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    let isValid = true;
    // Basic validation for required fields
    if (!form.name.trim()) {
      newErrors.name = "Name is required.";
      isValid = false;
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email address is invalid.";
      isValid = false;
    }
    if (!form.message.trim()) {
      newErrors.message = "Message is required.";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      setStatus("Please correct the errors above.");
      return;
    }

    setStatus("Sending...");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.status === 429) {
        setIsRateLimited(true);
        setStatus("");
      } else if (res.ok) {
        setStatus("Message sent!");
        setIsSuccess(true); // Set success state to true
        setForm({ name: "", phone: "", email: "", message: "" });
      } else {
        setStatus("Error sending message.");
      }
    } catch {
      setStatus("Error sending message.");
    }
  };

  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Not all heroes wear capes… <br /> Some write code!
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Think of me as the &apos;Superman&apos; of code, architecting and
            implementing full-stack solutions that keep your product flying
            high.
          </p>

          {/* Location */}
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Aurora, CO</span>
          </div>

          {/* Contact Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleOpenModal}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Get in Touch
            </button>
            <button
              onClick={() => setIsResumeModalOpen(true)}
              className="px-8 py-3 bg-gray-100 border border-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M8 11a1 1 0 100 2h4a1 1 0 100-2H8zm0-4a1 1 0 100 2h4a1 1 0 100-2H8z"
                  clipRule="evenodd"
                />
              </svg>
              View Resume
            </button>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-6">
            <a
              href="https://github.com/sujeethiremath"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/sujeethiremath/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      {/* The entire modal is now conditionally rendered */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300">
          {/* Modal Overlay with blur and click-to-close */}
          <div
            className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm"
            onClick={handleCloseModal}
            aria-hidden="true"
          />

          {/* Modal Content with enter/exit animations */}
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-[95%] mx-4 p-8 transition-transform duration-300 ease-out animate-pop-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Close Button with a proper icon */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h3
              id="modal-title"
              className="text-3xl font-extrabold text-gray-900 mb-6 text-center"
            >
              Contact Me
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none p-2 transition-colors duration-200"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.name}
                  </span>
                )}
              </div>
              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Your Contact Number (Optional)"
                  className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none p-2 transition-colors duration-200"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email Address"
                  className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none p-2 transition-colors duration-200"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.email}
                  </span>
                )}
              </div>
              <div>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={5}
                  className="w-full border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none p-3 transition-colors duration-200 resize-none"
                  value={form.message}
                  onChange={handleChange}
                  required
                />
                {errors.message && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.message}
                  </span>
                )}
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform duration-200 transform hover:scale-105"
              >
                Send Message
              </button>
            </form>
            {status && (
              <p className="mt-4 text-center text-sm text-gray-600">{status}</p>
            )}
          </div>
        </div>
      )}
      {/* New custom dialog for rate-limiting errors */}
      {isRateLimited && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center transition-opacity duration-300">
          <div
            className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm"
            aria-hidden="true"
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-[95%] mx-4 p-8 text-center animate-pop-in">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Already got your message!
            </h3>
            <p className="text-gray-600 mb-6">
              Thanks so much for reaching out! I already got your previous
              message and I&apos;m on it. You&apos;ll be able to send me another
              one after 24 hours.
            </p>
            <button
              onClick={() => setIsRateLimited(false)}
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform duration-200 transform hover:scale-105"
            >
              OK
            </button>
          </div>
        </div>
      )}
      {/* New custom dialog for successful submissions */}
      {isSuccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center transition-opacity duration-300">
          <div
            className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm"
            aria-hidden="true"
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-[95%] mx-4 p-8 text-center animate-pop-in">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Success!</h3>
            <p className="text-gray-600 mb-6">
              Your message has been sent successfully. Sujeet will get back to
              you shortly.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform duration-200 transform hover:scale-105"
            >
              Awesome!
            </button>
          </div>
        </div>
      )}

      {isResumeModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center transition-opacity duration-300">
          <div
            className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm"
            onClick={() => setIsResumeModalOpen(false)}
            aria-hidden="true"
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-[95%] mx-4 p-8 text-center animate-pop-in">
            <button
              onClick={() => setIsResumeModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Resume Options
            </h3>
            <p className="text-gray-600 mb-6">
              Choose an option to interact with the resume.
            </p>
            <div className="flex flex-col gap-4">
              <a
                href="resume/Resume_Sujeet_H.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsResumeModalOpen(false)}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform duration-200 transform hover:scale-105 inline-flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 2a1 1 0 00-1 1v7a1 1 0 001 1h8a1 1 0 001-1V7a1 1 0 00-1-1H6z"
                    clipRule="evenodd"
                  />
                </svg>
                View Resume
              </a>
              <a
                href="resume/Resume_Sujeet_H.pdf"
                download="Sujeet_H_Resume.pdf"
                onClick={() => setIsResumeModalOpen(false)}
                className="w-full px-6 py-3 bg-gray-100 text-gray-900 font-semibold rounded-full shadow-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-transform duration-200 transform hover:scale-105 inline-flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 9.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 8.414V14a1 1 0 11-2 0V8.414L6.707 9.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Download Resume
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
