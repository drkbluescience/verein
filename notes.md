docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=Asdf0911!' -p 1433:1433 --name sql2022 --platform linux/amd64 -d mcr.microsoft.com/mssql/server:2022-latest



docker ps


sqlcmd -S localhost -U sa -P 'Asdf0911!'

CREATE DATABASE VEREIN;
GO
EXIT


sqlcmd -S localhost -U sa -P 'Asdf0911!' -d VEREIN -i APPLICATION_H_101.sql

docker exec -it sql2022 /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'Asdf0911!'
