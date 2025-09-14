# CinemaReview - Movie Review Platform Frontend

A modern, responsive React application for reviewing and discovering movies. Built with TypeScript, Tailwind CSS, and shadcn/ui components.

## 🎬 Features

### Core Functionality
- **Movie Discovery**: Browse and search through a comprehensive movie database
- **User Reviews**: Write and read detailed movie reviews with star ratings
- **Watchlist Management**: Save movies to your personal watchlist
- **User Profiles**: Manage your profile, view review history, and track activity
- **Authentication**: Secure login and registration with JWT tokens

### Advanced Features
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Advanced Filtering**: Filter movies by genre, year, rating, and more
- **Search Functionality**: Search movies by title, director, cast, or genre
- **Trailer Integration**: Watch movie trailers in modal dialogs
- **Real-time Updates**: Optimistic UI updates for better user experience
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Loading States**: Beautiful loading skeletons and spinners
- **Accessibility**: WCAG compliant with keyboard navigation support

## 🚀 Tech Stack

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Lucide React** - Beautiful icons
- **React Hook Form** - Form handling
- **Zustand/Context API** - State management

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── ErrorBoundary.tsx
│   ├── LoadingSpinner.tsx
│   ├── MovieCard.tsx
│   ├── ReviewCard.tsx
│   └── ...
├── contexts/           # React contexts
│   └── AppContext.tsx
├── hooks/              # Custom React hooks
│   ├── useApi.ts
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/                # Utility functions and configurations
│   ├── api.ts          # API service layer
│   ├── mockData.ts     # Mock data for development
│   └── utils.ts
├── pages/              # Page components
│   ├── Home.tsx
│   ├── Movies.tsx
│   ├── MovieDetail.tsx
│   ├── Profile.tsx
│   ├── Auth.tsx
│   └── NotFound.tsx
├── App.tsx             # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:5000`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cine-spark-54
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_APP_NAME=CinemaReview
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎨 Design System

### Color Palette
- **Primary Gold**: `#D4AF37` - Used for highlights and CTAs
- **Cinema Purple**: `#6B46C1` - Primary brand color
- **Cinema Blue**: `#3B82F6` - Secondary accent
- **Cinema Darker**: `#1F2937` - Dark backgrounds
- **Cinema Silver**: `#9CA3AF` - Muted text

### Typography
- **Headings**: Inter font family with varying weights
- **Body Text**: System font stack for optimal readability
- **Code**: JetBrains Mono for code snippets

### Components
All components follow the shadcn/ui design system with custom cinema-themed styling.

## 🔌 API Integration

The frontend integrates with a Node.js/Express backend API. Key endpoints include:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Movies
- `GET /api/movies` - Get paginated movie list
- `GET /api/movies/:id` - Get movie details
- `GET /api/movies/search` - Search movies

### Reviews
- `GET /api/movies/:id/reviews` - Get movie reviews
- `POST /api/movies/:id/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile
- `GET /api/users/:id/watchlist` - Get user watchlist
- `POST /api/users/:id/watchlist` - Add to watchlist
- `DELETE /api/users/:id/watchlist/:movieId` - Remove from watchlist

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

### Code Quality
- **ESLint** - Code linting with custom rules
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Husky** - Git hooks for quality assurance

### Testing
```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: `< 768px`
- **Tablet**: `768px - 1024px`
- **Desktop**: `> 1024px`
- **Large Desktop**: `> 1440px`

### Mobile Optimizations
- Touch-friendly interface
- Optimized image loading
- Reduced bundle size
- Progressive Web App features

## ♿ Accessibility

- **WCAG 2.1 AA** compliant
- **Keyboard navigation** support
- **Screen reader** compatibility
- **High contrast** mode support
- **Focus management** for modals and forms

## 🚀 Performance

### Optimizations
- **Code splitting** with React.lazy()
- **Image optimization** with lazy loading
- **Bundle analysis** and optimization
- **Service worker** for caching
- **Tree shaking** for smaller bundles

### Performance Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🔒 Security

- **JWT token** authentication
- **Secure HTTP headers**
- **XSS protection**
- **CSRF protection**
- **Content Security Policy**

## 🌐 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 📦 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for beautiful components
- **Tailwind CSS** for utility-first styling
- **Vite** for fast development experience
- **React** team for the amazing framework
- **Movie Database APIs** for data sources

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation wiki

---

**Made with ❤️ by the CinemaReview Team**