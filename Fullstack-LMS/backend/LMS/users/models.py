"""
This app re-exports the canonical custom User model defined in `labs.models`.
By aliasing instead of redefining, we avoid having two separate User models,
which breaks authentication and causes 401 errors.
"""

# IMPORTANT: Do not redefine a second User model here.
# Always import the canonical one from `labs.models`.
from labs.models import User  # noqa: F401
