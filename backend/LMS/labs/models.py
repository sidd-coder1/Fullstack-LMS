from django.db import models
from django.contrib.auth.models import AbstractUser

# ------------------------------
# 1) Custom User (with Roles)
# ------------------------------

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('student', 'Student'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_users',
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_users_permissions',
        blank=True,
    )

    def __str__(self):
        return f"{self.username} ({self.role})"


# ------------------------------
# 2) Lab Model
# ------------------------------
class Lab(models.Model):
    name = models.CharField(max_length=100, unique=True)
    location = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


# -------------------------------
# 3) PC model
# -------------------------------
class PC(models.Model):
    lab = models.ForeignKey(Lab, on_delete=models.CASCADE, related_name='pcs')
    name = models.CharField(max_length=100)
    status = models.CharField(max_length=50)
    brand = models.CharField(max_length=100, blank=True, null=True)
    serial_number = models.CharField(max_length=100, blank=True, null=True, unique=True)

    def __str__(self):
        return self.name


# ------------------------------
# 4) Equipment (All Items)
# ------------------------------
class Equipment(models.Model):
    EQUIPMENT_TYPES = (
        ('PC', 'PC'),
        ('MONITOR', 'Monitor'),
        ('KEYBOARD', 'Keyboard'),
        ('MOUSE', 'Mouse'),
        ('ROUTER', 'Router'),
        ('SWITCH', 'Switch'),
        ('SERVER', 'Server'),
        ('FAN', 'Fan'),
        ('LIGHT', 'Light/Bulb'),
        ('OTHER', 'Other'),
    )
    STATUS_CHOICES = (
        ('working', 'Working'),
        ('not_working', 'Not Working'),
        ('under_repair', 'Under Repair'),
    )

    lab = models.ForeignKey(Lab, on_delete=models.CASCADE, related_name="equipments")
    equipment_type = models.CharField(max_length=20, choices=EQUIPMENT_TYPES)
    brand = models.CharField(max_length=100, blank=True, null=True)
    model_name = models.CharField(max_length=100, blank=True, null=True)
    serial_number = models.CharField(max_length=100, blank=True, null=True, unique=True)
    location_in_lab = models.CharField(max_length=200, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='working')
    added_on = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.equipment_type} - {self.model_name or 'Unknown'} ({self.status})"


# ------------------------------
# 5) Software installed on PCs
# ------------------------------
class Software(models.Model):
    pc = models.ForeignKey(
        PC,
        on_delete=models.CASCADE,
        related_name="installed_software"
    )
    name = models.CharField(max_length=100)
    version = models.CharField(max_length=50, blank=True, null=True)
    license_key = models.CharField(max_length=200, blank=True, null=True)
    expiry_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.version}) - PC: {self.pc.id}"


# ------------------------------
# 6) Maintenance Logs
# ------------------------------
class MaintenanceLog(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('fixed', 'Fixed'),
    )

    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name="maintenance_logs")
    reported_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="reported_issues")
    fixed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="fixed_issues")
    issue_description = models.TextField(blank=True, null=True)
    status_before = models.CharField(max_length=20, choices=Equipment.STATUS_CHOICES)
    status_after = models.CharField(max_length=20, choices=Equipment.STATUS_CHOICES, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reported_on = models.DateTimeField(auto_now_add=True)
    fixed_on = models.DateTimeField(blank=True, null=True)
    remarks = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Issue on {self.equipment} - {self.status}"


# ------------------------------
# 7) Inventory Table (for Dashboard)
# ------------------------------
class Inventory(models.Model):
    equipment_type = models.CharField(max_length=20, choices=Equipment.EQUIPMENT_TYPES)
    total_quantity = models.IntegerField(default=0)
    working_quantity = models.IntegerField(default=0)
    not_working_quantity = models.IntegerField(default=0)
    under_repair_quantity = models.IntegerField(default=0)
    lab = models.ForeignKey(Lab, on_delete=models.CASCADE, related_name="inventory")

    def __str__(self):
        return f"{self.equipment_type} in {self.lab.name} - Total: {self.total_quantity}"
