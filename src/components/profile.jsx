import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import defaultUser from '../assets/defaultuser.png'
import api from '../api/Intercepter'

function Profile() {
  const [hospitalName, setHospitalName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [file, setFile] = useState('')
  const { t, i18n } = useTranslation()
  const filePickerRef = useRef(null)
  const [showForm, setShowForm] = useState('hidden')
  const [profileData, setProfileData] = useState('')

  useEffect(() => {
    api.get('/api/profile', { withCredentials: true })
      .then(res => {
        setProfileData(res.data)
        console.log(res.data)
      })
  }, [])

  function handleClick() {
    filePickerRef.current.click()
  }

  function handleSubmit(e) {
    const formData = new FormData()
    if (phoneNumber) {
      formData.append('phone_number', phoneNumber)
    }
    if (hospitalName) {
      formData.append('hospital_name', hospitalName)
    }
    if (file) {
      formData.append('profile_image', file)
    }

    e.preventDefault()
    if (profileData === '') {
      api.post('/api/profile', formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        })
        .then(res => {
          if (res.status === 200) {
            window.location.reload()
          }
        })
    }
    else {
      api.patch('/api/updateProfile', formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        })
        .then(res => {
          if (res.status === 200) {
            window.location.reload()
          }
          console.log(res.data)
        })
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 px-4 py-10">
        <div className="max-w-5xl mx-auto">


          <div className="flex flex-col md:flex-row items-center md:items-stretch gap-6 bg-white dark:bg-slate-900 rounded-3xl shadow-xl ring-1 ring-slate-200/60 p-6 md:p-8">
            <div
              className="relative w-40 h-40 md:w-44 md:h-44 rounded-full overflow-hidden cursor-pointer flex-shrink-0 ring-4 ring-violet-100 dark:ring-violet-900/50 shadow-md hover:ring-violet-300 transition"
              onClick={() =>
                showForm === 'hidden' ? setShowForm('block') : setShowForm('hidden')
              }
            >
              <img
                className="w-full h-full object-cover"
                src={
                  profileData.profile_image
                    ? `http://localhost:8000/${profileData.profile_image}`
                    : defaultUser
                }
                alt="user image"
              />
            </div>

            <div className="flex-1 flex flex-col justify-center text-center md:text-left">
              <p className="text-xs uppercase tracking-widest text-violet-600 dark:text-violet-400 font-semibold mb-1">
                {t("Profile")}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 capitalize">
                {profileData.hospital_name ? `Hosp. ${profileData.hospital_name}` : t("Add hospital info")}
              </h1>
              <h2 className="text-base text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">
                {profileData.phone_number ? `📱 ${profileData.phone_number}` : t("No phone number set")}
              </h2>
              <button
                onClick={() =>
                  showForm === 'hidden' ? setShowForm('block') : setShowForm('hidden')
                }
                className="mt-4 self-center md:self-start bg-gradient-to-r from-violet-700 to-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition"
              >
                {t("Edit Profile")}
              </button>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className={`${showForm} mt-6 mx-auto bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-xl ring-1 ring-slate-200/60 w-full max-w-md space-y-5`}
          >
            <div className="flex justify-center">
              <div
                className="w-32 h-32 rounded-full overflow-hidden cursor-pointer ring-4 ring-violet-100 dark:ring-violet-900/50 shadow-md hover:ring-violet-300 transition"
                onClick={handleClick}
              >
                <img
                  className="w-full h-full object-cover"
                  src={
                    file
                      ? URL.createObjectURL(file)
                      : defaultUser
                  }
                  alt="user image"
                />
              </div>
            </div>
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 -mt-2">{t("Click image to change")}</p>

            <input
              ref={filePickerRef}
              className="hidden"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <div className="w-full">
              <label className="block text-sm text-slate-700 dark:text-slate-200 font-medium mb-1.5">🏥 {t("Hospital Name")}</label>
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl px-3 bg-slate-50 dark:bg-slate-900/60 focus-within:bg-white dark:bg-slate-900 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-200 transition">
                <input
                  className="w-full p-3 bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 focus:outline-none"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  type="text"
                  placeholder={t('Hospital Name')}
                />
              </div>
            </div>

            <div className="w-full">
              <label className="block text-sm text-slate-700 dark:text-slate-200 font-medium mb-1.5">📱 {t("Phone Number")}</label>
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl px-3 bg-slate-50 dark:bg-slate-900/60 focus-within:bg-white dark:bg-slate-900 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-200 transition">
                <input
                  className="w-full p-3 bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 focus:outline-none"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  type="text"
                  placeholder={t('Phone Number')}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-700 to-indigo-700 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition"
            >
              {t("Set")}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
export default Profile
