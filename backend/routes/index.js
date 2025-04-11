import { Router } from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json([{
    Message: "Hello",
    SecondMessage: "world"
  }]);
});

export default router;
