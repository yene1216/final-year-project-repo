import { Link } from "react-router-dom"
import Doctor from '../assets/doctor.jpg'
import Ls from '../assets/ls.jpg'
import axios from 'axios'
function Home1(){
    return (
        <>
        <div className="flex flex-col bg-blue-400 h-[100vh]">
            <div className="flex flex-row justify-around">
                <div className="flex flex-col text-white">
                    <h1>AI Diagnostic Support System</h1>
                    <h1 >welcome, yenesew </h1>
                </div>
                

            </div>

            <div className="flex flex-row">
                {/* <img src={Ls} alt="hello" className="w-80"/> */}
                <div className="flex flex-row justify-around mt-15 w-[70%] m-auto   h-90 bg-white rounded-bl-2xl  rounded-tr-2xl">
                    <div className="w-60  h-70 bg-blue-200 m-auto rounded-tr-3xl rounded-bl-3xl">
                    CNN
                    <h1 className="text-white">Skin cancer detection only </h1>
                    <h2>Upload the photo of the skin lesion</h2>
                    <button className="bg-yellow-300 w-20 p-2 m-auto cursor-pointer">
                            <Link to={'/chat_CNN'}>Start</Link>
                    </button>
                    
                    </div>
                    <div className=" w-60  h-70 m-auto bg-blue-200 rounded-tr-3xl rounded-bl-3xl">
                        RNN
                        <h1>Symptom disease detection from 773 disease <br/> Enter patient symptom in text</h1>
                        <button className="bg-yellow-300 w-20 p-2 m-auto cursor-pointer">
                                <Link to={'/chat_RNN'}>Start</Link>
                        </button>
                        
                    </div>
                </div>
            </div>
            <div>
                <h1 className="text-white mb-0">
                    Small note - Patient details like age, <br/>
|                   gender, skin type can be added in next step
                </h1>
            </div>
            

        </div>
        </>
    )
}
export default Home1