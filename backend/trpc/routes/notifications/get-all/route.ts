import { publicProcedure } from '../../../create-context';
import { AdminNotification } from '@/types/club';

// No fake notifications - real notifications will be added when users request admin approval
const mockNotifications: AdminNotification[] = [];

export const getNotificationsProcedure = publicProcedure.query(() => {
  return mockNotifications.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
});