import { Request, Response } from 'express';
import User from '../models/userModel';
import { UserType } from '../types/userTypes';

export async function checkUserExist(email: string) {
	try {
		const user = await User.findOne({ email });
		return !!user;
	} catch (error) {
		return false;
	}
}
