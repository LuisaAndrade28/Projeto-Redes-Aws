# Projeto-Redes-Aws


# Criando a Instância
Neste passo a passo, vamos criar uma instância que servirá como base para rodar o Docker. A instância será configurada para hospedar o projeto, permitindo que ele seja acessado via web. Vamos seguir algumas etapas essenciais, que envolvem a criação da instância e suas respectivas configurações. 

### Etapas para criar a instância:

1. **Criar uma nova instância na nuvem** (AWS).
2. **Configurar as permissões necessárias**, como abrir portas para acesso à aplicação web.

Abaixo, você verá algumas imagens que ilustram as etapas descritas.


![image](https://github.com/user-attachments/assets/e5dfec1b-4880-4db9-802d-055a9e1f14d0)


![image (1)](https://github.com/user-attachments/assets/cbd3a795-aaf9-480a-8413-631eb379fc6a)


![image (2)](https://github.com/user-attachments/assets/b7575507-e874-4068-a66d-3b25b058622b)

## Acessando a instância

Para acessar a instância, abra o **PowerShell** como administrador no seu computador. Navegue até o diretório onde sua chave SSH está salva:

Exemplo: 

    cd C:\Users\pedro\Downloads
Em seguida, execute o comando SSH para acessar a instância:

```
ssh -i <nome-chave> ubuntu@<ip-maquina>
```

## Instalando o Docker

Vamos primeiro atualizar a instância:
```
sudo apt update
```
Comando para baixar o Docker na instância

```
sudo apt install docker.io -y
```
Verifique que o Docker foi devidamente instalado:
```
docker --version
```
Para que seja possível utilizar os comandos sem o `sudo` na frente vamos usar o seguinte comando, após isso é preciso sair para a alteração se tornar válida.

```
sudo usermod -aG docker $USER
```
Após logar novamente na instãncia, vamos criar uma pasta para maior organização:
```
mkdir ~/aplicacao
```
Dentro dessa pasta vamos clonar o projeto:
```
git clone <link do projeto no github>
```
## Criando o Docker Compose

Para baixar o Docker Compose na nossa instância, execute:

```
sudo apt install docker-compose -y
```
Agora, crie o arquivo compose.yaml:
```
touch compose.yaml

```
Aqui criamos o nosso compose.yaml. Agora dentro do nosso compose.yaml vamos colocar o seguinte bloco de código. Lembrem-se, para acessar e modificar o arquivo basta dar um `nano compose.yaml`

```
services:

  backend:
    container_name: backend
    build:
      context: ./redes_computadores/backend
      dockerfile: Dockerfile
    ports:
      - "3333:3333"

  frontend:
    container_name: frontend
    build:
      context: ./redes_computadores/frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  db_data:

```

## Frontend Dockerfile:

Dentro do frontend, vamos criar o Dockerfile. 

Para criar o arquivo `Dockerfile`, execute:

```
touch Dockerfile
```
```
nano Dockerfile
```
E ensira o seguinte código dentro do seu Dockerfile:
```
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

# Copia o resultado do build para o nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

```

## Backend Dockerfile:

Dentro do backend, vamos criar o Dockerfile. 

Para criar o arquivo `Dockerfile`, execute:

```
touch Dockerfile
```
```
nano Dockerfile
```
E ensira o seguinte código dentro do seu Dockerfile:

```
FROM node:22-alpine

WORKDIR /app

# Copia os arquivos de dependência e instala tudo
COPY package*.json ./
RUN npm install

# Copia o restante do projeto
COPY . .

# Expõe a porta do app
EXPOSE 3333

# Roda o servidor com ts-node-dev
CMD ["npx", "ts-node-dev", "src/server.ts"]

```

##Executando o Compose

O seguinte comando serve para executar o nosso Docker Compose
```
docker-compose -f compose.yaml up --build -d
```

Ele vai criar os dockers seguindo as instruções definidas no Dockerfile. Lembre-se de ir na VM e acessar seu grupo de segurança, abra a porta 3333 para que ela receba o acesso do backend.
![image (3)](https://github.com/user-attachments/assets/887dfbfb-a894-413d-8c89-21666bc41d1e)

### Atenção! 
Toda vez que ligar a VM na AWS vai gerar um IP novo, então é preciso acessar o api.jsx no frontend para trocar o IP de acesso.
![image (4)](https://github.com/user-attachments/assets/3cb6f425-184f-4b2c-9a4e-3ca0ea571d92)

Depois remova os containers criados, e reconstrua o projeto com as imagens atualizadas do Dockerfile. 
```
docker-compose down
```

```
docker-compose -f compose.yaml up --build -d
```






