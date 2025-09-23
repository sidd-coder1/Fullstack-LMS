from rest_framework import generics
from rest_framework.exceptions import ValidationError
from .models import User, Lab, PC, Software, Equipment, MaintenanceLog, Inventory
from .serializers import UserSerializer, LabSerializer, PCSerializer, SoftwareSerializer, EquipmentSerializer, MaintenanceLogSerializer, InventorySerializer
from .permissions import IsAdminOrReadOnly

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrReadOnly]

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrReadOnly]

from rest_framework.permissions import IsAuthenticated

class LabList(generics.ListCreateAPIView):
    queryset = Lab.objects.all()
    serializer_class = LabSerializer
    permission_classes = [IsAuthenticated]

class LabDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Lab.objects.all()
    serializer_class = LabSerializer
    permission_classes = [IsAuthenticated]

class PCList(generics.ListCreateAPIView):
    queryset = PC.objects.all()
    serializer_class = PCSerializer
    permission_classes = [IsAuthenticated]

class PCDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = PC.objects.all()
    serializer_class = PCSerializer
    permission_classes = [IsAuthenticated]

class LabPCList(generics.ListCreateAPIView):
    serializer_class = PCSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        lab_id = self.kwargs['lab_id']
        return PC.objects.filter(lab=lab_id)

    def perform_create(self, serializer):
        lab_id = self.kwargs['lab_id']
        # Get the lab instance
        try:
            lab = Lab.objects.get(id=lab_id)
            serializer.save(lab=lab)
        except Lab.DoesNotExist:
            raise ValidationError({'lab': 'Lab not found'})

class SoftwareList(generics.ListCreateAPIView):
    queryset = Software.objects.all()
    serializer_class = SoftwareSerializer
    permission_classes = [IsAuthenticated]

class SoftwareDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Software.objects.all()
    serializer_class = SoftwareSerializer
    permission_classes = [IsAuthenticated]

class EquipmentList(generics.ListCreateAPIView):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [IsAuthenticated]

class EquipmentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [IsAuthenticated]

class MaintenanceLogList(generics.ListCreateAPIView):
    queryset = MaintenanceLog.objects.all()
    serializer_class = MaintenanceLogSerializer
    permission_classes = [IsAuthenticated]

class MaintenanceLogDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = MaintenanceLog.objects.all()
    serializer_class = MaintenanceLogSerializer
    permission_classes = [IsAuthenticated]

class InventoryList(generics.ListCreateAPIView):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [IsAuthenticated]

class InventoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [IsAuthenticated]
