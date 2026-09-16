# Submission Checklist

Complete each item before submitting the Airbnb Capstone.

## Environment and database

- [ ] `backend/.env` exists locally but is excluded from the submission archive.
- [ ] `MONGO_URI` points to the correct MongoDB database.
- [ ] MongoDB Atlas Network Access allows the backend host IP address.
- [ ] `JWT_SECRET` is a long random value and is not committed to source control.
- [ ] `CLIENT_URLS` contains every deployed customer and admin frontend origin.
- [ ] Deployed frontends define `VITE_API_URL` as the public backend URL.

## Backend

- [ ] `GET /api/health` returns a successful response.
- [ ] MongoDB connection succeeds in the backend log.
- [ ] User registration rejects invalid input and stores valid users in MongoDB.
- [ ] User login returns a JWT for valid credentials.
- [ ] Invalid credentials are rejected.
- [ ] Public registration cannot create an administrator account.
- [ ] Admin-only listing creation, editing, and deletion reject non-admin users.
- [ ] Customer listing reads return data from MongoDB.
- [ ] Authenticated customers can create and view their reservations.
- [ ] Reservation totals are calculated and validated by the backend.
- [ ] Admin users can view and update reservation statuses.

## Customer frontend

- [ ] `npm ci` completes in `frontend`.
- [ ] `npm run lint` passes in `frontend`.
- [ ] `npm run build` passes in `frontend`.
- [ ] Homepage loads without console errors.
- [ ] Search and listing filters work with backend data.
- [ ] Listing details load correctly.
- [ ] Registration and login work.
- [ ] Protected reservation creation redirects unauthenticated users to login.
- [ ] Dark mode works.
- [ ] Homepage is usable on desktop, tablet, and mobile widths.

## Admin frontend

- [ ] `npm ci` completes in `admin`.
- [ ] `npm run lint` passes in `admin`.
- [ ] `npm run build` passes in `admin`.
- [ ] Unauthenticated users cannot open protected admin pages.
- [ ] Non-admin users are rejected from the dashboard.
- [ ] Admin login persists the JWT between page navigations.
- [ ] Listings display MongoDB accommodations.
- [ ] Add, edit, and delete listing actions work.
- [ ] Reservations and users sections load correctly.
- [ ] Logout clears the stored session.

## Packaging

- [ ] Do not include `node_modules`, `dist`, `.env`, logs, or database credentials.
- [ ] Include `README.md`, `SUBMISSION-CHECKLIST.md`, `frontend`, `admin`, and `backend`.
- [ ] Confirm the submission archive opens and contains the expected folders.
- [ ] Submit the correct deployed URLs, if deployment is required by the rubric.
