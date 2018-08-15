# Syndicator
## How to start
- This application is built from create-react-app, MongoDB, and ExpressJS
- Three things needs to be running for this to work
	1. Make sure MongoDB is running with `mongod`
		> You can open another terminal and navigate the database if you wish with `mongo`
	2. Make sure the `server.js` inside `server` folder is running with `node server.js` and `npm install` the dependencies
	3. Then lastly, in `client` folder, also `npm install` the react dependencies, then `yarn start` to run React App
		> The react dependencies may have a few vulnerabilities, but the terminal will tell you to fix it by `npm audit fix`

## What I have done
#### Client Side (React)
- The main page is the dashboard, running in `port: 3000`
- You are able to type in name, description, and the start and end dates of the event
- Due to time I was not able to implement more inputs (if it was possible)
- The events added is shown on the right, and it will dissappear when it has been added to other sites

##### The Date and Time
- Just fyi, I have made it so that you can't pick a start time before `Date.now()` and an end time after start time
- However, because there is a delay by cron before posting the event, when it is actually being posted, the event may not be posted on that site because the start time fell behind present
- I will just assume that every event made is at least 1 day ahead or at least longer than the cron time

##### Inside Console
- Everytime the submit button pressed it prints out in console
- It also shows when the site is fetching data (in this case it is the events that is being added)

#### Server Side (Express)
- Server is running in `port: 5000`
- I have the events added into mongoDB with a event schema inside `db.js`
- Everything added is displayed in 	`http://localhost:5000/api/events`
- Each event has a boolean that tells you if it has been added to other event sites
- Cron will be set to 1 minute, but you can change it to a few seconds to actually see the events being posted and leaving the dashboard without waiting for a long time
- Due to time I only have managed to post onto:
	1. Eventbrite
	2. Picatic
	3. Xing Events

**ALL THE API KEYS OR TOKENS ARE INSIDE A `config.json` FILE (mine looks like this)**
```json
{
	"eventbrite": "xxxx...",
	"eventzilla": {
		"token":"xxxx...",
		"zapier-key":"xxxx..."
	},
	"xing": {
		"key": "xxxx...",
		"email": "xxxx...",
		"id": "xxxx..."
	},
	"picatic": {
		"private_key":"sk_live_xxxx...",
		"public_key":"pk_live_xxxx..."
	}
}
```

##### Inside Console
- As each time passes when cron checks for events to be sent out, it will print `Nothing has been added.` or all the events in queue if there are any

#### MongoDB
- Everything is inside the database called `pulsd` with a collection called `events`
- `events` will contain all the events that has been added