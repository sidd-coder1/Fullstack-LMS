from rest_framework import serializers
from .models import Ticket

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ['id', 'student', 'pc', 'issue_description', 'status', 'created_at', 'updated_at']
        read_only_fields = ['student', 'status', 'created_at', 'updated_at']
