// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
import { BotFrameworkAdapter } from 'botbuilder';
import { MicrosoftAppCredentials } from 'botframework-connector';

// Set up to authenticate on scratch and PPE environment.
MicrosoftAppCredentials.trustServiceUrl('https://api.scratch.botframework.com');
MicrosoftAppCredentials.trustServiceUrl('https://state.scratch.botframework.com');
MicrosoftAppCredentials.trustServiceUrl('https://token.scratch.botframework.com');

MicrosoftAppCredentials.trustServiceUrl('https://api.ppe.botframework.com');
MicrosoftAppCredentials.trustServiceUrl('https://state.ppe.botframework.com');
MicrosoftAppCredentials.trustServiceUrl('https://token.ppe.botframework.com');

// Catch-all for errors.
async function onTurnErrorHandler(context, error) {
  // This check writes out errors to console log .vs. app insights.
  // NOTE: In production environment, you should consider logging this to Azure
  //       application insights.
  console.error(`\n [onTurnError] unhandled error: ${error}`);

  // Send a trace activity, which will be displayed in Bot Framework Emulator
  await context.sendTraceActivity(
    'OnTurnError Trace',
    `${error}`,
    'https://www.botframework.com/schemas/error',
    'TurnError'
  );

  // Send a message to the user
  await context.sendActivity('The bot encountered an error or bug.');
  await context.sendActivity('To continue to run this bot, please fix the bot source code.');
}

export default async function createBotFrameworkAdapter(
  {
    APPSETTING_WEBSITE_SITE_NAME: websiteName,
    BOT_OPENID_METADATA: openIdMetadata,
    CHANNEL_SERVICE: channelService,
    MICROSOFT_APP_ID: appId,
    MICROSOFT_APP_PASSWORD: appPassword
  } = process.env
) {
  // See https://aka.ms/about-bot-adapter to learn more about how bots work.
  const adapter = new BotFrameworkAdapter({ appId, appPassword, channelService, openIdMetadata });

  // Enable Direct Line App Service Extension
  // See https://docs.microsoft.com/en-us/azure/bot-service/bot-service-channel-directline-extension-node-bot?view=azure-bot-service-4.0
  adapter.useNamedPipe(context => bot.run(context), websiteName + '.directline');

  // Set the onTurnError for the singleton BotFrameworkAdapter.
  adapter.onTurnError = onTurnErrorHandler;

  return adapter;
}