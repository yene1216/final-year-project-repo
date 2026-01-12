import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Payment(){
        if(localStorage.getItem('token') === null){
            location.pathname='log_in'
        }
        const [firstName,setFirstname]=useState('')
        const [lastName,setLastname]=useState('')
        const [Email,setEmail]=useState('')
        const [phoneNumber,setPhonenumber]=useState('')
        const [Amount,setAmount]=useState(199)
        function handleClick(e){
            e.preventDefault()
            axios.post('http://127.0.0.1:8000/api/pay_with_chapa',{
                "firstName":firstName,
                'lastName':lastName,
                "Email":Email,
                "phoneNumber":phoneNumber,
                "Amount":Amount,


            })
            .then(result=>{
                console.log(result.data.data.checkout_url)
                window.location.href=result.data.data.checkout_url
            })
        }
        const navigate=useNavigate()

        return(
            <>
            <div className="flex flex-col w-[400px] shadow-lg shadow-violet-800 rounded  m-auto p-3">
                <button className='text-violet-800 absolute pb-3 cursor-pointer' onClick={()=>{navigate(-1)}}>Back</button>
                <form onSubmit={handleClick} className="flex flex-col p-5">
                    <input value={firstName} onChange={e=>{setFirstname(e.target.value)}} className='bg-white m-5 m-5 p-3 focus:outline-none border border-t-0 border-l-0 border-r-0 border-[3px] border-b-orange-500 text-violet-800' type="text" placeholder="First Name"/>
                    <input value={lastName} onChange={e=>{setLastname(e.target.value)}} className='bg-white m-5 m-5 p-3 focus:outline-none border border-t-0 border-l-0 border-r-0 border-[3px] border-b-orange-500 text-violet-800' type="text" placeholder="Last Name"/>
                    <input value={Email} onChange={e=>{setEmail(e.target.value)}} className='bg-white m-5 m-5 p-3 focus:outline-none border border-t-0 border-l-0 border-r-0 border-[3px] border-b-orange-500 text-violet-800' type="email" placeholder="Email"/>
                    <input value={phoneNumber} onChange={e=>{setPhonenumber(e.target.value)}} className='bg-white m-5 m-5 p-3 focus:outline-none border border-t-0 border-l-0 border-r-0 border-[3px] border-b-orange-500 text-violet-800' type="text" placeholder="Phone number"/>
                    <input className="bg-green-800 p-2 text-white transition duration-150 hover:bg-green-600 cursor-pointer" type="submit" value='Pay 💳 With Chapa'/>
                </form>
            </div>
            </>
        )
}
export default Payment