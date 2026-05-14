from django.urls import path
from . import views

urlpatterns=[
    
    path('rnn_train',views.RNN_training),
    path("chat_with_RNN",views.Answer_end_point.as_view()),
    path('chat_with_CNN',views.Answer_CNN.as_view()),
    path("sign_up",views.SignUpView.as_view()),
    path("log_in", views.LoginView.as_view()),
    path("new_conversation",views.start_new_conversation.as_view()),
    path("log_out",views.LogoutView.as_view()),
    path("chat_text",views.ChatMessageView.as_view()),
    path('user',views.UserView.as_view()),
    path('skin_case',views.Skin_case_view.as_view()),
    path('dermatologists',views.dermatologist_list.as_view()),
    path('profile',views.ProfileView.as_view()),
    path("updateProfile",views.updateProfile),
    path('refresh',views.RefreshTokenView.as_view()),
    path("password-reset/", views.request_password_reset),
    path("password-reset-confirm/<uidb64>/<token>/", views.confirm_password_reset),
    path("search_patient",views.Search_patients),
    path("daily_log",views.dailyAssessmentLogView),
    path("delete/<int:id>",views.delete_patient),
]