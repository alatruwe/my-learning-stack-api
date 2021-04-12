# My Learning Stack API

My Learning Stack is a journaling app for developers.

It helps the user to understand his learning journey and track his progress.

## Install:

    npm install

## Run the app:

    npm start

## Run the tests:

    npm test

# API

This API uses GET, POST and DELETE requests to manage My Learning Stack app content.

All responses come in standard JSON.
All requests must include a content-type of application/json and the body must be valid JSON.

## Failed Resquests and response:

For all endpoints, upon receiving an unauthorized or bad request you get:

**Failed Response:**

```json
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
    "error": "Unauthorized request"
}
```

or

```json
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
    "error": "error message here"
}
```

## Endpoints:

## Login

**You send:** Your login credentials.

**You get:** An `authToken` with which you can make further actions.

- authToken => string

**Request:**

```json
POST /api/login HTTP/1.1
Content-Type: application/json

{
    "email": "my@email.com",
    "user_password": "myPassword"
  }
```

**Successful Response:**

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
   "authToken": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```
## SignUp

**You send:** Your information.

**You get:** An `authToken` with which you can make further actions. A user profile is created:

- id => number
- first_name => string
- last_name => string
- email => string
- authToken => string

**Request:**

```json
POST /api/signup HTTP/1.1
Content-Type: application/json

{
    "first_name": "first name",
    "last_name": "last name",
    "email": "tmy@email.com",
    "user_password": "myPassword"
  }
```

**Successful Response:**

```json
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 3,
  "first_name": "first name",
  "last_name": "last name",
  "email": "tmy@email.com",
  "authToken": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```
## Dashboard

**You send:** Your authToken.

**You get:** A list of all entries and for each entry:

- id => number
- date => string
- current_mood => string
- tech_id => number
- name => string
- learning_notes => string
- struggling_notes => string

**Request:**

```json
GET /api/dashboard HTTP/1.1
Authorization: bearer "your authToken"
Content-Type: application/json
```

**Successful Response:**

```json
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
      "date": "2021-04-07T21:19:53.664Z",
      "current_mood": "meh",
      "tech_id": 4,
      "learning_notes": "user notes here",
      "struggling_notes": "user notes here",
      "id": 1,
      "name": "tech name here"
  },
  {
      "date": "2021-04-07T21:19:53.664Z",
      "current_mood": "smile",
      "tech_id": 4,
      "learning_notes": "user notes here",
      "struggling_notes": "user notes here",
      "id": 2,
      "name": "tech name here"
  },
  {
       "date": "2021-04-07T21:19:53.664Z",
      "current_mood": "frown",
      "tech_id": 4,
      "learning_notes": "user notes here",
      "struggling_notes": "user notes here",
      "id": 3,
      "name": "tech name here"
  }
]
```

## Delete an entry

**You send:** Your authToken.

**Request:**

```json
DELETE /api/dashboard/entry/:entry_id HTTP/1.1
Authorization: bearer "your authToken"
Content-Type: application/json

```

**Successful Response:**

```json
HTTP/1.1 204 No Content
Content-Type: application/json

```

## Profile

**You send:** Your authToken.

**You get:** A list of all tech in the profile and for each tech:

- id => number
- name => string

**Request:**

```json
GET /api/profile HTTP/1.1
Authorization: bearer "your authToken"
Content-Type: application/json
```

**Successful Response:**

```json
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
        "name": "javascript",
        "id": 1
    },
    {
        "name": "react",
        "id": 2
    }
]
```
## Add a new entry

**You send:** Your entry details.

**You get:** The entry profile created with:

- id => number
- date => string
- current_mood => string
- tech_id => number
- user_id => number
- learning_notes => string
- struggling_notes => string

**Request:**

```json
POST /api/new-entry HTTP/1.1
Authorization: bearer "your authToken"
Content-Type: application/json

{
    "current_mood": "smile",
    "tech_id": "javascript",
    "learning_notes": "user notes here",
    "struggling_notes": "user notes here"
  }
  
```

**Successful Response:**

```json
HTTP/1.1 201 Created
Content-Type: application/json

[
  {
    "id": 1,
    "user_id": 1,
    "date": "2021-04-11T23:48:51.301Z",
    "current_mood": "smile",
    "tech_id": 4,
    "learning_notes": "user notes here",
    "struggling_notes": "user notes here"
  }
]
```
