@echo off
setlocal enabledelayedexpansion

:menu
cls
echo ==================================
echo Git Local Reset & Update Tool
echo ==================================
echo 1. Reset and clean only   (discard local changes)
echo 2. Reset, clean, and pull latest from origin/source
echo 3. Local test
echo 4. Commit and push to formal release
echo 5. Exit
echo ==================================
set /p choice=Choose an option (1-5): 

if "%choice%"=="1" goto resetOnly
if "%choice%"=="2" goto resetAndPull
if "%choice%"=="3" goto prodTest
if "%choice%"=="4" goto commitPush
if "%choice%"=="5" goto end

echo Invalid choice. Please try again.
pause
goto menu

:resetOnly
echo.
echo  This will REMOVE all local changes and untracked files!
pause
git reset --hard
git clean -fd
echo.
echo  Local changes discarded.
pause
goto menu

:resetAndPull
echo.
echo  This will REMOVE all local changes and untracked files, then pull latest from origin/source!
pause
git reset --hard
git clean -fd
git pull --rebase origin source
echo.
echo  Repository reset and updated from origin/source.
pause
goto menu

:prodTest
echo === npm run build ===
call npm run build
if errorlevel 1 (
  echo ❌ build error
  pause
  goto menu
)
echo === npm run serve ===
call npm run serve
goto menu


:commitPush
echo === Git status ===
git status --short
echo ------------------------------

set "msg="
set /p msg=Commit message: 
if "%msg%"=="" (
  echo Cancelled: no commit message provided.
  pause
  goto menu
)

REM Replace double quotes with single quotes to avoid breaking -m argument
set "msg=%msg:"='%"

git add -A
git commit -m "%msg%"
if errorlevel 1 goto menu

git pull --rebase origin source
if errorlevel 1 (
  echo Rebase failed. Please resolve conflicts before pushing.
  pause
  goto menu
)

git push origin source
echo Pushed to origin/source
pause
goto menu

:end
endlocal
exit /b
