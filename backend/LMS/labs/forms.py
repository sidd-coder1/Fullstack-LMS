from django import forms
from .models import Lab, PC

class LabForm(forms.ModelForm):
    class Meta:
        model = Lab
        fields = ['lab_code', 'name', 'location', 'description', 'lab_head']

class PCForm(forms.ModelForm):
    class Meta:
        model = PC
        fields = [
            "asset_tag", "hostname", "serial_number", "ip_address", "mac_address",
            "manufacturer", "model", "cpu", "cpu_cores", "ram_mb", "storage_gb",
            "os_name", "os_version", "purchased_on", "warranty_until", "is_defective", "defective_reason"
        ]
