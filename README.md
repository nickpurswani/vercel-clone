
# Getting started
- Clone the repository
```
git clone  <git lab template url> <project_name>
```
- Start all 4 services/server
```
cd backend/vercel-clone && npm i && npx tsc -b && node dist/index.js
cd backend/vercel-deploy-service && npm i && npx tsc -b && node dist/index.js
cd backend/vercel-request && npm i && npx tsc -b && node dist/index.js
cd vercel-frontend/frontend && npm i && npm start 
```
- Build and run the project
```
npm start
```
