from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import User, Lab, PC, Equipment, Software, MaintenanceLog, Inventory
from .serializers import (
    UserRegisterSerializer, LabSerializer, PCSerializer, EquipmentSerializer,
    SoftwareSerializer, MaintenanceLogSerializer, InventorySerializer
)

# ------------------ User Registration ------------------
class UserRegisterView(generics.CreateAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]

# ------------------ Lab CRUD ------------------
class LabListCreateView(generics.ListCreateAPIView):
    queryset = Lab.objects.all()
    serializer_class = LabSerializer

class LabRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Lab.objects.all()
    serializer_class = LabSerializer

# ------------------ PC CRUD ------------------
class PCListCreateView(generics.ListCreateAPIView):
    serializer_class = PCSerializer

    def get_queryset(self):
        lab_id = self.kwargs['lab_id']
        return PC.objects.filter(lab_id=lab_id)

    def perform_create(self, serializer):
        lab_id = self.kwargs['lab_id']
        serializer.save(lab_id=lab_id)

class PCRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PC.objects.all()
    serializer_class = PCSerializer

# ------------------ Equipment CRUD ------------------
class EquipmentListCreateView(generics.ListCreateAPIView):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer

class EquipmentRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer

# ------------------ Software CRUD ------------------
class SoftwareListCreateView(generics.ListCreateAPIView):
    queryset = Software.objects.all()
    serializer_class = SoftwareSerializer

class SoftwareRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Software.objects.all()
    serializer_class = SoftwareSerializer

# ------------------ MaintenanceLog CRUD ------------------
class MaintenanceLogListCreateView(generics.ListCreateAPIView):
    queryset = MaintenanceLog.objects.all()
    serializer_class = MaintenanceLogSerializer

class MaintenanceLogRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MaintenanceLog.objects.all()
    serializer_class = MaintenanceLogSerializer

# ------------------ Inventory CRUD ------------------
class InventoryListCreateView(generics.ListCreateAPIView):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer

class InventoryRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
