# Development Task & Prompt Guidelines

Please follow the guidelines below for all development tasks and when creating prompts for AI/coding agents.

---

### 1. Use English Only

* All prompts, plans, explanations, comments, and documentation should be in **English**.
* Do not use any other language unless specifically required for the task.

---

### 2. Understand the Task First

Before starting development, first understand the complete requirement.

Identify:

* What is being requested
* What the expected behavior is
* Business and technical requirements
* Existing functionality related to the task
* Dependencies
* Edge cases
* Potential risks
* Any missing or unclear information

**Do not start coding immediately.**

---

### 3. Plan the Task First

Create a clear implementation plan before making changes.

The plan should include:

* What needs to be changed
* What needs to be created
* What existing code can be reused
* Which components are affected
* Dependencies
* Architecture/design considerations
* Testing approach (including testing with real current dates and data)
* Reference parity validation criteria

---

### 4. Decide the Expected Output First

Before implementation, clearly define what the final result should be.

For example:

* Which files need to be created
* Which files need to be modified
* Which files need to be deleted/renamed
* API/database/configuration changes
* Tests required
* Documentation required
* Expected behavior
* Acceptance criteria

The expected output should be clear before implementation begins.

---

### 5. Inspect the Existing Code Before Creating New Code

Always inspect the existing project and understand the current architecture.

Look for:

* Existing services
* Interfaces
* Utilities/helpers
* Common components
* Models/DTOs
* Repositories
* Database logic
* Configuration
* Error handling
* Logging
* Tests
* Existing patterns and conventions

**Reuse existing functionality whenever possible.**

Do not create duplicate functionality if something already exists.

---

### 6. Always Give Clear File Direction

When asking an AI agent or another developer to make changes, specify the **exact file/folder path**.

Example:

```text
CREATE
src/Services/OrderService.cs

MODIFY
src/Controllers/OrderController.cs

MODIFY
src/Repositories/OrderRepository.cs

CREATE
tests/Services/OrderServiceTests.cs
```

For each file, explain:

* What needs to change
* Why it needs to change
* What existing code should be reused
* Expected behavior

Avoid vague instructions such as:

> *"Update the service."*

Instead:

> *"Modify `src/Services/OrderService.cs` to reuse the existing `IOrderRepository` and add validation before creating an order."*

---

### 7. Follow Proper Architecture and Coding Standards

Implementation should follow production-quality engineering practices.

Use:

* SOLID principles
* DRY
* Separation of concerns
* Appropriate design patterns
* Dependency injection
* Reusable components
* Proper exception handling
* Proper logging
* Security best practices
* Performance considerations
* Existing project conventions

Do not over-engineer.

Do not rewrite unrelated code.

Do not introduce unnecessary dependencies or abstractions.

---

### 8. Validate Before Completing the Task (Real Dates & Reference Parity)

After implementation, always validate the changes thoroughly:

#### A. Testing with Real Current Dates & Live Data
* Always test with the **current real-world date and live temporal data**, never relying on frozen mock dates or arbitrary hardcoded timestamps.
* Verify seasonal calendars, live session clocks, match countdowns, and relative publication timestamps (e.g. ISO-8601, UTC/GMT, IST) against active time.
* Ensure zero blank cards or dead empty states regardless of off-peak hours or between-match intervals.

#### B. Reference & Legacy App Parity Comparison
* If there is a comparison app, legacy app, or authoritative reference platform (e.g. Cricbuzz, ESPN Cricinfo, BBC Sport, official league sites):
  * **Compare live results directly against the reference app** to verify exact data parity.
  * Ensure match scores, overs, wickets, bowler economy, partnership runs, and points table numbers match 1:1 with the ground-truth reference.
  * Confirm that text commentary, dismissal descriptions, and player names have no missing tokens, corrupted symbols, or placeholder artifacts.

#### C. Engineering Checks
* Build/compile (`npm run build` or equivalent) with zero exit errors.
* Unit/integration test execution.
* Error handling and graceful fallback recovery.
* Edge cases (rain interruptions, tie-breakers, super overs, abandoned matches).
* Security and sanitized inputs.
* Performance and edge-cache optimization.
* Duplicate code elimination and unused dependency removal.

Fix all issues found during validation before considering the task complete.

---

### 9. Final Response / Handover

When completing a task, provide a clear summary using this exact structure:

```text
## Summary
What was completed.

## Files Created
Exact file paths and purpose.

## Files Modified
Exact file paths and what changed.

## Files Deleted/Renamed
If applicable.

## Architecture / Design Decisions
Important technical decisions.

## Validation
Build/tests/checks performed (including real-date testing and reference parity comparisons).

## Remaining Issues
Anything that could not be completed or verified.

## Manual Steps
Anything that needs to be done manually.
```

---

### Important Rule

The expected workflow for every task should be:

**Understand → Plan → Define Expected Output → Inspect Existing Code → Define File Changes → Implement → Validate (Real Dates & Reference Parity) → Report**

Please follow this process consistently across all development tasks. The goal is to make the work **structured, reusable, maintainable, testable, and production-ready**, rather than simply getting the code to work.
