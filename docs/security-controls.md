# Security Controls Roadmap

## Implemented in Current Prototype

- Mobile zoom blocking was removed.
- Shared output-encoding and URL-validation helpers were added.
- High-risk dynamic render paths for dashboard cards, timelines, DMS cards, photo cards, equipment lists, and selected operational rows now encode user-controlled display values.
- Document links are opened through a safe URL helper using `noopener,noreferrer`.
- Corrupted localStorage JSON is handled with recovery to seeded data.

## Required Before Production

- Authentication with OIDC/SAML/SSO.
- Server-side RBAC/ABAC authorization.
- Server-side input validation for every API.
- CSRF protection for cookie-based sessions.
- Strict Content Security Policy.
- Removal of inline event handlers.
- Subresource Integrity or self-hosted third-party assets.
- Audit logging for all sensitive actions.
- Malware scanning for uploaded files.
- Signed URLs for documents and photos.
- Secrets management and environment-specific configuration.
