from django.db import models

# Create your models here.
from django.contrib.auth.models import User,AbstractUser
from django.conf import settings

from django.contrib.auth.models import BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        if self.model.objects.filter(email=email).exists():
            raise ValueError("A user with this email already exists")

        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20,default="General Practitioner")
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = CustomUserManager() 

class DailyAssessmentLog (models.Model):
    user=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    question_per_day=models.IntegerField(default=0)

    def __str__(self):
        
        return f"{self.user} {self.question_per_day}"


class Patient(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    full_name=models.CharField(max_length=255)
    age=models.IntegerField()
    gender=models.CharField(max_length=10,)
    # patient_id=models.CharField(max_length=20)
    def __str__(self):
        return f"{self.user} {self.full_name} {self.age} {self.gender} {self.created_at}"



class AssessmentRecord (models.Model):
    patient  = models.ForeignKey(Patient , on_delete=models.CASCADE)
    sender = models.CharField(max_length=10)
    message = models.JSONField(blank=True, null=True)
    image=models.ImageField(upload_to='Chat_image/',blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient } {self.sender} {self.message}"

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    hospital_name = models.CharField(max_length=255, blank=True, null=True)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} {self.user.first_name} {self.phone_number} {self.created_at} {self.profile_image}"

class SkinCase(models.Model):
    patient_name = models.CharField(max_length=255)
    image = models.ImageField(upload_to='profile_images/')
    captured_by = models.ForeignKey(User,on_delete=models.CASCADE,related_name="captured_cases")
    assigned_to = models.ForeignKey(User,on_delete=models.CASCADE,related_name="assigned_cases")
    status = models.CharField(max_length=10,default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.patient_name}  {self.status} {self.captured_by} {self.image} {self.assigned_to}"
    