# Project: Audio Recording App

## Core Technologies

*   **Framework:** Next.js
*   **Language:** TypeScript
*   **Version Control:** GitHub
*   **Deployment:** Vercel
*   **Backend & Database:** Supabase

## Features

### User Authentication
*   User registration with Google OAuth.
*   User login with Google OAuth.

### Pages
*   **Landing Page:** Showcase the capabilities of the service.
*   **Registration Page:** Simple and clean, focused on Google OAuth registration.
*   **Login Page:** Simple and clean, focused on Google OAuth login.
*   **Dashboard (Logged In):** Main interface for authenticated users.

### Core Functionality
*   **Audio Recording:**
    *   Request microphone permissions from the user.
    *   Allow users to record audio directly from the website.
    *   Store recorded audio in the browser (e.g., using IndexedDB or `localStorage`).
*   **Future Backend Integration:**
    *   The stored audio will eventually be sent to a backend for processing and persistent storage.

## Deployment Plan

1.  Set up a new Next.js project with TypeScript.
2.  Initialize a GitHub repository.
3.  Configure Supabase for database and authentication.
4.  Set up a Vercel project and link it to the GitHub repository for continuous deployment.
5.  Implement the frontend pages and components.
6.  Integrate Supabase for Google OAuth.
7.  Implement the audio recording functionality.
8.  Deploy to Vercel.
