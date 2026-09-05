# OpenRouter PR Review setup

The review workflow generates findings without a GitHub write credential. A short-lived GitHub App token is created only after generation and validation have completed, and is used only to publish one pull request review.

The workflow calls OpenRouter directly with a strict JSON Schema and checks out trusted review tooling separately from the pull request head. Automatic pull request and authorized comment events pin tooling to the pull request base SHA. An explicitly started `workflow_dispatch` canary pins tooling to the selected workflow ref. The model receives a deterministic PR diff and has no shell, file-write, GitHub API, or other tool access. Never change the workflow to execute runner or publisher scripts from the pull request checkout.

The direct request is capped at 200,000 bytes of diff context and 8,000 output tokens. An oversized context fails closed instead of being silently truncated. Both model attempts require an endpoint that supports the request parameters, including Structured Outputs.

## GitHub App

Create a private GitHub App owned by the repository owner with these settings:

- Webhook: disabled
- Repository permissions:
  - Metadata: read-only (mandatory for GitHub Apps)
  - Pull requests: read and write
- Installation scope: only `tsuchiya-yu/cat_tools`

Generate one private key and configure these Actions repository secrets:

- `OPENROUTER_REVIEW_APP_ID`: the numeric App ID
- `OPENROUTER_REVIEW_APP_PRIVATE_KEY`: the complete PEM private key

The workflow uses `actions/create-github-app-token` with `permission-pull-requests: write`, so the installation token is restricted to the permission needed by the publisher and is revoked by the Action's post step.

Do not give the App Contents, Actions, Administration, Workflows, Issues, or Members write permission.

## OpenRouter

`OPENROUTER_API_KEY` must be dedicated to PR review. Configure its effective workspace or guardrail policy with:

- allowed models:
  - `openai/gpt-5.6-luna`
  - `google/gemini-3.7-flash`
- only approved providers
- Zero Data Retention for OpenAI and Google model groups
- data collection disabled
- Private Input & Output Logging disabled
- a budget appropriate for at most two model attempts per review

Each request sends `provider.require_parameters: true`, `provider.zdr: true`, and `provider.data_collection: "deny"`. Account and guardrail policy must remain the non-bypassable backstop.

## Validation order

1. Run `npm test -- --runInBand tests/unit/scripts/openrouter-review-*.test.js` locally.
2. Confirm the workflow syntax and pinned Action SHAs.
3. Configure and install the GitHub App and repository secrets.
4. Use the `OpenRouter PR Review` workflow's `workflow_dispatch` input with a non-draft, same-repository test PR.
5. Confirm that exactly one review is published for the selected run ID and head SHA.
6. Confirm OpenRouter activity shows an allowed model and a ZDR/data-collection-denied endpoint.
7. Confirm the GitHub Actions run has no review artifact and no prompt, source, raw response, API key, or Authorization header in logs.

The workflow is advisory and must not be configured as a required branch-protection check.
