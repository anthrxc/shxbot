# Getting Started

## Using the [MongoDB](https://mongodb.com/) website
To use a database from the MongoDB website, [create an account](https://account.mongodb.com/account/register) or [log in](https://account.mongodb.com/account/login).
If you have already completed any of the steps below, feel free to skip ahead in the documentation to a step you haven't completed.

### Creating an organization
After you've created your account, you will need to create an organization. The name of your organization does not matter, what I have for my personal projects is just my username (aanthr0), so there's an idea. You can also choose to invite people into the organization, but I wouldn't recommend inviting anyone except users you are working on the project with.

### Creating a project
Once you've created an organization, you will need to create a project. Again, you can name it whatever you like, what I do is just the name of my project. You can also choose to invite users to the project, but just like inviting into an organization, I wouldn't recommend inviting anyone that doesn't work on your project with you.

### Creating a cluster
After you've made a project, you have to create a cluster where the database will be stored. In the first step, you will be asked to choose a plan. If you are working on a smaller project that isn't supposed to have many users, or you are just experimenting with databases, I would recommend using the free tier, otherwise go with the paid ones (Dedicated Clusters start at $0.08/hr and Dedicated Multi-Cloud & Multi-Region Clusters start at $0.13/hr). Next, you will need to chose a cloud provider and region. I recommend chosing whichever provider has an available region closest to where your project will be hosted. After you chose the provider and region, you need to choose a cluster tier. Again, if you're experimenting or have a smaller project, I recommend going with the free M0 tier, but you can always upgrade or downgrade if you'd like. If you chose an M2 cluster (or higher), you can also choose to have backups. After that, you will need to choose a name fror your cluster, but **be careful because you cannot change the name after purchase**.

## Using other MongoDB providers
If you want to use other MongoDB providers, go through the steps to create a cluster in your provider, and once you have created it, you can [connect your database](#connecting_your_database).

## Connecting to your database

### In MongoDB Compass
Once your cluster has been created, press the `CONNECT` button below your cluster's name. Choose whether you want connections to be available only from your current IP address, a specific IP address (which you have to provide), or any IP address. After that, you need to create a database user. Choose your username and password (or click on `Autogenerate Secure Password`) and create a database user. Once the `Choose a connection method` button lights up in green, click on it and choose the `Connect using MongoDB Compass` button. You will be prompted to download MongoDB Compass (which you need to do if you do not already have it). Once you downloaded Compass (or if you already have it), select `I have MongoDB Compass`, and choose your version of Compass. Now, copy the connection string, and paste it into the `New Connection` tab in Compass and click on `Connect`. If you see a screen with 3 databases called  `admin`, `config` and `local`, you've successfully connected!

### In your code
To connect to your database in your code, open your config.js file (located in `src/`), and find the `database` object. In the object, replace the value of `type` with `mongodb`, and the value of `uri` with the connection URI (the same one you used to connect to the database in MongoDB Compass), and change the `/test` at the end of the string to `/Data`. After you saved the file, open the terminal and run `npm test` or `npm start`. If there were no errors on startup, you have successfully connected to the database. Good job!

## Other
If you come across a bug with the template, feel free to open an issue or pull request. From here on, you can [create an event](https://github.com/aanthr0/djs-template/blob/main/docs/making_an_event.md) or [a command](https://github.com/aanthr0/djs-template/blob/main/docs/making_a_command.md).
