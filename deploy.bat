@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"
title Nitin Nabin site - deploy

echo.
echo ==========================================================
echo   Nitin Nabin site  ^|  Supabase + Vercel auto-deploy
echo ==========================================================
echo.

REM ---------- 1. Node.js ----------
where node >nul 2>nul
if errorlevel 1 (
  echo [1/6] Node.js nahi mila. winget se install kar raha hoon...
  winget install --id OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements
  echo.
  echo Node install ho gaya. Ye window band karke deploy.bat DOBARA chalao ^(PATH refresh ke liye^).
  pause
  exit /b 1
)
for /f "tokens=*" %%v in ('node -v') do set NODEV=%%v
echo [1/6] Node.js %NODEV% mil gaya.

REM ---------- 2. .env.local ----------
if not exist ".env.local" (
  echo.
  echo [2/6] .env.local nahi hai. Supabase keys daalo:
  echo       ^(Supabase dashboard -^> Project Settings -^> API / Database^)
  echo.
  set /p SB_URL="  NEXT_PUBLIC_SUPABASE_URL  (https://xxxx.supabase.co): "
  set /p SB_ANON="  NEXT_PUBLIC_SUPABASE_ANON_KEY (anon public key): "
  set /p SB_SERVICE="  SUPABASE_SERVICE_ROLE_KEY (service_role key, optional - Enter to skip): "
  set /p SB_DB="  SUPABASE_DB_URL (Database -> Connection string -> URI, password ke saath): "
  (
    echo NEXT_PUBLIC_SUPABASE_URL=!SB_URL!
    echo NEXT_PUBLIC_SUPABASE_ANON_KEY=!SB_ANON!
    echo SUPABASE_SERVICE_ROLE_KEY=!SB_SERVICE!
    echo SUPABASE_DB_URL=!SB_DB!
  ) > .env.local
  echo   .env.local likh diya.
) else (
  echo [2/6] .env.local mil gaya.
)

REM load .env.local into variables (skip comments / blank lines)
for /f "usebackq eol=# tokens=1,* delims==" %%a in (".env.local") do (
  if not "%%a"=="" set "%%a=%%b"
)
if "!NEXT_PUBLIC_SUPABASE_URL!"=="" (
  echo   ERROR: NEXT_PUBLIC_SUPABASE_URL khali hai. .env.local theek karo.
  pause & exit /b 1
)
if "!NEXT_PUBLIC_SUPABASE_ANON_KEY!"=="" (
  echo   ERROR: NEXT_PUBLIC_SUPABASE_ANON_KEY khali hai. .env.local theek karo.
  pause & exit /b 1
)

REM ---------- 3. npm install ----------
echo.
echo [3/6] npm install...
call npm install --no-audit --no-fund
if errorlevel 1 ( echo   npm install FAIL. & pause & exit /b 1 )

REM ---------- 4. Supabase tables + seed ----------
echo.
if "!SUPABASE_DB_URL!"=="" (
  echo [4/6] SUPABASE_DB_URL nahi hai - database step SKIP.
  echo       Supabase SQL Editor mein supabase\migrations\*.sql aur supabase\seed.sql manually chalao.
) else (
  echo [4/6] Supabase database setup ^(tables + seed^)...
  call node scripts\setup-db.mjs
  if errorlevel 1 (
    echo   Database setup FAIL. SUPABASE_DB_URL / password check karo.
    set /p CONT="  Phir bhi aage badhein? (y/N): "
    if /i not "!CONT!"=="y" exit /b 1
  )
)

REM ---------- 5. Build ----------
echo.
echo [5/6] npm run build ^(local check^)...
call npm run build
if errorlevel 1 ( echo   Build FAIL. Upar ka error dekho. & pause & exit /b 1 )

REM ---------- 6. Vercel ----------
echo.
echo [6/6] Vercel deploy...
call npx vercel whoami >nul 2>nul
if errorlevel 1 (
  echo   Vercel login - browser khulega, login karke wapas aao.
  call npx vercel login
  if errorlevel 1 ( echo   Vercel login FAIL. & pause & exit /b 1 )
)

echo   Project link/create...
call npx vercel link --yes
if errorlevel 1 ( echo   vercel link FAIL. & pause & exit /b 1 )

echo   Environment variables push...
REM (percent-expansion here on purpose: delayed !vars! don't survive a pipe)
for %%E in (production preview development) do (
  echo %NEXT_PUBLIC_SUPABASE_URL%| call npx vercel env add NEXT_PUBLIC_SUPABASE_URL %%E --force >nul 2>nul
  echo %NEXT_PUBLIC_SUPABASE_ANON_KEY%| call npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY %%E --force >nul 2>nul
  if not "%SUPABASE_SERVICE_ROLE_KEY%"=="" (
    echo %SUPABASE_SERVICE_ROLE_KEY%| call npx vercel env add SUPABASE_SERVICE_ROLE_KEY %%E --force >nul 2>nul
  )
)
echo   env vars set ^(production / preview / development^).

echo   Production deploy...
call npx vercel --prod --yes
if errorlevel 1 ( echo   Deploy FAIL. & pause & exit /b 1 )

echo.
echo ==========================================================
echo   DONE. Upar wala URL live site hai.
echo   Content badalne ke liye: Supabase -^> Table Editor.
echo   Code badalne ke baad dobara: deploy.bat
echo ==========================================================
echo.
pause
endlocal
