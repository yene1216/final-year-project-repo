import axios from "axios";
import { useState } from "react";
import api from "../api/Intercepter"
import { t } from "i18next";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/api/password-reset/", { email });
    alert("If this email exists, a reset link has been sent.");
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white dark:bg-slate-900/90 dark:bg-slate-900/90 backdrop-blur rounded-3xl shadow-xl ring-1 ring-slate-200/60 p-8 md:p-10">
          <div className="text-center mb-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white text-xl shadow-md mb-4">
              🔐
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {t("Reset Password")}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-2 leading-relaxed">
              {t("Enter your email address and we'll send you a link to reset your password.")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl px-3 bg-slate-50 dark:bg-slate-900/60 focus-within:bg-white dark:bg-slate-900 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-200 transition">
              <span className="mr-2 text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500">📧</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full p-3 bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-700 to-indigo-700 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:from-violet-800 hover:to-indigo-800 transition duration-300"
            >
              {t("Send Reset Link")}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500">{t("Remember your password?")} </span>
            <a
              href="/log_in"
              className="text-violet-700 dark:text-violet-300 font-semibold hover:text-violet-900 hover:underline"
            >
              {t("Sign In")}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
export default ForgotPassword
