import { useState } from "react"
import Services from "./services/services.jsx"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
function SignUp(){
    const {t,i18n}=useTranslation()

    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [firstName,setFirstName]=useState('')
    const [lastName,setLastName]=useState('')

    function SignUpHandler(e){
        e.preventDefault()
        const service =new Services()
        service.signup(firstName,lastName,email,password)
    }
    const navigate=useNavigate()
    return <>
    
    <div className="flex flex-col w-[400px] shadow-lg shadow-violet-800 rounded  m-auto mt-[20vh] p-3">
        <button className='text-violet-800 absolute pb-3 cursor-pointer' onClick={()=>{navigate(-1)}}>{t("Back")}</button>
        <form className="flex flex-col" onSubmit={SignUpHandler}>
            <strong>👤<input className='bg-white m-5 m-5 p-3 focus:outline-none border border-t-0 border-l-0 border-r-0 border-[3px] border-b-orange-500 text-violet-800' value={firstName} onChange={e=>{setFirstName(e.target.value)}} type="text" placeholder={t('first name')}/></strong>
            <strong>👤<input className='bg-white m-5 m-5 p-3 focus:outline-none border border-t-0 border-l-0 border-r-0 border-[3px] border-b-orange-500 text-violet-800' value={lastName} onChange={e=>{setLastName(e.target.value)}} type="text" placeholder={t('last name')}/></strong>
            <strong>📧<input className='bg-white m-5 p-3 focus:outline-none border border-t-0 border-l-0 border-r-0 border-[3px] border-b-orange-500 text-violet-800'  value={email} onChange={e=>{setEmail(e.target.value)}} type="email" placeholder={t("Email")}/></strong>
            <strong>🔑<input className='bg-white m-5 p-3  focus:outline-none border border-t-0 border-l-0 border-r-0 border-[3px] border-b-orange-500 text-violet-800' value={password} onChange={e=>{setPassword(e.target.value)}} type='password' placeholder="********"/></strong>
            <input className='transition duration-500 bg-violet-800 m-5 cursor-pointer p-2 text-white hover:bg-violet-600 rounded' type="submit" value={t('Sign Up')}/>
            <div className="flex flex-row justify-around">
                <strong className="text-violet-600">{t("Have An Account ?")}</strong>
                <a className="text-violet-800 hover:text-blue-900 font-bold" href="log_in" >{t("Sign In")}</a>
            </div>
        </form>
    </div>
    </>
}
export default SignUp