import { useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api/Intercepter"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
function ResetPassword() {
  const navigate=useNavigate()
  const { uid, token } = useParams()
  const [newPassword, setNewPassword] = useState("")
  const [t, i18] = useTranslation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await api.post(`/api/password-reset-confirm/${uid}/${token}/`, { new_password: newPassword })
    const confirmed=confirm("Password reset successful")
    if(confirmed){
      navigate("/")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent">
            {t("Reset Your Password")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-2 text-sm">
            {t("Choose a strong password to keep your account secure.")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900/80 dark:bg-slate-900/80 backdrop-blur-xl p-7 sm:p-8 rounded-3xl shadow-xl ring-1 ring-violet-100 dark:ring-violet-900/50 space-y-6"
        >
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              {t("New Password")}
            </label>
            <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-3 bg-white dark:bg-slate-900 focus-within:ring-2 focus-within:ring-violet-400 focus-within:border-violet-400 transition">
              <span className="text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500">🔒</span>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full p-3 bg-transparent focus:outline-none text-sm"
                placeholder={t("Enter your new password")}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition"
          >
            {t("Reset Password")}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
