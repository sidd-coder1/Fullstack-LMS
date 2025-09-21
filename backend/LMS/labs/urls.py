from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Auth
    path('register/', UserRegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Lab CRUD
    path('labs/', LabListCreateView.as_view(), name='lab-list-create'),
    path('labs/<int:pk>/', LabRetrieveUpdateDeleteView.as_view(), name='lab-rud'),

    # PC CRUD
    path('labs/<int:lab_id>/pcs/', PCListCreateView.as_view(), name='pc-list-create'),
    path('pcs/<int:pk>/', PCRetrieveUpdateDeleteView.as_view(), name='pc-rud'),

    # Equipment CRUD
    path('equipments/', EquipmentListCreateView.as_view(), name='equipment-list-create'),
    path('equipments/<int:pk>/', EquipmentRetrieveUpdateDeleteView.as_view(), name='equipment-rud'),

    # Software CRUD
    path('software/', SoftwareListCreateView.as_view(), name='software-list-create'),
    path('software/<int:pk>/', SoftwareRetrieveUpdateDeleteView.as_view(), name='software-rud'),

    # Maintenance Logs CRUD
    path('maintenance/', MaintenanceLogListCreateView.as_view(), name='maintenance-list-create'),
    path('maintenance/<int:pk>/', MaintenanceLogRetrieveUpdateDeleteView.as_view(), name='maintenance-rud'),

    # Inventory CRUD
    path('inventory/', InventoryListCreateView.as_view(), name='inventory-list-create'),
    path('inventory/<int:pk>/', InventoryRetrieveUpdateDeleteView.as_view(), name='inventory-rud'),
]
