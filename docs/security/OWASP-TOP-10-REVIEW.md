# docs/security/OWASP-TOP-10-REVIEW.md

| # | Category | Status in Inkwell | Action |
|---|---|---|---|
| A01 | Broken Access Control | Found: comments/posts endpoints did not verify ownership before edit/delete | Fixed — Section 1.2 |
| A02 | Cryptographic Failures | Passwords already hashed with bcrypt (Lecture 6); found: JWT secret was a weak, hardcoded string | Fixed — Section 1.3 |
| A03 | Injection | Prisma's parameterized queries already prevent SQL injection by default; verified, not fixed | No action needed, verified only |
| A04 | Insecure Design | Covered via Lecture 15's threat modeling; no new gap found this pass | No action needed |
| A05 | Security Misconfiguration | Found: detailed stack traces returned to the client in production mode | Fixed — Section 1.4 |
| A06 | Vulnerable/Outdated Components | Addressed by `npm audit` (introduced this lecture) | Fixed — Section 1.5 |
| A07 | Authentication Failures | Rate limiting already added (Lecture 15) | No new action needed |
| A08 | Software/Data Integrity | Deferred — full treatment in Lecture 20/21's pipeline integrity discussion | Deferred, flagged |
| A09 | Logging/Monitoring Failures | Found: no logging at all on failed login attempts | Fixed — Section 1.6 |
| A10 | SSRF | Not yet applicable — no feature fetches a user-supplied URL; flagged for when avatar-by-URL is built | Flagged for future work |
