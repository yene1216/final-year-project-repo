import axios from 'axios'


class Services{
    login(email,password){
        axios.post("http://localhost:8000/api/log_in",{'email':email,'password':password},{withCredentials:true})
        .then(response=>{
            if(response.data.success){
                location.pathname='/'
            }
            
        })
    }
    signup(firstName,lastName,email,password){
        axios.post("http://localhost:8000/api/sign_up",{'first_name':firstName,'last_name':lastName,'email':email,'password':password})
        .then(response=>{
            console.log(response.data.success)
            if(response.data.success){
                location.pathname='/'

            }
        })
        
    }
}
export default Services