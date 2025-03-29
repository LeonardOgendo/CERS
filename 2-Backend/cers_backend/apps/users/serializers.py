from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser, UserProfile, LOCATION_CHOICES

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        required=True,
        style={"input_type": "password"}
    )

    identifier = serializers.CharField(required=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'identifier', 'first_name', 'last_name', 'email', 'role', 'password']

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = CustomUser.objects.create_user(password=password, **validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(identifier=data['identifier'], password=data['password'])
        if not user:
            raise serializers.ValidationError('Invalid credentials, please try again')
        if not user.is_active:
            raise serializers.ValidationError('Your account is inactive. Contact support.')
        return user

class ProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    role = serializers.CharField(source='user.role', read_only=True)
    location = serializers.ChoiceField(choices=LOCATION_CHOICES, required=False)

    def get_profile_picture(self, obj):
        if obj.profile_picture:
            return self.context['request'].build_absolute_uri(obj.profile_picture.url)
        return None

    class Meta:
        model = UserProfile
        fields = [
            'id', 'first_name', 'last_name', 'email', 'role',
            'phone_number', 'date_of_birth', 'profile_picture',
            'location', 'address', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class LocationSerializer(serializers.ModelSerializer):
    location = serializers.ChoiceField(choices=LOCATION_CHOICES, required=True)

    class Meta:
        model = UserProfile
        fields = ['location', 'address']

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, min_length=8, write_only=True)
    confirm_password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords don't match")
        validate_password(data['new_password'])
        return data