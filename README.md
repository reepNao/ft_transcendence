# ft_transcendence

```bash
# Clone the repository
git clone https://github.com/yigithankarablut/ft_transcendence.git

# Go to the project root directory and run the following command to build the project
docker-compose build
```


![alt text](https://github.com/yigithankarabulut/ft_transcendence/blob/main/transcendence-diagram.png?raw=true)
version: '3.8'

services:
  frontend:
    container_name: frontend
    image: nginx
    volumes:
      - ./frontend:/usr/share/nginx/html
      - ./frontend/nginx.conf:/etc/nginx/nginx.conf
    ports:
      - "808:80"

  apigateway:
    container_name: apigateway
    build: ./apigateway
    depends_on:
      - authservice
      - mailservice
      - usermanagement
    volumes:
      - ./apigateway:/app
    ports:
      - "8000:8000"

  authservice:
    container_name: authservice
    build: ./authservice
    volumes:
      - ./authservice:/app

  mailservice:
    container_name: mailservice
    build: ./mailservice
    depends_on:
      rabbitmq:
        condition: service_healthy
    volumes:
      - ./mailservice:/app

  userpostgres:
    container_name: userpostgres
    image: postgres:13
    environment:
      POSTGRES_USER: yigit
      POSTGRES_PASSWORD: yigit
      POSTGRES_DB: usermanagement
    ports:
      - "5432:5432"

  gamepostgres:
    container_name: gamepostgres
    image: postgres:13
    environment:
      POSTGRES_USER: yigit
      POSTGRES_PASSWORD: yigit
      POSTGRES_DB: gamepostgres
    ports:
      - "5433:5432"

  friendspostgres:
    container_name: friendspostgres
    image: postgres:13
    environment:
      POSTGRES_USER: yigit
      POSTGRES_PASSWORD: yigit
      POSTGRES_DB: friendspostgres
    ports:
      - "5434:5432"

  bucketpostgres:
    container_name: bucketpostgres
    image: postgres:13
    environment:
      POSTGRES_USER: yigit
      POSTGRES_PASSWORD: yigit
      POSTGRES_DB: bucketpostgres
    ports:
      - "5435:5432"

  usermanagement:
    container_name: usermanagement
    build: ./usermanagement
    depends_on:
      - userpostgres
    volumes:
      - ./usermanagement:/app
    ports:
      - "8004:8004"

  gameservice:
    container_name: gameservice
    build: ./gameservice
    depends_on:
      - gamepostgres
    volumes:
      - ./gameservice:/app
    ports:
      - "8010:8010"

  friendservice:
    container_name: friendservice
    build: ./friendservice
    depends_on:
      - friendspostgres
    volumes:
      - ./friendservice:/app
    ports:
      - "8012:8012"
  
  bucketservice:
    container_name: bucketservice
    build: ./bucketservice
    volumes:
      - ./bucketservice:/app
    ports:
      - "8014:8014"

  rabbitmq:
      container_name: rabbitmq
      image: rabbitmq:3.8.17-management
      ports:
        - "5672:5672"
        - "15672:15672"
      healthcheck:
        test: ["CMD", "rabbitmqctl", "node_health_check"]
        interval: 30s
        timeout: 10s
        retries: 5

  statusservice:
    container_name: statusservice
    build: ./statusservice
    volumes:
      - ./statusservice:/app
    ports:
      - "8020:8020"

  gameplayservice:
    container_name: gameplayservice
    build: ./gameplayservice
    volumes:
      - ./gameplayservice:/app
    ports:
      - "8011:8011"