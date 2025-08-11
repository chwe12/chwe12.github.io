@echo off
chcp 65001 >nul
setlocal ENABLEDELAYEDEXECUTION

REM === One-click deploy for Docusaurus (source -> main) ===

REM 0) Basic checks
where git >nul 2>nul || (echo [ERROR] Git not found. Install Git first.& pause & exit /b 1)
where npm >nul 2>nul || (echo [ERROR] Node.js/npm not found. Install Node.js first.& pause & exit /b 1)

REM 1) Detect current branch
for /f "tokens=*" %%b in ('git rev-parse --abbrev-ref HEAD') do set CUR_BRANCH=%%b
if "%CUR_BRANCH%"=="HEAD" (
  echo [WARN] You are in a detached HEAD state. Attempting to switch to 'source'...
)

REM 2) Ensure we are on 'source' branch
if /I "%CUR_BRANCH%"=="main" (
  echo [INFO] You are on 'main'. Switching to 'source'...
  git checkout source 2>nul || (
    echo [INFO] 'source' not found locally. Trying to fetch from remote...
    git fetch origin source 2>nul
    git checkout -b source origin/source 2>nul || (
      echo [INFO] Remote 'source' not found. Creating local 'source' from current state...
      git checkout -b source || (echo [ERROR] Failed to create 'source' branch.& pause & exit /b 1)
    )
  )
) else (
  if /I not "%CUR_BRANCH%"=="source" (
    echo [INFO] Current branch: %CUR_BRANCH%. Switching to 'source'...
    git checkout source 2>nul || (
      echo [INFO] 'source' not found locally. Trying to fetch from remote...
      git fetch origin source 2>nul
      git checkout -b source origin/source 2>nul || (
        echo [INFO] Remote 'source' not found. Creating local 'source' from current state...
        git checkout -b source || (echo [ERROR] Failed to create 'source' branch.& pause & exit /b 1)
      )
    )
  )
)

REM 3) Confirm we are on source now
for /f "tokens=*" %%b in ('git branch --show-current') do set CUR_BRANCH=%%b
if /I not "%CUR_BRANCH%"=="source" (
  echo [ERROR] Not on 'source' after switching. Current: %CUR_BRANCH%
  pause & exit /b 1
)

REM 4) Ask for commit message (skip commit if nothing to commit)
set /p COMMIT_MSG=Enter commit message (leave empty to skip commit): 
if not "%COMMIT_MSG%"=="" (
  git add -A
  git diff --cached --quiet && (
    echo [INFO] No staged changes. Skipping commit.
  ) || (
    git commit -m "%COMMIT_MSG%" || (echo [ERROR] Commit failed.& pause & exit /b 1)
    git push origin source || (echo [ERROR] Push to 'source' failed.& pause & exit /b 1)
  )
) else (
  echo [INFO] Empty message. Skipping add/commit/push.
)

REM 5) Ensure GIT_USER (HTTPS) or USE_SSH is set
if "%GIT_USER%"=="" (
  set GIT_USER=chwe12
  echo [INFO] GIT_USER not set. Using default: %GIT_USER%
)

REM 6) Install deps if node_modules missing (optional quick check)
if not exist node_modules (
  echo [INFO] node_modules not found. Running npm ci...
  npm ci || (echo [ERROR] npm ci failed. Try 'npm install'.& pause & exit /b 1)
)

REM 7) Build
echo [INFO] Building site...
npm run build || (echo [ERROR] Build failed.& pause & exit /b 1)

REM 8) Deploy to 'main'
echo [INFO] Deploying to 'main'...
npm run deploy || (echo [ERROR] Deploy failed.& pause & exit /b 1)

echo.
echo === Deployment finished! Check: https://chwe12.github.io/ ===
pause
