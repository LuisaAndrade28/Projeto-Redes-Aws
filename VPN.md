# 🛡️ Configuração de Servidor e Cliente OpenVPN com Nginx

## ✅ Passo 1 – Instalação e Configuração do Servidor OpenVPN

### 1. Instalar OpenVPN e Easy-RSA

```bash
sudo apt install openvpn easy-rsa -y
```

### 2. Acessar o diretório do OpenVPN
```bash
cd /etc/openvpn/
sudo su
cd server

```

### 3. Criar o arquivo de configuração do servidor

```bash
sudo touch servidor.conf
sudo nano servidor.conf
```
Adicione o seguinte conteúdo:
```bash
dev tun
ifconfig 10.0.0.1 10.0.0.2
secret /etc/openvpn/server/(nome)
port 5000
proto udp
comp-lzo
verb 4
keepalive 10 120
persist-key
persist-tun
float
cipher AES256

```
💡 Explicação:
dev tun: Cria a interface tun0 para tunelamento.
secret: Define a chave secreta usada para criptografia (modo simétrico).

### 4. Gerar a chave secreta
```bash
sudo openvpn --genkey secret (nome)

```

### 5. Configurar grupo de segurança na AWS
No grupo de segurança da instância, libere a porta 5000 UDP (ou 1194 UDP, se preferir padrão OpenVPN).

# 🧑‍💻 Configuração do Cliente OpenVPN
### 1. Criar e editar o arquivo de configuração
```bash
sudo nano /etc/openvpn/client/client.ovpn
```
Adicione o seguinte conteúdo (substitua <ip-da-instancia>):

```bash
dev tun
proto udp
remote <ip-da-instancia> 5000
ifconfig 10.0.0.2 10.0.0.1
secret (nome)
cipher AES256
comp-lzo
verb 4
keepalive 10 120
persist-key
persist-tun
float
route 10.0.0.1 255.255.255.255
```
## ▶️ Iniciar e gerenciar o serviço OpenVPN
```bash
sudo systemctl start openvpn-server@servidor
sudo systemctl daemon-reload
sudo systemctl restart openvpn-server@servidor  # Use apenas para reconfiguração
```

## 🔧 Configuração do Nginx com Load Balancer
```bash
cd <nome-do-repositorio>/nginx/
sudo nano default.conf

```
Conteúdo do arquivo:
```bash
upstream backend {
        server app1:5000 weight=3;
        server app2:5000 weight=1;
        server app3:5000 weight=1;
}

server {
        listen 10.0.0.1:80;

        location / {
                proxy_pass http://backend;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
        }
}

```
⚠️ Rebuildar os containers do Docker após alterações.

## 🔄 Transferência e Permissões dos Arquivos
### 1. Copiar arquivos para o home do usuário
```bash
cd /etc/openvpn/client
sudo cp client.ovpn /home/ubuntu

cd /etc/openvpn/server
sudo chmod 404 (nome)
sudo cp (nome) /home/ubuntu

```
### 2. Ajustar permissões e dono

```bash
sudo chown root:root /etc/openvpn/server/(nome)
sudo chmod 400 /etc/openvpn/server/(nome)

```

## 📦 Transferência dos Arquivos para o Cliente (Windows)
No terminal (Windows), ainda em dowloads, execute:
```bash
scp -i chave.pem ubuntu@<IP-da-instancia>:/home/ubuntu/(nome) .
scp -i chave.pem ubuntu@<IP-da-instancia>:/home/ubuntu/client.ovpn .
```

## 🖥️ Passo 2 – Instalar e Configurar OpenVPN no Windows
1.Acesse: https://openvpn.net/community-downloads/

2. Baixe o instalador: Windows 64-bit MSI installer
   
3.Siga os seguintes passos:

- Vá até C:\Users\matos\OpenVpn\config

- Copie os arquivos (nome) e client.ovpn da pasta Downloads

- Saia do OpenVPN

- Execute o OpenVPN como Administrador

- Conecte usando a interface gráfica do OpenVPN


