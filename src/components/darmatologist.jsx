import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/Intercepter";
import { useTranslation } from "react-i18next";

function Dermatologist() {
  const [dermatologist, setDermatologist] = useState([]);
  const navigate = useNavigate();
  const { t, i18 } = useTranslation()

  useEffect(() => {
    const getDermatologist = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await api.get("/api/dermatologists", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDermatologist(res.data);
      } catch (error) {
        console.log("You do not have any Dermatologist");
      }
    };
    getDermatologist();
  }, []);

  const setDermatologistID = (id) => {
    localStorage.setItem("dermatologistID", id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 px-4 sm:px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-violet-600 dark:text-violet-400 font-semibold mb-2">
            {t("Specialists")}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {t("Your Dermatologists")}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-2">
            {t("Select a dermatologist to view associated cases.")}
          </p>
        </div>

        {dermatologist.length > 0 ? (
          <ul className="grid sm:grid-cols-2 gap-4">
            {dermatologist.map((item) => (
              <li
                key={item.id}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200/60 cursor-pointer hover:shadow-lg hover:ring-violet-300 hover:-translate-y-0.5 transition"
                onClick={() => {
                  setDermatologistID(item.id.toString());
                  navigate("/skin_cases");
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                    {(item.first_name?.[0] || "?").toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-slate-900 dark:text-slate-50 truncate">
                      Dr. {item.first_name} {item.last_name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-0.5">{t("Tap to view cases")}</p>
                  </div>
                  <span className="text-violet-500 opacity-0 group-hover:opacity-100 transition">→</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center bg-white dark:bg-slate-900 rounded-2xl p-12 shadow-sm ring-1 ring-slate-200/60">
            <div className="text-5xl mb-3">🩺</div>
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              {t("There is no Dermatologist yet!")}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-2">
              {t("Check back later or contact your administrator.")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dermatologist;
