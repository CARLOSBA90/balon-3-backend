FROM node:18-alpine

WORKDIR /app

# Copia los manifiestos de dependencias
COPY package*.json ./

# Instala SOLO las dependencias necesarias para produccion (ignora TypeScript y nodemon)
RUN npm install --omit=dev

# Copia la carpeta dist  
COPY dist ./dist

EXPOSE 4501

# Inicia app
CMD ["npm", "start"]
