import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import UserModel from '../dao/models/userModel.js';
import { isValidPassword } from '../utils/encrypt.js';

const initializePassport = () => {
  
  passport.use('login', new LocalStrategy(
    { usernameField: 'email' }, // usamos "email" en lugar de "username"
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });
        if (!user) return done(null, false, { message: 'Usuario no encontrado' });

        if (!isValidPassword(user, password)) return done(null, false, { message: 'Contraseña incorrecta' });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  
  passport.use('jwt', new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    },
    async (jwt_payload, done) => {
      try {
        const user = await UserModel.findById(jwt_payload.id);
        if (!user) return done(null, false);
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  ));
};

export default initializePassport;
