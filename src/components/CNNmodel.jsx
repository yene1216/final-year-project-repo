import { Link, useSearchParams } from "react-router-dom"
import axios from 'axios'
import { useState,useEffect } from "react"
function CNN(){
    const [result,setResult]=useState([])
    const [file,setFile]=useState(null)
    

    const conversationId=sessionStorage.getItem('conversationId')
    function submissionHandler(e){
        e.preventDefault()
        const formData = new FormData()
        formData.append("skinImage", file)
        formData.append("conversationId", conversationId)
        
        axios.post('http://localhost:8000/api/chat_with_CNN', formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        withCredentials:true
        })
        .then(response=>{
        setResult(prev=>{
            const newResult=[...prev]
            const lastResult=newResult[newResult.length -1]
            lastResult.message=response.data.message
            lastResult.confidence=response.data.confidence
            lastResult.time=response.data.time
            return newResult
        })
        }) 
    }

    const objectUrl = URL.createObjectURL(file);
    return (
        <>
        <div className="bg-blue-400 h-[100vh] text-white">
            <div>
                <Link to='/'>Home</Link>
            </div>
            <div>
                <h1>upload the image of the skin for prediction for cancer disease</h1>
                <div>
                    {
                        
                        <div>
                            <img  src={objectUrl} alt="skin image"/>
                            <div className= 'text-black bg-blue-100  w-[80%] mr-20 mt-4 rounded-tr-md rounded-br-md rounded-tl-md p-3 ml-3 [&::first-letter]:uppercase border'>
                                <table>
                                    <thead className="border">
                                        <tr className="border">
                                            <th className="border">Disease</th>
                                            <th className="border">Confidence (%)</th>
                                        </tr>
                                        
                                    </thead>
                                    <tbody className="border">
                                        <tr className="border">
                                            <td className="border">{result.message}</td>
                                            <td className="border">{result.confidence *100}%</td>
                                        </tr>
                                        
                                    </tbody>
                                </table>
                                <div>{result.time}</div>
                            </div>
                            
                        </div>
                    }
                </div>
                <form onSubmit={submissionHandler}>
                    <input className='bg-orange-500 cursor-pointer' onChange={e=>{setFile(e.target.files[0])}} type="file"/>
                    <input className='cursor-pointer' type="submit" value='send' />
                </form>

                
            </div>
        </div>
        
        </>
    )
}
export default CNN