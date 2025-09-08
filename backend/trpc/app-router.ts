import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import { getAllClubsProcedure } from "./routes/clubs/get-all/route";
import { updateClubProcedure } from "./routes/clubs/update/route";
import { getNotificationsProcedure } from "./routes/notifications/get-all/route";
import { approveAdminProcedure } from "./routes/notifications/approve-admin/route";
import { 
  joinClubProcedure, 
  leaveClubProcedure, 
  getUserMembershipsProcedure, 
  getClubMembersProcedure, 
  isUserMemberProcedure 
} from "./routes/clubs/join/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  clubs: createTRPCRouter({
    getAll: getAllClubsProcedure,
    update: updateClubProcedure,
    join: joinClubProcedure,
    leave: leaveClubProcedure,
    getUserMemberships: getUserMembershipsProcedure,
    getClubMembers: getClubMembersProcedure,
    isUserMember: isUserMemberProcedure,
  }),
  notifications: createTRPCRouter({
    getAll: getNotificationsProcedure,
    approveAdmin: approveAdminProcedure,
  }),
});

export type AppRouter = typeof appRouter;