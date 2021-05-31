# Getting Started
When you first download the bot, there some things you want to change.
Before you make any changes, run `npm ci` to install all the packages the bot uses.

## Creating a bot
If you haven't already, create a bot on the [Discord developers](https://discord.com/developers/applications) page.
If you don't know how to, follow [this guide](https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/v12/getting-started/getting-started-long-version.md#step-1-creating-your-app-and-bot-account).

## Bot Configuration
First off, you need to rename the **config-example.js** file to **config.js**.
Next, change the values inside the file to the correct information for your bot.
If you are the only owner of your bot, change the *owners* array to only have one value (your ID).

*Note: the ***color***, ***emoji*** and ***footer*** variables are used for message embeds.*
*Every part of the bot that sends messages (with the exception of eval) uses message embeds.*

### dotenv (optional)
If you want to use *.env* files to store your token, follow these steps:

1. Install the *dotenv* module using `npm i -D dotenv`
2. Create a file called *.env* in the **src/** folder.
3. Add **require("dotenv").config({ path: ${process.cwd()}/src/.env })** to the top of the *index.js* file.
4. Change the token value inside your *config.js* file to `process.env.YOUR-TOKEN-VARIABLE`.

## Running the bot
The bot is now ready to run!
To start up the bot, simply type `npm start` in the console.
You can also type `npm test` to run the bot with [nodemon](https://www.npmjs.com/package/nodemon).

## Bot Mentions
In the message event (*src/events/message.js*), whenever someone mentions the bot, it sends a "Hello" message reminding users of the bot prefix.
The bot currently mentions my GitHub profile, so if you'd like to change that, feel free to.

## Creating your first command/event
You're now ready to start making commands and events!
To see how to make a command, follow [these instructions](https://github.com/aanthr0/djs-template/blob/main/docs/making_a_command.md).
Alternatively, you can follow [these instructions](https://github.com/aanthr0/djs-template/blob/main/docs/making_an_event.md) to see how to make events.