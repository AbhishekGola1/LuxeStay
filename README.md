# LuxeStay

LuxeStay is an Express and EJS home-rental listing app. It uses MongoDB for listings, users, reviews, and sessions; Cloudinary stores listing images.

## Run locally

Requirements: Node.js 22 and a MongoDB database (MongoDB Atlas or a local MongoDB server).

```powershell
npm install
npm test
npm start
```

Create a `.env` file in the project root with these values:

```env
ATLASDB_URL=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
SECRET=<long-random-session-secret>
CLOUD_NAME=<cloudinary-cloud-name>
CLOUD_API_KEY=<cloudinary-api-key>
CLOUD_API_SECRET=<cloudinary-api-secret>
```

Use your own MongoDB and Cloudinary credentials. Keep `.env` private and do not commit it. The server listens on `PORT` when set, or port `8080` by default.

## Deploy (recommended: Render)

1. Push this project to a GitHub repository.
2. Create a MongoDB Atlas cluster and a Cloudinary account. In Atlas, create a database user and allow connections from the Render service (for a quick initial test, Atlas can temporarily allow `0.0.0.0/0`; restrict this when possible).
3. In Render, create a **Web Service** connected to the repository. Use **Build Command** `npm install` and **Start Command** `npm start`. Choose a Node.js runtime compatible with the `engines` setting in `package.json`.
4. Add `NODE_ENV=production`, `ATLASDB_URL`, `SECRET`, `CLOUD_NAME`, `CLOUD_API_KEY`, and `CLOUD_API_SECRET` under the Render service's environment variables. Generate a unique random `SECRET`; never put secrets in source control.
5. Deploy. Render provides `PORT` automatically; the app reads it and enables secure session cookies behind the production proxy.
6. Open the generated Render URL and test signup, login, search, listing image uploads, and reviews.

MongoDB Atlas and Cloudinary are external services and need their own accounts and configuration. Do not run `node init/index.js` against a database containing data: that script deletes the database's listing documents before inserting sample listings.

## Project structure

- `models/`, `controllers/`, `routes/`: MongoDB schemas and MVC request handling
- `views/`: EJS pages
- `public/`: client-side CSS and JavaScript
- `middleware.js`, `schema.js`: authorization and Joi request validation
