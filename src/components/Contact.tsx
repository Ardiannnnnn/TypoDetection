"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

export default function Contact() {
  const t = useTranslations("contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    rating: 5,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const renderTextWithHighlight = (text: string) => {
    return text.split("##HIGHLIGHT_START##").map((part, index) => {
      if (index === 0) return part;
      const [highlighted, ...rest] = part.split("##HIGHLIGHT_END##");
      return (
        <span key={index}>
          <span className="text-indigo-700 dark:text-indigo-400">
            {highlighted}
          </span>
          {rest.join("##HIGHLIGHT_END##")}
        </span>
      );
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        rating: 5,
      });
    }, 800);
  };

  const subjects = [
    t("form.subjects.general"),
    t("form.subjects.bug"),
    t("form.subjects.feature"),
    t("form.subjects.technical"),
    t("form.subjects.usage"),
    t("form.subjects.other"),
  ];

  if (submitted) {
    return (
      <section
        id="contact"
        className="py-16 sm:py-20 bg-white dark:bg-slate-900"
      >
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="max-w-xl mx-auto text-center bg-slate-50 dark:bg-slate-950 p-8 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-indigo-700 dark:text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-3 font-poppins">
              {t("form.success.title")}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6 font-poppins">
              {t("form.success.message")}
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="min-h-[44px] bg-indigo-700 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors font-medium font-poppins"
            >
              {t("form.buttons.sendAnother")}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="contact"
      className="py-16 sm:py-20 bg-white dark:bg-slate-900"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="max-w-3xl mb-12 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-4 font-poppins">
            {renderTextWithHighlight(t("title"))}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-poppins">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Contact Info & Product FAQ */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-50 font-poppins">
              {t("letsTalk")}
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 rounded-lg flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-indigo-700 dark:text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="text-sm">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-1 font-poppins">
                    {t("info.email.title")}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 font-poppins">
                    {t("info.email.support")}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 font-poppins">
                    {t("info.email.feedback")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 rounded-lg flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-indigo-700 dark:text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="text-sm">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-1 font-poppins">
                    {t("info.responseTime.title")}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 font-poppins">
                    {t("info.responseTime.time")}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 font-poppins">
                    {t("info.responseTime.availability")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 rounded-lg flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-indigo-700 dark:text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div className="text-sm">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-1 font-poppins">
                    {t("info.location.title")}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 font-poppins">
                    {t("info.location.country")}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 font-poppins">
                    {t("info.location.timezone")}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-3 font-poppins">
                {t("faq.title")}
              </h4>
              <div className="space-y-3 text-sm">
                <p className="text-slate-600 dark:text-slate-300 font-poppins">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    Q:
                  </span>{" "}
                  {t("faq.questions.dataSecurity.question")}
                </p>
                <p className="text-slate-600 dark:text-slate-300 font-poppins">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    A:
                  </span>{" "}
                  {t("faq.questions.dataSecurity.answer")}
                </p>
                <p className="text-slate-600 dark:text-slate-300 font-poppins pt-1">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    Q:
                  </span>{" "}
                  {t("faq.questions.fileFormats.question")}
                </p>
                <p className="text-slate-600 dark:text-slate-300 font-poppins">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    A:
                  </span>{" "}
                  {t("faq.questions.fileFormats.answer")}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-950 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 font-poppins"
                  >
                    {t("form.name")} *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full min-h-[44px] px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg font-poppins text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    placeholder={t("form.placeholders.name")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 font-poppins"
                  >
                    {t("form.email")} *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full min-h-[44px] px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg font-poppins text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    placeholder={t("form.placeholders.email")}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 font-poppins"
                >
                  {t("form.subject")} *
                </label>
                <select
                  id="contact-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full min-h-[44px] px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg font-poppins text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900"
                >
                  <option value="">{t("form.placeholders.subject")}</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 font-poppins">
                  {t("form.rating")}
                </span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      aria-label={`${star} / 5`}
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className={`w-9 h-9 flex items-center justify-center rounded-md ${
                        star <= formData.rating
                          ? "text-amber-500"
                          : "text-slate-300 dark:text-slate-600"
                      } hover:text-amber-500 transition-colors`}
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 font-poppins"
                >
                  {t("form.message")} *
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg resize-none font-poppins text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  placeholder={t("form.placeholders.message")}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full min-h-[44px] py-3 rounded-lg font-semibold text-base transition-colors font-poppins ${
                  isSubmitting
                    ? "bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                    : "bg-indigo-700 hover:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white"
                }`}
              >
                {isSubmitting
                  ? t("form.buttons.submitting")
                  : t("form.buttons.submit")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
