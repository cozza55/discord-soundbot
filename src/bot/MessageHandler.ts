import '../discord/Message';

import { Message } from 'discord.js';

import userHasElevatedRole from '~/commands/util/userHasElevatedRole';
import { config } from '~/util/Container';
import * as ignoreList from '~/util/db/IgnoreList';
import localize from '~/util/i18n/localize';

import CommandCollection from './CommandCollection';

export default class MessageHandler {
  private readonly commands: CommandCollection;
  private readonly deleteMessages: boolean;

  constructor(commands: CommandCollection, deleteMessages?: boolean) {
    this.commands = commands;
    if (deleteMessages === true) {
      this.deleteMessages = true;
    } else {
      this.deleteMessages = false;
    }
  }

  public handle(message: Message) {
    if (!this.isValidMessage(message)) return;

    const messageToHandle = message;
    messageToHandle.content = message.content.substring(config.prefix.length);

    this.execute(messageToHandle);
  }

  private isValidMessage(message: Message) {
    return (
      !message.author.bot &&
      !message.isDirectMessage() &&
      message.hasPrefix(config.prefix) &&
      !ignoreList.exists(message.author.id)
    );
  }

  private execute(message: Message) {
    const [command, ...params] = message.content.split(' ');
    const commandToRun = this.commands.get(command);

    if (commandToRun.elevated && !userHasElevatedRole(message.member)) {
      message.channel.send(localize.t('errors.unauthorized'));
      if (this.deleteMessages) message.delete();

      return;
    }

    commandToRun.run(message, params, this.deleteMessages);
  }
}
