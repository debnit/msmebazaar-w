# MSMEConnect Mobile App

A React Native mobile application built with Expo that replicates the UI and flows of the MSMEConnect web application.

## Features

- **Authentication**: Login and registration with JWT token persistence
- **Dashboard**: User profile, enquiries, loan applications, and payment history
- **Payments**: Razorpay integration with predefined services and custom payments
- **Loan Application**: Multi-step loan application form
- **Enquiry Form**: Contact form for customer support
- **Landing Page**: Hero section, features, and call-to-action buttons

## Tech Stack

- **Expo Router**: File-based navigation
- **NativeWind**: Tailwind CSS for React Native
- **Zustand**: Global state management
- **React Query**: API data fetching and caching
- **AsyncStorage**: Local data persistence
- **React Native Razorpay**: Payment gateway integration
- **TypeScript**: Type safety

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

## Installation

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run on your preferred platform:
   - **iOS**: Press `i` in the terminal or scan QR code with Expo Go app
   - **Android**: Press `a` in the terminal or scan QR code with Expo Go app
   - **Web**: Press `w` in the terminal

## Configuration

### Backend API

Update the API base URL in the following files:
- `store/authStore.ts`
- `services/authService.ts`
- `services/paymentService.ts`
- `services/apiService.ts`

Change `http://localhost:5000/api` to your actual backend URL.

### Razorpay Configuration

1. Get your Razorpay Key ID from the Razorpay dashboard
2. Update `RAZORPAY_KEY_ID` in `services/paymentService.ts`
3. Ensure your backend has the correct Razorpay configuration

### Environment Variables

Create a `.env` file in the mobile directory:
```
EXPO_PUBLIC_API_URL=http://your-backend-url.com/api
EXPO_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Project Structure

```
mobile/
├── app/                    # Expo Router screens
│   ├── _layout.tsx        # Root layout with navigation
│   ├── index.tsx          # Landing/home screen
│   ├── login.tsx          # Login screen
│   ├── register.tsx       # Registration screen
│   ├── dashboard.tsx      # User dashboard
│   ├── payments.tsx       # Payment services
│   ├── loan.tsx           # Loan application
│   └── enquiry.tsx        # Contact form
├── components/            # Reusable UI components
├── services/              # API services
│   ├── authService.ts     # Authentication API calls
│   ├── paymentService.ts  # Payment processing
│   └── apiService.ts      # General API calls
├── store/                 # Zustand stores
│   ├── authStore.ts       # Authentication state
│   └── paymentStore.ts    # Payment state
├── hooks/                 # Custom React hooks
├── package.json           # Dependencies
├── app.json              # Expo configuration
├── tailwind.config.js    # NativeWind configuration
└── tsconfig.json         # TypeScript configuration
```

## Key Features Implementation

### Authentication Flow
- JWT token storage in AsyncStorage
- Automatic token validation on app startup
- Protected routes with authentication checks

### Payment Integration
- Razorpay SDK integration for mobile
- Predefined service payments (Pro-Membership, Valuation, Exit Strategy)
- Custom payment amounts
- Payment verification and success handling

### Form Management
- Multi-step loan application with validation
- Real-time form validation
- Progress indicators
- Error handling and user feedback

### State Management
- Zustand for global state
- AsyncStorage for persistence
- React Query for server state management

## Development

### Adding New Screens

1. Create a new file in the `app/` directory
2. Add the screen to the Stack in `_layout.tsx`
3. Implement navigation using `router.push()` or `router.replace()`

### Styling

The app uses NativeWind (Tailwind CSS for React Native). All styling follows the design system defined in `tailwind.config.js`.

### API Integration

All API calls are centralized in the `services/` directory. Use the existing services as templates for new endpoints.

## Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

### Web
```bash
expo build:web
```

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `expo start -c`
2. **NativeWind not working**: Ensure babel.config.js includes the NativeWind plugin
3. **API connection issues**: Check network connectivity and API URL configuration
4. **Razorpay integration**: Verify key configuration and backend setup

### Debug Mode

Enable debug mode by adding `debug: true` to your app.json configuration.

## Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for type safety
3. Test on both iOS and Android platforms
4. Update documentation for new features

## License

This project is part of the MSMEConnect application suite.
