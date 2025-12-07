# CLAUDE.md - AI Assistant Guide

This document provides comprehensive information about this repository for AI assistants working on code changes, analysis, and development tasks.

## Repository Overview

**Repository:** gagamello/123
**Current State:** Minimal/starter repository
**Primary Language:** To be determined based on future development
**Last Updated:** 2025-12-07

### Purpose
This repository appears to be a starter/demonstration project. The current codebase contains minimal files:
- `readme.md` - Simple greeting file

## Repository Structure

```
/home/user/123/
├── .git/              # Git version control
├── readme.md          # Project greeting/introduction
└── CLAUDE.md          # This file - AI assistant guide
```

## Development Workflows

### Branch Strategy

This repository uses a feature branch workflow with AI-specific branch naming conventions:

- **Branch Naming Pattern:** `claude/claude-md-<identifier>-<session-id>`
- **Current Branch:** `claude/claude-md-miw1utafhuwafgyj-019hprS9VgXSYt3bAdZqTVsP`
- **Remote:** origin at `http://local_proxy@127.0.0.1:64568/git/gagamello/123`

### Git Operations Best Practices

#### Pushing Changes
```bash
# Always use -u flag for pushing to remote
git push -u origin <branch-name>

# CRITICAL: Branch must start with 'claude/' and end with matching session ID
# Otherwise push will fail with 403 HTTP error

# Retry logic: If push fails due to network errors, retry up to 4 times
# with exponential backoff: 2s, 4s, 8s, 16s
```

#### Fetching/Pulling
```bash
# Prefer fetching specific branches
git fetch origin <branch-name>

# For pulls
git pull origin <branch-name>

# Use same retry logic as push if network failures occur
```

#### Committing
```bash
# Use descriptive commit messages
git commit -m "Clear description of changes"

# For multi-line commits, use heredoc format:
git commit -m "$(cat <<'EOF'
Summary of changes

Detailed explanation if needed
EOF
)"
```

## Key Conventions for AI Assistants

### File Operations

1. **Read Before Modify:** Always read existing files before making changes
2. **Prefer Editing:** Edit existing files rather than creating new ones when possible
3. **No Unnecessary Files:** Don't create documentation, README updates, or new files unless explicitly requested

### Code Quality Standards

1. **Security First:** Avoid common vulnerabilities:
   - Command injection
   - XSS (Cross-Site Scripting)
   - SQL injection
   - OWASP Top 10 vulnerabilities

2. **Simplicity Over Complexity:**
   - Don't over-engineer solutions
   - Only make requested changes
   - Avoid premature abstractions
   - Don't add features beyond requirements

3. **No Unnecessary Additions:**
   - Don't add comments to unchanged code
   - Don't add error handling for impossible scenarios
   - Don't create utilities for one-time operations
   - Don't add type annotations to unchanged code

4. **Clean Deletions:**
   - Remove unused code completely
   - No `_var` renaming for unused variables
   - No `// removed` comments
   - No backwards-compatibility hacks for internal changes

### Development Process

1. **Planning:**
   - Use TodoWrite tool for multi-step tasks
   - Break complex changes into manageable steps
   - Track progress throughout implementation

2. **Research:**
   - Use Task tool with Explore agent for codebase exploration
   - Use specialized tools over bash commands
   - Understand existing patterns before proposing changes

3. **Implementation:**
   - Make atomic, focused commits
   - Test changes when possible
   - Document significant architectural decisions

4. **Communication:**
   - Be concise and technical
   - Use code references with `file:line` format
   - Output text directly, not through bash echo
   - Avoid excessive praise or validation

## Project-Specific Guidelines

### Current State
This repository is in its initial state with minimal content. Future development will determine:
- Primary programming language(s)
- Framework/library choices
- Testing strategy
- Build/deployment processes
- Documentation standards

### Future Sections to Add

As the project grows, update this document with:

- **Architecture Overview:** System design, component relationships
- **API Documentation:** Endpoints, data models, authentication
- **Testing Guidelines:** Test structure, coverage requirements, running tests
- **Build & Deploy:** Build commands, environment configuration, deployment process
- **Dependencies:** Key libraries, version constraints, update policies
- **Common Tasks:** Frequent operations and their workflows
- **Troubleshooting:** Known issues and solutions

## Tools and Environment

### Git Configuration
```
Repository Format: 0
File Mode: true
Auto GC: disabled
Remote: origin
```

### Available Tools for AI Assistants

- **File Operations:** Read, Write, Edit, Glob, Grep
- **Execution:** Bash (with retry logic)
- **Analysis:** Task tool with specialized agents
- **Planning:** TodoWrite for task management
- **Web:** WebFetch, WebSearch (when needed)

## Common Patterns

### Exploring Codebase
```bash
# Use Task tool with Explore agent for broad searches
# Use Glob for file pattern matching
# Use Grep for content searches
# Use Read for specific file inspection
```

### Making Changes
```bash
# 1. Read relevant files
# 2. Plan changes (TodoWrite if complex)
# 3. Make focused edits
# 4. Commit with clear message
# 5. Push to feature branch
```

### Creating Pull Requests
```bash
# 1. Ensure all changes are committed
# 2. Push to remote branch
# 3. Create PR with clear description
# 4. Include test plan and summary
```

## Notes for AI Assistants

- **GitHub CLI:** Not available in this environment - request issue information from users
- **Session Context:** This is a stateless environment; maintain context through commit messages
- **User Interaction:** Ask clarifying questions when requirements are ambiguous
- **Error Handling:** Fix issues immediately when detected
- **Network Resilience:** Implement retry logic for git operations

## Version History

- **2025-12-07:** Initial CLAUDE.md creation
  - Documented minimal repository state
  - Established git workflow conventions
  - Defined AI assistant guidelines

---

**Note:** This document should be updated as the repository evolves. Keep it current with architectural changes, new conventions, and lessons learned during development.
