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


# class ConversationModelAdmin(ExportMixin,admin.ModelAdmin):
#     resource_classes=[IncludedFieldOnCsv]

# class displayFormatForPayment(admin.ModelAdmin):
#     list_display=['user','status']

    

# class displayFormatForChatHistory(admin.ModelAdmin):
#     list_display=['user','question_per_day']

class UserDisplay(UserAdmin):
    list_display=['id','first_name','last_name','email','role']
    ordering=['first_name']

# admin.site.register(DailyAssessmentLog,displayFormatForChatHistory)
# admin.site.register(AssessmentRecord,ConversationModelAdmin)
admin.site.register(User,UserDisplay)
# admin.site.register(Patient)
# admin.site.register(SkinCase)
# admin.site.register(Profile)


@admin.register(DailyAssessmentLog)
class DailyAssessmentLogAdmin(admin.ModelAdmin):
    list_display = [
        "id","user","question_per_day",]

    search_fields = [
        "user__username",
        "user__email",
    ]

    list_filter = [
        "question_per_day",
    ]

    ordering = ["-id"]

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ["id","full_name","age","gender","user","created_at",]

    search_fields = [
        "user__first_name",
        "user__email",
        "user__last_name",
        "full_name"
    ]

    list_filter = [
        "gender",
        "created_at",
    ]

    ordering = ["-created_at"]


@admin.register(AssessmentRecord)
class AssessmentRecordAdmin(admin.ModelAdmin):
    list_display = ["id","patient","sender","message_preview","has_image","created_at",]

    search_fields = [
        "patient__full_name",
        "sender",
    ]

    list_filter = [
        "sender",
        "created_at",
    ]

    ordering = ["-created_at"]

    def message_preview(self, obj):
        if obj.message:
            return str(obj.message)[:50]
        return "No Message"

    message_preview.short_description = "Message"

    def has_image(self, obj):
        return bool(obj.image)

    has_image.boolean = True
    has_image.short_description = "Image"


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ["id","user","phone_number","hospital_name","profile_preview","created_at",]

    search_fields = [
        "user__username",
        "user__email",
        "hospital_name",
        "phone_number",
    ]

    list_filter = [
        "created_at",
    ]

    ordering = ["-created_at"]

    def profile_preview(self, obj):
        if obj.profile_image:
            return "Available"
        return "No Image"

    profile_preview.short_description = "Profile Image"


@admin.register(SkinCase)
class SkinCaseAdmin(admin.ModelAdmin):
    list_display = ["id","patient_name","captured_by","assigned_to","status","image_status","created_at",]

    search_fields = [
        "patient_name",
        "captured_by__username",
        "assigned_to__username",
    ]

    list_filter = [
        "status",
        "created_at",
    ]

    ordering = ["-created_at"]

    def image_status(self, obj):
        return bool(obj.image)

    image_status.boolean = True
    image_status.short_description = "Image"
