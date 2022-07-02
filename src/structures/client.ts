import fs from "fs";
import path from "path";
import {
  ApplicationCommandDataResolvable,
  Client,
  ClientEvents,
  Collection,
} from "discord.js";
import { CommandType } from "../typings/command";
import { IRegisterCommandOptions } from "../typings/client";
import { Event } from "../structures/event";

export class ExtendedClient extends Client {
  commands: Collection<string, CommandType> = new Collection();

  constructor() {
    super({ intents: ["GUILDS", "GUILD_MESSAGES"] });
  }

  start() {
    this.registerModules();
    this.login(process.env.TOKEN);
  }

  async importFile(filePath: string) {
    return (await import(filePath))?.default;
  }

  async registerCommand({ commands, guildId }: IRegisterCommandOptions) {
    if (guildId) {
      this.guilds.cache.get(guildId)?.commands.set(commands);
      return;
    }
    this.application?.commands.set(commands);
  }

  async registerModules() {
    const commands: ApplicationCommandDataResolvable[] = [];
    const commandPath = path.join(__dirname, "../commands");

    const commandFiles = fs
      .readdirSync(commandPath)
      .filter((file) => file.endsWith(".ts"));

    const commandPromises = commandFiles.map((file) => {
      const filePath = path.join(commandPath, file);
      return this.importFile(filePath);
    });

    const commandsArray = await Promise.all(commandPromises);

    for (let index = 0; index < commandsArray.length; index++) {
      const command: CommandType = commandsArray[index];
      if (!command.name) return;
      console.log(command);
      this.commands.set(command.name, command);
      commands.push(command);
    }

    const eventPath = path.join(__dirname, "../events");
    const eventFiles = fs
      .readdirSync(eventPath)
      .filter((file) => file.endsWith(".ts"));

    const eventPromises = eventFiles.map((file) => {
      const filePath = path.join(eventPath, file);
      return this.importFile(filePath);
    });

    const eventsArray = await Promise.all(eventPromises);

    for (let index = 0; index < eventsArray.length; index++) {
      const event: Event<keyof ClientEvents> = eventsArray[index];
      this.on(event.event, event.handler);
    }
  }
}
