// server/src/events/event-bus.js
//
// A minimal, in-process Observer/Pub-Sub implementation (Section 4.3).
// This is NOT a message broker or distributed event bus (Lecture 5's
// event-driven architecture discussion) - it is the smallest possible
// version of the pattern, appropriate to Inkwell's modular-monolith
// architecture (ADR-001).

const listeners = {};

export const EventBus = {
  on(eventName, handler) {
    (listeners[eventName] ??= []).push(handler);
  },
  emit(eventName, payload) {
    (listeners[eventName] ?? []).forEach((handler) => handler(payload));
  },
};
