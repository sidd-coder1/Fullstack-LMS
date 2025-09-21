from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, DetailView
from .models import Lab, PC
from .forms import LabForm, PCForm
from django.urls import reverse_lazy

# -------------------------
# List Labs (Read)
# -------------------------
class LabListView(ListView):
    model = Lab
    template_name = "labs/lab_list.html"
    context_object_name = "labs"

# -------------------------
# Create Lab
# -------------------------
class LabCreateView(CreateView):
    model = Lab
    form_class = LabForm
    template_name = 'labs/lab_form.html'
    success_url = reverse_lazy('lab-list')

# -------------------------
# Update Lab
# -------------------------
class LabUpdateView(UpdateView):
    model = Lab
    form_class = LabForm
    template_name = 'labs/lab_form.html'
    success_url = reverse_lazy('lab-list')

# -------------------------
# Delete Lab
# -------------------------
class LabDeleteView(DeleteView):
    model = Lab
    template_name = 'labs/lab_confirm_delete.html'
    success_url = reverse_lazy('lab-list')

# -------------------------
# Lab Detail View
# -------------------------

class LabDetailView(DetailView):
    model = Lab
    template_name = "labs/lab_detail.html"
    context_object_name = "lab"

# ---------- PC CRUD ----------
class PCCreateView(CreateView):
    model = PC
    form_class = PCForm
    template_name = "labs/pc_form.html"

    def form_valid(self, form):
        lab = get_object_or_404(Lab, pk=self.kwargs["lab_id"])
        form.instance.lab = lab
        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy("lab-detail", kwargs={"pk": self.kwargs["lab_id"]})


class PCUpdateView(UpdateView):
    model = PC
    form_class = PCForm
    template_name = "labs/pc_form.html"

    def get_success_url(self):
        return reverse_lazy("lab-detail", kwargs={"pk": self.object.lab.pk})


class PCDeleteView(DeleteView):
    model = PC
    template_name = "labs/pc_confirm_delete.html"

    def get_success_url(self):
        return reverse_lazy("lab-detail", kwargs={"pk": self.object.lab.pk})

class PCDetailView(DetailView):
    model = PC
    template_name = "labs/pc_detail.html"
    context_object_name = "pc"
