import session from "express-session";
import pgSession from "connect-pg-simple";
import pool from "../db.js";
import dotenv from "dotenv";

dotenv.config();

const PgSession = pgSession(session);

const sessionMiddleware = session({
  store: new PgSession({
    pool: pool,           
    tableName: "user_sessions"
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
});

export default sessionMiddleware;