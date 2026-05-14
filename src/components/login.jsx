import { useState } from 'react'
import Services from './services/services'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaSpinner } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function LogIn() {
  const { t, i18n } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  function LogInHandler(e) {
    e.preventDefault()
    const service = new Services()
    service.login(email, password, navigate)
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white dark:bg-slate-900/90 dark:bg-slate-900/90 backdrop-blur rounded-3xl shadow-xl ring-1 ring-slate-200/60 p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white text-xl font-bold shadow-md mb-4">
              S
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {t("Welcome Back")}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-2">
              {t("Sign in to continue to SymptomAI")}
            </p>
          </div>

          <form onSubmit={LogInHandler} className="space-y-4">
            <div className="group flex items-center border border-slate-200 dark:border-slate-700 rounded-xl px-3 bg-slate-50 dark:bg-slate-900/60 focus-within:bg-white dark:bg-slate-900 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-200 transition">
              <span className="mr-2 text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500">📧</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t("Email")}
                required
                className="w-full p-3 bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 focus:outline-none"
              />
            </div>

            <div className="group flex items-center border border-slate-200 dark:border-slate-700 rounded-xl px-3 bg-slate-50 dark:bg-slate-900/60 focus-within:bg-white dark:bg-slate-900 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-200 transition">
              <span className="mr-2 text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500">🔑</span>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full p-3 bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 focus:outline-none"
              />
            </div>

            <div className="text-right">
              <Link
                to="/forgotpassword"
                className="text-sm text-violet-700 dark:text-violet-300 hover:text-violet-900 hover:underline font-medium"
              >
                {t("Forgot password ?")}
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-700 to-indigo-700 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:from-violet-800 hover:to-indigo-800 transition duration-300"
            >
              {t("Sign In")}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:bg-slate-900 transition"
            >
              {t("Back")}
            </button>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-center items-center text-sm gap-2">
              <span className="text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500">
                {t("Don't You Have An Account ?")}
              </span>
              <Link
                to="/sign_up"
                className="text-violet-700 dark:text-violet-300 font-semibold hover:text-violet-900 transition"
              >
                {t("Sign Up")}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
export default LogIn
