import debug from "debug";
import util from "util";

const log = debug('mat-che:resolvers')

const users = {};

export const resolvers = {
  Query: {
    me: (root, args, ctx) => {
      if (!users[ctx.sid]) return null;
      
      return  { name: users[ctx.sid] }
    }

  },
  Mutation: {
    setName: (root, args, ctx) => {
      log('setting user for: ' + ctx.sid + ' to ' + args["name"]);
      users[ctx.sid] = args["name"];
      
      return { name: users[ctx.sid] }
    }
  }
};
