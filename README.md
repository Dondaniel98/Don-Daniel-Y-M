# Don Daniel Y M — Portfolio

A portfolio site with a Node.js/Express/MongoDB backend powering:
- **Contact form** — messages save to MongoDB; optional email notification via Nodemailer.
- **Visitor counter** — increments once per page load, tracked per day.
- **Testimonials** — visitors can submit feedback; approved feedback displays on the page.

## Project structure

```
portfolio-app/
├── public/              ← front-end (served statically)
│   ├── index.html
│   ├── css/style.css
│   └── js/main.js
├── server/
│   ├── server.js        ← Express app entry point
│   ├── config/db.js     ← MongoDB connection
│   ├── models/          ← Mongoose schemas (Contact, Testimonial, Visitor)
│   └── routes/          ← API routes (contact, testimonials, visitors)
├── package.json
└── .env.example
```

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up MongoDB**
   - Easiest: create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and copy the connection string, OR
   - Run MongoDB locally (`mongod`) if you have it installed.

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and set `MONGODB_URI` to your connection string. Email settings are optional — leave them blank and the contact form will still save messages to the database, it just won't send you an email notification.

4. **Run the server**
   ```bash
   npm run dev     # with auto-reload (nodemon)
   # or
   npm start
   ```

5. Open **http://localhost:5000** in your browser.

## API endpoints

| Method | Endpoint              | Description                          |
|--------|------------------------|--------------------------------------|
| POST   | `/api/contact`         | Save a contact message               |
| GET    | `/api/testimonials`    | List approved testimonials           |
| POST   | `/api/testimonials`    | Submit a new testimonial             |
| POST   | `/api/visitors/hit`    | Increment and return today's count   |
| GET    | `/api/visitors/count`  | Read today's count (no increment)    |

## Notes & next steps

- **Testimonial moderation:** submissions are auto-approved for simplicity. For production, set `approved: false` by default in `server/models/Testimonial.js` and build a small admin route (e.g. `PATCH /api/testimonials/:id/approve`) protected by a login, so you can review before anything goes public.
- **Rate limiting:** the contact form is rate-limited (20 requests / 15 min per IP) to reduce spam. Testimonials aren't limited yet — worth adding the same if it gets abused.
- **Deploying:** this is a standard Express app, so it deploys as-is to Render, Railway, Fly.io, or a small VPS. Pair it with MongoDB Atlas for the database so you don't need to self-host Mongo.
- **Email notifications:** uses Gmail by default via Nodemailer. You'll need an [App Password](https://myaccount.google.com/apppasswords), not your regular Gmail password.
