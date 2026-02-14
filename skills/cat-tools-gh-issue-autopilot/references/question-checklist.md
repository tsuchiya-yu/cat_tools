# Blocking Question Checklist

Ask blocking questions before implementation when any item is unclear.

## Required

- Goal: What exact user/business outcome is expected?
- Scope: Which files/features are in and out of scope?
- Acceptance: What conditions define done?
- Validation: Which test/lint/e2e checks are required?
- Risk constraints: Any prohibited changes (API, UI copy, SEO, schema)?

## Optional but useful

- Priority tradeoff: speed vs robustness
- Backward compatibility requirements
- Rollout constraints or deadlines

## Decision rule

If one or more Required items are unresolved, ask questions and stop implementation.
