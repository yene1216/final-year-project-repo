import api from '../../api/Intercepter'
import { useNavigate } from 'react-router-dom'
class Services{

    login(email,password,navigate){
        
        api.post("/api/log_in",{'email':email.toLowerCase(),'password':password},{withCredentials:true})
        .then(response=>{
            if(response.data.success){
                const questionPerDay=localStorage.setItem("questionPerDay",1)
                navigate('/')
                
            }
            
        })
    }
    signup(firstName,lastName,email,password,role,navigate){
        
        api.post("/api/sign_up",{'first_name':firstName,'last_name':lastName,'email':email.toLowerCase(),'password':password,'role':role})
        .then(response=>{
            console.log(response.data.success)
            if(response.data.success){
                const questionPerDay=localStorage.setItem("questionPerDay",1)
                navigate("/")

            }
        })
        
    }
}
export default Services