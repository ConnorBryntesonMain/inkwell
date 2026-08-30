# docs/requirements/WATCH-LIST.md

| Requirement | Watch for | Status as of Lecture 3 |
|---|---|---|
| US-03's negotiated MVP scope (Section 5.4). This section talks about a deal already agreed on. The deal set the first-version scope, or MVP, for editing posts. | Watch for feedback from the Author. The feedback would say plain-text editing is not good enough. This feedback has not happened yet. It is only a real concern once it actually happens. | No signal yet. Nothing has come up so far. Keep watching once Lectures 6 and 7 ship. Shipping means the feature goes live. |
| Register and Login non-enumeration extensions. Non-enumeration means the system does not reveal which emails are already registered. | Watch for any future feature that breaks this rule by accident. One example is a "check if email exists" endpoint. An endpoint is a piece of the system that answers a specific request. This kind of endpoint would leak information it shouldn't. | Clear for now. No such endpoint exists yet. |
| Post behavioral model (Section 4.8). This model shows the different states a Post can be in. | Watch for any future feature that assumes a Post state not shown in this model. One example is comments. Comments are planned for Lecture 3, Exercise 5. | Open. This is not fully settled yet. The Comment feature's own model has not been written. That will happen in Exercise 6. |
