# Splitwise-Api

## Install all the dependency npm packages
```bash
  npm install
```

## Create new user in mysql
```bash
 mysql -u root -p

 mysql:
    GRANT ALL PRIVILEGES ON *.* TO 'anagha'@'localhost' IDENTIFIED BY 'anagha';
    exit

 mysql -uanagha -panagha

 mysql:
    CREATE DATABASE splitwise;
    USE splitwise;
```

## Create tables.
```bash
node ./app/sequelize.js
npx sequelize-cli db:migrate
```

## Start server
```bash
  source set_env_vars.sh
  node ./bin/www
```
