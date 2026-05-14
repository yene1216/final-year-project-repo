import { useEffect, useRef, useState } from 'react'
import { FaArrowUp, FaRobot, FaSpinner, FaLaptop, FaCheck, FaStethoscope } from "react-icons/fa"
import { PiWaveform } from 'react-icons/pi'
import { CiCirclePlus } from "react-icons/ci"
import { MdAttachFile } from "react-icons/md"
import { Link } from 'react-router-dom'
import { FaRegCopy } from "react-icons/fa6"
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa"
import { RiShare2Line } from "react-icons/ri"
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import api from '../api/Intercepter'

function RNN() {
  const { t, i18n } = useTranslation()
  const fileReference = useRef(null)
  const [messages, setMessages] = useState([])
  const bottomRef = useRef(null)
  const [Symptom, setSymptom] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const InputRef = useRef(null)
  const [permissionForAskAgain, setPermission] = useState(true)
  const [recordState, setRecordingState] = useState('stopped')
  const [historyMessage, setHistoryMessage] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/api/chat_text', {
      params: { conversationId: sessionStorage.getItem("conversationId") },
      withCredentials: true
    }).then(res => setHistoryMessage(res.data))
  }, [messages])

  function handleSearch() {
    if (Symptom === '') return

    if (Symptom.includes("exit") || Symptom.includes("stop") || Symptom.includes("close")) {
      if (Symptom.includes("tab")) {
        window.open('http://localhost:5173/closed_tab')
        setSymptom('')
        return
      }
      setMessages(prev => [...prev, { user: Symptom, answer: "Okay, I Will Close The Chat Within 2 Seconds", time: "now" }])
      setSymptom('')
      return
    }

    if (permissionForAskAgain) {
      setPermission(false)
      setIsLoading(true)
      setMessages(prev => [...prev, { user: Symptom, answer: "", time: "" }])

      const questionPerDay = localStorage.getItem("questionPerDay")
      api.post('/api/chat_with_RNN',
        { Symptom, conversationId: localStorage.getItem("conversationId"), question_per_day: questionPerDay },
        { withCredentials: true }
      ).then(response => {
        setMessages(prev => {
          const newMessages = [...prev]
          const last = newMessages[newMessages.length - 1]
          last.answer = response.data.message
          last.time = response.data.time
          return newMessages
        })
        setPermission(true)
        setIsLoading(false)
        sessionStorage.setItem("questionPerDay", Number(sessionStorage.getItem("questionPerDay")) + 1)
      })
    }
    setSymptom('')
  }

  function newChatHandler() {
    setMessages([])
    api.post('/api/new_conversation', {}, { withCredentials: true })
      .then(response => {
        sessionStorage.setItem("conversationId", response.data.conversation_id)
      })
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    window.addEventListener('keydown', () => InputRef.current?.focus())
  }, [])

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">

      <div className="flex sm:hidden items-center justify-between bg-white dark:bg-slate-900/80 dark:bg-slate-900/80 backdrop-blur-xl px-4 py-3 border-b border-violet-100 dark:border-violet-900/50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md">
            <FaRobot size={18} color="white" />
          </div>
          <span className="font-bold text-slate-800 dark:text-slate-100">SymptomAI</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-violet-700 dark:text-violet-300 text-sm font-medium flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-violet-50 dark:bg-violet-950/50 transition"
        >
          <CiCirclePlus size={20} />
          {t("Menu")}
        </button>
      </div>

      {sidebarOpen && (
        <div className="sm:hidden flex flex-col gap-2 bg-white dark:bg-slate-900/90 dark:bg-slate-900/90 backdrop-blur-xl px-4 py-3 border-b border-violet-100 dark:border-violet-900/50 shadow-sm">
          <Link className="text-slate-700 dark:text-slate-200 text-sm hover:text-violet-700 dark:text-violet-300 font-medium px-2 py-1.5 rounded-md hover:bg-violet-50 dark:bg-violet-950/50" to="/">{t("Home")}</Link>
          <button
            className="flex items-center gap-2 text-white text-sm font-semibold cursor-pointer w-fit bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1.5 rounded-lg shadow-sm"
            onClick={() => { newChatHandler(); setSidebarOpen(false) }}
          >
            <CiCirclePlus size={20} />
            {t("New Chat")}
          </button>
        </div>
      )}

      <aside className="hidden sm:flex flex-col h-screen w-[230px] border-r border-violet-100 dark:border-violet-900/50 bg-white dark:bg-slate-900/80 dark:bg-slate-900/80 backdrop-blur-xl px-4 py-6 gap-4 shadow-sm">
        <div className="flex items-center gap-2 px-1">
          <img
            className="w-10 h-10 rounded-xl cursor-pointer ring-1 ring-violet-200"
            onClick={() => navigate("/")}
            src="/icon.png"
            alt="icon"
          />
          <span className="font-bold text-slate-800 dark:text-slate-100">SymptomAI</span>
        </div>

        <Link
          className="text-slate-600 dark:text-slate-300 text-sm hover:text-violet-700 dark:text-violet-300 font-medium px-3 py-2 rounded-lg hover:bg-violet-50 dark:bg-violet-950/50 transition"
          to="/"
        >
          {t("Home")}
        </Link>
        <button
          className="flex items-center gap-2 text-white text-sm font-semibold cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-xl px-3 py-2.5 shadow-md hover:shadow-lg transition"
          onClick={newChatHandler}
        >
          <CiCirclePlus size={20} />
          {t("New Chat")}
        </button>
      </aside>

      <div className="flex flex-col flex-1 relative items-center">

        <div className="
          absolute z-10 overflow-y-auto no-scrollbar
          bg-white dark:bg-slate-900/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl shadow-xl ring-1 ring-violet-100 dark:ring-violet-900/50
          p-4
          w-[96vw] bottom-[88px] top-[12px]
          sm:w-[600px] sm:top-[24px] sm:bottom-[14vh]
          sm:left-1/2 sm:-translate-x-1/2
        ">
          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 ring-1 ring-violet-100 dark:ring-violet-900/50 w-fit max-w-[90%] rounded-2xl px-4 py-3 mb-3 flex items-center gap-2 shadow-sm">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-sm">
              <FaLaptop size={14} color="white" />
            </div>
            <strong className="text-slate-700 dark:text-black-200 text-sm">{t("Hi! I'm SymptomAI")}</strong>
            <FaStethoscope size={16} className="text-violet-600 dark:text-violet-400" />
          </div>

          {messages.map((message, index) => (
            <div key={index} className="mb-3">
              {message.user && (
                <div className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white w-[82%] ml-auto mt-3 rounded-2xl rounded-br-md p-3 text-sm leading-relaxed first-letter:uppercase break-words shadow-sm">
                  {message.user}
                </div>
              )}

              {message.answer !== undefined && (
                <div className="bg-white dark:bg-slate-900 w-[82%] mt-3 rounded-2xl rounded-bl-md p-3 text-sm leading-relaxed first-letter:uppercase break-words shadow-sm ring-1 ring-violet-100 dark:ring-violet-900/50">
                  {message.answer === "" && (
                    <span className="text-violet-500 text-xs italic">{t("Thinking...")}</span>
                  )}

                  {Array.isArray(message.answer) && message.answer.length > 0 && (
                    <div className="overflow-x-auto mt-1">
                      <table className="w-full border-collapse text-xs rounded-xl overflow-hidden ring-1 ring-violet-100 dark:ring-violet-900/50">
                        <caption className="text-violet-700 dark:text-violet-300 font-semibold text-xs py-2 bg-violet-50 dark:bg-violet-950/50">
                          {t("Top Five possible disease")}
                        </caption>
                        <thead>
                          <tr>
                            <th className="px-2 py-2 bg-violet-100 text-violet-800">{t("Diseases")}</th>
                            <th className="px-2 py-2 bg-violet-100 text-violet-800">{t("Confidence")} ({t("prob")})</th>
                            <th className="px-2 py-2 bg-violet-100 text-violet-800">{t("Confidence")} ({t("%")})</th>
                          </tr>
                        </thead>
                        <tbody>
                          {message.answer.map((msg, i) => (
                            <tr key={i} className="even:bg-violet-50 dark:bg-violet-950/50/50">
                              <td className="px-2 py-1.5 text-slate-700 dark:text-slate-200">
                                {i18n.language === 'am' ? t(msg.disease) : msg.disease}
                              </td>
                              <td className="px-2 py-1.5 text-center text-slate-700 dark:text-slate-200">
                                {(msg.confidence * 100).toFixed(4)}
                              </td>
                              <td className="px-2 py-1.5 text-center font-medium text-violet-700 dark:text-violet-300">
                                {(msg.confidence * 100).toFixed(2)}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {message.time && (
                    <i className="block text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 font-mono text-[11px] mt-2">{message.time}</i>
                  )}
                </div>
              )}

              {message.answer && message.answer !== '' && (
                <div className="flex flex-row gap-3 px-2 py-1 items-center">
                  <FaRegCopy
                    title="Copy"
                    className="cursor-pointer text-slate-300 hover:text-violet-600 dark:text-violet-400 transition-colors"
                    size={15}
                    onClick={() => navigator.clipboard.writeText(
                      Array.isArray(message.answer)
                        ? message.answer.map(m => m.disease).join(', ')
                        : message.answer
                    )}
                  />
                  <FaThumbsUp title="I like it" className="cursor-pointer text-slate-300 hover:text-violet-600 dark:text-violet-400 transition-colors" size={14} />
                  <FaThumbsDown title="I dislike it" className="cursor-pointer text-slate-300 hover:text-violet-600 dark:text-violet-400 transition-colors" size={14} />
                  <RiShare2Line title="Share" className="cursor-pointer text-slate-300 hover:text-violet-600 dark:text-violet-400 transition-colors" size={15} />
                </div>
              )}
            </div>
          ))}

          <div
            ref={bottomRef}
            className={`w-2 h-2 rounded-full ${isLoading ? 'bg-violet-600 animate-ping' : 'bg-transparent'}`}
          />
        </div>

        <div className="
          z-10 flex items-center gap-1
          border border-violet-100 dark:border-violet-900/50
          rounded-2xl bg-white dark:bg-slate-900/90 dark:bg-slate-900/90 backdrop-blur-xl
          shadow-lg ring-1 ring-violet-100 dark:ring-violet-900/50
          absolute
          bottom-4 w-[94vw] px-2
          sm:bottom-[6vh] sm:w-[600px]
          sm:left-1/2 sm:-translate-x-1/2
        ">
          {/* <button
            className="cursor-pointer p-2 rounded-xl hover:bg-violet-50 dark:bg-violet-950/50 transition flex-shrink-0"
            onClick={() => fileReference.current?.click()}
          >
            <MdAttachFile className="text-violet-700 dark:text-violet-300" size={20} />
          </button>
          <input ref={fileReference} type="file" className="hidden" /> */}

          <textarea
            rows={1}
            ref={InputRef}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSearch() } }}
            value={Symptom}
            onChange={e => setSymptom(e.target.value)}
            className="flex-1 h-11 resize-none overflow-y-hidden focus:outline-none p-2.5 bg-transparent text-sm placeholder:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500"
            placeholder={t("Type comma separated symptoms")}
          />

          <button
            className="cursor-pointer p-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition flex-shrink-0"
            onClick={handleSearch}
          >
            {permissionForAskAgain
              ? <FaArrowUp size={16} />
              : <FaSpinner size={16} className="animate-spin" />
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default RNN
