// server/src/repositories/README.md (new)
//
// Repositories are the ONLY modules permitted to import from
// "@prisma/client" or execute raw SQL. Routes and Services must not
// import Prisma directly. This is ADR-001's architecture, made into
// an explicit, checkable rule — full enforcement (via a lint rule or
// architecture test) is introduced in Lecture 17.
