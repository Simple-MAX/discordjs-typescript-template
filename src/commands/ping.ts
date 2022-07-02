import { Command } from "../structures/command";

export default new Command({
  name: "ping",
  description: "Ping!",
  run: async ({ interaction }) => {
    interaction.followUp("Pong!");
  },
});
