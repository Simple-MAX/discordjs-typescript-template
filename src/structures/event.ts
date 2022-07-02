import { ClientEvents } from "discord.js";

export class Event<Key extends keyof ClientEvents> {
  constructor(
    public event: Key,
    public handler: (...options: ClientEvents[Key]) => any
  ) {}
}
