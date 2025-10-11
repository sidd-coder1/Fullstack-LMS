from rest_framework import generics
from rest_framework.exceptions import ValidationError
from .models import User, Lab, PC, Software, Equipment, MaintenanceLog, Inventory
from .serializers import UserSerializer, LabSerializer, PCSerializer, SoftwareSerializer, EquipmentSerializer, MaintenanceLogSerializer, InventorySerializer
from .permissions import IsAdminOrReadOnly, AllowAuthenticatedReadAndCreateElseAdmin

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
    permission_classes = [IsAdminOrReadOnly]

class LabDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Lab.objects.all()
    serializer_class = LabSerializer
    permission_classes = [IsAdminOrReadOnly]

class PCList(generics.ListCreateAPIView):
    queryset = PC.objects.all()
    serializer_class = PCSerializer
    permission_classes = [IsAdminOrReadOnly]

class PCDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = PC.objects.all()
    serializer_class = PCSerializer
    permission_classes = [IsAdminOrReadOnly]

class LabPCList(generics.ListCreateAPIView):
    serializer_class = PCSerializer
    permission_classes = [IsAdminOrReadOnly]

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
    permission_classes = [IsAdminOrReadOnly]

class SoftwareDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Software.objects.all()
    serializer_class = SoftwareSerializer
    permission_classes = [IsAdminOrReadOnly]

class EquipmentList(generics.ListCreateAPIView):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [IsAdminOrReadOnly]

class EquipmentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [IsAdminOrReadOnly]

class MaintenanceLogList(generics.ListCreateAPIView):
    queryset = MaintenanceLog.objects.all()
    serializer_class = MaintenanceLogSerializer
    permission_classes = [AllowAuthenticatedReadAndCreateElseAdmin]

    def perform_create(self, serializer):
        # Ensure students can only create complaints; set controlled fields
        serializer.save(
            reported_by=self.request.user,
            status='pending',
            status_after=None,
            fixed_by=None,
            fixed_on=None,
        )

class MaintenanceLogDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = MaintenanceLog.objects.all()
    serializer_class = MaintenanceLogSerializer
    permission_classes = [AllowAuthenticatedReadAndCreateElseAdmin]

class InventoryList(generics.ListCreateAPIView):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [IsAdminOrReadOnly]

class InventoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [IsAdminOrReadOnly]
