@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM ===== Menu =====
echo.
echo [Docusaurus Workflow]
echo   1) local test
echo   2) Commit and Push to origin source
echo.
choice /c 12 /n /m "choose [1-2]: "
set sel=%errorlevel%
echo.

if "%sel%"=="1" goto :prod_test
if "%sel%"=="2" goto :commit_push

goto :end


:prod_test
echo === build：npm run build ===
npm run build
if errorlevel 1 (
  echo ❌ build error
  pause
)
npm run serve
goto :end

:prod_then_commit
echo === 正式版建置：npm run build ===
npm run build
if errorlevel 1 (
  echo ❌ build error
  goto :end
)
echo === 本機預覽：npm run serve ===
npm run serve
echo.
echo ✅ test pass
goto :commit_push

:commit_push
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
endlocal
exit /b
