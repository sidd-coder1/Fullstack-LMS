from django import forms
from .models import Lab, PC, Equipment, MaintenanceLog

class LabForm(forms.ModelForm):
    class Meta:
        model = Lab
        fields = ['name', 'location']

class PCForm(forms.ModelForm):
    class Meta:
        model = PC
        fields = ['name', 'status', 'brand', 'serial_number']

class EquipmentForm(forms.ModelForm):
    class Meta:
        model = Equipment
        fields = [
            'lab', 'equipment_type', 'brand', 'model_name',
            'serial_number', 'location_in_lab', 'price', 'status'
        ]

class MaintenanceLogForm(forms.ModelForm):
    class Meta:
        model = MaintenanceLog
        fields = [
            'equipment', 'issue_description', 'status_before',
            'status_after', 'status', 'remarks'
        ]
