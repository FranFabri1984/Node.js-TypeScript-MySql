import {Request, Response} from  "express";
import User from "../models/user";

export const getUsers = async(req: Request, res: Response) => {
    const user = await User.findAll();
    res.json({user});
}

export const getUser = async(req: Request, res: Response) => {
    const {id} = req.params;
    const user = await User.findByPk(id);

    if (user) {
        res.json({user});
    } 
    else {
        res.status(400).json({msg: `Username ${id} does not exist`});
    }
}

export const postUser = async(req: Request, res: Response) => {
    const {body} = req;
    try {
        
        const existEmail = await User.findOne({
            where:{
                email: body.email
            }
        });

        if (existEmail) {
            return res.status(400).json({
                msg: `Email ${body.email} already exists in the database`,
            });
        }

        const user = await User.create(body);
        await user.save();
        res.json(user);
        
    } catch (error) { 
        console.log(error);
        res.status(500).json({
            msg: 'Contact an admin',
        });
    }
}

export const putUser = async(req: Request, res: Response) => {
    const {id} = req.params;
    const {body} = req;
    try {
        
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(400).json({
                msg: `User ${id} does not exist`,
            });
        }

        await user.update(body);
        res.json(user);
        
    } catch (error) { 
        console.log(error);
        res.status(500).json({
            msg: 'Contact an admin',
        });
    }
}

export const deleteUser = async(req: Request, res: Response) => {
    const {id} = req.params;
    const user = await User.findByPk(id);

    if (!user) {
        return res.status(404).json({
            msg: `User ${id} does not exist`,
        });
    }

    await user.update({state: false})

    res.json(user);
}

