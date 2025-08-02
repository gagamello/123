# Holochain Simple Communicator

This project demonstrates a minimal chat zome built with the Holochain HDK. It exposes two extern functions:

- `send_message` – store a message entry on the agent's source chain.
- `get_messages` – query the agent's chain for all stored messages.

The code for the zome lives in `holochat/src/lib.rs`. You can compile and run the tests with:

```bash
cd holochat
cargo test
```
