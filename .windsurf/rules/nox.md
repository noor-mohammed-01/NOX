# NOX development rules

- Implement only the phase explicitly requested in the current prompt.
- Read docs/STATE.md before making changes.
- Do not implement future phases.
- Do not rewrite unrelated files or existing working features.
- Do not add dependencies unless the current phase requires them.
- Keep secrets and credentials in environment variables; never hardcode them.
- Never create custom cryptographic algorithms. Use established cryptographic libraries/APIs.
- The server must not permanently store chat history.
- Online and offline communication must use the same message model/security pipeline.
- Run the relevant typecheck, build, or tests after changes and fix errors caused by the implementation.
- Update docs/STATE.md after completing a phase. Keep it concise.
- Final report must be at most 10 lines: changed files, commands/tests run, result, and remaining limitations.
