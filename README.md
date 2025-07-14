# OTConekt Admin Dashboard

A comprehensive admin dashboard for managing the OTConekt occupational therapy platform. This dashboard provides tools for managing therapist verifications, user accounts, appointments, and platform analytics.

## Features

### 🔐 Admin Management

- **Therapist Verification**: Review and approve/reject therapist applications
- **User Management**: Manage client and therapist accounts
- **Account Suspension**: Suspend or activate user accounts
- **Profile Review**: Detailed profile reviews with document verification

### 📊 Analytics & Monitoring

- **Dashboard Overview**: Real-time platform statistics
- **User Analytics**: Track user registrations and activity
- **Appointment Metrics**: Monitor appointment scheduling and completion rates
- **Revenue Tracking**: Track platform revenue and growth

### 🛠️ Administrative Tools

- **Quick Actions**: Fast access to common admin tasks
- **Recent Activity**: Monitor all admin actions and platform activity
- **Search & Filtering**: Advanced search and filtering capabilities
- **Bulk Operations**: Perform actions on multiple items

### 📱 Modern UI/UX

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Clean Interface**: Modern, intuitive design built with Tailwind CSS
- **Real-time Updates**: Live data updates and notifications
- **Accessibility**: Built with accessibility best practices

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Heroicons
- **Charts**: Recharts
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase project with the OTConekt database schema

### Installation

1. **Clone and install dependencies**:

   ```bash
   cd admin-dashboard
   npm install
   ```

2. **Set up environment variables**:

   ```bash
   cp .env.local.example .env.local
   ```

   Fill in your Supabase credentials in `.env.local`:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

3. **Run the development server**:

   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
admin-dashboard/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard homepage
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── therapists/        # Therapist management
├── components/            # Reusable UI components
│   ├── DashboardLayout.tsx
│   ├── StatsCards.tsx
│   ├── TherapistCard.tsx
│   └── TherapistModal.tsx
├── lib/                   # Utilities and configurations
│   └── supabase.ts       # Supabase client setup
├── types/                 # TypeScript type definitions
│   └── index.ts
└── public/               # Static assets
```

## Key Components

### Dashboard Layout (`components/DashboardLayout.tsx`)

- Main navigation sidebar
- User profile and logout
- Responsive layout management

### Stats Cards (`components/StatsCards.tsx`)

- Real-time platform statistics
- User, therapist, and appointment metrics
- Revenue and activity tracking

### Therapist Management

- **TherapistCard**: Preview cards for therapist profiles
- **TherapistModal**: Detailed view with full profile information
- **Verification System**: Approve/reject with reasons

### Analytics Chart (`components/AnalyticsChart.tsx`)

- Interactive charts for platform metrics
- Daily appointments, user registrations, revenue
- Multiple chart types (line, bar)

## Database Schema Requirements

The admin dashboard expects the following Supabase tables:

### `users`

```sql
- id (uuid, primary key)
- email (text)
- full_name (text)
- account_status ('active' | 'suspended')
- user_type ('client' | 'therapist')
- created_at (timestamp)
- updated_at (timestamp)
```

### `therapist_profiles`

```sql
- id (uuid, primary key)
- user_id (uuid, foreign key to users)
- full_name (text)
- email (text)
- phone (text)
- license_number (text)
- specializations (text[])
- bio (text)
- years_of_experience (integer)
- education (text)
- certifications (text[])
- hourly_rate (numeric)
- verification_status ('pending' | 'approved' | 'rejected')
- rejection_reason (text, nullable)
- verification_documents (text[], nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

### `appointments`

```sql
- id (uuid, primary key)
- client_id (uuid, foreign key to users)
- therapist_id (uuid, foreign key to users)
- appointment_date (date)
- start_time (time)
- end_time (time)
- status ('scheduled' | 'completed' | 'cancelled' | 'no_show')
- created_at (timestamp)
- updated_at (timestamp)
```

## Features in Detail

### Therapist Verification Workflow

1. **Application Review**: View detailed therapist profiles
2. **Document Verification**: Review uploaded licenses and certifications
3. **Approval/Rejection**: Approve qualified therapists or reject with detailed feedback
4. **Status Tracking**: Monitor verification status and history

### User Management

- **Account Overview**: View all user accounts with filtering
- **Status Management**: Activate or suspend accounts
- **Profile Details**: Access comprehensive user information
- **Activity Monitoring**: Track user engagement and session history

### Analytics Dashboard

- **Real-time Metrics**: Live platform statistics
- **Growth Tracking**: Monitor user and therapist growth
- **Revenue Analytics**: Track appointment completion and revenue
- **Usage Patterns**: Analyze platform usage trends

## Customization

### Styling

- Tailwind CSS configuration in `tailwind.config.js`
- Custom component styles in `app/globals.css`
- Color scheme and branding easily customizable

### Functionality

- Modular component architecture
- Easy to extend with new features
- Type-safe with TypeScript
- Scalable database queries with Supabase

## Security

- **Service Role Access**: Uses Supabase service role for admin operations
- **Row Level Security**: Respects Supabase RLS policies
- **Type Safety**: Full TypeScript coverage
- **Secure Environment**: Environment variables for sensitive data

## Support

For support with the admin dashboard:

1. Check the [Supabase documentation](https://supabase.com/docs)
2. Review [Next.js documentation](https://nextjs.org/docs)
3. Consult [Tailwind CSS documentation](https://tailwindcss.com/docs)

## License

This admin dashboard is part of the OTConekt platform and follows the same licensing terms.
