@echo off
setlocal enabledelayedexpansion

:menu
cls
echo ==================================
echo Git Local Reset & Update Tool
echo ==================================
echo 1. Reset and clean only   (discard local changes)
echo 2. Reset, clean, and pull latest from origin/source
echo 3. Exit
echo ==================================
set /p choice=Choose an option (1-3): 

if "%choice%"=="1" goto resetOnly
if "%choice%"=="2" goto resetAndPull
if "%choice%"=="3" goto end

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

:end
endlocal
exit /b
