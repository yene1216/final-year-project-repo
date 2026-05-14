import { useState } from "react"
import Services from "./services/services.jsx"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

function SignUp() {
  const { t, i18n } = useTranslation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [role, setRole] = useState('')
  const navigate = useNavigate()

  function SignUpHandler(e) {
    e.preventDefault()
    const service = new Services()
    service.signup(firstName, lastName, email, password, role, navigate)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white dark:bg-slate-900/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl ring-1 ring-violet-100 dark:ring-violet-900/50 p-7 sm:p-8 relative">
        <div className="text-center mb-7">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent">
            {t("Create Account")}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm mt-1">
            {t("Join us and get started in seconds.")}
          </p>
        </div>

        <form onSubmit={SignUpHandler} className="space-y-4">
          <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-3 bg-white dark:bg-slate-900 focus-within:ring-2 focus-within:ring-violet-400 focus-within:border-violet-400 transition">
            <span className="text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500">👤</span>
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder={t("First name")}
              className="w-full p-3 bg-transparent focus:outline-none text-sm"
              required
            />
          </div>

          <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-3 bg-white dark:bg-slate-900 focus-within:ring-2 focus-within:ring-violet-400 focus-within:border-violet-400 transition">
            <span className="text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500">👤</span>
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder={t("Last name")}
              required
              className="w-full p-3 bg-transparent focus:outline-none text-sm"
            />
          </div>

          <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-3 bg-white dark:bg-slate-900 focus-within:ring-2 focus-within:ring-violet-400 focus-within:border-violet-400 transition">
            <span className="text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500">📧</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t("Email")}
              required
              className="w-full p-3 bg-transparent focus:outline-none text-sm"
            />
          </div>

          <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-3 bg-white dark:bg-slate-900 focus-within:ring-2 focus-within:ring-violet-400 focus-within:border-violet-400 transition">
            <span className="text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500">🔑</span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="********"
              required
              className="w-full p-3 bg-transparent focus:outline-none text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 ml-1">
              {t("Select Role")}
            </label>
            <select
              value={role}
              required
              onChange={e => setRole(e.target.value)}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 text-sm transition"
            >
              <option value="" disabled>{t("Select Role")}</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Dermatoscopist">Dermatoscopist</option>
              <option value="Generalpractitioner">General Practitioner</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition"
          >
            {t("Sign Up")}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full px-6 py-3 rounded-xl border border-violet-200 dark:border-violet-800/50 text-violet-700 dark:text-violet-300 font-semibold hover:bg-violet-50 dark:bg-violet-950/50 transition"
          >
            {t("Back")}
          </button>

          <div className="flex flex-col sm:flex-row justify-between items-center text-sm pt-2">
            <span className="text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500">{t("Have An Account ?")}</span>
            <a
              href="log_in"
              className="text-violet-700 dark:text-violet-300 font-bold hover:text-indigo-700 transition"
            >
              {t("Sign In")}
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp
