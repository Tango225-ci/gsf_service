@echo off
rem Composer du projet GSF Service, installe sur D: (le disque C: est presque plein).
rem Utilisation depuis la racine du projet :  outils\composer\composer.bat <commande>
rem PHP utilise : celui de WAMP (8.3), sauf si la variable GSF_PHP indique un autre php.exe.

setlocal
set "ICI=%~dp0"
if "%GSF_PHP%"=="" set "GSF_PHP=C:\wamp64\bin\php\php8.3.28\php.exe"

rem Configuration et cache de Composer gardes dans le projet, pas dans le profil sur C:
set "COMPOSER_HOME=%ICI%home"
set "COMPOSER_CACHE_DIR=%ICI%cache"

"%GSF_PHP%" "%ICI%composer.phar" %*
endlocal & exit /b %ERRORLEVEL%