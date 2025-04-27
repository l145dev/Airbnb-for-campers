// FOR FUTURE (maybe)

import { Router } from 'express';
import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';
import passport from 'passport';

// const prisma = new PrismaClient();

const router = Router();

dotenv.config();

// // Google OAuth route
// router.get('/google', passport.authenticate('google', {
//     scope: ['profile', 'email']
// }));

// router.get('/google/callback', passport.authenticate('google', {
//     failureRedirect: '/login',
// }), (req, res) => {
//     // Successful authentication, redirect home.
//     console.log(res);
//     res.redirect('/');
// });

// // Microsoft OAuth route
// // router.get('/microsoft', passport.authenticate('microsoft', {
// //     scope: ['user.read']
// // }));

// // router.get('/microsoft/callback', passport.authenticate('microsoft', {
// //     failureRedirect: '/login',
// // }), (req, res) => {
// //     // Successful authentication, redirect home.
// //     res.redirect('/');
// // });

export default router;