from rest_framework import serializers
from .models import DailyAssessmentLog,AssessmentRecord,Patient,SkinCase,Profile
from django.contrib.auth import get_user_model
User = get_user_model()

class userSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    class Meta:
        model=User
        fields=['id','first_name','last_name','email','password','role']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model=DailyAssessmentLog
        fields=['user','question_per_day']
        read_only_fields=['user','question_per_day']

class TextSerializer(serializers.ModelSerializer):
    class Meta:
        model=AssessmentRecord
        fields=['sender','message','image','created_at']
       
class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model=Patient
        fields=['id','full_name','age','gender','patient_id']

class SkinCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model=SkinCase
        fields=['id','patient_name','image','captured_by','assigned_to','status','created_at']
        read_only_fields=['id','captured_by','status','created_at']

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model= Profile
        fields=['phone_number','hospital_name','profile_image']
        # extra_kwargs = {
        #     'phone_number': {'required': False},
        #     'hospital_name': {'required': False},
        #     'profile_image': {'required': False},
        # }
