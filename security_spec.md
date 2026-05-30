# Security Spec

1. Data Invariants: 
   - A teacher must belong to the logged-in admin.
   - An observation must belong to the logged-in admin.
2. The "Dirty Dozen" Payloads:
   - Creating a teacher with someone else's adminId
   - Updating a teacher's adminId
   - Creating an observation with someone else's adminId
   - Updating an observation's adminId
   - Missing required fields
   - Payload with ghost fields
   - Reading someone else's teacher
   - Reading someone else's observation
   - Invalid field types
   - Values exceeding sizes constraints
   - Unauthenticated reads/writes
   - Modifying createdAt timestamps
