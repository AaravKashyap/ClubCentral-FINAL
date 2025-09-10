import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import { loginProcedure, signupProcedure, meProcedure } from "./routes/auth/route";
import { 
  getAllClubsProcedure, 
  getClubByIdProcedure, 
  getFavoriteClubsProcedure, 
  toggleFavoriteProcedure,
  getUpcomingMeetingsProcedure 
} from "./routes/clubs/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  auth: createTRPCRouter({
    login: loginProcedure,
    signup: signupProcedure,
    me: meProcedure,
  }),
  clubs: createTRPCRouter({
    getAll: getAllClubsProcedure,
    getById: getClubByIdProcedure,
    getFavorites: getFavoriteClubsProcedure,
    toggleFavorite: toggleFavoriteProcedure,
    getUpcomingMeetings: getUpcomingMeetingsProcedure,
  }),
});

export type AppRouter = typeof appRouter;