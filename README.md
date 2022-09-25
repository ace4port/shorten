# URL Shortner app

## Gist

Get a long url - return a shortened version.
Redirect to full url

## Features

1. Core - Shorten
2. Analytics (click tracking), auto delete
3. Customize url and limit
4. Auth - set auth for email, pw/ sign in w/ google/ use next auth?
5. Customize domain (domain integration)

---

## Step 1: Core

- Initialize code, get the core feature up and running
- Choice - Nest JS, Next JS, Remix --> Nest - Next
- DB choide - Redis MongoDB --> MongoDB

### API Routes

- POST
  --> Check for valid url
  --> Create a shortened string
  --> Save shortened string to db
  --> Return shortened url

- GET
  --> Check if record exists
  --> If exists - get the record/original url
  -- --> Redirect to original url/Send original url

### Kick off by making backend only

#### NextJS MongoDB Mongoose

#### ~2hr 10min

---

## Step 2: Analytics (click tracking), auto delete

- Basic analytics (click tracking/no of visits/link)
- Auto delete/remove after 6 months

### API Routes

- POST
  --> Modify schema to include analytics info (clicks)
  --> Add expires field to schema

- GET
  --> Add analytics when get (click++)

- Deploy on live server and test/check

### Deployed on vercel

### Analytics - user browser, click, last updated

### Expires not working ...

---

## Step 3: Custom url and limit

- Ability to add custom url/link
- Show all urls
- Set limit 18/20/10

### API Routes

- POST
  --> Check if url exists
- GET
  --> Get all urls

---

## Step 4: Auth and limit

- Set auth
- Use next auth
- Ideally JWT and other options Github & Google
- Link user to urls and limit ❌
- Tailwind
- Stylize

---

## Step 5: Polishing & Custom domain

- Link user to urls and implement limit
- Loading and error handle
- Urls - edit and delete

---

## Additional

- Custom domains
- Redis as db
- Dockerize
- Testing Unit, Integration and E2E
- Cloud deployment
- Event scheduling/expiration - eg - Remove a link after certain days 1 week, 1 month, 1 year or 2 yrs max

---

https://github.com/ace4port/miniature-waddle
