from rest_framework import serializers
from .models import User, Lab, PC, Equipment, Software, MaintenanceLog, Inventory
from django.contrib.auth.password_validation import validate_password

# ------------------ User ------------------
class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'role')

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            role=validated_data['role']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

# ------------------ Lab ------------------
class LabSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lab
        fields = '__all__'

# ------------------ PC ------------------
class PCSerializer(serializers.ModelSerializer):
    class Meta:
        model = PC
        fields = '__all__'

# ------------------ Equipment ------------------
class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = '__all__'

# ------------------ Software ------------------
class SoftwareSerializer(serializers.ModelSerializer):
    class Meta:
        model = Software
        fields = '__all__'

# ------------------ MaintenanceLog ------------------
class MaintenanceLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceLog
        fields = '__all__'

# ------------------ Inventory ------------------
class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = '__all__'
