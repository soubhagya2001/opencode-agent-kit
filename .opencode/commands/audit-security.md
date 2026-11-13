---
description: Run a security audit on the entire project or a specific path
agent: security-auditor
subtask: true
---

Perform a full security audit on: $ARGUMENTS

Focus on (use the `vulnerability-scanner`, `input-sanitization`, `secrets-management`, and `auth-patterns` skills):

- Exposed API keys or secrets in config files
- MCP server configuration safety
- Agent permission escalation risks
- Supply chain vulnerabilities in dependencies (run `npm audit` where applicable)
- Input validation in API routes and custom tools
- Authentication/authorization gaps, CSRF, XSS, SQL injection

Optionally run the automated scanner: `python .opencode/scripts/security_scan.py .`

Output a structured report with severity: CRITICAL / HIGH / MEDIUM / LOW, plus remediation steps for each finding.
