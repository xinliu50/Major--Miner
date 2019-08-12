# Major Miner in React

## Setup instructions:
1. Clone this repository
2. Install necessary packages
```bash
npm install
```
## Connect Major Miner to your firebase

1. Create a new project in your firebase.
- Click **Add project** to add a new project.
- Enter your project name then click **continue** to finish creating the project.

2. Register your app
- In the Firebase console’s project overview page, click the web **(<>)** to launch the setup workflow.
- Enter your app’s nickname, register your app.
- You will need the Firebase SDK later, for now, click **Continue to console**

*Because the .gitignore file is ignoring .env file for security access reason so you have to generate .env your own.*

3. Create `.env` file inside project root directory to include firebase project credentials
```
REACT_APP_FIREBASE_KEY=
REACT_APP_FIREBASE_DOMAIN=
REACT_APP_FIREBASE_DATABASE=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_SENDER_ID=
```
*You can access firebase SDK by going to **Project Overview***
- Click **1 app**:
<img src="images/1app" width=“500” height=“300” />
- Click setting icon:
<img src="images/settingicon" width=“500” height=“300” />

under **General** page, you will see the SDK values.
<img src="images/SDK" width=“500” height=“300” />

## Other setup
- [CORS configuration](https://firebase.google.com/docs/storage/web/download-files#cors_configuration) (For access to Firebase data)
