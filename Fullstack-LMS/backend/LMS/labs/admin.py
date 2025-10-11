from django.contrib import admin
from .models import User, Lab, PC, Equipment, Software, MaintenanceLog, Inventory

# --------------------------
# Custom User Admin
# --------------------------
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active')
    search_fields = ('username', 'email')
    ordering = ('username',)


# --------------------------
# Lab Admin
# --------------------------
@admin.register(Lab)
class LabAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'created_at', 'updated_at')
    search_fields = ('name', 'location')


# --------------------------
# PC Admin
# --------------------------
@admin.register(PC)
class PCAdmin(admin.ModelAdmin):
    list_display = ('name', 'lab', 'brand', 'status')
    list_filter = ('lab', 'status')
    search_fields = ('name', 'lab__name', 'brand')


# --------------------------
# Equipment Admin
# --------------------------
@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ('equipment_type', 'brand', 'model_name', 'serial_number', 'status', 'lab', 'added_on')
    list_filter = ('equipment_type', 'status', 'lab')
    search_fields = ('brand', 'model_name', 'serial_number', 'lab__name')


# --------------------------
# Software Admin
# --------------------------
@admin.register(Software)
class SoftwareAdmin(admin.ModelAdmin):
    list_display = ('name', 'version', 'pc')
    list_filter = ('pc',)
    search_fields = ('name', 'version', 'pc__name')


# --------------------------
# Maintenance Log Admin
# --------------------------
@admin.register(MaintenanceLog)
class MaintenanceLogAdmin(admin.ModelAdmin):
    list_display = ('equipment', 'status', 'reported_by', 'fixed_by', 'reported_on', 'fixed_on')
    list_filter = ('status', 'equipment__lab')
    search_fields = ('equipment__name', 'reported_by__username', 'fixed_by__username')


# --------------------------
# Inventory Admin
# --------------------------
@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ('equipment_type', 'lab', 'total_quantity', 'working_quantity', 'not_working_quantity', 'under_repair_quantity')
    list_filter = ('equipment_type', 'lab')
