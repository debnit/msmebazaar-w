# Overview

MSMEConnect is a Next.js-based financial services platform designed for Micro, Small, and Medium Enterprises (MSMEs). The application provides comprehensive financial solutions including loan applications, payment processing, enquiry management, and user dashboard functionality. It integrates Firebase for hosting while utilizing Prisma ORM for database operations and Razorpay for payment processing.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: Next.js 15 with App Router and TypeScript
- **Styling**: Tailwind CSS with custom design system using shadcn/ui components
- **State Management**: React Hook Form with Zod validation for forms
- **UI Components**: Radix UI primitives wrapped in custom components for consistency
- **Authentication**: JWT-based session management with HTTP-only cookies

## Backend Architecture
- **API Routes**: Next.js API routes for server-side functionality
- **Database Layer**: Prisma ORM as the database abstraction layer
- **Authentication**: Custom JWT implementation using jose library
- **Security**: bcryptjs for password hashing, middleware-based route protection

## Database Design
- **ORM**: Prisma Client for type-safe database operations
- **Models**: User, Enquiry, LoanApplication, PaymentTransaction, Notification entities
- **Relationships**: User-centric design with foreign key relationships to track user activities

## Authentication & Authorization
- **Session Management**: JWT tokens stored in HTTP-only cookies for security
- **Route Protection**: Middleware-based authentication with public/private route definitions
- **Password Security**: bcrypt hashing with salt rounds for secure password storage

## Payment Integration
- **Gateway**: Razorpay integration for secure payment processing
- **Flow**: Order creation → Payment processing → Success/failure handling
- **Security**: Server-side order validation and payment verification

## UI/UX Design System
- **Color Scheme**: Deep blue primary (#1A237E), light blue background (#E8EAF6), orange accent (#FF7043)
- **Typography**: Poppins for headings, PT Sans for body text
- **Components**: Consistent component library built on Radix UI primitives
- **Responsive**: Mobile-first design with breakpoint-based layouts

## File Structure
- **Pages**: App router structure with grouped routes for authentication
- **Components**: Modular component structure with UI, layout, and feature components
- **Libraries**: Utility functions and shared services in lib directory
- **Hooks**: Custom React hooks for reusable logic

# External Dependencies

## Core Framework & Runtime
- **Next.js**: React framework for full-stack applications
- **React**: Frontend library for building user interfaces
- **TypeScript**: Type safety and developer experience

## Database & ORM
- **Prisma**: Database ORM and query builder
- **@prisma/client**: Generated database client for type-safe queries

## Authentication & Security
- **jose**: JWT token creation and verification
- **bcryptjs**: Password hashing and verification

## Payment Processing
- **Razorpay**: Payment gateway for secure transactions

## UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Unstyled, accessible UI primitives
- **Lucide React**: Icon library for consistent iconography
- **class-variance-authority**: Type-safe styling variants

## Form Handling & Validation
- **React Hook Form**: Performant form library
- **Zod**: Schema validation and type inference
- **@hookform/resolvers**: Integration between React Hook Form and validation libraries

## AI Integration
- **Firebase**: Hosting and potentially AI services
- **Google AI (Genkit)**: AI capabilities integration

## Development Tools
- **dotenv**: Environment variable management
- **patch-package**: NPM package patching capabilities

## Additional Libraries
- **date-fns**: Date manipulation and formatting
- **embla-carousel-react**: Carousel component for testimonials
- **clsx**: Conditional class name utility