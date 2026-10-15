@echo off
setlocal
echo ===================================================
echo   Starting RoadGuard AI (Java 21)
echo ===================================================

set JAVA_HOME=C:\Users\Jeswin\.tools\jdk-21
set PATH=%JAVA_HOME%\bin;%PATH%

if not exist target\classes (
    echo Compiling Java sources...
    call build.bat
)

echo Launching RoadGuard Server on port 8090...
java -cp target/classes com.roadguard.Main 8090
pause
