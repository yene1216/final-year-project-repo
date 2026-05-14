import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import { useTranslation } from "react-i18next";
import api from '../api/Intercepter'

function PatientDetail() {
  const [PatientName, setPatientName] = useState('')
  const [Age, setAge] = useState('')
  const [PatientGender, setPatientGender] = useState('')
  const [PatientId, setPatientId] = useState('')
  const [ConversationId, setConversationId] = useState('')
  const navigate = useNavigate()

  function SubmitHandler(e) {
    e.preventDefault()
    api.post('/api/new_conversation', { 'full_name': PatientName, 'age': Age, 'gender': PatientGender, 'patient_id': PatientId }, { withCredentials: true })
      .then(response => {
        const newId = response.data.conversation_id;
        sessionStorage.setItem("conversationId", newId);
        setConversationId(newId);
        console.log(response.data.conversation_id)
        navigate("/home2")
      })
  }

  const { t, i18n } = useTranslation();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900/90 dark:bg-slate-900/90 backdrop-blur rounded-3xl shadow-xl ring-1 ring-slate-200/60 p-8 md:p-10">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-violet-600 dark:text-violet-400 font-semibold mb-2">
              {t("Step 1 of 2")}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {t("Patient Information")}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-2">
              {t("Enter your patient's details to start a new assessment.")}
            </p>
          </div>

          <form onSubmit={SubmitHandler} className="space-y-5">
            <div className="flex flex-col">
              <label className="text-sm text-slate-700 dark:text-slate-200 font-medium mb-1.5">
                {t("Patient's full name")}
              </label>
              <input
                type="text"
                value={PatientName}
                onChange={e => setPatientName(e.target.value)}
                required
                placeholder={t("Enter full name")}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 focus:outline-none focus:bg-white dark:bg-slate-900 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm text-slate-700 dark:text-slate-200 font-medium mb-1.5">
                  {t("Patient Age")}
                </label>
                <input
                  type="number"
                  value={Age}
                  onChange={e => setAge(e.target.value)}
                  placeholder={t("Enter age")}
                  required
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 focus:outline-none focus:bg-white dark:bg-slate-900 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-slate-700 dark:text-slate-200 font-medium mb-1.5">
                  {t("Patient Gender")}
                </label>
                <select
                  required
                  value={PatientGender}
                  onChange={e => setPatientGender(e.target.value)}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 focus:outline-none focus:bg-white dark:bg-slate-900 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition"
                >
                  <option value="">{t("Select gender")}</option>
                  <option value="male">{t("Male")}</option>
                  <option value="female">{t("Female")}</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-slate-700 dark:text-slate-200 font-medium mb-1.5">
                {t("Patient Id")}
              </label>
              <input
                type="number"
                value={PatientId}
                required
                onChange={e => setPatientId(e.target.value)}
                placeholder={t("Enter patient ID")}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 focus:outline-none focus:bg-white dark:bg-slate-900 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:bg-slate-900 transition"
              >
                {t("Back")}
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-violet-700 to-indigo-700 text-white font-semibold shadow-md hover:shadow-lg hover:from-violet-800 hover:to-indigo-800 transition"
              >
                {t("Continue")} →
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
export default PatientDetail
