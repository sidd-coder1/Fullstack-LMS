from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admin users to edit objects.
    Technicians and others can only read.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_authenticated and request.user.role == 'admin'

class IsAdminUser(permissions.BasePermission):
    """
    Custom permission to only allow admin users full access.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'

class IsTechnicianOrAdmin(permissions.BasePermission):
    """
    Custom permission to allow both technicians and admin users.
    """
    def has_permission(self, request, view):
        return (request.user and request.user.is_authenticated and
                request.user.role in ['admin', 'technician'])
