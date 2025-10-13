#  BodyBloom

**Tagline:** *Track your progress. Feel your growth.*

A modern fitness tracking web application designed to motivate, educate, and empower users on their fitness journey. BodyBloom combines intuitive workout logging, exercise discovery, progress visualization, and daily motivation to create a holistic fitness companion.

---

##  Project Vision

BodyBloom goes beyond simple workout tracking—it's a comprehensive fitness experience that:
- Makes fitness management **effortless and exciting**
- Provides **data-driven insights** into your progress
- Delivers **daily motivation** through quotes and music
- Helps users **stay consistent** and feel empowered

---

##  Features

###  Current Features
-  **Responsive Navigation** - Seamless navigation across all pages (desktop & mobile)
-  **Modern UI Components** - Reusable Button, Card, Modal, and Loader components
-  **Clean Layout System** - Consistent layout with navbar and footer
-  **Landing Page** - Engaging home page with feature highlights

###  Upcoming Features
-  **Workout Logging** - Record exercises, sets, reps, and weights
-  **Workout History** - View and manage past sessions grouped by date
-  **Exercise Library** - Explore exercises via WGER API integration
-  **Motivation Hub** - Daily quotes and curated workout playlists
-  **Progress Dashboard** - Interactive charts and performance analytics
-  **Dark Mode** - Toggle between light and dark themes

---

##  Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React 18 |
| **Routing** | React Router v6 |
| **Styling** | Tailwind CSS v4 |
| **Build Tool** | Vite |
| **State Management** | React Hooks (useState, useEffect) |
| **Data Storage** | LocalStorage (Phase 1) → Firebase (Phase 2) |
| **API Integration** | WGER Exercise API |
| **Charts & Visualization** | Recharts / Chart.js |
| **Deployment** | Vercel / Netlify |
| **Version Control** | Git & GitHub |

---

##  Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ghanneycaleb/bodybloom.git
   cd bodybloom
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   Navigate to http://localhost:5173
   ```

---

##  Project Structure

```
bodybloom/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable React components
│   │   ├── common/      # Shared UI components
│   │   ├── layout/      # Layout components (Navbar, Footer)
│   │   ├── workout/     # Workout-related components (coming soon)
│   │   ├── dashboard/   # Dashboard components (coming soon)
│   │   └── ...
│   ├── pages/           # Page components (Home, Dashboard, etc.)
│   ├── hooks/           # Custom React hooks (coming soon)
│   ├── services/        # API services (coming soon)
│   ├── utils/           # Helper functions (coming soon)
│   ├── data/            # Static data (quotes, playlists)
│   ├── App.jsx          # Main app component with routing
│   ├── main.jsx         # App entry point
│   └── index.css        # Global styles with Tailwind
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```


### Future Enhancements
- [ ] User authentication with Firebase
- [ ] Workout streak tracking
- [ ] Personal fitness goals
- [ ] AI-powered workout recommendations
- [ ] Social features (sharing, challenges)
- [ ] PWA support for offline usage

---

##  Design Philosophy

BodyBloom follows modern web design principles:

- **Clean & Minimalist** - Focus on content, remove clutter
- **User-Centric** - Intuitive navigation and clear CTAs
- **Responsive First** - Mobile-friendly from the ground up
- **Accessible** - WCAG compliant color contrasts and semantic HTML
- **Performance** - Optimized load times and smooth interactions

---

##  Contributing

This is a capstone project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

##  License

This project is open source and available under the [MIT License](LICENSE).

---

##  Developer


- GitHub: [https://github.com/Ghanneycaleb]
- LinkedIn: [https://linkedin.com/in/calebghanney]


---

##  Acknowledgments

- **WGER API** - For providing comprehensive exercise data
- **Tailwind CSS** - For the amazing utility-first framework
- **React Community** - For incredible tools and resources
- **Fitness Enthusiasts** - For inspiration and feedback

---

##  Screenshots

*Coming soon! Screenshots will be added as features are completed.*

---

<div align="center">

**Built with love and dedication to fitness**

*BodyBloom - Where Progress Blooms* 

</div>


