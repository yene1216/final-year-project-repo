from django.http import HttpResponse
from .RNNtrainer import RNNTrainer
from .CNNtrainer import CNNTrainer,DataPreparation
import pandas as pd
import numpy as np
import tensorflow as tf    
from sklearn.preprocessing import LabelEncoder
import pickle
from rest_framework.decorators import api_view,permission_classes,authentication_classes
from .models import *
from .serializers import *
from django.contrib.auth import authenticate
import requests
from rest_framework.authtoken.models import Token
import secrets
import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from io import BytesIO
from django.core.files.base import ContentFile
import uuid
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.utils.html import strip_tags
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from rest_framework import status
import random
def RNN_training(request):
    Trainer=RNNTrainer()
    diseases,symptoms=Trainer.prepare_data()
    
    Trainer.train()
    Trainer.save_model()
    return HttpResponse("hello from the server")


def CNNTrainer(request):
    prepare=DataPreparation()
    prepare.load_data()
    prepare.prepare_data()
    CNNTrainer.create_model()
    CNNTrainer.compile_model()
    CNNTrainer.train()
    CNNTrainer.test()
    CNNTrainer.save_model()

class UserView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        return Response({'firstName':request.user.first_name,
                         'lastName':request.user.last_name,
                         'role':request.user.role})  


class Answer_end_point(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        token = request.COOKIES.get("access_token")
        if not token:
            return Response({'success':False})
        user_symptoms=request.data.get("Symptom")
        user_symptoms=user_symptoms.split(",")
        df=pd.read_csv('Disease and symptoms dataset (1).csv')
        symptoms=df.columns.tolist()[1:]
        array_of_zeros=np.zeros(len(symptoms),dtype=np.float32)
        for i,s in enumerate(symptoms):
            if s in user_symptoms:
                array_of_zeros[i] = 1
        
        array_of_zeros = array_of_zeros.reshape(1, -1)
        model=tf.keras.models.load_model("Trained_RNN_model.h5")
        prediction=model.predict(array_of_zeros)[0]
        poss_pred=np.argsort(prediction)[-5:][::-1]
        top_five_conf=prediction[poss_pred]
        with open("RNN_label_encoder.pkl","rb") as f:
            le=pickle.load(f)
        top_five_disease=le.inverse_transform(poss_pred)
        top_five_prediction=[{'disease':disease,'confidence':float(confidence)} for disease,confidence in zip(top_five_disease,top_five_conf)]
        now=datetime.datetime.now().strftime("%I:%M:%S %p")
        patient_id=int(request.data.get("conversationId"))
        patient=Patient.objects.get(id=patient_id,user=request.user)
        AssessmentRecord.objects.create(patient=patient,sender="user",message=",".join(user_symptoms))
        AssessmentRecord.objects.create(patient=patient,sender="bot",message=top_five_prediction)

        if DailyAssessmentLog.objects.filter(user=request.user.id).first() is not None:
                chat=DailyAssessmentLog.objects.filter(user=request.user.id).first()
                chat.question_per_day=int(request.data.get("question_per_day"))
                print("value:",request.data.get("question_per_day"))
                chat.save()
            
        return Response({"message":top_five_prediction,"time":now})


class Answer_CNN(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        if request.headers.get('X-Client-Type') !='mobile':
            token = request.COOKIES.get("access_token")
            if not token:
                return Response({'success':False})
        
        user_patient_image=request.FILES.get('skinImage')
        image_bytes = user_patient_image.read()
        img=tf.keras.utils.load_img(BytesIO(image_bytes),target_size=(128,128))

        image_array=tf.keras.utils.img_to_array(img)/255.0
        array_of_photo = np.array(image_array, dtype='float32')
        img_array = array_of_photo.reshape(1, 128, 128, 3)
        loaded_model=tf.keras.models.load_model('updated skin_cancer_model (1).h5')
        prediction=loaded_model.predict(img_array)
        encoded=np.argmax(prediction,axis=1)
        confidence=prediction[0,encoded]
        
        with open('CNN_label_encoder.pkl','rb') as f:
            decoder=pickle.load(f)
        intent=decoder.inverse_transform(encoded)[0]
        class_map = {
                    'akiec': 'Actinic keratoses and intraepithelial carcinoma (pre‑cancerous / carcinoma)',
                    'bcc': 'Basal cell carcinoma',
                    'bkl': 'Benign',
                    'df': 'Dermatofibroma',
                    'nv': 'Melanocytic nevi',
                    'vasc': 'Vascular lesions',
                    'mel': 'Melanoma'
                }
        high = ['Melanoma']
        medium = ['Basal cell carcinoma', 'Actinic keratoses and intraepithelial carcinoma (pre‑cancerous / carcinoma)']
        low = ['Benign', 'Dermatofibroma', 'Melanocytic nevi', 'Vascular lesions']
     

        high_recommendations = [
            "High Risk — Melanoma: Recommend immediate wide local excision with 1–2 cm margins. Urgent oncology referral indicated.",
            "High Risk — Melanoma: Dermoscopic findings consistent with melanoma. Proceed with excisional biopsy and sentinel lymph node evaluation.",
            "High Risk — Melanoma: Suspicious for invasive melanoma. Stage workup recommended including imaging and oncology consultation.",
            "High Risk — Melanoma: Immediate surgical referral advised. Breslow thickness assessment required post-excision.",
            "High Risk — Melanoma: Malignant features detected. Prioritize complete excision and multidisciplinary team review.",
        ]

        medium_recommendations = {
            'Basal cell carcinoma': [
                "Medium Risk — BCC: Surgical excision recommended. Consider Mohs micrographic surgery for high-risk locations (face, ears).",
                "Medium Risk — BCC: Consistent with basal cell carcinoma. Excision with 3–5 mm margins advised. Low metastatic risk but local invasion possible.",
                "Medium Risk — BCC: Consider topical treatment (imiquimod/5-FU) for superficial BCC or surgical excision for nodular type.",
                "Medium Risk — BCC: Recommend excision and histopathological confirmation. Follow-up in 3 months post-treatment.",
            ],
            'Actinic keratoses and intraepithelial carcinoma (pre‑cancerous / carcinoma)': [
                "Medium Risk — AK/IEC: Pre-cancerous lesion identified. Cryotherapy or topical 5-FU recommended as first-line treatment.",
                "Medium Risk — AK/IEC: Field therapy with imiquimod or photodynamic therapy advised given likely field cancerization.",
                "Medium Risk — AK/IEC: Biopsy recommended to rule out progression to squamous cell carcinoma. Monitor closely.",
                "Medium Risk — AK/IEC: Lesion consistent with actinic keratosis. Treat with cryotherapy and advise strict photoprotection.",
            ]
        }

        low_recommendations = {
            'Benign': [
                "Low Risk — Benign Keratosis: No immediate intervention required. Routine annual skin check advised.",
                "Low Risk — Benign Keratosis: Seborrheic keratosis appearance. Reassure patient, no treatment necessary unless symptomatic.",
                "Low Risk — Benign Keratosis: Benign morphology confirmed. Document and monitor for any future changes.",
                "Low Risk — Benign Keratosis: No malignant features. Patient education on self-monitoring recommended.",
            ],
            'Dermatofibroma': [
                "Low Risk — Dermatofibroma: Benign fibrous lesion. No treatment required unless symptomatic or cosmetically concerning.",
                "Low Risk — Dermatofibroma: Classic dermatofibroma presentation. Simple excision if patient requests removal.",
                "Low Risk — Dermatofibroma: Routine monitoring advised. Reassess if rapid growth or morphological changes occur.",
            ],
            'Melanocytic nevi': [
                "Low Risk — Melanocytic Nevi: Benign nevus. Monitor using ABCDE criteria at next follow-up.",
                "Low Risk — Melanocytic Nevi: No atypical features detected. Annual dermoscopic follow-up recommended.",
                "Low Risk — Melanocytic Nevi: Stable benign nevus. Advise patient on sun protection and self-examination.",
                "Low Risk — Melanocytic Nevi: No intervention needed. Document dermoscopic image for baseline comparison.",
            ],
            'Vascular lesions': [
                "Low Risk — Vascular Lesion: Benign vascular lesion identified. No treatment required unless symptomatic.",
                "Low Risk — Vascular Lesion: Consistent with hemangioma or angiokeratoma. Laser therapy available if cosmetic removal desired.",
                "Low Risk — Vascular Lesion: Routine monitoring advised. No malignant potential detected.",
            ]
        }

        intent = class_map.get(intent, 'Unknown')
        recommendation=None
        if intent in high:
            recommendation = random.choice(high_recommendations)
        elif intent == 'Basal cell carcinoma':
            recommendation = random.choice(medium_recommendations['Basal cell carcinoma'])
        elif intent == 'Actinic keratoses and intraepithelial carcinoma (pre‑cancerous / carcinoma)':
            recommendation = random.choice(medium_recommendations['Actinic keratoses and intraepithelial carcinoma (pre‑cancerous / carcinoma)'])
        elif intent in low:
            recommendation = random.choice(low_recommendations[intent])
        else:
            recommendation = "Classification inconclusive. Manual review recommended."

           
        now=datetime.datetime.now().strftime("%I:%M:%S %p")
        patient_full_name=request.data.get("patientFullName")
        patient_id = None
        if patient_full_name:
            patient = Patient.objects.filter(full_name__icontains=patient_full_name,user=request.user).first()
            if patient:
                patient_id = patient.id
                obj=SkinCase.objects.filter(patient_name=patient_full_name,assigned_to=request.user)
                obj.delete()
            else:
                return Response({"error": "Patient not found"},status=404)
        else:
            patient_id = request.data.get("conversationId")
        patient=Patient.objects.get(id=patient_id,user=request.user)
        django_image = ContentFile(image_bytes, name=f"{uuid.uuid4()}.jpg")
        message=AssessmentRecord.objects.create(patient=patient,sender="user")
        message.image.save(django_image.name, django_image, save=True)
        AssessmentRecord.objects.create(patient=patient,sender="bot",message=intent)
        if DailyAssessmentLog.objects.filter(user=request.user.id).first() is not None:
                chat=DailyAssessmentLog.objects.filter(user=request.user.id).first()
                chat.question_per_day=int(request.data.get("question_per_day"))
                chat.save()

        return Response({"message":intent,'confidence':confidence,"time":now,"recommendation":recommendation})

class SignUpView(APIView):
    permission_classes=[AllowAny]
    authentication_classes=[]
    def post(self,request):
        serialized_user=userSerializer(data=request.data)
        try:
            if serialized_user.is_valid():
                user=serialized_user.save()
                chat_owner=DailyAssessmentLog.objects.create(user=user)
                refresh=RefreshToken.for_user(user)
                access_token=str(refresh.access_token)
                # responser_data={'success':True}
                is_mobile = request.headers.get("X-Client-Type") == "mobile"
                if is_mobile:
                    return Response({
                        "success": True,
                        "access_token": str(refresh.access_token),
                        "refresh_token": str(refresh)
                    }, status=200)

                response = Response({"success": True}, status=201)
                response.set_cookie(
                key="access_token",
                value=str(refresh.access_token),
                httponly=True,
                secure=False,     
                samesite="Lax",
                path="/",
            )

                response.set_cookie(
                    key="refresh_token",
                    value=str(refresh),
                    httponly=True,
                    secure=False,
                    samesite="Lax",
                    path="/",
                    max_age=60*60*24*7
                
                )
                return response
        except ValueError as e:
            return Response({"error":"email already registered"})
        return Response({"success":False})

class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        print(email,password)
        user = authenticate(email=email, password=password)
        if not user:
            return Response({"detail": "Invalid credentials"}, status=401)
        refresh = RefreshToken.for_user(user)
        is_mobile = request.headers.get("X-Client-Type") == "mobile"
        if is_mobile:
            return Response({
                "success": True,
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh)
            }, status=200)

        response = Response({"success": True}, status=200)

        response.set_cookie(
            key="access_token",
            value=str(refresh.access_token),
            httponly=True,
            secure=False,
            samesite="Lax",
            path="/",
        )

        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=False,
            samesite="Lax",
            path="/",
            max_age=60 * 60 * 24 * 7
        )

        return response


class RefreshTokenView(APIView):
    permission_classes = [AllowAny] 
    authentication_classes=[]
    def post(self, request):
        client_type = request.headers.get("X-Client-Type") 
        if client_type == "mobile":
            refresh_token = request.data.get("refresh_token")  
        else:
            refresh_token = request.COOKIES.get("refresh_token") 

        print(refresh_token)
        if not refresh_token:
            return Response({"error": "No refresh token found"}, status=400)
        try:
            token = RefreshToken(refresh_token)
            new_access_token = str(token.access_token)
            response = Response({"access": new_access_token})
            
           
            response.set_cookie(
                key="access_token",
                value=new_access_token,
                httponly=True,
                secure=False,
                samesite="Lax",
                path="/",
            )
            return response
        except Exception as e:
            return Response({"error": str(e)}, status=400)
        



class start_new_conversation(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        header=request.headers.get('X-Client-Type')
        if header !='mobile':
            token=request.COOKIES.get("access_token")
            if not token:
                return Response({"message":"login required"},status=status.HTTP_401_UNAUTHORIZED)
        serialized_patient=SessionSerializer(data=request.data)
        if serialized_patient.is_valid():
            patient=serialized_patient.save(user=request.user)
            try:
                patient_id=patient.id
                id=Patient.objects.get(user=request.user,id=patient_id)
                return Response({"conversation_id":id.id})
            except:
                return Response({'message':'there is no the data associated with this value'})
        else:
            return Response(serialized_patient.errors,status=status.HTTP_400_BAD_REQUEST)
    def get(self,request):
        patient=Patient.objects.filter(user=request.user)
        serializer=SessionSerializer(instance=patient,many=True)
        return Response(serializer.data)
    

@api_view(['DELETE'])    
@permission_classes([IsAuthenticated])
def delete_patient(request,id):
        patient=Patient.objects.get(id=id,user=request.user)
        patient.delete()
        return Response({"success":"delete successfully!"})



class LogoutView(APIView):
    permission_classes = [AllowAny]
    authentication_classes=[]
    def post(self, request):
        response = Response({"message": "Logged out"})
        response.delete_cookie('access_token', path='/')
        response.delete_cookie('refresh_token', path='/')
        return response



class ChatMessageView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        try:
            conversation_id = int(request.GET.get('conversationId'))
            full_name = request.GET.get('fullName')
            filters = {
                "id": conversation_id,
                "user": request.user,
            }
            if full_name:
                filters["full_name"] = full_name
            patient = Patient.objects.get(**filters)
            message=AssessmentRecord.objects.filter(patient=patient)
            chat=TextSerializer(instance=message,many=True)
            return Response(chat.data)
        except:
           return Response({"message":"this patient have no previous history "})
        
class Skin_case_view(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=SkinCaseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(captured_by=request.user)
            return Response({"message":"you have successfully submitted the file"})
        return Response({"message":"you have not submitted successfully" ,"errors":serializer.errors})
    def get(self,request):
        cases=SkinCase.objects.filter(assigned_to=request.user)
        if cases:
            serialized_cases=SkinCaseSerializer(instance=cases,many=True)
            return Response(serialized_cases.data)
        return Response({"message":"You Are Not Allowed To Access this Page"})



User = get_user_model()
@api_view(["POST"])
@permission_classes([AllowAny])
@authentication_classes([])
def request_password_reset(request):
    
    email = request.data.get("email")
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"message": "If the email exists, a reset link will be sent."})

    token = PasswordResetTokenGenerator().make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    reset_link = f"http://localhost:5173/reset-password/{uid}/{token}"  
    if request.headers.get('X-Client-Type') == 'mobile':
         reset_link = f"cameraapp2://reset-password/{uid}/{token}"  

    
    # html_content = f'Click this link to reset your password: <a href="{reset_link}">Reset Password</a>'
    # plan_text=strip_tags(html_content)
    send_mail(
        subject="Password Reset Request",
        message=reset_link,
        from_email="SymptomAI <yenesewenyew47@gmail.com>",
        recipient_list=[email],
        fail_silently=False,
    )
    return Response({"message": "If the email exists, a reset link will be sent."})


@api_view(["POST"])
@permission_classes([AllowAny])
@authentication_classes([])
def confirm_password_reset(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({"error": "Invalid link"}, status=400)

    if not PasswordResetTokenGenerator().check_token(user, token):
        return Response({"error": "Token is invalid or expired"}, status=400)
    
    new_password = request.data.get("new_password")
    user.set_password(new_password)
    user.save()

    return Response({"message": "Password reset successful"})

class dermatologist_list(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        # Dermatoscopist
        print("user role",request.user.role)
        if request.user.role == 'Dermatoscopist':
            user=User.objects.filter(role="Dermatologist")
            serialized=userSerializer(instance=user,many=True)
            return Response(serialized.data)
        return Response({"message":"you are not allowed to see the dermatologist"})

class ProfileView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serialized=ProfileSerializer(data=request.data)
        print(serialized)
        if serialized.is_valid():
            serialized.save(user=request.user)
            return Response({"message":"successfully submitted"},status=200)
        return Response({"message":"could't save"})
    def get(self,request):
        try:
            profile=Profile.objects.get(user=request.user)
            serialized=ProfileSerializer(instance=profile)
            return Response(serialized.data)
        except:
           return Response({"message":"have no profile data"})


    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def updateProfile(request):
    try:
        profile = Profile.objects.get(user=request.user)

        serializer = ProfileSerializer(
            profile,
            data=request.data,
            partial=True   
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Profile.DoesNotExist:
        return Response({"message": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def Search_patients(request):
    fullname=request.GET.get("fullname","")
    patients=Patient.objects.filter(full_name__icontains=fullname,user=request.user)
    serializer=SessionSerializer(instance=patients,many=True)
    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dailyAssessmentLogView(request):

    log = DailyAssessmentLog.objects.filter(user=request.user).first()

    if log is None:
        return Response({'dailyLog': 0})

    return Response({
        'dailyLog': log.question_per_day
    })