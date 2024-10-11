# MVP TODOS

User Auth

- enable user auth and protect home page

Database

- enable user to store/load data using user_id

# roadmap

get footage upload working

# wishlist

link to tiktoks for reference
loading bars
timeline editor
cost efficient ai calls

# Setup

The setup currently has 2 users. user 1 has user_id of 123456 and user 2 has user_id 232323. This is found in the db API route file.

```
const userdata = await collection.find({user_id:<current user id>}).toArray();
```

I have included a button on the main page that outputs the video_url for the selected user in the client console. The goal would be to pass the user_id as a header from middleware so we can use it in the db API route to load the current users data.

# Changelog

- new user data is entered into DB after new user is created in Kinde using webhooks API
- The route /dashboard gets redirected back to the root if not logged in
- added client side user data fetching
