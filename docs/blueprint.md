# **App Name**: MSMEConnect

## Core Features:

- Authentication (Login/Register): User sign up + login with email/password, JWT authentication with refresh tokens, Secure session storage (AsyncStorage on frontend), Input validation & error handling
- Enquiry Form Submission: Capture and submit user enquiries through a web form, sending data to the /api/enquiry endpoint.
- Loan Application Form: Enable users to fill and submit loan applications, sending the information to the /api/loan-application endpoint.
- WhatsApp Chat Integration: Implement a floating WhatsApp button that opens a chat with a predefined message and number.
- Payments (Razorpay Integration E2E): Razorpay Checkout integrated inside app, Fixed services, Dynamic service payments: user types service name + amount → pay, Payment success/failure screen, Transaction history in user profile
- Dashboard (Profile + Orders/Payments): Show past enquiries, loan applications, and payments, Download payment receipts (PDF via backend)
- Notifications: Push notifications for loan status updates & payment confirmations (Expo Notifications)
- Dynamic Config & Services: Store services + prices in DB so admin can update without code changes, Support dynamic addition/removal of services
- Security & Best Practices: Use `.env` for secrets (Razorpay keys, DB URI, JWT secret), Backend validation with Joi/Zod, Secure API with authentication middleware
- Database: Use MongoDB Atlas or Postgres (via Prisma ORM), Models: User, Enquiry, LoanApplication, PaymentTransaction, Services

## Style Guidelines:

- Primary color: Deep blue (#1A237E) to evoke trust and stability.
- Background color: Very light blue (#E8EAF6), a desaturated shade of the primary color, to create a clean and professional look.
- Accent color: Vibrant orange (#FF7043) for call-to-action buttons to draw attention and create contrast.
- Headline font: 'Poppins', a geometric sans-serif to convey a contemporary and fashionable feel; body text: 'PT Sans', a more humanist sans-serif choice that is comfortable to read.
- Use simple and modern icons to represent various services and actions.
- Clean and intuitive layout to facilitate easy navigation.