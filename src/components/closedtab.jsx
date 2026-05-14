import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

function Closed() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-6">
      <div className="w-full max-w-md bg-white dark:bg-slate-900/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl ring-1 ring-violet-100 dark:ring-violet-900/50 p-8 sm:p-10 flex flex-col items-center text-center">
        <div className="bg-gradient-to-br from-violet-100 to-indigo-100 ring-1 ring-violet-200 rounded-full p-6 mb-6 shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-14 w-14 text-violet-600 dark:text-violet-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16h6M21 12c0 5.523-4.477 10-10 10S1 17.523 1 12 5.477 2 11 2s10 4.477 10 10z"
            />
          </svg>
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent mb-3">
          {t("Oops!")}
        </h1>
        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
          {t("Nothing to display here")}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm sm:text-base mb-8 max-w-sm">
          {t("It seems you closed the chat or the conversation has ended. You can start a new chat or return to the homepage.")}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-white dark:bg-slate-900 border border-violet-200 dark:border-violet-800/50 hover:border-violet-400 text-violet-700 dark:text-violet-300 hover:text-violet-800 font-semibold px-6 py-3 rounded-xl shadow-sm hover:shadow transition cursor-pointer"
          >
            {t("Go Home")}
          </button>
          <button
            onClick={() => navigate("/chat_RNN")}
            className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
          >
            {t("Start New Chat")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Closed
