import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import { useTranslation } from "react-i18next";
    
function PatientDetail(){

    const [PatientName,setPatientName]=useState('')
    const [Age,setAge]=useState('')
    const [PatientGender,setPatientGender]=useState('')
    const [PatientId,setPatientId]=useState('')
    const [ConversationId,setConversationId]=useState('')
    function SubmitHandler(e){
        e.preventDefault()
        axios.post('http://localhost:8000/api/new_conversation',{'full_name':PatientName,'age':Age,'gender':PatientGender,'patient_id':PatientId},{withCredentials:true})
        .then(response=>{
            const newId = response.data.conversation_id;
            sessionStorage.setItem("conversationId", newId);
            setConversationId(newId); 
            console.log(response.data.conversation_id)
            
        })
     }
  
    const navigate=useNavigate()
    const { t, i18n } = useTranslation();
    return <>
    <div className="bg-blue-400 h-[100vh] pt-20">
        <div className=" flex flex-col w-[600px] shadow-lg shadow-violet-800 rounded  m-auto bg-white p-3">
            
            <form onSubmit={SubmitHandler} className=" flex flex-col">
                <input className='bg-white m-5 p-3 w-[80%] focus:outline-none border border-t-0 border-l-0 border-r-0 border-[3px] border-b-orange-500 text-violet-800 ' value={PatientName} onChange={e=>{setPatientName(e.target.value)}} type="text" placeholder={t("Patient's full name")}/>
                <input className='bg-white m-5 p-3 w-[80%]  focus:outline-none border border-t-0 border-l-0 border-r-0 border-[3px] border-b-orange-500 text-violet-800'  value={Age} onChange={e=>{setAge(e.target.value)}} type="number" placeholder={t("Patient Age")}/>
                <input className='bg-white m-5 p-3 w-[80%]  focus:outline-none border border-t-0 border-l-0 border-r-0 border-[3px] border-b-orange-500 text-violet-800'  value={PatientGender} onChange={e=>{setPatientGender(e.target.value)}} type="text" placeholder={t("Patient Gender")}/>
                <input className='bg-white m-5 p-3 w-[80%]   focus:outline-none border border-t-0 border-l-0 border-r-0 border-[3px] border-b-orange-500 text-violet-800' value={PatientId} onChange={e=>{setPatientId(e.target.value)}} type='number' placeholder={t("Patient Id")}/>
                
                <div className="flex flex-row justify-around">
                    <button className='text-violet-800  pb-3 cursor-pointer font-bold' onClick={()=>{navigate(-1)}}>{t("Back")}</button>
                    <input className=" cursor-pointer text-violet-800 hover:text-blue-900 font-bold"  type="submit" value={t("Continue")}/>
                </div>
            </form>
        </div>
    </div>
    </>
}
export default PatientDetail