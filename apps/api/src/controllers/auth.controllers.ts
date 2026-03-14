import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PlatformUser } from "@enterprise-commerce/core/platform/types"
import { createUser } from "../models/User"
import openDb from '../db/db';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const newUser: PlatformUser = {
    id: null,
    email,
    password
  };

  try {
    const db = await openDb();

    const checkUser = await db.get('SELECT email FROM users WHERE email = ?', email);

    if (checkUser) {
      res.status(409).json({message: "User already exists"})
      return;
    }
    
    const createdUser = await createUser(newUser);
    res.status(201).json({user: createdUser});
  } catch (err) {
    res.status(500).json({error: (err as Error).message});

  } finally {
    console.log("User created")
  }
};