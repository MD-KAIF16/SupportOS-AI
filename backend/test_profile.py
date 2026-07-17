from app.services.profile_service import profile_service

user_id = "11111111-1111-1111-1111-111111111111"

profile = profile_service.get_profile(user_id)

print(profile)