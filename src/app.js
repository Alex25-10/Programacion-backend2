import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import passport from 'passport';

import initializePassport from './config/passport.js';
import userRouter from './routes/userRouter.js'; 

dotenv.config();

const app = express();
app.use(express.json());


mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error en MongoDB:', err));


initializePassport();
app.use(passport.initialize());


app.use('/api/sessions', userRouter); 


app.listen(3000, () => console.log('🚀 Servidor escuchando en puerto 3000'));
