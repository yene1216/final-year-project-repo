import { Link, useSearchParams } from "react-router-dom"
import axios from 'axios'
import { useState, useEffect, useRef } from "react"
import api from '../api/Intercepter'
import { FaArrowUp } from "react-icons/fa"
import isImageBlurred from './services/checker'
import { useLocation } from "react-router-dom"
import { t } from "i18next"

function CNN() {
  const [result, setResult] = useState([])
  const [file, setFile] = useState(null)
  const fileRef = useRef(null)
  const [style, setStyle] = useState('bg-violet-50 dark:bg-violet-950/50')
  const bottomRef = useRef(null)
  const { state } = useLocation()
  const { errorMessage, setErrorMessage } = useState(null)

  useEffect(() => {
    if (state?.image) {
      axios.get(`http://127.0.0.1:8000/${state.image}`, {
        responseType: 'blob'
      })
        .then(res => {
          const file = new File([res.data], "skin_image.jpg", { type: res.data.type })
          setFile(file)
          setResult([{
            message: '',
            confidence: '',
            time: '',
            recommendation: '',
            skinImage: file
          }])
        })
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [file])

  if (state?.patient_name) {
    console.log(state.patient_name)
  }

  const conversationId = localStorage.getItem('conversationId')

  function submissionHandler(e) {
    e.preventDefault()

    if (!file) return;
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const blurred = isImageBlurred(img, 100);
      if (blurred) {
        console.log("your image is blurry")
      } else {
        console.log("your image is sharp")
      }
    };

    const questionPerDay = sessionStorage.getItem("questionPerDay")
    const formData = new FormData()
    formData.append("skinImage", file)
    formData.append("conversationId", conversationId)
    formData.append("question_per_day", questionPerDay)
    formData.append("patientFullName", state?.patient_name ?? "")

    setStyle('bg-black animate-ping')
    api.post('/api/chat_with_CNN', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true
    })
      .then(response => {
        if (response.data.error) {
          setErrorMessage(response.data.error)
        }
        setResult(prev => {
          const newMessages = [...prev]
          const lastMessage = newMessages[newMessages.length - 1]
          lastMessage.message = response.data.message
          lastMessage.confidence = response.data.confidence
          lastMessage.time = response.data.time
          lastMessage.recommendation = response.data.recommendation
          return newMessages
        })
        setStyle('bg-violet-50 dark:bg-violet-950/50')
        const count = sessionStorage.getItem("questionPerDay")
        sessionStorage.setItem("questionPerDay", Number(sessionStorage.getItem("questionPerDay")) + 1)
      })
  }

  function clickFileChoiceButton() {
    fileRef.current.click()
  }

  function setSelectedFile(e) {
    setFile(e.target.files[0])
    setResult(prev => [
      ...prev,
      {
        message: '',
        confidence: '',
        time: '',
        skinImage: e.target.files[0]
      }
    ])
  }

  useEffect(() => {
    setTimeout(() => { setErrorMessage(null) }, 3000)
  }, [errorMessage])

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 bg-white dark:bg-slate-900/70 dark:bg-slate-900/70 backdrop-blur border-b border-slate-200 dark:border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              🔬
            </div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {t("Skin Cancer Detection")}
            </h1>
          </div>
          <Link
            to="/"
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-300 ring-1 ring-violet-200 font-medium hover:bg-violet-50 dark:bg-violet-950/50 transition"
          >
            {t("Home")}
          </Link>
        </div>



        <div className="flex-1 max-w-4xl w-full mx-auto bg-white dark:bg-slate-900/80 dark:bg-slate-900/80 backdrop-blur rounded-t-3xl mt-4 p-6 overflow-y-auto space-y-4 ring-1 ring-slate-200/60 shadow-inner">
          {result.length > 0 ? (result.map(item => (
            <div>
              <div className="flex justify-end">
                <div className="bg-gradient-to-br from-violet-100 to-indigo-100 p-3 rounded-2xl rounded-br-none max-w-[80%] md:max-w-md shadow-sm ring-1 ring-violet-200/60">
                  <img
                    src={item.skinImage instanceof File ? URL.createObjectURL(item.skinImage) : ""}
                    alt="skin"
                    className="w-full h-56 object-cover rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-start mt-2">
                {
                  item.message !== "" ? (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 p-5 rounded-2xl rounded-bl-none max-w-[80%] md:max-w-md shadow-md">
                      <h3 className="font-bold text-violet-700 dark:text-violet-300 mb-3 flex items-center gap-2">
                        <span>🧠</span> {t("Prediction Result")}
                      </h3>

                      <table className="w-full text-sm border-collapse overflow-hidden rounded-lg">
                        <thead className="bg-violet-50 dark:bg-violet-950/50 text-violet-800">
                          <tr>
                            <th className="p-2 text-left">{t("Disease")}</th>
                            <th className="p-2 text-right">{t("Confidence")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t border-slate-100 dark:border-slate-800">
                            <td className="p-2 font-medium">
                              {item.message}
                            </td>
                            <td className="p-2 text-right">
                              <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold">
                                {(item.confidence * 100).toFixed(2)}%
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {item.recommendation && (
                        <div className="text-sm text-slate-600 dark:text-slate-300 mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                          💡 {item.recommendation}
                        </div>
                      )}
                      <div className="text-xs text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-2 text-right">
                        {item.time}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-rose-500 mt-2 text-right">
                      {errorMessage}
                    </div>
                  )
                }
                <div ref={bottomRef} className={`w-2 h-2 ${style} rounded-full ml-2 self-end`}></div>
              </div>
            </div>
          ))) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">📸</div>
              <p className="text-slate-600 dark:text-slate-300 font-medium">{t("Upload a skin image to get started")}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">{t("Clear, well-lit photos give best results")}</p>
            </div>
          )}
        </div>

        
        <form
          onSubmit={submissionHandler}
          className="bg-white dark:bg-slate-900/90 dark:bg-slate-900/90 backdrop-blur border-t border-slate-200 dark:border-slate-700/60 p-4 flex flex-col sm:flex-row gap-3 items-center sticky bottom-0 max-w-4xl w-full mx-auto"
        >
          <input
            type="file"
            ref={fileRef}
            onChange={e => setSelectedFile(e)}
            className="hidden"
          />
          <button
            type="button"
            onClick={clickFileChoiceButton}
            className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-5 py-3 rounded-xl font-semibold hover:bg-slate-200 transition w-full sm:w-auto"
          >
            <FaArrowUp size={16} /> {t("Upload File")}
          </button>

          <button
            type="submit"
            className="bg-gradient-to-r from-violet-700 to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition w-full sm:flex-1"
          >
            {t("Analyze")}
          </button>
        </form>
      </div>
    </>
  )
}
export default CNN
