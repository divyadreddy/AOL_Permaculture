# Permaculture Marketplace

A comprehensive e-commerce platform connecting buyers with permaculture organic produce farmers. Built with React.js and Cloudflare R2 for storage.

## 🌱 Features

### For Buyers
- **Product Discovery**: Browse products from all farmers with advanced filtering (category, price, MOQ, distance)
- **Detailed Product Information**: View growing methods, harvest dates, and farmer details
- **Smart Bag System**: Save products for later reference (non-transactional)
- **Farmer Connection**: Direct access to farmer contact information and farm details
- **Similar Products**: Discover related items and other products from the same farmer

### For Sellers (Farmers)
- **Product Management**: Add, edit, and delete product listings with rich details
- **Image Upload**: Multiple image support with Cloudflare R2 storage
- **Farm Profile**: Detailed farm information and growing practices
- **Dashboard**: Comprehensive seller dashboard for managing inventory

## 🛠️ Technical Stack

- **Frontend**: React.js with Material-UI (MUI)
- **Storage**: Cloudflare R2 for product images and file storage
- **Authentication**: Firebase Auth (via `AuthContext`)
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Styling**: Material-UI with custom theming

## 🎨 Design System

The application follows a carefully crafted design system defined in `design.json`:

- **Theme**: Eco-friendly, organic, nature-inspired
- **Color Palette**: Primary green tones, accent colors, neutral backgrounds
- **Typography**: Bold, uppercase headings with clean sans-serif body text
- **Layout**: Sticky header, hero sections, content areas, minimal footer
- **Components**: Cards, buttons, infographics, and media blocks with consistent styling

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Cloudflare account with R2 enabled

### 1. Clone the Repository
```bash
git clone <repository-url>
cd permaculture-marketplace
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Cloudflare R2
1. Create a Cloudflare account and enable R2 storage
2. Create a new R2 bucket for your project
3. Generate API tokens with R2 permissions
4. Update `src/cloudflare-r2.js` with your credentials:

```javascript
const R2_ACCOUNT_ID = 'your-cloudflare-account-id';
const R2_ACCESS_KEY_ID = 'your-r2-access-key-id';
const R2_SECRET_ACCESS_KEY = 'your-r2-secret-access-key';
const R2_BUCKET_NAME = 'your-bucket-name';
```

### 4. Start the Development Server
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.js       # Navigation header with auth status
│   ├── Footer.js       # Site footer
│   └── PrivateRoute.js # Route protection for sellers
├── contexts/           # React Context providers
│   ├── AuthContext.js  # Authentication state management
│   └── BagContext.js   # Shopping bag state management
├── pages/              # Main application pages
│   ├── Home.js         # Landing page
│   ├── Login.js        # User authentication
│   ├── Register.js     # User registration
│   ├── ProductList.js  # Product browsing with filters
│   ├── ProductDetail.js # Individual product view
│   ├── SellerDashboard.js # Seller product management
│   └── Bag.js          # Shopping bag (non-transactional)
├── cloudflare-r2.js    # Cloudflare R2 storage configuration
└── App.js              # Main application component
```

## 🔑 Key Features Implementation

### Authentication Flow
- **Signup**: Multi-step registration for buyers and sellers
- **Login**: Email/password authentication with local storage
- **Profile Management**: User profile creation and updates
- **Route Protection**: Seller-only access to dashboard

### Product Management
- **CRUD Operations**: Full product lifecycle management
- **Image Upload**: Multiple image support with Cloudflare R2
- **Rich Metadata**: Growing methods, harvest dates, farm information
- **Status Management**: Active/inactive product states

### Search & Discovery
- **Advanced Filtering**: Category, price, MOQ, and distance filters
- **Search Functionality**: Product name and description search
- **Pagination**: Efficient product browsing
- **Similar Products**: Category-based product recommendations

### Bag System
- **Non-Transactional**: Designed for product discovery, not direct purchase
- **Local Storage**: Persistent bag data across sessions
- **Product Reference**: Easy access to saved products and farmer details

## 🗄️ Database Architecture

Removed legacy JSON database in favor of Cloudflare R2 and Firebase Auth.

### Cloudflare R2 Storage
- **Image Storage**: Secure and scalable image storage for products
- **CDN Integration**: Global content delivery network
- **Cost Effective**: Pay-per-use pricing model
- **S3 Compatible**: Uses AWS S3 SDK for easy integration

## 🔒 Security Features

- **Local Authentication**: Secure user authentication with local storage
- **Data Validation**: Input validation and sanitization
- **Secure Storage**: Protected file uploads with Cloudflare R2
- **Route Protection**: Role-based access control (buyer/seller)

## 🚀 Production Considerations

### Database Migration
For production deployment, consider migrating from JSON database to:
- **PostgreSQL**: Robust relational database
- **MongoDB**: NoSQL database for flexible schemas
- **Supabase**: Open-source Firebase alternative
- **PlanetScale**: Serverless MySQL platform

### Authentication Enhancement
- **OAuth Integration**: Add social login options

### Storage Optimization
- **Image Compression**: Implement client-side image compression
- **CDN Configuration**: Optimize Cloudflare R2 settings
- **Caching Strategy**: Implement proper caching headers
- **Backup Strategy**: Regular data backups and disaster recovery

## 🚀 Future Enhancements

- **Real-time Updates**: Live product availability and pricing
- **Advanced Search**: Location-based filtering and sorting
- **Farmer Verification**: Certification and review systems
- **Mobile App**: React Native mobile application
- **Payment Integration**: Optional payment processing
- **Analytics Dashboard**: Sales and performance metrics
- **API Integration**: Third-party farming and certification APIs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the Cloudflare R2 documentation
- Review the React and Material-UI documentation

---

**Built with ❤️ for sustainable agriculture and local food systems**
