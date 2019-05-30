# ticket-app

# Disclaimer: This API was build as part of a homework. The rest of the homework is kept in the corresponding private repository and won't be made public.  

This is a simple API for an app, that provides endpoints for creating and viewing events, tickets and comments on the tickets. 

Logged in users can add events, publich tickets and post comments. 
Everyone can see the list of events, tickets and comments.
There is an added ticket fraud warning, where the fraud risk is calculated based on: 
  - the price of the ticket - the risk is higher if the price is too small,
  - the time of publishing - the risk is higher if the ticket is published outside working hours
  - the number of comments on a ticket - if there are more than three comments the risk is higher. 
 
# to run the api:

1. Install the dependancies: npm install
2. Run a PostgreSQL instance locally on localhost:5432, username: postgres, password:ticket. 
3. cd into the api's folder and run nodemon. the server will start listening on localhost:3000 

#test the routes:

1. Sigh Up: POST to localhost:3000/users. Example body:
 {
	"firstName":"FirstName",
	"lastName":"LastName",
	"email":"user@example.com",
	"password":"123456789"
 }

All fields are required. Password should be at least 8 characters.

2. Login: POST to localhost:3000/logins. Example body: 
 {
	"email":"user@example.com",
	"password":"123456789"
 }
 The response body is a jwt token.To use the protected routes, copy the token and paste it in auth header of the route.

3. To create an event: POST to localhost:3000/events. For the request to fullfil the requirement for the date fields,the date must be an ISOString.
For test with Postman use for example:
   Example body:
{
	"name":"One more event 2",
	"description":"Let's try this project again 2",
	"picture":"no picture yet",
	"startDate":"{{day}}",
	"endDate":"{{nextday}}"
}

With pre-request script:

var dateNow= new Date("12-23-2019"); //dates are expectedin this format, change manually
var dateThen = new Date("12.25.2019")
pm.environment.set("day", dateNow.toISOString());
pm.environment.set('nextday', dateThen.toISOString())

4. To create a ticket: POST to localhost:3000/events/:id/tickets  Change the ":id" with the id of the event you want to add a ticket to.
 Example body: 

{
	"picture" : "No pic",
	"price":100,
	"description":"A ticket for Event"
}

5. To edit a ticket you need to be the creator of the ticket. Patch to localhost:3000/events/:id/tickets/:id. 
Change the :id of the event and the corresponding ticket. All fields are optional. If a field is left empty, the updated ticket's corresponding filed will keep it's previous value. 
Example body: 
{	
	"description":"Edited description" 
	"picture":"new picture",
	"price":108
}

6. To get all events: GET localhost:3000. This will list all events in the database.
To use pagination: GET localhost:3000/?page=[number]&size=[number] - replace [number] with the page(starting from 0) and the number of events per page (size).

7. To get all tickets for a given event: GET localhost:3000/event/:id/tickets. Replace :id with the desired event's id.
The response is an array of ticket objects. Example:
[
    {
        "id": 16,
        "description": "Ticket 16",
        "picture": "no picture or picture url",
        "user_id": 4,
        "event_id": 7,
        "price": 100,
        "created_at": "2019-04-07T06:56:54.227Z"
    },
    {
        "id": 17,
        "description": "Ticket 17",
        "picture": "no picture or picture url",
        "user_id": 3,
        "event_id": 7,
        "price": 300,
        "created_at": "2019-04-07T07:05:53.782Z"
    }
]

8. To get a specific ticket: GET localhost:3000/event/:id/tickets/:id. Replace :id with the id of the event and the id of the ticket.
The response looks like this example:
{
    "id": 16,
    "description": "Ticket 16",
    "picture": "no picture or picture url",
    "user_id": 4,
    "event_id": 7,
    "price": 100,
    "created_at": "2019-04-07T06:56:54.227Z",
    "comments": [],
    "author": {
        "first_name": "UserFirstName",
        "last_name": "UserLastname"
    },
    "risk": 15
}

9. To post a comment: POST localhost:3000/events/:id/tickets/:id/comments Replace :id with the id of the event and the id of the ticket.
A comment only neads a text as a body. Example:
{
	"text": "A comment"
}

10. To get a specific event: GET localhost:3000/events/:id. Replace :id with the desired event's id.
The returned event object looks like this example:
{
    "id": 1,
    "name": "Event name",
    "description": "Event description",
    "picture": "no picture or picture url",
    "startDate": "2019-12-22",
    "endDate": "2019-12-24",
    "tickets": [
        {
            "id": 1,
            "description": "Ticket 1",
            "picture": "no picture or picture url",
            "price": 10,
            "createdAt": "2019-04-03T13:22:50.109Z"
        },
        {
            "id": 2,
            "description": "Ticket 2",
            "picture": "no picture or picture url",
            "price": 13,
            "createdAt": "2019-04-03T13:25:16.047Z"
        },
        {
            "id": 3,
            "description": "Ticket 3",
            "picture": "no picture or picture url",
            "price": 11,
            "createdAt": "2019-04-03T15:45:37.641Z"
        }
    ]
}
