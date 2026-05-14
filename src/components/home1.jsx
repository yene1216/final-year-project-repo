import { Link } from "react-router-dom"
import Doctor from '../assets/doctor.jpg'
import Ls from '../assets/ls.jpg'
import axios from 'axios'
import api from '../api/Intercepter'
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"

function Home1() {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/api/user', { withCredentials: true })
      .then(res => {
        setUser({ 'firstName': res.data.firstName, 'lastName': res.data.lastName })
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          location.pathname = '/log_in'
        }
      })
  }, [])

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex flex-col items-center py-10 px-4">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-widest text-violet-600 dark:text-violet-400 font-semibold mb-2">
            {t("AI Diagnostic Support System")}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {t("Welcome,")} <span className="bg-gradient-to-r from-violet-700 to-indigo-700 dark:from-violet-300 dark:to-indigo-300 bg-clip-text text-transparent">{user.firstName} {user.lastName}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-2 text-sm">
            {t("Choose a diagnostic tool to get started")}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row justify-center gap-6 w-full max-w-5xl">
          {
            (localStorage.getItem('role') === "Dermatoscopist" ?
              (
                <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl p-8 flex flex-col items-center shadow-xl ring-1 ring-slate-200/60 hover:shadow-2xl hover:-translate-y-1 transition">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-md mb-4">
                    📷
                  </div>
                  <h2 className="text-slate-900 dark:text-slate-50 text-xl font-bold mb-2 text-center">
                    Attach patient's skin image
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-6 text-center text-sm">
                    you can attach the patient's skin image with the intended Dermatologist
                  </p>
                  <Link
                    to="/skin_cases"
                    className="bg-gradient-to-r from-violet-700 to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition"
                  >
                    Start →
                  </Link>
                </div>
              ) :
              (localStorage.getItem('role') === "Dermatologist" ? (
                <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl p-8 flex flex-col items-center shadow-xl ring-1 ring-slate-200/60 hover:shadow-2xl hover:-translate-y-1 transition">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-md mb-4">
                    🔬
                  </div>
                  <h2 className="text-slate-900 dark:text-slate-50 text-xl font-bold mb-2 text-center">Skin Cancer Detection</h2>
                  <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-6 text-center text-sm">
                    Upload a photo of the skin lesion for prediction
                  </p>
                  <div className="flex flex-row justify-center flex-wrap gap-3">
                    <Link
                      to="/chat_CNN"
                      className="bg-gradient-to-r from-violet-700 to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition"
                    >
                      Start
                    </Link>
                    <button
                      type="button"
                      onClick={e => { navigate("/cases") }}
                      className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-6 py-3 rounded-xl font-semibold hover:bg-slate-200 transition"
                    >
                      {t("Cases")}
                    </button>
                  </div>
                </div>
              ) :
                (
                  <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl p-8 flex flex-col items-center shadow-xl ring-1 ring-slate-200/60 hover:shadow-2xl hover:-translate-y-1 transition">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-md mb-4">
                      💬
                    </div>
                    <h2 className="text-slate-900 dark:text-slate-50 text-xl font-bold mb-2 text-center">
                      Symptom Disease Detection
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-6 text-center text-sm">
                      Detect from 773 diseases. Enter patient symptoms in text.
                    </p>
                    <Link
                      to="/chat_RNN"
                      className="bg-gradient-to-r from-violet-700 to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition"
                    >
                      Start
                    </Link>
                  </div>
                )
              ))
          }
        </div>

        <div className="mt-12 max-w-2xl text-center">
          <div className="bg-white dark:bg-slate-900/70 dark:bg-slate-900/70 backdrop-blur rounded-2xl px-6 py-4 ring-1 ring-slate-200/60 text-slate-600 dark:text-slate-300 text-sm">
            <strong className="text-violet-700 dark:text-violet-300">Note:</strong> Patient details like age, gender, skin type can be added in the next step.
          </div>
        </div>
      </div>
    </>
  )
}
export default Home1
