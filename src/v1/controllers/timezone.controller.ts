import {Request, Response} from 'express';
import { Timezone } from '../models/timezone.model';

import * as fs from 'fs';
import path from 'path'; 

export const getTimeZones = async () => {

  checkQuantityData();
  const listTimeZones = await Timezone.findAll();

}


const checkQuantityData = async () => {
    const count = await Timezone.count();

    if (count === 0 && process.env.MODE === 'DEMO')
        fillFromJson();
    
    if (count === 0 && process.env.MODE === 'PRODUCTION')
        fillFromAPI();
}


const fillFromJson= async () => {
    const filePath = path.resolve(__dirname, '../mocks/timezone.json'); // Ruta completa al archivo timezone.json
    try {
      const jsonData = await fs.promises.readFile(filePath, 'utf8');
      const data: string[] = JSON.parse(jsonData);
      console.log(data);

      data.forEach( async (timezone) => {
          console.log(timezone);
          try {
             await Timezone.create({
              description: timezone
             })
             console.log(`Registro ${timezone} insertado en base de datos!`)
          } catch (error:any) {
            console.log("Error al insertar Timezone", error.messsage);
          }
      });
    } catch (error) {
      console.error('Error al leer el archivo:', error);
    }
}

const fillFromAPI= async () => {
    console.log("Cargar desde API");
}