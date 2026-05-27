from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        header = request.headers.get("Authorization", "")
        if header.startswith("Bearer "):
            raw_token = header.split(" ")[1]
        else:
            raw_token = request.COOKIES.get("access_token")

        if not raw_token:
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
        except (TokenError, InvalidToken):
            return None

        user = self.get_user(validated_token)
        return user, validated_token