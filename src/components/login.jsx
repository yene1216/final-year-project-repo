import { useState } from 'react'
import Services from './services/services'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
function LogIn(){
    const {t,i18n}=useTranslation()
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    function LogInHandler(e){
        e.preventDefault()
        const service=new Services()
        service.login(email,password)
    }

    const navigate=useNavigate()

    return <>
    <div className='bg-blue-400 h-[100vh]'>
            <div className="flex flex-col w-[400px] shadow-lg shadow-violet-800 rounded  m-auto p-3 bg-white">
                <button className='text-violet-800 absolute pb-3 cursor-pointer' onClick={()=>{navigate(-1)}}>{t("Back")}</button>
                <form className="flex flex-col" onSubmit={LogInHandler}>
                    <strong>👤<input className='bg-white m-5 p-3 focus:outline-none border border-t-0 border-l-0 border-r-0 border-[3px] border-b-orange-500 text-violet-800'  value={email} onChange={e=>{setEmail(e.target.value)}} type="email" placeholder={t("Email")}/></strong>
                    <strong>🔑<input className='bg-white m-5 p-3  focus:outline-none border border-t-0 border-l-0 border-r-0 border-[3px] border-b-orange-500 text-violet-800' value={password} onChange={e=>{setPassword(e.target.value)}} type='password' placeholder="********"/></strong>
                    <input className='transition duration-500 bg-violet-800 m-5 cursor-pointer p-2 text-white hover:bg-violet-600 rounded' type="submit" value={t("Sign In")}/>
                    <div className="flex flex-row justify-around">
                        <strong className="text-violet-600">{t("Don't You Have An Account ?")}</strong>
                        <a className="text-violet-800 hover:text-blue-900 font-bold" href="sign_up" >{t("Sign Up")}</a>
                    </div>
                </form>
            </div>
            
         </div>
            
    </>
}
export default LogIn