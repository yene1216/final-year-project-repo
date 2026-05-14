import { useState, useEffect } from "react"
import api from '../api/Intercepter'
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

function Cases() {
  const [cases, setCases] = useState([])
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    api.get("/api/skin_case", { withCredentials: true })
      .then(res => {
        setCases(res.data)
        console.log(res.data)
      })
  }, [])

  const role = localStorage.getItem("role")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-6">
      {role === "Dermatologist" ? (
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent">
              {t("Skin Cases")}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm mt-1">
              {t("Review and analyze submitted patient cases.")}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {(Array.isArray(cases) ? cases : []).map((cas) => (
              <div
                key={cas.id}
                className="bg-white dark:bg-slate-900/90 dark:bg-slate-900/90 backdrop-blur rounded-2xl shadow-sm hover:shadow-md ring-1 ring-violet-100 dark:ring-violet-900/50 transition flex flex-row items-center gap-4 p-4"
              >
                {cas.image ? (
                  <img
                    src={`http://127.0.0.1:8000/${cas.image}`}
                    alt="case"
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl ring-1 ring-violet-100 dark:ring-violet-900/50 flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-violet-400 text-xs text-center">No Image</span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  {cas.patient_name && (
                    <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-base truncate">
                      {cas.patient_name}
                    </h2>
                  )}
                  {cas.date && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">{cas.date}</p>
                  )}
                  {cas.status && (
                    <span className="inline-block mt-2 text-[11px] font-medium bg-violet-100 text-violet-700 dark:text-violet-300 rounded-full px-2.5 py-0.5 ring-1 ring-violet-200">
                      {t(`${cas.status}`)}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => navigate('/chat_CNN', {
                    state: {
                      image: cas.image,
                      patient_name: cas.patient_name,
                      case_id: cas.id
                    }
                  })}
                  className="flex-shrink-0 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm hover:shadow transition"
                >
                  {t("Analyze")}
                </button>
              </div>
            ))}

            {cases.length === 0 && (
              <div className="text-center text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-20 text-sm bg-white dark:bg-slate-900/60 dark:bg-slate-900/60 rounded-2xl py-12 ring-1 ring-violet-100 dark:ring-violet-900/50">
                {t("No cases found.")}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <h1 className="text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 text-lg">{t("You are not allowed here")}</h1>
        </div>
      )}
    </div>
  )
}

export default Cases
