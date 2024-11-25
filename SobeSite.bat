@echo off
:: Verifica se a pasta \src existe
if not exist "%~dp0src" (
    echo A pasta src nao foi encontrada.
    pause
    exit
)

:: Navega até a pasta \src
cd /d "%~dp0src"

:: Inicia o backend com Node.js
echo Iniciando o backend...
node index.js

:: Mantém a janela aberta para mensagens ou erros
echo.
echo Backend encerrado. Pressione qualquer tecla para sair...
pause
