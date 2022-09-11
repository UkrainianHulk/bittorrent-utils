@echo off

echo NodeJS version:
node -v

CMD /C npm install --omit=dev
CMD /C cls
CMD /C npm start

@pause