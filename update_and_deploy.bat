@echo off
setlocal enabledelayedexpansion

REM Show changes
git status --short
echo ------------------------------

REM Read commit message (prevent empty string)
set "msg="
set /p msg=Commit message: 
if "%msg%"=="" (
  echo ❌ Cancelled: no commit message provided.
  pause
  exit /b 1
)

REM Replace double quotes with single quotes to avoid breaking -m argument
set "msg=%msg:"='%"

git add -A
git commit -m "%msg%"
if errorlevel 1 goto :end

git pull --rebase origin source
if errorlevel 1 (
  echo ⚠️ Rebase failed. Please resolve conflicts before pushing.
  goto :end
)

git push origin source

:end
pause
