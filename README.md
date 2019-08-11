# Major Miner in React

## Setup instructions:
1. Clone this repository
2. Install necessary packages
```bash
npm install
```
3. Get Firebase credentials
    1. Choose Project settings
    ![project-setting](public/Assets/1.png)
    2. Locate the SDK config snippet
    ![config-snippet](public/Assets/2.png)
4. Create `.env` file inside project root directory to include firebase project credentials
```
REACT_APP_FIREBASE_KEY=
REACT_APP_FIREBASE_DOMAIN=
REACT_APP_FIREBASE_DATABASE=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_SENDER_ID=
```

## Other setup
- [CORS configuration](https://firebase.google.com/docs/storage/web/download-files#cors_configuration) (For access to Firebase data)