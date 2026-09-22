# 📌 Pinboard - A Modern Pinterest Clone

Pinboard is a full-stack web application inspired by Pinterest. It allows users to discover visual inspiration, log in securely with GitHub, share and pin images from across the web, and manage personal profile walls with a responsive Masonry grid layout.

---

## ✨ Features

- **GitHub OAuth Authentication:** Secure login and session management powered by Passport.js and GitHub.
- **Dynamic Pin Management:** Authenticated users can publish new pins with a title and image URL or delete their own pins.
- **Responsive Masonry Grid:** Dynamic image layout powered by Masonry.js and ImagesLoaded, ensuring a seamless visual grid across all screen sizes.
- **User Profile Walls:** Dedicated profile pages displaying curated pins specific to each user.
- **Robust Error Handling:** Automatic fallback placeholders for broken or invalid image links.
- **Modern UI / UX:** Designed with a sleek **Ocean Breeze & Slate** color palette, custom cards, and smooth CSS micro-interactions.

---

## 🛠️ Tech Stack

- **Front-End:** EJS (Embedded JavaScript templates), HTML5, CSS3 (Custom Design System), Masonry.js, jQuery, ImagesLoaded
- **Back-End:** Node.js, Express.js
- **Database & ODM:** MongoDB Atlas, Mongoose
- **Authentication:** Passport.js (GitHub OAuth 2.0 Strategy)
- **Deployment:** Render (Cloud Web Service)

---

## 📁 Project Structure

```text
pinterest-clone/
├── public/
|   └── style.css         # Custom CSS styling and responsive layout rules
├── views/
|   ├── index.ejs         # Main community feed & home template
|   ├── new-pin.ejs       # Create pin form view
|   ├── pin-detail.ejs    # Individual pin detail view
|   └── profile.ejs       # User profile wall view
├── models/
|   ├── User.js           # User model schema
|   └── Pin.js            # Pin model schema
├── server.js             # Main Express server, database connection & routes
├── package.json          # Project dependencies and start scripts
└── .env                  # Local environment variables (not tracked in git)
```

---

## 🚀 Getting Started Locally

### Prerequisites

Make sure you have [Node.js](https://www.nodejs.org) installed on your machine.

### Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone [https://github.com/whitgunt77/pinterest-clone.git](https://github.com/whitgunt77/pinterest-clone.git)
   cd pinterest-clone
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the following keys:

   ```env
   PORT=3000
   MONGO_URI=your_mongodb_atlas_connection_string
   SESSION_SECRET=your_random_session_secret_string
   GITHUB_CLIENT_ID=your_github_oauth_client_id
   GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
   CALLBACK_URL=http://localhost:3000/auth/github/callback
   ```

4. **Run the application:**

   ```bash
   node server.js
   ```

5. **Open in your browser:**
   Navigate to `http://localhost:3000`

---

## ☁️ Deployment on Render

This application is optimized for deployment on [Render](https://render.com):

1. Push your repository to GitHub.
2. Create a new **Web Service** on Render and connect your repository.
3. Set the following build and start configurations:
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Add your production environment variables (`MONGO_URI`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `SESSION_SECRET`, and update `CALLBACK_URL` to your live `.onrender.com` domain).
5. Update your GitHub OAuth App settings with your live production Redirect URI.

---

## 👤 Author

_Built by Whitney Gunter_

---

## 🔌 API Endpoints Reference

| Method. | Route                   | Description                                                 |
| :------ | :---------------------- | :---------------------------------------------------------- |
| `GET`   | `/`                     | Renders the main explore feed displaying all community pins |
| `GET`   | `/auth/github`          | Initiates the GitHub OAuth authentication flow              |
| `GET`   | `/auth/github/callback` | OAuth callback endpoint handled by Passport.js              |
| `GET`   | `/logout`               | Destroys the current user session and redirects home        |
| `GET`   | `/pins/new`             | Renders the create pin form (requires authentication)       |
| `POST`  | `/pins`                 | Submits and saves a new pin to MongoDB Atlas                |
| `POST`  | `/pins/delete/:id`      | Deletes a specific pin (restricted to the original owner)   |
| `GET`   | `/pins/:id`             | Renders the dedicated full-size pin details view            |
| `GET`   | `/user/:username`       | Renders a specific user's personalized profile wall         |

---

## 🤝🏼 Contributing

Contributions, feature ideas, and bug reports are welcome! Feel free to fork the repository and submit a pull request for any enhancements.

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
