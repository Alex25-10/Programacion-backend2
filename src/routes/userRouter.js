import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

import UserModel from '../dao/models/userModel.js';
import PasswordResetToken from '../dao/models/PasswordResetToken.js';
import { createHash, isValidPassword } from '../utils/encrypt.js';

const router = Router();

// 📌 REGISTRO
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

// 📌 LOGIN
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

// 📌 CURRENT USER (JWT)
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

// 📌 FORGOT PASSWORD (ENVÍO DE CORREO)
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Elimina tokens anteriores
    await PasswordResetToken.deleteMany({ userId: user._id });

    // Genera nuevo token y guarda
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hora
    await PasswordResetToken.create({ userId: user._id, token, expiresAt });

    const resetLink = `http://localhost:3000/reset-password?token=${token}&uid=${user._id}`;

    // Configuración de nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: 'TuApp <no-reply@tuapp.com>',
      to: email,
      subject: 'Recuperación de contraseña',
      html: `
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Este enlace expirará en 1 hora.</p>
      `
    });

    res.status(200).json({ message: 'Correo de recuperación enviado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al enviar correo de recuperación' });
  }
});

// 📌 RESET PASSWORD (Restablecer la contraseña con token)
router.post('/reset-password', async (req, res) => {
  const { token, uid, newPassword } = req.body;

  try {
    const resetToken = await PasswordResetToken.findOne({ userId: uid, token });
    if (!resetToken) return res.status(400).json({ error: 'Token inválido o expirado' });
    if (resetToken.expiresAt < new Date()) {
      await PasswordResetToken.deleteOne({ _id: resetToken._id });
      return res.status(400).json({ error: 'Token expirado' });
    }

    const user = await UserModel.findById(uid);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const isSamePassword = isValidPassword(user, newPassword);
    if (isSamePassword) return res.status(400).json({ error: 'No puedes usar la misma contraseña' });

    user.password = createHash(newPassword);
    await user.save();

    await PasswordResetToken.deleteOne({ _id: resetToken._id });

    res.status(200).json({ message: 'Contraseña restablecida correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al restablecer la contraseña' });
  }
});

export default router;
