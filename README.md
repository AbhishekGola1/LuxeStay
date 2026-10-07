<<<<<<< HEAD
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
=======
# LuxeStay – Full Stack Home Rental & Booking Web App

LuxeStay is a scalable full-stack home rental and booking platform that allows users to explore, list, and reserve rental properties through a seamless and responsive web interface. Built using modern web technologies and structured with MVC architecture, the platform delivers secure authentication, dynamic property management, and smooth reservation workflows.

## Features

* User authentication and authorization
* Property listing creation, editing, and management
* Dynamic property search and detailed property pages
* Secure booking and reservation system
* Responsive user interface for all devices
* RESTful API integration
* MVC architecture for maintainability and scalability
* Form validation and error handling

## Tech Stack

### Frontend

* HTML
* CSS
* JavaScript
* EJS

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Additional Tools

* Passport.js
* Cloudinary
* Map integration
* Postman

## Architecture

This project follows the MVC (Model-View-Controller) pattern:

* **Models** – Database schemas and business logic
* **Views** – Frontend templates and UI
* **Controllers** – Request handling and application logic

## Installation

```bash
git clone https://github.com/yourusername/LuxeStay.git
cd LuxeStay
npm install
npm start
```

## Environment Variables

Create a `.env` file and configure:

```env
MONGO_URI=your_mongodb_connection
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
SESSION_SECRET=your_secret
```

## Folder Structure

```bash
LuxeStay/
│── models/
│── routes/
│── controllers/
│── views/
│── public/
│── utils/
│── app.js
│── package.json
```

## Future Enhancements

* Payment gateway integration
* Wishlist functionality
* Review & rating system
* Admin dashboard
* Advanced search filters
* Real-time booking updates

## Resume Highlights

* Developed a scalable full-stack home rental and booking platform
* Built secure authentication, property management, and reservation workflows
* Implemented RESTful APIs with MVC architecture
* Designed responsive UI for seamless cross-device experience

## Features can be added in future

* AI-Powered Enhancements
* Advanced Booking & Payment Features
* Enhanced Guest Experience (UX)
* Technical & Performance Optimization

## Author

**Abhishek Gola**
GitHub: [https://github.com/AbhishekGola1](https://github.com/AbhishekGola1)

## Project Demo
Demo: [https://luxestay-5hd8.onrender.com/listings](https://luxestay-5hd8.onrender.com/listings)

## License

This project is intended for educational and portfolio purposes.
>>>>>>> 46bfd6284bf6b4d2f787d09342bb1d504fdc3285
