
# Alzikrayat — Project 4 : Real-Time WebSocket
# socketio

## Selected Track
Track D: Real-Time WebSocket (Socket.io)

## Rationale
In Project 3, a new comment only appeared for other users after a manual refresh.
With Socket.io, a new comment now appears instantly for everyone viewing the same
photo, without changing the existing REST API.

## What Was Added
- **Server (server.js):** Socket.io attached to an HTTP server created from the Express app.
- Rooms: each photo detail page is its own room (photo-<photoId>), joined with joinPhotoRoom and left with leavePhotoRoom.
- **Event (commentControllers.js):** after a comment is saved, the server emits newComment to the photo's room only.
- **Client (PhotoDetail.jsx):** connects with socket.io-client inside useEffect, listens for newComment, updates the comments state, and cleans up (leave room + disconnect) on unmount. Duplicate comments are filtered by _id.

## Setup
cd server
npm install
cd ../client
npm install

## How to Run
# Terminal 1
cd server
npm run dev

# Terminal 2
cd client
npm run dev
## How to Test the Real-Time Feature
1. Open the same photo in two browsers (or one normal window and one incognito), logged in as different users.
2. Add a comment in the first browser.
3. The comment appears in the second browser without a refresh.
4. Open a different photo in the second browser: it does not receive the comment (room-based broadcasting).

## Existing Features (unchanged)
Register / Login, photo upload, gallery, photo detail, owner-only delete, comments, responsive layout.

## Branch
project-4-socketio
raheeg abd alazeem-IT