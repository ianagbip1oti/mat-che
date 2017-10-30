import { PubSub, withFilter } from "graphql-subscriptions";

import debug from "debug";
import util from "util";

import R from "ramda";

const log = debug("mat-che:resolvers");

const users = {};

const pubsub = new PubSub();

const getUser = function(sid) {
  if (!users[sid]) return null;

  return { name: users[sid] };
};

class Message {
  constructor(user, content) {
    this.user = user;
    this.content = content || "";
  }

  save() {
    if (!this.user) return;
    if (R.trim(this.content) === "") return;

    log("publishing message...");
    
    const payload = {
      "user" : this.user,
      "content" : this.content
    }
    pubsub.publish("messageAdded", { "messageAdded" : payload });
  }
}

export const resolvers = {
  Query: {
    me: (root, args, ctx) => getUser(ctx.sid)
  },
  Mutation: {
    setName: (root, args, ctx) => {
      users[ctx.sid] = R.trim(args["name"]);

      return getUser(ctx.sid);
    },
    sendMessage: (root, args, ctx) => {
      const msg = new Message(getUser(ctx.sid), args["content"]);

      msg.save();

      return msg;
    }
  },
  Subscription: {
    messageAdded: {
      subscribe: () => pubsub.asyncIterator("messageAdded")
    }
  }
};
