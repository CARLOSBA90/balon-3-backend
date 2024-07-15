import {Request, Response} from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const newUser = async (req:Request, res: Response ) => {

    validateInputParameters(req,res);

    const { username, password } = req.body;

    const userExist = await checkIfUserExist(username);

    if(userExist)
      return  errorMsg(res,'Ya existe el usuario '+username);

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
        errorMsg(res,'Error al crear nuevo usuario: '+error.message);
    }
}

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const login = async (req:Request, res: Response ) => {

    validateInputParameters(req,res);

    const { username, password } = req.body;

    const userExist = await checkIfUserExist(username);

    // Validate if exist user exists
    if(!userExist)
      return errorMsg(res,'No existe el usuario '+username);


    // validate if password is equal
    const passwordValid = await checkPasswordValid(req,res);

    if(!passwordValid)
       return errorMsg(res,'Password incorrecto!');


    // Generate Token
    const token = jwt.sign({ username:username}, 
    process.env.SECRET_KEY||'.SECRET.KEY.313.'
    );

    res.json({
        token
    });

  
}

/**
 * Validate Inputs before flows sequences
 * @param req 
 * @param res 
 */
const validateInputParameters =  (req:Request, res: Response ) => {
    const { username, password } = req.body;

    if(!username) 
       errorMsg(res,'Debe ingresar username.');


    if(!password)
       errorMsg(res,'Debe ingresar password.');

}

/**
 * Check if exists user in Table USER
 * @param username 
 * @returns 
 */
const checkIfUserExist =  async (username:string) => {
    try {
        const user = await User.count({where: {username:username}});
        return user? true:false;  
    } catch (error) {
         return false; // T0D0 handle
    }
}


/**
 * Function to give back response with STATUS 404 with error message
 * @param res 
 * @param errorMsg 
 * @returns 
 */
const errorMsg =  (res: Response, errorMsg:string) => {
    return  res.status(400).json({
        msg: errorMsg
    })
}


const checkPasswordValid = async (req:Request, res: Response ) => {

    const { username, password } = req.body;

    try {
        const user:any = await User.findOne({where: {username:username}});

        if(user){
                const passwordValidate = await bcrypt.compare(password,user.password);
                return passwordValidate;
        }else{
            errorMsg(res,'Error al validar usuario');
        }
    } catch (error:any) {
        errorMsg(res,'Error al validar usuario : <br>'+error.message);
    } 
}
