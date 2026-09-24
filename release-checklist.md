# Project App Starter — Final Cleanup and Release Checklist

This document describes the final cleanup and release process for the
`project-app-starter` repository before creating a stable release such as
`v1.0.0`.

The process has four goals:

1. Make sure the latest code changes are committed.
2. Verify the backend and frontend are clean.
3. Make sure development/generated files are not committed.
4. Verify the exact GitHub release can be cloned and used as a new project.

---

# 1. Commit the Final Code Changes First

Before starting the release cleanup, make sure all final development changes
have been committed.

In this project, the latest changes include the Angular spec/test fixes.

From the project root:

```powershell
cd E:\django-projects\project-app-starter
```

Check what changed:

```powershell
git status
```

Review the actual changes:

```powershell
git diff
```

If everything looks correct, stage the changes:

```powershell
git add .
```

Check what will be committed:

```powershell
git status
```

Create the commit:

```powershell
git commit -m "Fix Angular unit tests"
```

Verify the commit:

```powershell
git log --oneline -5
```

## Why?

The release tag should point to a commit that already contains the final
working code.

Do not create the `v1.0.0` tag while there are still uncommitted changes.

---

# 2. Final Angular Validation

Move into the frontend:

```powershell
cd E:\django-projects\project-app-starter\frontend
```

Install dependencies if necessary:

```powershell
npm install
```

## Run Angular unit tests

```powershell
npm test
```

The expected result is:

```text
Test Files  24 passed (24)
Tests       24 passed (24)
```

Angular's test runner may remain in watch mode.

Press:

```text
q
```

to quit the test runner.

## Run the production build

```powershell
npm run build
```

Expected result:

```text
Application bundle generation complete.
```

The generated `dist/` directory is a build artifact and should not be
committed.

---

# 3. Final Django Validation

Move into the backend:

```powershell
cd E:\django-projects\project-app-starter\backend
```

Activate the virtual environment:

```powershell
.\venv\Scripts\Activate.ps1
```

## Django system checks

```powershell
python manage.py check
```

Expected:

```text
System check identified no issues (0 silenced).
```

## Django automated tests

```powershell
python manage.py test
```

The starter currently has no Django test cases, so this may report:

```text
Found 0 test(s).
NO TESTS RAN
```

This is not a failure.

It means the starter currently does not contain backend test cases.

## Check for missing migrations

```powershell
python manage.py makemigrations --check
```

Expected:

```text
No changes detected
```

This verifies that the current models do not require a new migration.

## Apply migrations

```powershell
python manage.py migrate
```

Expected:

```text
No migrations to apply.
```

This confirms the existing migration state is clean.

---

# 4. Return to the Project Root

```powershell
cd E:\django-projects\project-app-starter
```

From this point onward, Git commands should normally be run from the
project root.

---

# 5. Check the Repository Status

Run:

```powershell
git status
```

This shows:

* modified files
* deleted files
* untracked files
* whether the working tree is clean

Ideally:

```text
nothing to commit, working tree clean
```

If you have legitimate final changes that are not committed, stop here and
commit them before continuing.

---

# 6. Inspect Ignored Files

Run:

```powershell
git status --ignored
```

This is especially useful for checking that development files are being
ignored correctly.

The repository should ignore files/directories such as:

```text
backend/venv/
backend/.env
backend/db.sqlite3
frontend/node_modules/
frontend/dist/
frontend/.angular/
```

These files are needed during development but should not be part of the
starter repository.

---

# 7. Verify Tracked Files

Run:

```powershell
git ls-files
```

This shows files that Git is actually tracking.

Pay particular attention to make sure that the following are NOT tracked:

```text
backend/venv/
backend/.env
backend/db.sqlite3
frontend/node_modules/
frontend/dist/
frontend/.angular/
```

A file being present on your computer does not mean Git will commit it.

The `.gitignore` determines which files Git normally ignores.

---

# 8. Check for Secrets

Before publishing a starter release, inspect configuration files carefully.

Check:

```text
backend/.env
backend/.env.example
.vscode/settings.json
.vscode/tasks.json
.vscode/launch.json
.vscode/extensions.json
.vscode/mcp.json
```

The real `.env` must NOT be committed.

The repository should contain:

```text
backend/.env.example
```

instead.

The example file should contain placeholders rather than real secrets.

For example:

```env
SECRET_KEY=
DEBUG=True
```

Never commit:

* real Django secret keys
* passwords
* API keys
* database credentials
* access tokens
* refresh tokens
* private keys

Also check `.vscode` files for:

* absolute machine-specific paths
* personal usernames
* secrets
* local-only configuration

Portable editor configuration is fine to commit.

---

# 9. Review the Final Diff

Run:

```powershell
git diff
```

If the working tree is already clean, inspect the most recent commit instead:

```powershell
git show --stat --oneline HEAD
```

You can also inspect the complete latest commit:

```powershell
git show HEAD
```

Use this step to catch accidental changes before creating the release.

---

# 10. Check the Current Branch

Run:

```powershell
git branch --show-current
```

The starter's main branch should be:

```text
main
```

If necessary:

```powershell
git switch main
```

Then verify:

```powershell
git status
```

---

# 11. Check the GitHub Remote

Run:

```powershell
git remote -v
```

The `origin` remote should point to the project's GitHub repository:

```text
https://github.com/rocd1/project-app-starter.git
```

Do not accidentally tag or push to a different repository.

---

# 12. Review Recent Commits

Run:

```powershell
git log --oneline -5
```

This gives a quick overview of the final commits.

For example:

```text
abc1234 Fix Angular unit tests
def5678 Finalize project starter documentation
...
```

The newest commit should contain the final code changes.

---

# 13. Push the Final Main Branch

Once the repository has been reviewed:

```powershell
git push origin main
```

If the local branch has not previously been connected to `origin/main`,
you may use:

```powershell
git push -u origin main
```

Verify:

```powershell
git status
```

The working tree should remain clean.

---

# 14. Create the v1.0.0 Release Tag

Only create the tag after all final changes have been committed and pushed.

Create an annotated tag:

```powershell
git tag -a v1.0.0 -m "Project App Starter v1.0.0"
```

Verify the tag:

```powershell
git tag
```

Inspect the tag:

```powershell
git show v1.0.0
```

The tag should point to the final release commit.

---

# 15. Push the Release Tag

Push the tag to GitHub:

```powershell
git push origin v1.0.0
```

Verify that the tag exists locally:

```powershell
git tag -n
```

You can also refresh remote tags:

```powershell
git fetch --tags
```

Then:

```powershell
git tag -n
```

You should see:

```text
v1.0.0    Project App Starter v1.0.0
```

---

# 16. Create the GitHub Release

Open the project's GitHub repository:

```text
https://github.com/rocd1/project-app-starter
```

Go to:

```text
Releases
→ Draft a new release
```

Select the existing tag:

```text
v1.0.0
```

Use:

```text
Project App Starter v1.0.0
```

as the release title.

The release notes should summarize the functionality included in the
starter.

The `CHANGELOG.md` should remain the detailed version history.

---

# 17. Clean-Clone Test

This is one of the most important steps.

The purpose is to test the exact release that a future project generator will
clone.

Do not test only your existing working directory.

Instead, clone the actual `v1.0.0` tag into a temporary directory.

Move outside the project:

```powershell
cd E:\django-projects
```

Clone the release:

```powershell
git clone --branch v1.0.0 --depth 1 https://github.com/rocd1/project-app-starter.git starter-test
```

Move into it:

```powershell
cd starter-test
```

---

# 18. Test the Clean-Clone Backend

Enter the backend:

```powershell
cd backend
```

Create a fresh virtual environment:

```powershell
python -m venv venv
```

Activate it:

```powershell
.\venv\Scripts\Activate.ps1
```

Install the requirements:

```powershell
python -m pip install --upgrade pip
```

Then:

```powershell
pip install -r requirements.txt
```

Create the environment file:

```powershell
Copy-Item .env.example .env
```

Generate a development Django secret key:

```powershell
$SecretKey = python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Then insert it into `.env`:

```powershell
(Get-Content ".env") -replace '^SECRET_KEY=.*$', "SECRET_KEY=$SecretKey" | Set-Content ".env"
```

Run:

```powershell
python manage.py check
```

Then:

```powershell
python manage.py migrate
```

Expected result:

```text
System check identified no issues
```

and migrations should complete successfully.

---

# 19. Test the Clean-Clone Frontend

From the clean clone root:

```powershell
cd E:\django-projects\starter-test\frontend
```

Install dependencies:

```powershell
npm install
```

Run the tests:

```powershell
npm test
```

Quit the test runner with:

```text
q
```

Then run:

```powershell
npm run build
```

Expected:

```text
Application bundle generation complete.
```

This confirms that the GitHub release contains everything required to
rebuild the Angular application.

---

# 20. Remove the Temporary Clean Clone

Once the clean-clone test passes:

```powershell
cd E:\django-projects
```

Remove the temporary project:

```powershell
Remove-Item -Recurse -Force .\starter-test
```

This does not affect the GitHub repository.

It only removes the temporary local verification copy.

---

# 21. Final Release Verification

Return to the real starter:

```powershell
cd E:\django-projects\project-app-starter
```

Check:

```powershell
git status
```

Check the current branch:

```powershell
git branch --show-current
```

Check the release tag:

```powershell
git tag -n
```

Check recent commits:

```powershell
git log --oneline -5
```

The final state should be:

```text
Branch:       main
Working tree: clean
Release tag:  v1.0.0
```

---

# 22. Release Workflow Summary

The complete workflow is:

```text
Make final code changes
        ↓
Run Angular tests
        ↓
Run Angular production build
        ↓
Run Django checks
        ↓
Check migrations
        ↓
Commit final changes
        ↓
Check git status
        ↓
Check ignored files
        ↓
Check tracked files
        ↓
Check for secrets
        ↓
Review final diff
        ↓
Push main
        ↓
Create annotated v1.0.0 tag
        ↓
Push v1.0.0 tag
        ↓
Create GitHub Release
        ↓
Clone v1.0.0 into temporary folder
        ↓
Test clean backend
        ↓
Test clean frontend
        ↓
Delete temporary clone
        ↓
Starter release verified
```

---

# 23. Why the Clean-Clone Test Matters

The working project can contain files that are not actually committed to Git.

For example:

```text
backend/venv/
backend/.env
frontend/node_modules/
frontend/dist/
```

Your existing development environment may work because those files already
exist.

A clean clone does not have them.

Therefore, the clean-clone test answers an important question:

> "If someone downloads exactly `v1.0.0`, can they actually set up and build the project?"

This is also important because the future project generator will use the
release tag as its source.

The intended relationship is:

```text
GitHub
rocd1/project-app-starter
        │
        │ v1.0.0
        ▼
Project Generator
        │
        ▼
New Project
        │
        ├── backend/
        ├── frontend/
        ├── README.md
        └── ...
```

If the clean clone works, the generator has a reliable release artifact to
clone.

---

# 24. Important Rule for Future Releases

For future releases, follow the same general pattern:

```text
Develop
  ↓
Test
  ↓
Clean up
  ↓
Commit
  ↓
Push main
  ↓
Tag release
  ↓
Push tag
  ↓
Clean-clone test
  ↓
GitHub Release
```

Never create a release tag before the final changes are committed.

Never modify the contents of an already-published release tag.

If something needs to be fixed after `v1.0.0`, make a new commit and release,
for example:

```text
v1.0.1
```

rather than moving `v1.0.0`.

---

# Current v1.0.0 Validation Status

At the time of preparing this checklist:

* Angular unit tests: **24/24 passed**
* Angular production build: **passed**
* Django system check: **passed**
* Django tests: **0 tests currently defined**
* Django migration check: **no changes detected**
* Django migrations: **no migrations pending**

The remaining release work is the Git cleanup/review, final commit if needed,
`v1.0.0` tagging, GitHub release, and clean-clone verification.
