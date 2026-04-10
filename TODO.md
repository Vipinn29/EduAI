# Auth Implementation TODO

## Phase 1: Dependencies & Prisma (Current)
- [x] Install npm dependencies (next-auth, prisma, bcryptjs, etc.)
- [ ] npx prisma init && edit schema.prisma
- [ ] npx prisma generate && db push

## Phase 2: Core Files ✓
- [x] lib/auth.ts
- [x] lib/prisma.ts
- [x] [...nextauth]/route.ts
- [x] signup/route.ts

## Phase 3: UI (Next)
- [ ] Edit app/layout.tsx
- [x] app/auth/login/page.tsx
- [x] app/auth/signup/page.tsx

## Phase 4: Protection
- [ ] Add useSession checks to dashboard/lessons, analysis, etc.

## Complete
- [ ] Test login/signup/session
- [ ] attempt_completion
