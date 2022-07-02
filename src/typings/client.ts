import { ApplicationCommandDataResolvable } from "discord.js";

export interface IRegisterCommandOptions {
  guildId?: string;
  commands: ApplicationCommandDataResolvable[];
}
