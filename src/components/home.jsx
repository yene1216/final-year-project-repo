import { Link } from "react-router-dom"
import Ls from '../assets/ls.jpg'
import axios from 'axios'
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
import api from '../api/Intercepter'
import { useNavigate } from "react-router-dom";

function DashBoard() {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState('')
  const [dailyLog, setDailyLog] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/api/user', { withCredentials: true })
      .then(res => {
        if (res.data.role === "Dermatoscopist") {
          window.location.pathname = "/dermatologists"
        }
        setUser({ 'firstName': res.data.firstName, 'lastName': res.data.lastName })
        localStorage.setItem("role", res.data.role)
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          location.pathname = '/log_in'
        }
      })
  }, [])

  useEffect(() => {
    api.get("/api/daily_log", {
      withCredentials: true
    })
      .then(res => {
        setDailyLog(res.data.dailyLog)
      })
  }, [])

  const role = localStorage.getItem("role")

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex flex-col">


        <header className="flex flex-col md:flex-row justify-between items-center px-6 py-4 gap-4 bg-white dark:bg-slate-900/70 dark:bg-slate-900/70 backdrop-blur border-b border-slate-200 dark:border-slate-700/60">
          <div className="flex items-center gap-3">
            <img
              className="w-11 h-11 rounded-xl cursor-pointer ring-1 ring-slate-200 shadow-sm"
              onClick={e => { navigate("/") }}
              src="/icon.png"
              alt="icon"
            />
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">SymptomAI</h1>
          </div>

          <div className="text-center">
            <h2 className="text-sm md:text-base font-semibold text-slate-700 dark:text-slate-200">
              {t("AI Diagnostic Support System")}
            </h2>
            <p className="text-xs text-violet-600 dark:text-violet-400 font-medium mt-0.5">
              {t("Daily Log:")} <span className="font-bold text-violet-800">{dailyLog ?? "—"}</span>
            </p>
          </div>

          <div className="text-sm text-slate-600 dark:text-slate-300">
            {t("welcome,")}{" "}
            <strong className="text-slate-900 dark:text-slate-50">{user.firstName} {user.lastName}</strong>
          </div>
        </header>

        {role === "Dermatologist" ? (
          <div className="flex justify-end px-6 pt-4">
            <button
              type="button"
              onClick={e => { navigate("/cases") }}
              className="px-5 py-2 rounded-xl border border-violet-700 text-violet-700 dark:text-violet-300 font-semibold hover:bg-violet-700 hover:text-white transition"
            >
              {t("Cases")}
            </button>
          </div>
        ) : null}

        {/* Hero */}
        <div className="flex flex-col lg:flex-row items-center justify-center flex-1 px-6 py-10 gap-10 max-w-6xl mx-auto w-full">
          <img
            src={Ls}
            alt="hello"
            className="w-60 sm:w-72 md:w-80 lg:w-96 object-contain drop-shadow-xl"
          />

          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-xl ring-1 ring-slate-200/60 p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            <Link
              to="detail"
              className="group flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md hover:shadow-xl hover:-translate-y-1 transition"
            >
              <div className="text-3xl mb-3">🩹</div>
              <h3 className="font-bold text-lg">{t("New Assessment")}</h3>
              <p className="text-xs text-violet-100 mt-1">
                {t("Start a new patient diagnosis")}
              </p>
            </Link>

            <Link
              to="/follow_up"
              className="group flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 ring-1 ring-slate-200 text-slate-800 dark:text-slate-100 hover:bg-white dark:bg-slate-900 hover:shadow-lg hover:-translate-y-1 transition"
            >
              <div className="text-3xl mb-3">📋</div>
              <h3 className="font-bold text-lg">{t("Follow Up User")}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">
                {t("Review past patient history")}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
export default DashBoard
