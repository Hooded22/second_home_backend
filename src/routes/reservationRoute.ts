import { Router } from "express";
import auth from "./verifyToken";

const reservationRouter = Router();

reservationRouter.use('/', auth);

reservationRouter.get('/');

reservationRouter.get('/myReservations');

reservationRouter.post('/');

reservationRouter.post('/endReservation');

reservationRouter.post('/delayReservation');