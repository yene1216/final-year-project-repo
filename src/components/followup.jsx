import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/Intercepter";

function FollowUp() {
  const { t, i18n } = useTranslation()
  const [HistoryMessage, setHistoryMessage] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    setHistoryMessage([])
    api.get('/api/chat_text', {
      params: {
        "conversationId": localStorage.getItem("conversationId"),
        "fullName": localStorage.getItem("fullName")
      },
      withCredentials: true
    })
      .then(res => {
        console.log(res.data)
        setHistoryMessage(prev => [...prev, ...(Array.isArray(res.data) ? res.data : [res.data])])
      })
  }, [])

  return (
    <div className="flex-3 w-full md:w-3/4 bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 min-h-screen p-4 md:p-6 overflow-y-scroll relative">
      <div className="flex flex-row justify-between items-center mb-6 bg-white dark:bg-slate-900/80 dark:bg-slate-900/80 backdrop-blur rounded-2xl px-4 py-3 ring-1 ring-slate-200/60 shadow-sm">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-xl border border-violet-700 text-violet-700 dark:text-violet-300 font-semibold hover:bg-violet-700 hover:text-white transition"
        >
          ← {t("Back")}
        </button>
        <i className="text-sm text-slate-600 dark:text-slate-300">
          {t("Patient")}: <span className="font-semibold text-slate-900 dark:text-slate-50 not-italic">{sessionStorage.getItem("fullName")}</span>
        </i>
      </div>

      <div className="space-y-6 max-w-3xl mx-auto">
        {HistoryMessage.map((h, index) => {
          if (Array.isArray(h.message) && h.sender === "bot") {
            return (
              <table
                key={index}
                className="bg-white dark:bg-slate-900 w-full md:w-4/5 rounded-2xl p-3 shadow-md ring-1 ring-slate-200/60 overflow-hidden"
              >
                <caption className="font-bold mb-2 text-violet-800 text-left p-3">
                  {t("Top Five Possible Diseases")}
                </caption>
                <thead className="bg-violet-50 dark:bg-violet-950/50 text-violet-800">
                  <tr>
                    <th className="p-3 text-left">{t("Disease")}</th>
                    <th className="p-3 text-right">{t("Confidence")} ({t("prob")})</th>
                    <th className="p-3 text-right">{t("Confidence")} (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {h.message.map((msg, idx) => (
                    <tr key={idx} className="border-t border-slate-100 dark:border-slate-800">
                      <td className="p-3 font-medium text-slate-800 dark:text-slate-100">
                        {i18n.language === "am" ? t(msg.disease) : msg.disease}
                      </td>
                      <td className="p-3 text-right text-slate-600 dark:text-slate-300">
                        {(msg.confidence * 100).toFixed(2)}%
                      </td>
                      <td className="p-3 text-right">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-sm">
                          {(msg.confidence * 100).toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          }

          const isBot = h.sender === "bot";
          return (
            <div
              key={index}
              className={`flex ${isBot ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`p-4 rounded-2xl max-w-[80%] md:max-w-lg shadow-sm ring-1 ${
                  isBot
                    ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-bl-none ring-slate-200/60"
                    : "bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-none ring-violet-300/40"
                }`}
              >
                {h.message !== null ? (
                  <span>
                    {i18n.language === "am"
                      ? h.message.split(",").map((m) => t(m.trim())).join(", ")
                      : h.message}
                  </span>
                ) : (
                  <img
                    src={`http://localhost:8000/${h.image}`}
                    alt="skin"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        className="absolute bottom-6 right-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-700 to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition cursor-pointer"
        onClick={() => navigate("/home2")}
      >
        {t("Follow Up")} →
      </button>
    </div>
  )
}

export default FollowUp
