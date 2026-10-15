@echo off
setlocal
echo ===================================================
echo   Building RoadGuard AI Project
echo ===================================================

set JAVA_HOME=C:\Users\Jeswin\.tools\jdk-21
set PATH=%JAVA_HOME%\bin;C:\Users\Jeswin\.tools\maven\bin;%PATH%

if not exist target\classes mkdir target\classes

echo Compiling Java source files...
powershell -Command "& 'C:\Users\Jeswin\.tools\jdk-21\bin\javac.exe' -d target/classes (Get-ChildItem -Path src/main/java -Filter *.java -Recurse | Select-Object -ExpandProperty FullName)"

if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Compilation finished successfully.
) else (
    echo [ERROR] Compilation failed.
)
