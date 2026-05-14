from django.apps import AppConfig
import os
from apscheduler.schedulers.background import BackgroundScheduler




def reset_questions_per_day():
    from .models import DailyAssessmentLog
    DailyAssessmentLog.objects.all().update(question_per_day=0)

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        if os.environ.get("RUN_MAIN") != "true":
            return
        scheduler = BackgroundScheduler()
        scheduler.add_job(
            reset_questions_per_day,
            trigger='cron',
            hour=0,
            minute=0
        )
        scheduler.start()