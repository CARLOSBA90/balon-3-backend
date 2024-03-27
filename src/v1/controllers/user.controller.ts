import {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user.model';


export const newUser = async (req:Request, res: Response ) => {

    const { username, password } = req.body;
    const user = await User.findOne({where: {username:username}})


    if(user){
        const errorMsg = 'Ya existe el usuario '+username;
        return  res.status(400).json({
            msg: errorMsg
        })
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await User.create({
            username:username,
            password:hashedPassword
        })
        
        const message = 'Usuario '+username+' creado exitosamente!';
    
        res.json({
            msg: message
        });

    } catch (error:any) {
     
        const errorMsg = 'Error al crear nuevo usuario: '+error.message;

        res.status(400).json({
            msg: errorMsg
        })
    }
}


export const login = (req:Request, res: Response ) => {

    const body  = req.body;

    res.json({
        msg: 'Login User',
        body
    });

}