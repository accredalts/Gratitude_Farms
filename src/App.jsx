import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { LEGACY_ROUTES } from './lib/routes.js';
import { currentUser, signOut } from './lib/admin-auth.js';

import Home from './pages/Home.jsx';
import AboutUs from './pages/AboutUs.jsx';
import OurTeam from './pages/OurTeam.jsx';
import OurServices from './pages/OurServices.jsx';
import ManagedFarmland from './pages/ManagedFarmland.jsx';
import SoilFertility from './pages/SoilFertility.jsx';
import FarmlandDesign from './pages/FarmlandDesign.jsx';
import FarmlandOperate from './pages/FarmlandOperate.jsx';
import FarmlandDevelopment from './pages/FarmlandDevelopment.jsx';
import NakshatraVanam from './pages/NakshatraVanam.jsx';
import CorporateEsg from './pages/CorporateEsg.jsx';
import SainyaKrishi from './pages/SainyaKrishi.jsx';
import MedicinalPlantsTrees from './pages/MedicinalPlantsTrees.jsx';
import VrikshAyurveda from './pages/VrikshAyurveda.jsx';
import Blog from './pages/Blog.jsx';
import BlogPost from './pages/BlogPost.jsx';
import Contact from './pages/Contact.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import Terms from './pages/Terms.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import NotFound from './pages/NotFound.jsx';

/**
 * Each page used to be its own document, so every navigation began at the top
 * of the new page. Client-side routing keeps the scroll position instead, which
 * lands the visitor halfway down a page they have not seen. An in-page anchor
 * is the one case where the browser's own behaviour is the right one.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

/** Gives BlogPost the slug from `/blog/:slug` as a prop — it is a class. */
function BlogPostRoute() {
  const { slug } = useParams();
  return <BlogPost slug={slug} />;
}

/**
 * The pages the site had before the port, redirected to where they live now,
 * so links already published — and anything a search engine still holds — keep
 * landing on the right page. `Blog-Post.dc.html?slug=x` is handled separately
 * because its target depends on the query string.
 */
function LegacyBlogPost() {
  const slug = new URLSearchParams(useLocation().search).get('slug');
  return <Navigate to={slug ? `/blog/${slug}` : '/blog'} replace />;
}

/**
 * The console renders only for a signed-in visitor; everyone else is sent to the
 * login page, which returns them here once they are through.
 */
function RequireAdmin() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // An account removed while its session was open no longer resolves, which
  // closes the console behind whoever was using it.
  const user = currentUser();

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: pathname }} />;
  }

  return (
    <AdminDashboard
      user={user}
      onSignOut={() => {
        signOut();
        navigate('/admin/login', { replace: true });
      }}
    />
  );
}

function legacyRedirects() {
  return Object.entries(LEGACY_ROUTES)
    .filter(([file]) => file !== 'Blog-Post.dc.html')
    .map(([file, target]) => (
      <Route key={file} path={`/${file}`} element={<Navigate to={target} replace />} />
    ));
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/our-team" element={<OurTeam />} />

        <Route path="/services" element={<OurServices />} />
        <Route path="/services/managed-farmland" element={<ManagedFarmland />} />
        <Route path="/services/soil-fertility" element={<SoilFertility />} />
        <Route path="/services/farmland-design" element={<FarmlandDesign />} />
        <Route path="/services/farmland-operate" element={<FarmlandOperate />} />

        <Route path="/farmland-development" element={<FarmlandDevelopment />} />
        <Route path="/nakshatra-vanam" element={<NakshatraVanam />} />
        <Route path="/corporate-esg" element={<CorporateEsg />} />
        <Route path="/sainya-krishi" element={<SainyaKrishi />} />
        <Route path="/medicinal-plants-trees" element={<MedicinalPlantsTrees />} />
        <Route path="/vriksh-ayurveda" element={<VrikshAyurveda />} />

        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPostRoute />} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<RequireAdmin />} />

        <Route path="/Blog-Post.dc.html" element={<LegacyBlogPost />} />
        {legacyRedirects()}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
