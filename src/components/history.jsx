import { useEffect, useState, useRef } from "react"
import api from '../api/Intercepter'
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function History() {
  const [showFollowUpButton, setShowFollowUpButton] = useState('hidden')
  const [Patient, setPatient] = useState([])
  const [HistoryMessage, setHistoryMessage] = useState([])
  const [searchResult, setSearchResult] = useState([])
  const [openMenuId, setOpenMenuId] = useState(null)
  const timeoutRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function DeletePatient(conversationId) {
    try {
      await api.delete(`/api/delete/${conversationId}`, {
        withCredentials: true,
      });
      setPatient(prev => prev.filter(p => p.id !== conversationId));
      setSearchResult(prev => prev.filter(p => p.id !== conversationId));
      setOpenMenuId(null);
    } catch (err) {
      console.error("Failed to delete patient", err);
    }
  }

  useEffect(() => {
    api.get('/api/new_conversation', { withCredentials: true })
      .then(res => {
        console.log(res.data)
        setPatient(res.data)
      })
  }, [])

  function PreviousChat(conversationId, fullName) {
    if (window.innerWidth < 640) {
      navigate("/followup")
    }
    setHistoryMessage([])
    api.get('/api/chat_text', {
      params: {
        "conversationId": conversationId,
        "fullName": fullName
      },
      withCredentials: true
    })
      .then(res => {
        console.log(res.data)
        setHistoryMessage(prev => [...prev, ...(Array.isArray(res.data) ? res.data : [res.data])])
      })
  }

  const { t, i18n } = useTranslation()

  async function SearchPatients(fullName) {
    const response = await api.get("/api/search_patient", {
      params: { "fullname": fullName },
      withCredentials: true
    })
    console.log("search result ", response.data)
    setSearchResult(response.data)
  }

  const handleSearch = (value) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      SearchPatients(value);
    }, 360);
  };

  const PatientCard = ({ p, index }) => (
    <div
      key={index}
      onClick={() => {
        PreviousChat(p.id, p.full_name);
        localStorage.setItem('conversationId', p.id);
        localStorage.setItem("fullName", p.full_name);
        setShowFollowUpButton(null);
      }}
      className="group relative flex items-center gap-3 bg-white dark:bg-slate-900 rounded-2xl p-3 ring-1 ring-slate-200/60 hover:ring-violet-300 hover:shadow-md cursor-pointer transition"
    >
      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
        {(p.full_name?.[0] || "?").toUpperCase()}
      </div>
      <h2 className="font-medium text-slate-800 dark:text-slate-100 truncate flex-1">{p.full_name}</h2>

      <div className="relative" ref={openMenuId === p.id ? menuRef : null}>
        <button
          type="button"
          aria-label="Open menu"
          onClick={(e) => {
            e.stopPropagation();
            setOpenMenuId(openMenuId === p.id ? null : p.id);
          }}
          className="p-1.5 rounded-full text-slate-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-slate-800 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.6" />
            <circle cx="12" cy="12" r="1.6" />
            <circle cx="12" cy="19" r="1.6" />
          </svg>
        </button>

        {openMenuId === p.id && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-9 z-20 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-lg ring-1 ring-slate-200 dark:ring-slate-700 overflow-hidden"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                DeletePatient(p.id);
              }}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
              {t("Delete")}
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      <div className="bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex flex-col md:flex-row" style={{ height: '100vh' }}>

        <div className="w-full md:w-1/4 bg-white dark:bg-slate-900/80 dark:bg-slate-900/80 backdrop-blur p-4 overflow-y-auto h-[50vh] md:h-screen md:sticky top-0 border-r border-slate-200 dark:border-slate-700/60">
          <h2 className="text-xs uppercase tracking-widest text-violet-600 dark:text-violet-400 font-semibold mb-3 px-1">
            {t("Patients")}
          </h2>
          <input
            type="search"
            placeholder={t("Search Patient")}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 focus:outline-none focus:bg-white dark:bg-slate-900 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 mb-4 transition"
            onChange={(e) => handleSearch(e.target.value)}
          />
          {
            searchResult.length > 0 ? (
              <div className="space-y-2">
                {searchResult.map((p, index) => <PatientCard key={index} p={p} index={index} />)}
              </div>
            ) : (
              <div className="space-y-2">
                {Patient.map((p, index) => <PatientCard key={index} p={p} index={index} />)}
              </div>
            )
          }
        </div>



        <div className="w-full md:w-3/4 p-4 md:p-6 overflow-y-auto h-[50vh] md:h-screen relative">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-1">
            {t("Follow Up Your Patient Here")}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-6">
            {t("Select a patient on the left to view their history")}
          </p>

          <div className="space-y-6 max-w-3xl">
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
            className={`fixed bottom-6 right-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-700 to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition cursor-pointer ${showFollowUpButton}`}
            onClick={() => (window.location.pathname = "/home2")}
          >
            {t("Follow Up")} →
          </button>
        </div>

      </div>
    </>
  )
}

export default History
