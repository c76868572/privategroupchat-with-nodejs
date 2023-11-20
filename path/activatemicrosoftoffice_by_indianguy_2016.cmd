@ECHO OFF
:: BatchGotAdmin
:-------------------------------------
REM  --> Check for permissions
    IF "%PROCESSOR_ARCHITECTURE%" EQU "amd64" (
>nul 2>&1 "%SYSTEMROOT%\SysWOW64\cacls.exe" "%SYSTEMROOT%\SysWOW64\config\system"
) ELSE (
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
)

REM --> If error flag set, we do not have admin.
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    set params= %*
    echo UAC.ShellExecute "cmd.exe", "/c ""%~s0"" %params:"=""%", "", "runas", 1 >> "%temp%\getadmin.vbs"

    "%temp%\getadmin.vbs"
    del "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    pushd "%CD%"
    CD /D "%~dp0"
:--------------------------------------  

cd "C:\Program Files (x86)\Microsoft Office\Office16"
cscript ospp.vbs /inpkey:XQNVK-8JYDB-WJ9W3-YJ8YR-WFG99
cscript ospp.vbs /unpkey:BTDRB >nul
cscript ospp.vbs /unpkey:KHGM9 >nul
cscript ospp.vbs /unpkey:CPQVG >nul
cscript ospp.vbs /sethst:e8.us.to
cscript ospp.vbs /setprt:1688
cscript ospp.vbs /act
ECHO "Activate Successfully!, Here u go!"
POWERSHELL.EXE -Command "Add-Type -AssemblyName System.Windows.Forms; [void] [System.Windows.Forms.MessageBox]::Show( 'Activate Successfully!, Here u go!', 'Activation Status', 'OK', 'Information' )"
exit