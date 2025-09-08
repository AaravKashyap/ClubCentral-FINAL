import app from '../../backend/hono';
import { handle } from 'hono/vercel';

export const config = {
  runtime: 'edge',
};

export default handle(app);