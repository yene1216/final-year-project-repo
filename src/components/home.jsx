
import { Link } from "react-router-dom"
import Ls from '../assets/ls.jpg'
import axios from 'axios'
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
function DashBoard(){
    const { t, i18n } = useTranslation();

    const [userName,setUserName]=useState('')
    useEffect(()=>{
        axios.get('http://localhost:8000/api/user',{withCredentials:true})
        .then(res=>{
            setUserName(res.data.username)
        })

    },[])
    return (
        <>

        <div className="flex flex-col bg-blue-400 h-[100vh]">
            <div className="flex flex-row justify-around">
                <div className="flex flex-col text-white">
                    <h1>{t("AI Diagnostic Support System")}</h1>
                    <h1 > {t("welcome,")} <strong>{userName}</strong> </h1>
                    
                </div>
                

            </div>

            <div className="flex flex-row">
                <img src={Ls} alt="hello" className="w-80"/>
                <div className="flex flex-row justify-around mt-15 w-[70%] m-auto   h-90 bg-white rounded-bl-2xl  rounded-tr-2xl">
                    <div className="w-60  h-70 bg-blue-200 m-auto rounded-tr-3xl rounded-bl-3xl">
                        <Link to='detail' className="bg-yellow-300 w-50 p-2 m-auto cursor-pointer ml-5 mt-30">{t("New Assessment")}</Link>
                    </div>

                    <div className=" w-60 rounded-sm h-70 m-auto bg-blue-200 rounded-tr-3xl rounded-bl-3xl">
                        <Link className="bg-yellow-300 w-50 p-2 m-auto cursor-pointer ml-5 mt-30" to='/follow_up'>{t("Follow Up User")}</Link>
                    </div>
                </div>
            </div>
            

        </div>
        </>
    )
}
export default DashBoard