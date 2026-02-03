# S1 Calculator - Semester Average Calculator

A modern, professional web application for calculating and tracking your Semester 1 academic average. Built with React, Firebase, and premium UI components featuring glassmorphism effects and smooth animations.

![S1 Calculator](https://img.shields.io/badge/React-19.2.0-blue) ![Firebase](https://img.shields.io/badge/Firebase-12.8.0-orange) ![Tailwind](https://img.shields.io/badge/TailwindCSS-3.4.19-cyan)

## ✨ Features

### 🔐 Authentication
- **Email/Password Authentication** - Secure signup and login
- **Google Sign-In** - Quick authentication with Google
- **Password Reset** - Email-based password recovery
- **Protected Routes** - Secure access to user-specific data

### 📊 Grade Management
- **Interactive Calculator** - Real-time semester average calculation
- **Module-based Input** - Enter grades for 7 different modules with coefficients
- **Save Calculations** - Store your results in Firebase Firestore
- **Calculation History** - View and manage past calculations
- **Statistics** - Track highest, lowest, and average grades

### 🎨 Premium UI/UX
- **Glassmorphic Design** - Modern, translucent UI elements
- **Smooth Animations** - Framer Motion powered transitions
- **Toast Notifications** - Beautiful success/error messages
- **Confirmation Modals** - Elegant dialogs for important actions
- **Responsive Design** - Works seamlessly on all devices
- **Dark Theme** - Eye-friendly gradient background

### 👤 User Profile
- **Profile Management** - Update display name and view account info
- **User Statistics** - Total calculations, average grades, and more
- **Account Security** - Secure user data with Firebase Auth

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd CAL-MO-VRMX
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use an existing one
   - Enable Authentication (Email/Password and Google providers)
   - Create a Firestore database
   - Copy your Firebase configuration

4. **Configure environment variables**
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   - Fill in your Firebase credentials in `.env`:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Deploy Firestore security rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   - Navigate to `http://localhost:5173`

## 🔧 Firebase Setup Guide

### 1. Enable Authentication
- In Firebase Console, go to **Authentication** → **Sign-in method**
- Enable **Email/Password** provider
- Enable **Google** provider
- Add your domain to authorized domains

### 2. Create Firestore Database
- Go to **Firestore Database** → **Create database**
- Choose production mode
- Select your preferred region

### 3. Security Rules
The project includes secure Firestore rules in `firestore.rules`:
- Users can only access their own data
- Validation for calculation data structure
- Grade values must be between 0 and 20

## 📁 Project Structure

```
CAL-MO-VRMX/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ConfirmModal.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── GradeInput.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── ResultCard.jsx
│   │   └── Toast.jsx
│   ├── context/             # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── ToastContext.jsx
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx
│   │   ├── History.jsx
│   │   ├── Login.jsx
│   │   ├── PasswordReset.jsx
│   │   └── Profile.jsx
│   ├── App.jsx              # Main app component
│   ├── constants.js         # Module definitions
│   ├── firebase.js          # Firebase configuration
│   ├── index.css            # Global styles
│   └── main.jsx             # App entry point
├── firestore.rules          # Firestore security rules
├── .env.example             # Environment variables template
└── package.json             # Dependencies
```

## 🎯 Usage

### Calculate Your Average
1. Log in or create an account
2. Enter grades for each module (0-20)
3. View your real-time calculated average
4. Click "Save Result" to store your calculation

### View History
1. Navigate to the History page
2. See all your past calculations
3. Delete calculations you no longer need

### Manage Profile
1. Click your profile icon in the navbar
2. Select "Profile" from the dropdown
3. Update your display name
4. View your statistics

## 🛠️ Built With

- **React 19.2** - UI framework
- **Vite 7.2** - Build tool
- **Firebase 12.8** - Backend and authentication
- **Tailwind CSS 3.4** - Styling
- **Framer Motion 12.30** - Animations
- **Lucide React** - Icons

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email your-email@example.com or open an issue in the repository.

---

Made with ❤️ by VRMX
