# Kavi Vendhan Portfolio

A modern, responsive portfolio website with a hidden admin panel for easy content management. The admin panel is accessed by clicking the profile image 11 times in a row.

## Features

- **Modern Design**: Clean, professional layout inspired by the provided Figma design
- **Hidden Admin Panel**: Click the profile image 11 times to access the edit mode
- **Dynamic Content**: All text content is editable through the admin panel
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Netlify Functions**: Serverless backend for data persistence
- **Supabase Ready**: Built-in support for Supabase database integration

## Quick Start

### 1. Deploy to Netlify

#### Option A: Deploy from GitHub (Recommended)

1. Push this code to a GitHub repository
2. Go to [Netlify](https://netlify.com) and sign in
3. Click "New site from Git"
4. Choose GitHub and select your repository
5. Netlify will automatically detect the settings from `netlify.toml`
6. Click "Deploy site"

#### Option B: Deploy via Drag & Drop

1. Install dependencies: `npm install`
2. Zip the entire project folder
3. Go to [Netlify](https://netlify.com) and drag the zip file to deploy

### 2. Set Custom Domain

1. In your Netlify dashboard, go to "Site settings" → "Domain management"
2. Click "Add custom domain"
3. Enter `kavivendhan.netlify.app` (or your preferred subdomain)
4. Follow the instructions to set up the domain

### 3. Optional: Database Setup (for persistent data)

If you want your edits to persist across deployments, set up Supabase:

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to the SQL Editor and run this query:

```sql
CREATE TABLE profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subtitle TEXT,
  description TEXT,
  about TEXT,
  projects_count TEXT,
  experience_years TEXT,
  clients_count TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  contact_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Configure Environment Variables
1. In your Netlify dashboard, go to "Site settings" → "Environment variables"
2. Add these variables:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon/public key

You can find these values in your Supabase project settings under "API".

## How to Use

### Viewing the Portfolio
Simply visit your deployed site. The portfolio displays all your information in a beautiful, professional layout.

### Admin Mode (Editing Content)
1. **Activate Admin Mode**: Click your profile image 11 times quickly (within 3 seconds between clicks)
2. **Edit Content**: A modal will appear with form fields for all editable content
3. **Save Changes**: Click "Save Changes" to update your portfolio
4. **Live Updates**: Changes appear immediately on your site

### Editable Fields
- Subtitle (e.g., "Full Stack Developer & UI/UX Designer")
- Hero description
- About section text
- Statistics (Projects count, Years of experience, Happy clients)
- Contact information (Email, Phone, Location)
- Contact section description

## Development

### Local Development
1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

3. Start local development server:
   ```bash
   netlify dev
   ```

4. Open `http://localhost:8888` in your browser

### Project Structure
```
profile/
├── index.html              # Main portfolio page
├── style.css               # All styles and responsive design
├── script.js               # Frontend functionality and admin panel
├── netlify.toml            # Netlify configuration
├── package.json            # Dependencies and scripts
├── netlify/
│   └── functions/
│       ├── get_profile.js  # API endpoint to fetch profile data
│       └── update_profile.js # API endpoint to update profile data
└── assets/                 # Place your images here
```

### Customization

#### Adding Your Own Images
1. Place your profile image in the `assets/` folder
2. Update the `src` attribute in `index.html`:
   ```html
   <img id="profile-image" src="assets/your-photo.jpg" alt="Kavi Vendhan" class="profile-img">
   ```

#### Updating Projects
Edit the `projects` array in `script.js` to add your own projects:
```javascript
const projects = [
    {
        title: "Your Project Name",
        description: "Project description...",
        technologies: ["React", "Node.js"],
        github: "https://github.com/username/project",
        demo: "https://your-demo-url.com"
    }
];
```

#### Changing Colors/Styling
The main color scheme can be updated in `style.css`:
- Primary color: `#6366f1` (indigo)
- Accent color: `#fbbf24` (amber)
- Background: `#f8fafc` (light gray)

#### Social Links
Update the social media links in `index.html`:
```html
<div class="social-links">
    <a href="https://github.com/your-username" class="social-link">
        <i class="fab fa-github"></i>
    </a>
    <!-- Add more social links -->
</div>
```

## Security Notes

- The admin panel is hidden behind the 11-click mechanism
- No authentication is required for the demo, but you should add proper authentication for production use
- Environment variables are secure and not exposed to the client
- All API endpoints have CORS protection

## Support

If you encounter any issues:

1. Check the browser console for error messages
2. Ensure all environment variables are set correctly in Netlify
3. Verify that your Supabase database table is created properly
4. Check the Netlify function logs in your dashboard

## License

MIT License - feel free to use this for your own portfolio!

---

**Note**: This portfolio works perfectly without a database. If you don't set up Supabase, your edits will still work during your session but won't persist across page reloads. For a production portfolio, setting up the database is recommended.
