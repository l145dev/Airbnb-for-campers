import { Router } from 'express';

const router = Router();

/* GET users. */
router.get('/', (req, res, next) => {
  res.json([
    {
      userPage: true
    }
  ])
});

export default router;
