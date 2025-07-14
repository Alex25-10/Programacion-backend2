import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';
import { createHash, isValidPassword } from '../utils/encrypt.js';

const router = Router();


router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    const userExists = await UserModel.findOne({ email });
    if (userExists) return res.status(400).json({ error: 'El usuario ya existe' });

    const hashedPassword = createHash(password);
    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword
    });

    res.status(201).json({ message: 'Usuario creado', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});


router.post('/login', async (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login exitoso', token });
  })(req, res, next);
});


router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    message: 'Usuario autenticado con JWT',
    user: {
      id: req.user._id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

export default router;
