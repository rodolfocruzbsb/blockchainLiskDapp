# blockchainLiskDapp[EM DESENVOLVIMENTO]
Dapp baseado no blockchain da Lisk para envio de não conformidade.

## Instalação
Para que a aplicação funcione, segue abaixo um passo a passo para que a mesma seja executada no Docker.
Caso seja optado por uma instalação em um S.O., siga as instruções contidas na documentação oficial do  [Lisk](https://lisk.io/documentation?i=lisk-docs/BinaryInstall) e vá para o passo 3.

Caso você não tenha o Docker instalado, siga as instruções contidas no site oficial para instalação do [Docker Toolbox](https://www.docker.com/products/docker-toolbox)

### Docker: Baixando imagem e Executando o container

Dentro do Terminal do Docker, execute os seguintes comandos

[source,bash]
----
docker pull lisk/testnet
docker run --name container_blockchain_lisk -d -p 0.0.0.0:7000:7000 lisk/testnet
----

Para testar se o Lisk foi corretamente baixado e iniciado, acesse o endereço liberado pelo Docker, facilmente visualizado no Kinematic. Geralmente: (192.168.99.100:7000)

Após startar o container, vamos acessá-lo para seguir com nossas configurações:

[source,bash]
----
docker ps -a
docker exec -it ID_DO_CONTAINER bash
----

### Configurando ambiente linux 
Após acessar o bash do seu container, conforme comando anterior continue configurando o linux para

#### Ajustar data do S.O. para locale de Belém[OPCIONAL]

[source,bash]
----
sudo rm /etc/localtime
sudo ln -s /usr/share/zoneinfo/America/Belem /etc/localtime
----

#### Configurar SSH no Linux para acessar o Git. 
Siga instruções em (https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/)

#### Baixar ferramenta do Lisk(Lisk-Cli) para gerar Dapp dentro do seu padrão.
 
[source,bash]
----
git clone git@github.com:LiskHQ/lisk-cli.git
cd lisk-cli
sudo npm install -g .
cd ..
----

#### Criar sua Dapp
Certifique-se de estar no diretório ~/lisk

[source,bash]
----
lisk-cli dapps -a

---- 

## Detalhes do funcionamento: blockchainLiskDapp

Dapp simples para enviar Não conformidade, baseado no blockchain do Lisk.

- Quantidade máxima de caracteres 1000.

- As não conformidades são atualizadas a cada 20 segundos.

- A senha não é obrigatória, caso não informe será considerada a senha padrão: "default-senha-rodolfo".

- A transação não tem taxação, é grátis 0 LISK (devido a ter fins apenas de teste).
