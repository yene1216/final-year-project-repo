import LogIn from './components/login';
import SignUp from './components/signup';
import {BrowserRouter,Routes,Route,Link} from 'react-router-dom'
import Home1 from './components/home1';
import Payment from './components/payment';
import Closed from './components/closedtab';
import RNN from './components/RNNmodel';
import CNN from './components/CNNmodel';
import DashBoard from './components/home';
import PatientDetail from './components/patientdetail';
import History from './components/history';
import { useTranslation } from "react-i18next";

function App() {
    const { t, i18n } = useTranslation();
    function logOut(){
    axios.post('http://localhost:8000/api/log_out',{},{withCredentials:true})
    .then(res=>{
      console.log(res.data)
      if(res.data.message ==='Logged out'){
        location.pathname='/log_in'
      }
    })
  }
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'am', label: 'አማርኛ' },
    { code: 'or', label: 'Afaan Oromoo' },
    { code: 'ti', label: 'ትግርኛ' },
    { code: 'es', label: 'Español' },
  ];
   
  return (
    <>
    <div className='flex flex-row'>
      <select value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)}>
      {
      languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>

      ))}
    </select>
      
      <button onClick={logOut} className='bg-blue-400 text-white absolute right-20 cursor-pointer p-2 rounded-2xl'>{t("Logout")}</button>
    </div>
    <BrowserRouter>
    <Routes>
      <Route path='log_in' element={<LogIn/>}/>
      <Route path='closed_tab' element={<Closed/>}/>
      <Route path='sign_up' element={<SignUp/>}/>
      <Route path='/' element={<DashBoard/>}/>
      <Route path='home2' element={<Home1/>}/>
      <Route path='pay_with_chapa' element={<Payment/>}/>
      <Route path='chat_RNN' element={<RNN/>}/>
      <Route path='chat_CNN' element={<CNN/>}/>
      <Route path='detail' element={<PatientDetail/>}/>
      <Route path='follow_up' element={<History/>}/>

    </Routes>
    
    </BrowserRouter>
    </>
  )

}


export default App
