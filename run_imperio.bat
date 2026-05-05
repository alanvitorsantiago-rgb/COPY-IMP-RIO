@echo off
TITLE Imperio Copy - Premium SaaS Launcher
SETLOCAL EnableDelayedExpansion

:: Cores para o terminal (funciona no Windows 10+)
SET "ESC="
SET "PURPLE=%ESC%[35m"
SET "BLUE=%ESC%[34m"
SET "GREEN=%ESC%[32m"
SET "RED=%ESC%[31m"
SET "RESET=%ESC%[0m"
SET "BOLD=%ESC%[1m"

cls
echo %PURPLE%================================================================%RESET%
echo %BOLD%               IMPERIO COPY - PREMIUM SAAS                  %RESET%
echo %PURPLE%================================================================%RESET%
echo.

:: 1. Verificando dependencias
echo %BLUE%[1/3]%RESET% Verificando e atualizando bibliotecas...
echo Isso pode levar alguns segundos se houver novas atualizacoes.
echo.

cmd /c npm install
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo %RED%[ERRO]%RESET% Falha ao instalar dependencias. Verifique se o Node.js esta instalado.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo %GREEN%[OK]%RESET% Bibliotecas prontas para uso.
echo.

:: 2. Verificando arquivo .env
echo %BLUE%[2/3]%RESET% Verificando configuracoes...
if not exist ".env" (
    if exist ".env.example" (
        echo %BLUE%[INFO]%RESET% Criando arquivo .env baseado no exemplo...
        copy .env.example .env > nul
        echo %RED%[AVISO]%RESET% Adicione sua chave ANTHROPIC_API_KEY no arquivo .env antes de usar a IA.
    ) else (
        echo %RED%[AVISO]%RESET% Arquivo .env nao encontrado. A geracao de IA pode falhar.
    )
) else (
    echo %GREEN%[OK]%RESET% Configuracoes detectadas.
)
echo.

:: 3. Iniciando Servidor
echo %BLUE%[3/3]%RESET% Iniciando o Imperio Copy...
echo %PURPLE%----------------------------------------------------------------%RESET%
echo %BOLD% O sistema sera aberto em: http://localhost:5173 %RESET%
echo %PURPLE%----------------------------------------------------------------%RESET%
echo.

cmd /c npm run dev

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo %RED%[ERRO]%RESET% O servidor parou inesperadamente.
    pause
)

ENDLOCAL
