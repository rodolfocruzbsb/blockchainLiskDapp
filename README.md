# blockchainLiskDapp
Dapp baseado no blockchain da Lisk para envio de não conformidade. [EM DESENVOLVIMENTO]

## Instalação
Para que a aplicação funcione, segue abaixo um passo a passo para que a mesma seja executada no Docker.
Caso seja optado por uma instalação em um S.O., siga as instruções contidas na documentação oficial do  [Lisk](https://lisk.io/documentation?i=lisk-docs/BinaryInstall) e vá para o passo 3.

Caso você não tenha o Docker instalado, siga as instruções contidas no site oficial para instalação do [Docker Toolbox](https://www.docker.com/products/docker-toolbox)

### Docker: Baixando imagem e Executando o container

Dentro do Terminal do Docker, execute os seguintes comandos

```sh
docker pull lisk/testnet
docker run --name container_blockchain_lisk -d -p 0.0.0.0:7000:7000 lisk/testnet
```

Para testar se o Lisk foi corretamente baixado e iniciado, acesse o endereço liberado pelo Docker, facilmente visualizado no Kinematic. Geralmente: (192.168.99.100:7000)

Após startar o container, vamos acessá-lo para seguir com nossas configurações:

```sh
docker ps -a
docker exec -it ID_DO_CONTAINER bash
```

### Configurando ambiente linux 
Após acessar o bash do seu container, conforme comando anterior continue configurando o linux para

#### Ajustar data do S.O. para locale de Belém[OPCIONAL]

```sh
sudo rm /etc/localtime
sudo ln -s /usr/share/zoneinfo/America/Belem /etc/localtime
```

#### Configurar SSH no Linux para acessar o Git. 
Siga instruções em (https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/)

#### Baixar ferramenta do Lisk(Lisk-Cli) para gerar Dapp dentro do seu padrão.
 
```sh
git clone git@github.com:LiskHQ/lisk-cli.git
cd lisk-cli
sudo npm install -g .
cd ..
```

#### Criar sua Dapp
Certifique-se de estar no diretório ~/lisk e execute o seguinte comando:
Antes de seguir, faça um fork deste projeto para utilizar-mos ele mais a frente no lisk-cli, ficando algo como: https://github.com/SEU_USUARIO_GIT/blockchainLiskDapp
```sh
lisk-cli dapps -a
``` 

O comando anterior irá gerar as seguintes saídas, siga conforme exemplo abaixo se atentando para substituir seu usuário no repositório Git

* ? Existing blockchain.db file will be replaced, are you sure? [Y]
* ? Enter secret of your testnet account [sua_senha]
* ? Overwrite the existing genesis block? [Y]
* ? Enter DApp name [naoconformidadeDapp]
* ? Enter DApp description [Não Conformidade Dapp para envio de mensagem de Não Conformidade de Segurança do Trabalho.]
* ? Github repository git@github.com:SEU_USUARIO_GIT/blockchainLiskDapp.git
* ? Enter public keys of dapp forgers - hex array, use ',' for separator 0c5be0e55b336b4fea82dd1ae380be2d5d0faa8d046bc088a9c1f8c85e9d54cb [Aperte ENTER]
* ? Add dapp to autolaunch? [Y]
* Done (DApp id is 16170334735595171296)

Por fim, anote o ID da Dapp gerada. Para o exemplo acima ID_DAPP:16170334735595171296

#### Clonar Dapp do Git para utilizá-la
```sh
cd dapps
git clone https://github.com/rodolfocruzbsb/blockchainLiskDapp
cp ID_DAPP/genesis.json blockchainLiskDapp/
rm -R ID_DAPP
mv blockchainLiskDapp ID_DAPP
``` 

## Últimos ajustes
* Adicione altere o arquivo ~/lisk/dapps/ID_APP/config.json e altere a seção "peers", "ip" e cooque o seu IP.
```sh
nano ~/lisk/dapps/ID_APP/config.json
```
* Altere o arquivo ~/lisk/genesisBlock.json, vá para o final do arquivo e procure o atributo *recipientId* e altere de null para "9656600697829963790L". Não esqueça de deixar o valor entre aspas duplas.
```sh
nano ~/lisk/genesisBlock.json
``` 

## Vendo a Dapp rodando
Após todos os passos anteriores terem sido executado sem nenhum erro, basta reiniciar o seu container.(Por vez, por algum bug do Lisk, é necessário reiniciar 2 vezes o container)
* Entre no Lisk, pelo endereço liberado pelo docker, conforme já citado no inicio deste documento. Ex: http://192.168.99.100:7000/
* Acesse o Lisk com uma nova conta, ou simplesmente informe a seguinte senha: "round craft number example shop jazz green gold snake bring wild mom"
* Vá até Dapp Store, e veja que o nosso Aplicativo se encontra disponível no Blockchai do Lisk.
* Você também pode acessar o Dapp diretamente em: http://192.168.99.100:7000/dapps/ID_DAPP



## Detalhes do funcionamento: blockchainLiskDapp

Dapp simples para enviar Não Conformidades, baseado no blockchain do Lisk.

- Quantidade máxima de caracteres 1000.

- As não conformidades são atualizadas a cada 20 segundos.

- A senha não é obrigatória, caso não informe será considerada a senha padrão: "default-senha-rodolfo".

- A transação não tem taxação, é grátis 0 LISK (devido a ter fins apenas de teste).

## Prints
![Lisk Local](https://github.com/rodolfocruzbsb/blockchainLiskDapp/blob/master/1_lisk_local.png)

![Dapp criado](https://github.com/rodolfocruzbsb/blockchainLiskDapp/blob/master/2_dapp_lisk.png)

![Dapp detalhamento](https://github.com/rodolfocruzbsb/blockchainLiskDapp/blob/master/3_dapp_lisk.png)

![Dapp rodando](https://github.com/rodolfocruzbsb/blockchainLiskDapp/blob/master/4_dapp_rodando.png)

## Referências

- [Lisk](https://lisk.io/documentation?i=lisk-docs/README)
- [Docker](https://docs.docker.com/)
- [Git](https://help.github.com/)
