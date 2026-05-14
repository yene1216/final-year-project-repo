import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import api from '../api/Intercepter'
import { FaArrowUp } from "react-icons/fa"
import isImageBlurred from "./services/checker"

function SkinCases() {
  const navigate = useNavigate()
  const [PatientFullName, setPatientFullName] = useState('')
  const [file, setFile] = useState('')
  const { t, i18n } = useTranslation()
  const [dermatologists, setDermatologists] = useState([])
  const [visibility, setVisibility] = useState('flex')
  const fileRef = useRef(null)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    api.get('/api/dermatologists', { withCredentials: true })
      .then(res => {
        console.log(res.data)
        setDermatologists(res.data)
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          window.location.href = "/log_in"
        } else {
          console.log("Error:", err)
        }
      })
  }, [])

  function SubmitHandler(e) {
    e.preventDefault()

    if (!file) return
    const img = new Image()
    img.src = URL.createObjectURL(file)

    img.onload = () => {
      const blurred = isImageBlurred(img, 100)
      if (blurred) {
        console.log("your image is blurry")
      } else {
        console.log("your image is sharp")
      }
    }
    const dermatologist = localStorage.getItem("dermatologist")
    const formData = new FormData()

    formData.append("patient_name", PatientFullName)
    formData.append("assigned_to", dermatologist)
    formData.append("image", file)

    api.post("/api/skin_case", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true
    })
      .then(res => {
        setSuccessMessage(res.data.message)
      })
  }

  function clickFileChoiceButton() {
    fileRef.current.click()
  }

  setTimeout(() => {
    setSuccessMessage("")
  }, 3000)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent">
            {t("Submit a New Case")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm mt-1">
            {t("Choose a dermatologist and upload the patient's image.")}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-sm ring-1 ring-violet-100 dark:ring-violet-900/50 p-4 mb-6">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3 px-1">
            {t("Available Dermatologists")}
          </h2>
          <div className="flex flex-wrap gap-3 max-h-[40vh] overflow-y-auto">
            {(Array.isArray(dermatologists) ? dermatologists : []).map((derma) => (
              <div
                key={derma.id}
                onClick={() => setVisibility("block")}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-md ring-1 ring-violet-100 dark:ring-violet-900/50 hover:ring-violet-300 transition cursor-pointer p-4 w-full sm:w-[220px] text-center"
              >
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-violet-200 to-indigo-200 flex items-center justify-center text-violet-700 dark:text-violet-300 font-bold">
                  {(derma.first_name?.[0] || '') + (derma.last_name?.[0] || '')}
                </div>
                <h1 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                  {derma.first_name} {derma.last_name}
                </h1>
              </div>
            ))}
          </div>
        </div>

        {successMessage && (
          <div className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-4 py-3 rounded-xl mb-4 text-sm font-medium">
            {successMessage}
          </div>
        )}

        <div
          className={`bg-white dark:bg-slate-900/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl ring-1 ring-violet-100 dark:ring-violet-900/50 rounded-3xl p-6 sm:p-8 mx-auto max-w-md ${visibility}`}
        >
          <form onSubmit={SubmitHandler} className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-3 bg-white dark:bg-slate-900 focus-within:ring-2 focus-within:ring-violet-400 focus-within:border-violet-400 transition">
              <span className="text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500">👤</span>
              <input
                className="w-full p-3 bg-transparent focus:outline-none text-sm"
                value={PatientFullName}
                onChange={(e) => setPatientFullName(e.target.value)}
                type="text"
                required
                placeholder={t("Patient's full name")}
              />
            </div>

            <button
              type="button"
              onClick={clickFileChoiceButton}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <FaArrowUp size={16} />
              {file ? (file.name || t("File Selected")) : t("Upload File")}
            </button>

            <input
              ref={fileRef}
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
              type="file"
            />

            <div className="flex flex-row justify-between gap-3 pt-2">
              <button
                type="button"
                className="flex-1 px-4 py-2.5 rounded-xl border border-violet-200 dark:border-violet-800/50 text-violet-700 dark:text-violet-300 font-semibold hover:bg-violet-50 dark:bg-violet-950/50 transition"
                onClick={() => navigate(-1)}
              >
                {t("Back")}
              </button>
              <input
                className="flex-1 cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold py-2.5 rounded-xl shadow-sm hover:shadow transition"
                type="submit"
                value={t("Submit")}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SkinCases
