// server/src/events/listeners/log-published-posts.listener.js
//
// The first, deliberately trivial listener - proves the pattern works
// end-to-end. Real listeners (notify followers, update a search index)
// are added in later lectures WITHOUT modifying PostService.publish()
// again - this is the pattern's actual payoff.

import { EventBus } from "../event-bus.js";

EventBus.on("post.published", (payload) => {
  console.log(`[event] post.published:`, payload);
});
