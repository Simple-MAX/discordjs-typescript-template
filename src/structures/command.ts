import { CommandType } from "../typings/command";

export class Command {
  constructor(options: CommandType) {
    Object.assign(this, options);
  }
}
