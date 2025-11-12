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
cls
echo ==============================================================
echo.
echo  WARNING! 
echo.
echo  YOU ARE ABOUT TO **RESET** YOUR LOCAL REPOSITORY
echo.
echo  This action will **DELETE ALL LOCAL CHANGES** and cannot be undone!
echo.
echo ==============================================================
echo.
set "confirm="
set /p confirm=Are you sure you want to RESET to the latest version? (Y/N): 
if /I not "%confirm%"=="y" (
  echo.
  echo Cancelled. No changes were made.
  pause
  goto menu
)

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
cls
echo ==============================================================
echo.
echo  WARNING! 
echo.
echo  YOU ARE ABOUT TO **RESET** YOUR LOCAL REPOSITORY
echo  AND SYNC TO THE LATEST VERSION FROM GITHUB (origin/source).
echo.
echo  This action will **DELETE ALL LOCAL CHANGES** and cannot be undone!
echo.
echo ==============================================================
echo.
set "confirm="
set /p confirm=Are you sure you want to RESET to the latest version? (Y/N): 
if /I not "%confirm%"=="y" (
  echo.
  echo Cancelled. No changes were made.
  pause
  goto menu
)
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
  echo build error
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
