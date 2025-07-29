# student-management-frontend

Modern admin + student dashboard frontend for the Mini Student Management System.

## Description

This is the **frontend UI** for a full-stack role-based Student Management System. Built with:

- **Next.js (App Router + Server Components)**
- **Tailwind CSS** for utility-first styling
- **Shadcn UI** for clean component design
- **Redux Toolkit Query** for API state management
- Fully responsive, light-themed UI with secure route handling and toast feedback

Students can:
- Register/login
- Update their profile and student info
- Upload profile pictures

Admins can:
- View all users and students
- Change user roles
- Delete users
- Access dashboard statistics


## Pages Implemented

| Route                     | Role     | Description                        |
|--------------------------|----------|------------------------------------|
| `/auth/login`, `auth/register`    | Public   | Auth pages                         |
| `/admin`             | Admin    | Dashboard with student stats       |
| `/admin/users`                 | Admin    | User management page               |
| `/students`              | Admin    | All students page                  |
| `/profile`               | Student  | Student profile + picture upload   |


## API Integration

All requests are made to your backend at:

```

[http://localhost:5000/api/v1](http://localhost:5000/api/v1)

````

Handled using **RTK Query** (`baseApi` slice). Auth is stored via JWT (in memory or storage).


## Setup

### Dependencies

- Node.js >= 18
- pnpm or yarn
- Tailwind CSS
- Shadcn UI
- Redux Toolkit + RTK Query
- lucide-react for icons

### Getting Started

```bash
git clone https://github.com/Pamellas20/sms-frontend.git
cd sms-frontend
pnpm install
cp .env.example .env.local
# Update the backend base URL if different
````

### Run the App

```bash
pnpm dev
```

Then visit: `http://localhost:3000`

## .env.local Example

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

## Testing the UI

You can manually verify:

* Login/Register
* Upload profile image (Cloudinary integration)
* Navigate admin dashboard
* Change roles
* Delete users

If you have seeded the backend (with `pnpm seed`), use:

* Admin: `admin@example.com / admin123`
* Student: `student1@example.com / student123`



## Deployment

You can deploy with:

* [Vercel](https://vercel.com/)
* [Netlify](https://netlify.com/)

**Vercel Steps:**

1. Push repo to GitHub
2. Connect Vercel → Import Project
3. Add `.env.local` for backend URL
4. Deploy 


## Related Repositories

* [Backend Repo](https://github.com/Pamellas20/sms-backend.git)

