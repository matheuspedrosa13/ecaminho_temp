# Usa a versão correta do Node.js
FROM node:22

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos do projeto para dentro do container
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

# Copia o restante do código para dentro do container
COPY . .

# Compila o projeto
RUN npm run build

# Expõe a porta que o app vai rodar
EXPOSE 6767

# Comando para rodar o app
CMD ["npm", "run", "start:prod"]
