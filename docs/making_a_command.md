# Making a command
Unless the 3 commands that this template comes with are enough for you, you're going to want to make some more commands.
And that's what this repository is for!

## "run" export
The run export is the main part of the command, where all your code and logic for the command goes.
The command cannot run without the run export, and omitting it will generate an error.
Fortunately, creating it is simple!

Just use the following code:
```javascript
// If a database connection is present, you can provide the database argument after "args"
module.exports.run = async(client, message, args, database) => {
    // your code here
};
```

## "help" export
The help export is what the dynamic help command uses to provide information about the command.
It also defines what permissions users need to run the command, whether or not the command is restricted to bot owners, and how many arguments the command needs to function.
Omitting the help export will generate an error.

The help export uses the following code:
```javascript
module.exports.help = {
    name: "commandName", // required - defines what users will type in to use the command
    description: "An example command", // required - a brief description of what the command does
    aliases: "cmd" || ["cmd1", "cmd2", "cmd3"], // optional - aliases for the command, for multiple aliases, use an array
    requiredPerms: "PERMISSION" || ["PERMISSION1", "PERMISSION2", "PERMISSION3"],   // These are all optional, and by default are none, none and false, respectively
    requiredRoles: "ROLE_ID" || ["ROLE1_ID", "ROLE2_ID", "ROLE3_ID"],               // They cannot be used together because of conflict
    ownerOnly: true || false,                                                       // Misusing commands with these settings proves you're a fucking idiot
    usage: "<required argument> [optional argument]", // optional - shows users how to use the command in the help command and when they have an incorrect number of arguments
    minArgs: 1, // optional - defines the minimum number of arguments users need to provide when using the command | default: 0
    maxArgs: 2 // optional - defines the maximum number of argument users need to provide when using the command, for infinite set the number to -1 | default: -1
};
```

## Other
You've successfully created a command! If you come across a bug, feel free to open an issue or pull request (for issues with your code, do **not** open pull requests).
To see how to make events, follow [these instructions](https://github.com/aanthr0/djs-template/blob/main/docs/making_an_event.md).
