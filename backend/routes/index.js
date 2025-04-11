import { Router } from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// probably gonna use this for homepage (if needed, probably not)
const router = Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json([{
    Message: "Hello",
    SecondMessage: "world"
  }]);
});

export default router;
