# Universal Guard Production

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment file:

```bash
copy .env.example .env.local
```

3. Edit `.env.local` and set your database and PayPal values.

4. Push database schema:

```bash
npx prisma db push
```

5. Seed default admin:

```bash
npm run db:seed
```

6. Start development server:

```bash
npm run dev
```

## Default login

Username:

```text
admin
```

Password:

```text
admin123
```

Change this immediately in production.
