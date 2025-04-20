# Prisma Setup

## Setup
1. Install prisma as devDependency
``` bash
npm install prisma --save-dev
```

2. Install prisma client
``` bash
npm install @prisma/client
```

3. initialize prisma in folder 
``` bash
npx prisma init
```

3. Make .env file with database url in prisma folder
``` env
DATABASE_URL="postgresql://username:password@localhost:5432/airbnbdb"
```

4. import the database from mysql server (will add db structure in schema.prisma)
``` bash
npx prisma db pull
```

5. If error, make sure DATABASE_URL is correct in .env

6. Generate prisma client
``` bash
npx prisma generate
```

7. now u can use prisma in your routes like this 
``` js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
```

## Update

1. Navigate to backend
```bash
cd backend
```

2. Pull DB (updates applies updates to prisma.schema)
```bash
npx prisma db pull
```

3. Close backend and prisma studio if they're running

4. Generate prisma client
```bash
npx prisma generate
```