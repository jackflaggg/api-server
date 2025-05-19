# API Server

## Описание

Проект представляет собой API сервер на NestJS с использованием PostgreSQL. В проекте настроены миграции, Docker для запуска базы данных, а также есть тесты и документация Swagger.

---

## Требования

- Node.js >= 18
- Yarn
- Docker (для запуска PostgreSQL)

---

## Переменные окружения

Создайте файл `.env` в корне проекта с такими переменными (пример):

```env
DATABASE_NAME_SQL=your_database_name
USERNAME_SQL=your_db_user
PASSWORD_SQL=your_db_password

-- для регистрации юзера!
ADMIN_EMAIL=n3kiii@yandex.ru
ADMIN_EMAIL_PASSWORD=vrrayvxwzeeqrzva

-- это нужно для bearer авторизации, для роута - users
ADMIN_USERNAME=admin
ADMIN_PASS=qwerty

JWT_REFRESH_SECRET=envelope
JWT_ACCESS_SECRET=not_envelope

JWT_ACCESS_EXPIRATION_TIME=5m
#10s
#5m
JWT_REFRESH_EXPIRATION_TIME=10m
#20s
#10m

---

## Запуск базы данных PostgreSQL через Docker

В корне проекта есть файл `docker-compose.yml`, который запускает PostgreSQL:

```

```bash
docker-compose up -d
```

---

## Установка зависимостей

```bash
yarn install
```

---

## Миграции базы данных

Для применения миграций используйте команду:

```bash
yarn run run-migrations
```
---

## Запуск проекта

### В режиме разработки с авто-перезагрузкой

```bash
yarn start:dev
```

### В продакшн режиме

Соберите проект:

```bash
yarn build
```

Запустите собранное приложение:

```bash
yarn start:prod
```

---


## Документация API

После запуска сервера откройте в браузере:

```
http://localhost:<port>/api
```
---

## Особенности

- Используется TypeORM для работы с базой данных
- Миграции расположены в папке `migrations/`
- Конфигурация приложения хранится в `src/env/`
- Переменные окружения подключаются из `.env`
- Для базы данных используется контейнер PostgreSQL через Docker Compose
