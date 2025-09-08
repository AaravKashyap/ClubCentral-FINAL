import app from '../../backend/hono';
import { handle } from '@hono/node-server/vercel';

export default handle(app);