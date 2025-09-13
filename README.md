
tch# Firebase Studio - MSMEConnect

This is a Next.js application for MSMEConnect, providing financial services for Micro, Small, and Medium Enterprises.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A PostgreSQL database

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies:**us


    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of the project by copying the example file:

    ```bash
    cp .env.example .env
    ```

    Update the `.env` file with your database connection string and other required keys (e.g., Razorpay API keys).

4.  **Set up the database:**

    Run the Prisma command to push the schema to your database. This will create the necessary tables.

    ```bash
    npx prisma db push
    ```
    
    You can also use `npx prisma generate` to generate the Prisma Client.

5.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Features

-   **User Authentication**: Secure login and registration.
-   **Enquiry Form**: Users can submit enquiries.
-   **Loan Application**: Multi-step loan application form.
-   **Payments**: Integration with Razorpay for processing payments.
-   **User Dashboard**: View application statuses and payment history.

## API Endpoints

The backend is built with Next.js API Routes. The main endpoints are:

-   `POST /api/auth/register`
-   `POST /api/auth/login`
-   `POST /api/enquiry`
-   `POST /api/loan-application`
-   `POST /api/payment/create-order`
-   `POST /api/payment/verify`
-   `GET /api/user/dashboard`

These endpoints are already connected to the frontend components.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/)
-   **UI**: [React](https://reactjs.org/) with [ShadCN UI](https://ui.shadcn.com/) and [Tailwind CSS](https://tailwindcss.com/)
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Database**: [PostgreSQL](https://www.postgresql.org/)
-   **AI**: [Genkit](https://firebase.google.com/docs/genkit)
