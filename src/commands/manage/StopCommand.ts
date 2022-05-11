import { Message } from 'discord.js';

import QueueCommand from '../base/QueueCommand';

export class StopCommand extends QueueCommand {
  public readonly triggers = ['leave', 'stop'];

  public run(message: Message, params?: string[], deleteMessages?: boolean) {
    if (!message.guild) {
      return;
    }

    if (!message.guild.voice) {
      return;
    }

    this.queue.clear();

    const { connection: voiceConnection } = message.guild.voice;
    if (voiceConnection) voiceConnection.disconnect();

    if (deleteMessages) this.deleteMessage(message);
  }
}
