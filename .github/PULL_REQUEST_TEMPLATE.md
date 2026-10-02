## What does this PR do?

<!-- One or two sentences. Reference the backlog item ID (e.g., US-08). -->

## Checklist

### Architecture conformance
- [ ] No route handler contains business logic that belongs in a Service
- [ ] No module outside `repositories/` imports `@prisma/client` directly

### Design quality
- [ ] New functions are named for what they do, not how they do it
- [ ] No duplicated validation or business logic that should be extracted
- [ ] Error handling follows the established typed-error pattern

### UX and accessibility (if applicable)
- [ ] New interactive elements are keyboard-operable and properly labeled
- [ ] New UI states (loading, empty, error) are explicitly designed
- [ ] Layout verified at mobile width

### Process hygiene
- [ ] Commit messages are descriptive and reference the backlog item
- [ ] `docs/BACKLOG.md` updated if applicable
- [ ] No secrets committed
