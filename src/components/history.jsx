import axios from "axios"
import { useEffect, useState } from "react"
import { FaRegCopy } from "react-icons/fa6";
import { FaThumbsUp } from "react-icons/fa";
import { FaThumbsDown } from "react-icons/fa";
import { RiShare2Line } from "react-icons/ri";
import { useTranslation } from "react-i18next";
function History(){
    const [showFollowUpButton,setShowFollowUpButton]=useState('hidden')
    const [Patient,setPatient]=useState([])
    const [HistoryMessage,setHistoryMessage]=useState([])
    useEffect(()=>{
        axios.get('http://localhost:8000/api/new_conversation',{withCredentials:true})
        .then(res=>{
                console.log(res.data)
                setPatient(res.data)
        })

    },[])
    function PreviousChat(conversationId,fullName){
            axios.get('http://localhost:8000/api/chat_text',{
            params:{
                "conversationId":conversationId,
                "fullName":fullName
            },
            withCredentials:true
            })
            .then(res=>{
            console.log(res.data)
             setHistoryMessage(prev => [...prev, ...(Array.isArray(res.data) ? res.data : [res.data])])
            
            })

    }
    const {t,i18n}=useTranslation()
  
    return (
        <>
        <div className="flex flex-row justify-around bg-blue-400 h-[100vh]">
            <div className="flex-1 bg-white">
                <input className="p-2 border border-blue-400 focus:outline-none w-[100%] rounded-2xl mt-5" type="search" placeholder={t("Search Patient")}/>
                {
                    Patient.map((p,index)=>(
                        <div key={index} onClick={()=>{PreviousChat(p.id,p.full_name);sessionStorage.setItem('conversationId',p.id);setShowFollowUpButton(null)}} className="bg-blue-200 w-[100%] h-[20vh] rounded-bl-3xl rounded-tr-3xl cursor-pointer m-4">
                            <h1>{p.full_name}</h1>
                        </div>
                        
                    ))
                }
            </div>
            <div className="flex-3">
                <div className="w-[90%] h-[100vh] bg-white m-auto overflow-y-scroll">
                   
                    <h1 className="text-blue-500">Follow Up Your Patient Here </h1>
                    {
                        HistoryMessage.map((h,index)=>(
                                    Array.isArray(h.message) && h.sender==='bot' ?(
                                    <table key={index} className={`bg-blue-100  w-[80%] mr-20 mt-4 rounded-tr-md rounded-br-md rounded-tl-md p-3 ml-3 [&::first-letter]:uppercase border mb-10`}>
                                        <caption>{t("Top Five possible disease")}</caption>
                                        <thead className='border'>
                                            <tr>
                                                <th className='border'>{t("Diseases")}</th>
                                                <th className='border'>{t("Confidence")}({t("prob")})</th>
                                                <th className='border'>{t("Confidence")}( {t("%")})</th>
                                            </tr>
                                        
                                        </thead>
                                        <tbody >
                                            {h.message.map((msg,index)=>( 
                                                <tr key={index} className='border'>
                                                    <td className='border'>{i18n.language==='am'?t(msg.disease):msg.disease}</td>
                                                    <td className='border'>{(msg.confidence * 100)}</td>
                                                    <td className='border'>{(msg.confidence * 100).toFixed(2)}%</td>
                                                </tr>
                                            ))}
                                            
                                        </tbody>
                                        
                                    </table>
                                    )
                                    :(<div className={`${h.sender==='bot'?('bg-blue-100  w-[80%] mr-20 mt-4 rounded-tr-md rounded-br-md rounded-tl-md p-3 ml-3 [&::first-letter]:uppercase  mb-10'): ('bg-blue-200  w-[80%] ml-20 mt-4 rounded-tl-md rounded-tr-md rounded-bl-md p-3 [&::first-letter]:uppercase' )} `}>{h.message !==null?(i18n.language ==='am'?t(h.message):(h.message)):(<img className="w-[70%]" src={`http://localhost:8000/${h.image}`} alt="image of the skin"/>)}</div>)
                                   
                        ))
                    }
                    <button
                            className={`absolute bottom-8 right-8 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium shadow-lg hover:bg-blue-700 transition cursor-pointer ${showFollowUpButton}`}
                            onClick={() => (window.location.pathname = '/home2')}
                        >
                            Follow Up →
                    </button>
                </div>
                
            </div>
         </div>
        </>
    )
}
export default History