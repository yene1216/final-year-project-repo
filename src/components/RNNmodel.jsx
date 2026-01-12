import {  useEffect, useRef, useState } from 'react'
import { FaArrowUp,FaRobot,FaSpinner,FaLaptop,FaCheck,FaStethoscope} from "react-icons/fa";
import {FcAssistant} from 'react-icons/fc'
import {PiWaveform} from 'react-icons/pi'
import { CiCirclePlus } from "react-icons/ci"
import { MdAttachFile } from "react-icons/md"
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaRegCopy } from "react-icons/fa6";
import { FaThumbsUp } from "react-icons/fa";
import { FaThumbsDown } from "react-icons/fa";
import { RiShare2Line } from "react-icons/ri";
import { useTranslation } from 'react-i18next';
function RNN() {
  const {t,i18n}=useTranslation()
  const[conversationId,setConversationId]=useState('')
  const fileReference=useRef(null)
  const [messages,setMessages]=useState([])
  const bottomRef=useRef(null)
  const [Symptom,setSymptom]=useState('')
  const [style,setStyle]=useState('bg-violet-50')
  const InputRef=useRef(null)
  const [permissionForAskAgain,setPermission]=useState(true)
  const [hide,setHideUnhide]=useState("hidden") 
  const [IconColor,setIconColor]=useState('violet')
  const [recordState,setRecordingState]=useState('stopped')
  const [historyMessage,setHistoryMessage]=useState([])
  const [countSymptom,setCountedSymptom] =useState(()=>{
    const NoSymptoms=Number(localStorage.getItem('count')) || 0
    return NoSymptoms
  })
  useEffect(()=>{
    axios.get('http://localhost:8000/api/chat_text',{
      params:{
        "conversationId":sessionStorage.getItem("conversationId")
      },
       withCredentials:true
    })
    .then(res=>{
      // console.log(res.data)
      setHistoryMessage(res.data)
    })
  },[messages])

  

  function handleSearch(){
    if(Symptom !== ''){
          if(Symptom.includes("exit") || Symptom.includes("stop") || Symptom.includes("close")){
              if(Symptom.includes("tab") || Symptom.includes("tab") || Symptom.includes("tab")){
                window.open('http://localhost:5173/closed_tab')
                setSymptom('')
                return 
              }
              setMessages(prev=>[...prev,{user:Symptom,answer:"Okay, I Will Close The Chat Within 2 Seconds",time:"now"}]) 
              setStyle("bg-violet-50")
              setTimeout(()=>{
                setHideUnhide("hidden") 
              },2000)
              setSymptom('')
              return 
          }
          setStyle('bg-black animate-ping')
        }

    if(Symptom === ''){
      return
    }
    
    else if(permissionForAskAgain === true){
      setPermission(false)
     
      setMessages(prev=>[...prev,{user:Symptom,answer:"",time:""}])
      const counted=countSymptom +1
      setCountedSymptom(counted)
      localStorage.setItem("count",counted)

      axios.post('http://localhost:8000/api/chat_with_RNN',
        {"Symptom":Symptom,"conversationId":sessionStorage.getItem("conversationId")},
      {
        withCredentials:true
      })
      .then(response=>{
        console.log(response.data.success)
        setMessages(prev => {
          const newMessages = [...prev]
          const lastMessage = newMessages[newMessages.length - 1]
          lastMessage.answer = response.data.message
          lastMessage.time=response.data.time
          return newMessages
      })

        setPermission(true)
        setStyle('bg-violet-50')
      }) 
    }
    setSymptom('')
  }

  function newChatHandler(){
      setMessages([]) 
      axios.post('http://localhost/api/new_conversation',{},{withCredentials:true})
      .then(response=>{
        sessionStorage.setItem("conversationId",response.data.conversation_id)
      })      
  }

  useEffect(()=>{
    bottomRef.current?.scrollIntoView({behavior:'smooth'})
  },[messages])
  useEffect(()=>{
    window.addEventListener('keydown',()=>{
      InputRef.current?.focus()
    })
  },[])
  
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
      recognition.lang = "en-US"
      recognition.interimResults = false
      recognition.continuous=true
      recognition.onresult = (event) => {
      const text = event.results[0][0].transcript
        setSymptom(text)
       }
      
  function startRecording(){
    recognition.start()

  }

  function stopRecording(){
    recognition.stop()
    // setSymptom('')
  }
    function clickFileinput(){
      fileReference.current?.click()
        }
    const translatedUserMessages = messages.map((message) => {
      if (!message.user) return ""; 
      if (i18n.language === "am") {
        return message.user
          .split(/\s*,\s*/)          
          .map((part) => t(part))    
          .join("፣ ");               
      } else {
        return message.user;        
      }
    });

  
  
  return (
    <>
    
    <div className='flex flex-row bg-blue-400'>
      <div className='overflow-y-scroll h-[96vh] w-[20%] border z-10 flex-col'>
        <div>
        <FaRobot size={34} color='white'/>
        </div>
        <div>
            
        </div>
        
        <button  className='cursor-pointer   text-white flex-row' onClick={newChatHandler}><CiCirclePlus size={24} color='white'/>{t("New Chat")}</button>
        
      </div>

    <div>
        <div className='flex flex-col'>
            <Link className='text-white ml-2 hover:text-blue-300 duration-100' to='/'>{t("Home")}</Link>
            <Link className='text-white ml-2 hover:text-blue-300 duration-100' to='/chat_CNN'>{t("Switch To Cancer")}</Link>
        </div>
    <div  className='w-[500px] absolute bottom-[20vh] right-[25%]  rounded h-[80vh] overflow-y-scroll z-10 bg-violet-50 no-scrollbar'>
        

      <div className='bg-blue-100  w-[80%] mr-20 mt-4 rounded-tr-md rounded-br-md rounded-tl-md p-3 ml-3'>
      <strong className='text-blue-400'><FaLaptop size={24} color='white'/> {t("Hi! I'm HealthScan")}</strong> 
     
        <FaStethoscope size={24} color='blue'/> 
      </div>
      {
        messages.map(message=>(
          
          <div>
            <div className={`bg-blue-200  w-[80%] ml-20 mt-4 rounded-tl-md rounded-tr-md rounded-bl-md p-3 [&::first-letter]:uppercase ${message.user==null?'hidden':null}`}>{translatedUserMessages} </div>
            <div className={`bg-blue-50 w-[80%] mr-20 mt-4 rounded-tr-md rounded-br-md rounded-tl-md p-3 ml-3 [&::first-letter]:uppercase ${message.answer==null?'hidden':null}`}>
           
              <table className={`bg-blue-100  w-[80%] mr-20 mt-4 rounded-tr-md rounded-br-md rounded-tl-md p-3 ml-3 [&::first-letter]:uppercase border ${message.answer==null?'hidden':null}`}>
                <caption>{t("Top Five possible disease")}</caption>
                <thead className='border'>
                  <tr>
                      <th className='border'>{t("Diseases")}</th>
                      <th className='border'>{t("Confidence")} ({t("prob")})</th>
                      <th className='border'>{t("Confidence")} ({t("%")})</th>
                  </tr>
                  
                </thead>
                <tbody >
                      {Array.isArray(message.answer) && message.answer.map((msg,index)=>( 
                        <tr key={index} className='border'>
                          <td className='border'>{i18n.language==='am'?t(msg.disease):msg.disease}</td>
                          <td className='border'>{(msg.confidence * 100)}</td>
                          <td className='border'>{(msg.confidence * 100).toFixed(2)}%</td>
                        </tr>
                      ))}
                      
                </tbody>
                
                </table>
              {message.answer ==='you have hit your daily limit upgrade to pro' && (<a className='bg-blue-400 text-white rounded' href="http://localhost:5173/pay_with_chapa">Premium</a>)} <br/>
                <i className='text-blue-600 font-mono text-xs pb-0'>{message.time} </i>
            </div>

            <div className={`flex flex-row justify-between w-30 ${message.answer==null || message.answer=== ''?'hidden':null}`}>
              <FaRegCopy title='Copy' className='cursor-pointer text-blue-200' onClick={e=>{navigator.clipboard.writeText(message.answer)}} size={20} />
              <FaThumbsUp title='I like it'  className='cursor-pointer text-blue-200' size={18}/>
              <FaThumbsDown title='I dislike it' className='cursor-pointer text-blue-200' size={18} />
              <RiShare2Line title='Share' className='cursor-pointer text-blue-200' size={18} />
            </div>
          </div>
        ))
      }
      <div ref={bottomRef} className={`w-2 h-2 ${style}  rounded-full`}></div>
    </div>

    <div className='flex border border-solid border-blue-600  absolute bottom-16 right-[25%] rounded-full bg-blue-300'>
      <button  className={`cursor-pointer rounded-full hover:shadow shadow-violet-600 duration-100`} onClick={clickFileinput}> <MdAttachFile className=" mr-2 w-9  align-center text-blue-900" /> </button>
      <input  ref={InputRef} onKeyDown={(e)=>{ if(e.key=='Enter'){handleSearch()}}} value={Symptom}  onChange={e=>{setSymptom(e.target.value)}} className='focus:outline-none width-[400px] p-2 w-[400px] bg-white' placeholder={recordState === 'stopped'?t("Symptoms here"):t("On Listening .......")} />
      <button  className={`cursor-pointer  rounded-full hover:shadow shadow-violet-600 duration-100`}> {recordState ==='stopped'? <PiWaveform onClick={()=>{startRecording();setRecordingState("started")}} className=" mr-2 w-9  align-center " size={24} color='blue'/> :<FaCheck onClick={()=>{stopRecording();setRecordingState("stopped")}} className=" mr-2 w-9  align-center" size={20} color='blue'/>}</button>
      <button  className={`cursor-pointer  rounded-full hover:shadow shadow-violet-600  duration-100`} onClick={handleSearch}>{ permissionForAskAgain === true? <FaArrowUp className=" mr-2 w-9  align-center text-blue-900" />:<FaSpinner className=" mr-2 w-9  align-center text-blue-900 animate-spin"/>}</button>
    </div>

    </div>
   </div>

   
    </>
  
  )

}

export default RNN