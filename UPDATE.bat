@echo off

echo Git version:
git --version

echo NodeJS version:
node -v

CMD /C git pull

timeout /t 5