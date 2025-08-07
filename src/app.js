import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import passport from 'passport';
import initializePassport from './config/passport.js';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/product.router.js';
import cartRouter from './routes/carts.routes.js'; // ✅ nuevo

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/products', productRouter);
app.use('/api/sessions', userRouter);
app.use('/api/carts', cartRouter); // ✅ nuevo

// Inicialización de Passport
initializePassport();
app.use(passport.initialize());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error en MongoDB:', err));

// Arranque del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});
