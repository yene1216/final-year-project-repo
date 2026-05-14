from django.contrib import admin

from django.contrib.auth.admin import UserAdmin
from import_export.admin import ExportMixin
from import_export import resources,fields
from import_export.widgets import ForeignKeyWidget
from .models import DailyAssessmentLog,AssessmentRecord,Patient,User,SkinCase,Profile
class IncludedFieldOnCsv(resources.ModelResource):
    age=fields.Field(
        column_name='patient_age',
        attribute='conversation',
        widget=ForeignKeyWidget(Patient,'age')
    )
    gender=fields.Field(
        column_name='patient_gender',
        attribute='conversation',
        widget=ForeignKeyWidget(Patient,'gender')

    )
    class Meta:
        model=AssessmentRecord
        fields=['age','gender','message']
    def dehydrate_message(self,msgObj):
        if msgObj.sender=='user':
            return msgObj.message
        
        return None


class ConversationModelAdmin(ExportMixin,admin.ModelAdmin):
    resource_classes=[IncludedFieldOnCsv]

class displayFormatForPayment(admin.ModelAdmin):
    list_display=['user','status']

    

class displayFormatForChatHistory(admin.ModelAdmin):
    list_display=['user','question_per_day']

class UserDisplay(UserAdmin):
    list_display=['first_name','last_name','email','role']
    ordering=['first_name']

admin.site.register(DailyAssessmentLog,displayFormatForChatHistory)
admin.site.register(AssessmentRecord,ConversationModelAdmin)
admin.site.register(User,UserDisplay)
admin.site.register(Patient)
admin.site.register(SkinCase)
admin.site.register(Profile)
