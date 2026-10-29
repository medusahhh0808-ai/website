@echo off
chcp 65001 >nul
title 启动建筑设计灵感库开发预览
echo ==========================================
echo    建筑设计灵感库 · 本地开发预览
echo ==========================================
echo.
echo 正在启动本地开发服务器，请稍候...
echo.
call npm.cmd run dev
pause
