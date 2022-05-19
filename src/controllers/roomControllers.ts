import { Request, Response, NextFunction } from 'express';
import errorMessages from '../assets/errorMessages';
import Room from '../models/roomModel';
import { IRoom } from '../types/roomTypes';
import {addRoomValidator} from  '../validators/roomValidators';

async function validateRoomNumber(roomNumber: number) {
    const roomWithNumber = await Room.findOne({number: roomNumber});
    if(roomWithNumber) {
        throw new Error(errorMessages.roomWithNumberAlreadyExist);
    } else {
        return;
    }
}

export async function addRoomDataValidation(req: Request<any, any, IRoom>, res: Response, next: NextFunction) {
    try {
        addRoomValidator(req.body);
        await validateRoomNumber(req.body.number);
        next();
    } catch (error: any) {
        return res.status(400).send({error: error.message});
    }   
}

export async function updateRoomDataValidation(req: Request<any, any, Partial<IRoom>, {id: string}>, res: Response, next: NextFunction) {
    try {
        const room = await Room.findById(req.query.id);
        if(room) {
            const newData: IRoom = {
                number: room.number,
                floor: room.floor,
                beds: room.beds,
                standard: room.standard,
                ...req.body
            }
            addRoomValidator(newData);
            if(req.body.number) {
                await validateRoomNumber(req.body.number);
            }
            next();
        } else {
            throw new Error("Incorect room id")
        }
    } catch(error: any) {
        return res.status(400).send(error.message);
    }
}

export async function deleteRoomValidation(req: Request<any, any, any, {id: string}>, res: Response, next: NextFunction) {
    if(!req.query.id) {
        res.status(400).send({error: errorMessages.incorectId});
    } else {
        next();
    }
}