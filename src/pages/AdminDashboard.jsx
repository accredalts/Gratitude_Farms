import { Component, Fragment } from 'react';
import { A, Hov, Seo } from '../lib/ui.jsx';
import { css } from '../lib/css.js';
import {
  ADMIN_ROLE, MEMBER_ROLE, MIN_PASSWORD,
  addUser, canManageTeam, listUsers, removeUser, updateUser
} from '../lib/admin-auth.js';

class AdminDashboard extends Component {

  state = {
    section: 'dashboard',
    editor: null,
    detail: null,
    form: {},
    toast: '',
    enquiries: [
      { name: 'Rajesh Kumar', email: 'rajesh.k@example.com', phone: '+91 98450 11223', interest: 'Managed Farmland', audience: 'Individuals / NRIs', location: 'Bengaluru, Karnataka', date: 'Jul 18, 2026', status: 'New', message: 'I own about 18 acres near Chikkaballapur that has been fallow for years. I would like to understand your managed farmland model, expected timelines, and the revenue-share option.' },
      { name: 'Priya Menon', email: 'priya.m@example.com', phone: '+91 99620 44518', interest: 'Personal Nakshatra Vanam', audience: 'Individuals / NRIs', location: 'Kochi, Kerala', date: 'Jul 17, 2026', status: 'Contacted', message: 'Interested in creating a 1-acre Nakshatra Vanam for my family. Please share the birth-star tree mapping process and approximate cost.' },
      { name: 'Infosys CSR Team', email: 'csr@infosys.example', phone: '+91 80 4116 7000', interest: 'Corporate ESG Partnership', audience: 'Corporates & PSUs', location: 'Bengaluru, Karnataka', date: 'Jul 16, 2026', status: 'New', message: 'We are evaluating carbon-offset and community agriculture partners for FY26 ESG spend. Please send audit/verification details and a sample impact report.' },
      { name: 'Colonel A. Nair (Retd)', email: 'a.nair@example.com', phone: '+91 94470 33210', interest: 'Sainya Krishi', audience: 'Small Landholders', location: 'Palakkad, Kerala', date: 'Jul 15, 2026', status: 'In Progress', message: 'Retired last year and want to take up natural farming on my 4 acres. Keen to join the Sainya Krishi training programme — when is the next batch?' },
      { name: 'Devika S.', email: 'devika.s@example.com', phone: '+91 90031 88274', interest: 'Medicinal Plants & Produce', audience: 'FPOs / Village Orgs', location: 'Madurai, Tamil Nadu', date: 'Jul 14, 2026', status: 'Closed', message: 'Our FPO wants to procure medicinal plants at scale. Please share availability and pricing for Ashwagandha and Tulsi.' },
      { name: 'Wipro Sustainability Cell', email: 'sustainability@wipro.example', phone: '+91 80 2844 0011', interest: 'Corporate ESG Partnership', audience: 'Corporates & PSUs', location: 'Bengaluru, Karnataka', date: 'Jul 12, 2026', status: 'Contacted', message: 'Looking to fund a 100-acre restoration project with verifiable carbon credits. Could we set up a call next week?' },
      { name: 'Meera Iyer', email: 'meera.iyer@example.com', phone: '+91 98844 55019', interest: 'Soil Fertility (BhuPrana™)', audience: 'Small & Marginal Holders', location: 'Coimbatore, Tamil Nadu', date: 'Jul 10, 2026', status: 'New', message: 'My soil test shows very low organic carbon. Can BhuPrana help restore it and how many seasons will it take?' },
      { name: 'S. Balasubramaniam', email: 's.bala@example.com', phone: '+91 90420 66337', interest: 'Farmland Design (Vasudha™)', audience: 'Small Landholders', location: 'Thanjavur, Tamil Nadu', date: 'Jul 8, 2026', status: 'Closed', message: 'I need a design-only engagement for my 6-acre plot — cropping layout and water plan. Do you offer that separately?' }
    ],
    blogs: [],
    // The people who can sign in. Unlike everything else in this state, this is
    // a mirror of a real store rather than sample data — src/lib/admin-auth.js
    // holds it, and every change here is re-read from there.
    team: listUsers(),
    testimonials: [
      { name: 'Lt. Col. R. Desai (Retd)', role: 'Sainya Krishi Entrepreneur, Tamil Nadu', rating: 5, status: 'Published', quote: 'Gratitude Farms gave me a second innings with the same discipline I knew in the Army. My food-forest plot now feeds my family and my income.' },
      { name: 'Anjali Rao', role: 'Landowner, Karnataka', rating: 5, status: 'Published', quote: 'They turned 12 barren acres into a living farm in under a year. The monthly reporting is transparent and the soil is visibly alive again.' },
      { name: 'GreenLeaf Foods (CSR)', role: 'Corporate ESG Partner', rating: 4, status: 'Pending', quote: 'Verifiable, on-ground impact for our ESG mandate — audit-ready data and real community benefit, not just certificates.' }
    ],
    services: [
      { name: 'Managed Farmland Services', brand: '', category: 'Service', page: '/services/managed-farmland', status: 'Live', summary: '' },
      { name: 'Soil Fertility Services', brand: 'BhuPrana™', category: 'Service', page: '/services/soil-fertility', status: 'Live', summary: '' },
      { name: 'Farmland Design Services', brand: 'Vasudha™', category: 'Service', page: '/services/farmland-design', status: 'Live', summary: '' },
      { name: 'Farmland Operate Services', brand: 'Sanjeevani™', category: 'Service', page: '/services/farmland-operate', status: 'Live', summary: '' },
      { name: 'Farmland Development Projects', brand: '', category: 'Program', page: '/farmland-development', status: 'Live', summary: '' },
      { name: 'Personal Nakshatra Vanam', brand: '', category: 'Program', page: '/nakshatra-vanam', status: 'Live', summary: '' },
      { name: 'Corporate ESG Projects', brand: '', category: 'Program', page: '/corporate-esg', status: 'Live', summary: '' },
      { name: 'Sainya Krishi', brand: '', category: 'Program', page: '/sainya-krishi', status: 'Live', summary: '' },
      { name: 'Medicinal Plants & Trees', brand: 'Vriksh Ayurveda', category: 'Catalogue', page: '/medicinal-plants-trees', status: 'Live', summary: '' }
    ],
    banners: [
      { image: '/assets/banner-circular-economy.png', badge: 'Waste to Wealth via Natural Farming', name: 'Circular Economy', brand: '', tagline: 'Turn farm waste into wealth — biomass becomes biochar, biochar rebuilds soil, and richer soil means higher yields and higher income for small farmers.', link: '/services', status: 'Live' },
      { image: '/assets/banner-managed-farmland.png', badge: 'Cultivating Discipline, Harvesting Hope', name: 'Managed Farmland', brand: '', tagline: 'Hand over your land. Get back a living, profitable natural farm — designed, restored, operated and monetised, all under one roof.', link: '/services/managed-farmland', status: 'Live' },
      { image: '/assets/banner-soil-fertility.png', badge: 'Living Soil · Locked Carbon', name: 'Soil Fertility', brand: 'BhuPrana™', tagline: 'Bring your soil back to life. We turn waste biomass into biochar and lock carbon into the earth for centuries.', link: '/services/soil-fertility', status: 'Live' },
      { image: '/assets/banner-farmland-design.png', badge: 'Every Square Foot, Intentional', name: 'Farmland Design', brand: 'Vasudha™', tagline: 'Water, trees and beauty — planned before a single seed goes in. A farm that is as productive as it is stunning.', link: '/services/farmland-design', status: 'Live' },
      { image: '/assets/banner-farmland-operate.png', badge: 'Thriving, Season After Season', name: 'Farmland Operate', brand: 'Sanjeevani™', tagline: 'Ex-servicemen teams run your farm day to day, so it keeps thriving — and you never lift a spade.', link: '/services/farmland-operate', status: 'Live' }
    ],
    faqs: [
      { question: 'What is natural farming and how is it different from organic farming?', answer: 'Natural farming is a chemical-free, self-regenerating system that rebuilds soil biology using on-farm inputs like Jeevamrutham and biochar. Unlike organic farming, which often still depends on external inputs, it minimises outside dependence and restores the soil’s own fertility.', page: 'Home', status: 'Published' },
      { question: 'Do you manage the entire farm, or only part of it?', answer: 'Our Managed Farmland service is fully end-to-end — soil restoration, design, cultivation, operations and market linkage under one accountable contract. You can also engage any single service (soil, design or operations) on its own.', page: 'Our Services', status: 'Published' },
      { question: 'How long does it take to restore a barren or degraded farm?', answer: 'Most farmland development projects take 6 to 12 months, during which soil organic carbon is raised from below 0.5% to over 3% using biochar, Amrit Mitti beds and natural bio-inputs.', page: 'Managed Farmland', status: 'Published' },
      { question: 'What is a Personal Nakshatra Vanam?', answer: 'A Nakshatra Vanam is a one-acre micro-forest of trees aligned to your birth star, zodiac sign and ruling planet — around 120 trees covering all 27 nakshatras, planted using Vriksh Ayurveda principles for ecological and spiritual harmony.', page: 'Nakshatra Vanam', status: 'Published' },
      { question: 'How can ex-servicemen join Sainya Krishi?', answer: 'Ex-servicemen can apply through our Contact page. Selected candidates receive NSDC-aligned residential training, help establishing a Food Forest farm, and market access under the Sainya Krishi “We are your Family Farmers” brand.', page: 'Sainya Krishi', status: 'Published' },
      { question: 'Do you work with corporates for ESG and carbon credits?', answer: 'Yes. We deliver verifiable carbon offsetting, community agriculture and sustainable supply-chain programs with audit-ready reporting for corporate ESG and CSR mandates.', page: 'Contact', status: 'Published' }
    ],
    seoRows: [
      { page: 'Home', slug: 'index', metaTitle: 'Gratitude Farms — Natural Precision Farming', metaDescription: 'India’s premium natural farming and agri-tech enterprise, led by ex-servicemen.', keywords: 'natural farming, agritech, ex-servicemen', canonical: 'https://gratitudefarms.co.in/', robots: 'index, follow', ogImage: '/assets/banner-managed-farmland.png', aeoSummary: 'Gratitude Farms is an ex-servicemen-led natural farming enterprise offering managed farmland, soil regeneration, farm design and operations across India.', geoRegion: 'IN-PY', geoPlacename: 'Pondicherry, India' },
      { page: 'About Us', slug: 'about-us', metaTitle: 'About Gratitude Farms', metaDescription: 'Our story, mission, vision and the ex-servicemen team behind our natural farming movement.', keywords: 'about, mission, ex-servicemen', canonical: 'https://gratitudefarms.co.in/about-us', robots: 'index, follow', ogImage: '/assets/banner-farmland-operate.png', aeoSummary: 'Founded in 2018 by two ex-Army officers and two technologists, Gratitude Farms develops ex-servicemen as natural farming entrepreneurs.', geoRegion: 'IN-PY', geoPlacename: 'Pondicherry, India' },
      { page: 'Our Services', slug: 'our-services', metaTitle: 'Products & Services | Gratitude Farms', metaDescription: 'Four flagship services covering the full lifecycle of a natural farm — design, restore, manage and operate.', keywords: 'managed farmland, soil fertility, farmland design', canonical: 'https://gratitudefarms.co.in/our-services', robots: 'index, follow', ogImage: '/assets/banner-circular-economy.png', aeoSummary: 'Gratitude Farms offers Managed Farmland, Soil Fertility (BhuPrana), Farmland Design (Vasudha) and Farmland Operate (Sanjeevani) services.', geoRegion: 'IN', geoPlacename: 'India' },
      { page: 'Medicinal Plants & Trees', slug: 'medicinal-plants-trees', metaTitle: 'Medicinal Plants & Trees | Gratitude Farms', metaDescription: 'Medicinal and sacred trees and plants cultivated under Vriksh Ayurveda principles.', keywords: 'medicinal plants, vriksh ayurveda', canonical: 'https://gratitudefarms.co.in/medicinal', robots: 'index, follow', ogImage: '/assets/papaya-farm-video-still.png', aeoSummary: 'Gratitude Farms cultivates medicinal trees and plants using Vriksh Ayurveda, available for wellness and procurement.', geoRegion: 'IN', geoPlacename: 'India' },
      { page: 'Blog', slug: 'blog', metaTitle: 'The Gratitude Farms Journal', metaDescription: 'Field-tested insights on natural farming, soil regeneration, biochar and rural entrepreneurship.', keywords: 'natural farming blog, biochar, food forest', canonical: 'https://gratitudefarms.co.in/blog', robots: 'index, follow', ogImage: '/assets/blog/foodforest.jpg', aeoSummary: 'The Gratitude Farms Journal covers natural farming, soil regeneration, biochar, food forests and ex-servicemen entrepreneurship.', geoRegion: 'IN', geoPlacename: 'India' },
      { page: 'Contact', slug: 'contact', metaTitle: 'Contact Gratitude Farms', metaDescription: 'Reach out for natural farming, farmland development and ESG partnership enquiries.', keywords: 'contact, enquiry, partnership', canonical: 'https://gratitudefarms.co.in/contact', robots: 'index, follow', ogImage: '/assets/polyhouse-greens.jpg', aeoSummary: 'Contact Gratitude Farms in Pondicherry for managed farmland, Nakshatra Vanam, Sainya Krishi and corporate ESG enquiries.', geoRegion: 'IN-PY', geoPlacename: 'Pondicherry, India' }
    ],
    settings: {
      siteName: 'Gratitude Farms', tagline: 'Cultivating Discipline, Harvesting Hope',
      supportEmail: 'info@gratitudefarms.co.in', phone: '+91 91500 23044',
      address: 'No.70, Auroville Main Road, Kottakuppam, Pondicherry – 605104',
      facebook: 'https://www.facebook.com/gratitudefarmsindia/', instagram: 'https://www.instagram.com/gratitude_farms/',
      linkedin: 'https://www.linkedin.com/company/gratitudefarmsindia', youtube: 'https://www.youtube.com/channel/UC61AuTlj_15ZXKLPCQF-F2w',
      heroInterval: '5.5', analyticsId: 'G-XXXXXXXXXX',
      showWef: true, maintenance: false
    }
  };

  componentDidMount() {
    document.body.classList.add('gf-admin');

    import('../data/blog-data.js').then(mod => {
      const serialize = (body) => (body || []).map(b => {
        if (b.t === 'h2') return '## ' + b.x;
        if (b.t === 'ul' || b.t === 'refs') return (b.items || []).map(i => '- ' + i).join('\n');
        if (b.t === 'quote') return '> ' + b.x;
        return b.x;
      }).join('\n\n');
      const blogs = mod.POSTS.map(p => ({
        title: p.title, slug: p.slug, category: p.category, author: p.author,
        dateDisplay: p.dateDisplay, hero: p.hero, subtitle: p.subtitle,
        content: serialize(p.body),
        metaDescription: p.seo.description, keywords: (p.seo.keywords || []).join(', '),
        status: 'Published'
      }));
      this.setState({ blogs });
    });
  }

  componentWillUnmount() {
    document.body.classList.remove('gf-admin');
    clearTimeout(this._t);
  }

  showToast(msg) {
    this.setState({ toast: msg });
    clearTimeout(this._t);
    this._t = setTimeout(() => this.setState({ toast: '' }), 2600);
  }

  fieldsFor(section, editor) {
    if (section === 'team') {
      // Editing an existing person never shows their password back — the list
      // does not carry one — so a blank field means "leave it as it is".
      const editing = !!editor && editor.idx > -1;
      return [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'email', label: 'Email Address', type: 'text', hint: 'This is what they sign in with.' },
        {
          key: 'password',
          label: editing ? 'New Password' : 'Password',
          type: 'password',
          hint: editing
            ? 'Leave blank to keep their current password.'
            : `At least ${MIN_PASSWORD} characters. Tell them what you set — it cannot be read back.`
        },
        {
          key: 'role', label: 'Role', type: 'select', options: [MEMBER_ROLE, ADMIN_ROLE],
          hint: 'Admins can add and remove people. Members can do everything else.'
        }
      ];
    }
    if (section === 'blogs') return [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'slug', label: 'URL Slug', type: 'text' },
      { key: 'category', label: 'Category', type: 'select', options: ['Natural Farming', 'Case Study', 'Perspective', 'Field Notes', 'Social Impact', 'Guide', 'In the News'] },
      { key: 'author', label: 'Author', type: 'text' },
      { key: 'dateDisplay', label: 'Publish Date', type: 'text' },
      { key: 'hero', label: 'Hero Image', type: 'image', hint: 'Path from the Media / Banners store, e.g. /assets/blog/mango.jpg' },
      { key: 'subtitle', label: 'Subtitle / Excerpt', type: 'area', rows: 2 },
      { key: 'content', label: 'Article Content', type: 'area', rows: 12, hint: 'Write the full article here. Blank line = new paragraph; start a line with ## for a section heading, - for a bullet, > for a quote.' },
      { key: '__seo', label: 'Search & Social', type: 'heading' },
      { key: 'metaDescription', label: 'SEO Meta Description', type: 'area', rows: 2, hint: 'Keep under ~155 characters.' },
      { key: 'keywords', label: 'SEO Keywords', type: 'text', hint: 'Comma-separated.' },
      { key: 'status', label: 'Status', type: 'select', options: ['Published', 'Draft'] }
    ];
    if (section === 'testimonials') return [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'role', label: 'Role / Location', type: 'text' },
      { key: 'rating', label: 'Rating', type: 'select', options: ['5', '4', '3', '2', '1'] },
      { key: 'quote', label: 'Testimonial', type: 'area', rows: 4 },
      { key: 'status', label: 'Status', type: 'select', options: ['Published', 'Pending'] }
    ];
    if (section === 'services') return [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'brand', label: 'Brand / Sub-name', type: 'text', hint: 'Optional, e.g. BhuPrana™' },
      { key: 'category', label: 'Category', type: 'select', options: ['Service', 'Program', 'Catalogue'] },
      { key: 'page', label: 'Linked Page', type: 'text' },
      { key: 'summary', label: 'Short Summary', type: 'area', rows: 3 },
      { key: 'status', label: 'Status', type: 'select', options: ['Live', 'Draft'] }
    ];
    if (section === 'banners') return [
      { key: 'image', label: 'Banner Image', type: 'image', hint: 'Full-bleed background image path, e.g. /assets/banner-soil-fertility.png' },
      { key: 'badge', label: 'Eyebrow / Badge Text', type: 'text' },
      { key: 'name', label: 'Headline', type: 'text' },
      { key: 'brand', label: 'Brand / Sub-name', type: 'text', hint: 'Optional, shown in gold, e.g. BhuPrana™' },
      { key: 'tagline', label: 'Tagline', type: 'area', rows: 3 },
      { key: 'link', label: 'Links To (page)', type: 'text' },
      { key: 'status', label: 'Status', type: 'select', options: ['Live', 'Hidden'] }
    ];
    if (section === 'faqs') return [
      { key: 'question', label: 'Question', type: 'text' },
      { key: 'answer', label: 'Answer', type: 'area', rows: 5, hint: 'Give a complete, self-contained answer — this is what AI answer engines will quote.' },
      { key: 'page', label: 'Appears On Page', type: 'select', options: ['Home', 'Contact', 'Our Services', 'Managed Farmland', 'Soil Fertility', 'Farmland Design', 'Farmland Operate', 'Medicinal Plants & Trees', 'Sainya Krishi', 'Nakshatra Vanam', 'Corporate ESG'] },
      { key: 'status', label: 'Status', type: 'select', options: ['Published', 'Draft'] }
    ];
    if (section === 'seo') return [
      { key: 'page', label: 'Page', type: 'text' },
      { key: 'slug', label: 'URL Slug', type: 'text' },
      { key: '__std', label: 'Standard SEO', type: 'heading' },
      { key: 'metaTitle', label: 'Title Tag', type: 'text', hint: 'Ideal length ~60 characters.' },
      { key: 'metaDescription', label: 'Meta Description', type: 'area', rows: 3, hint: 'Keep under ~155 characters.' },
      { key: 'keywords', label: 'Keywords', type: 'text', hint: 'Comma-separated.' },
      { key: 'canonical', label: 'Canonical URL', type: 'text' },
      { key: 'robots', label: 'Robots Directive', type: 'select', options: ['index, follow', 'noindex, follow', 'index, nofollow', 'noindex, nofollow'] },
      { key: 'ogImage', label: 'Social Share Image (OG)', type: 'image', hint: 'Used for Open Graph & Twitter cards.' },
      { key: '__aeo', label: 'AEO — Answer Engine Optimization', type: 'heading' },
      { key: 'aeoSummary', label: 'Concise Answer Summary', type: 'area', rows: 3, hint: 'A direct, quotable answer for Google AI Overviews and assistants like ChatGPT/Perplexity.' },
      { key: '__geo', label: 'GEO — Generative & Geo Context', type: 'heading' },
      { key: 'geoRegion', label: 'Geo Region Code', type: 'text', hint: 'ISO code, e.g. IN-PY for Puducherry.' },
      { key: 'geoPlacename', label: 'Place Name', type: 'text', hint: 'Human-readable location for local & generative context.' }
    ];
    return [];
  }

  listKey(section) { return section === 'seo' ? 'seoRows' : section; }

  openAdd() {
    const section = this.state.section;
    if (!this.fieldsFor(section).length) return;
    const blank = {};
    this.fieldsFor(section).forEach(f => { if (f.type === 'heading') return; blank[f.key] = f.type === 'select' ? f.options[0] : ''; });
    this.setState({ editor: { section, idx: -1 }, form: blank });
  }
  openEdit(section, idx) {
    const list = this.state[this.listKey(section)];
    const form = { ...list[idx] };
    if (section === 'team') form.password = '';
    this.setState({ editor: { section, idx }, form });
  }
  removeItem(section, idx) {
    if (section === 'team') { this.removeMember(idx); return; }
    const key = this.listKey(section);
    const list = this.state[key].slice();
    const [removed] = list.splice(idx, 1);
    this.setState({ [key]: list });
    this.showToast('Deleted “' + (removed.title || removed.name || removed.question || removed.page) + '”');
  }

  /**
   * The team section writes through to the account store rather than to this
   * component's state, so both of these hand the store's own refusal — a
   * duplicate address, too short a password, the last admin — straight to the
   * toast, and re-read the list on success.
   */
  saveMember(idx) {
    const form = this.state.form;
    const existing = idx === -1 ? null : this.state.team[idx];
    const result = existing ? updateUser(existing.email, form) : addUser(form);

    if (!result.ok) { this.showToast(result.error); return; }

    this.setState({ team: listUsers(), editor: null, form: {} });
    this.showToast((existing ? 'Saved ' : 'Added ') + String(form.email || '').trim().toLowerCase());
  }
  removeMember(idx) {
    const person = this.state.team[idx];
    const result = removeUser(person.email);

    if (!result.ok) { this.showToast(result.error); return; }

    this.setState({ team: listUsers() });
    this.showToast('Removed ' + person.email);
  }

  setField(key, val) { this.setState(s => ({ form: { ...s.form, [key]: val } })); }
  saveEditor() {
    const { section, idx } = this.state.editor;
    if (section === 'team') { this.saveMember(idx); return; }
    const key = this.listKey(section);
    const list = this.state[key].slice();
    if (idx === -1) list.unshift({ ...this.state.form });
    else list[idx] = { ...this.state.form };
    this.setState({ [key]: list, editor: null, form: {} });
    this.showToast('Saved successfully');
  }
  setEnquiryStatus(idx, val) {
    const list = this.state.enquiries.slice();
    list[idx] = { ...list[idx], status: val };
    const detail = this.state.detail && this.state.detail.idx === idx ? { ...this.state.detail, status: val } : this.state.detail;
    this.setState({ enquiries: list, detail });
    this.showToast('Status updated → ' + val);
  }
  openDetail(idx) { this.setState({ detail: { ...this.state.enquiries[idx], idx } }); }
  setSetting(key, val) { this.setState(s => ({ settings: { ...s.settings, [key]: val } })); }

  enqBadge(status) {
    if (status === 'New') return { bg: '#fdecd2', color: '#775a19' };
    if (status === 'Contacted') return { bg: '#e8f3ee', color: '#2D5A27' };
    if (status === 'In Progress') return { bg: '#e0ecf5', color: '#1f4a6b' };
    return { bg: '#e5e2dd', color: '#414846' };
  }

  renderVals() {
    const user = this.props.user || {};
    const canManage = canManageTeam(user);

    // A member has no team section, so a section they cannot open falls back to
    // the dashboard rather than rendering an empty page.
    const s = this.state.section === 'team' && !canManage ? 'dashboard' : this.state.section;

    const sections = [
      ['dashboard', 'Dashboard', 'Overview'],
      ['enquiries', 'Contact Enquiries', 'Leads'],
      ['services', 'Services & Programs', 'Catalogue'],
      ['blogs', 'Blog Posts', 'Content'],
      ['testimonials', 'Testimonials', 'Content'],
      ['faqs', 'FAQ Manager', 'Content'],
      ['banners', 'Homepage Banners', 'Content'],
      ['seo', 'SEO / AEO / GEO', 'Marketing'],
      ['team', 'Team & Access', 'System'],
      ['settings', 'Website Settings', 'System']
    ];
    const navItems = sections.filter(([key]) => key !== 'team' || canManage).map(([key, label]) => ({
      key, label,
      bg: s === key ? 'rgba(197,160,89,0.16)' : 'transparent',
      color: s === key ? '#e9c176' : '#c5eadf',
      dotOpacity: s === key ? 1 : 0.4,
      onClick: () => this.setState({ section: key, editor: null, detail: null })
    }));
    const meta = Object.fromEntries(sections.map(([k, l, kick]) => [k, { label: l, kicker: kick }]));

    const addable = { blogs: 'New Post', testimonials: 'Add Testimonial', services: 'Add Entry', banners: 'Add Banner', faqs: 'Add FAQ', team: 'Add Person' };
    const canAdd = !!addable[s];

    const editor = this.state.editor;
    let formFields = [];
    if (editor) {
      formFields = this.fieldsFor(editor.section, editor).map(f => {
        if (f.type === 'heading') return { label: f.label, isHeading: true, isField: false };
        return {
          label: f.label, hint: f.hint || '', isField: true, isHeading: false,
          value: this.state.form[f.key] ?? '',
          options: f.options || [], rows: f.rows || 4,
          isText: f.type === 'text' || f.type === 'image', isArea: f.type === 'area',
          isSelect: f.type === 'select', isImage: f.type === 'image',
          isPassword: f.type === 'password',
          onInput: (e) => this.setField(f.key, e.target.value)
        };
      });
    }
    const editorTitleMap = { blogs: 'Blog Post', testimonials: 'Testimonial', services: 'Catalogue Entry', banners: 'Banner Slide', faqs: 'FAQ', seo: 'Page SEO', team: 'Team Member' };

    const st = this.state.settings;
    const txt = (key, label, span) => ({ label, value: st[key], isText: true, span: span || 'auto', onInput: (e) => this.setSetting(key, e.target.value) });
    const toggle = (key, label) => ({ label, isToggle: true, span: 'auto', toggleBg: st[key] ? '#2D5A27' : '#c1c8c4', knobLeft: st[key] ? '27px' : '3px', onToggle: () => this.setSetting(key, !st[key]) });
    const settingGroups = [
      { title: 'General', hint: 'Core identity shown across the site and in the footer.', fields: [ txt('siteName', 'Site Name'), txt('tagline', 'Tagline'), txt('supportEmail', 'Support Email'), txt('phone', 'Phone'), { label: 'Address', value: st.address, isArea: true, span: '1 / -1', onInput: (e) => this.setSetting('address', e.target.value) } ] },
      { title: 'Social Links', hint: 'Linked from the footer and contact page.', fields: [ txt('facebook', 'Facebook URL'), txt('instagram', 'Instagram URL'), txt('linkedin', 'LinkedIn URL'), txt('youtube', 'YouTube URL') ] },
      { title: 'Homepage', hint: 'Behaviour of the homepage hero and banners.', fields: [ txt('heroInterval', 'Hero Slide Interval (sec)'), toggle('showWef', 'Show World Economic Forum banner') ] },
      { title: 'Integrations & System', hint: 'Analytics and site availability.', fields: [ txt('analyticsId', 'Google Analytics ID'), toggle('maintenance', 'Maintenance Mode') ] }
    ];

    const d = this.state.detail;

    return {
      navItems,
      sectionTitle: meta[s].label, sectionKicker: meta[s].kicker,
      canAdd, addLabel: addable[s] || 'Add',
      onAddNew: () => this.openAdd(),
      onSaveSettings: () => this.showToast('Settings saved'),

      isDashboard: s === 'dashboard', isEnquiries: s === 'enquiries', isServices: s === 'services',
      isBlogs: s === 'blogs', isTestimonials: s === 'testimonials', isBanners: s === 'banners',
      isFaqs: s === 'faqs', isSeo: s === 'seo', isSettings: s === 'settings',
      isTeam: s === 'team',

      stats: [
        { label: 'Open Enquiries', value: String(this.state.enquiries.filter(e => e.status !== 'Closed').length) },
        { label: 'Published Blogs', value: String(this.state.blogs.filter(b => b.status === 'Published').length) },
        { label: 'Live Banners', value: String(this.state.banners.filter(b => b.status === 'Live').length) },
        { label: 'FAQs Published', value: String(this.state.faqs.filter(q => q.status === 'Published').length) }
      ],
      goToEnquiries: () => this.setState({ section: 'enquiries' }),
      quickActions: [
        { label: '✍  Write a new blog post', onClick: () => { this.setState({ section: 'blogs' }); setTimeout(() => this.openAdd(), 0); } },
        { label: '❓  Add an FAQ (great for AEO)', onClick: () => { this.setState({ section: 'faqs' }); setTimeout(() => this.openAdd(), 0); } },
        { label: '🖼  Manage homepage banners', onClick: () => this.setState({ section: 'banners' }) },
        { label: '⌕  Review SEO / AEO / GEO', onClick: () => this.setState({ section: 'seo' }) }
      ],
      recentEnquiries: this.state.enquiries.slice(0, 5).map((r, i) => { const b = this.enqBadge(r.status); return { ...r, badgeBg: b.bg, badgeColor: b.color, onView: () => this.openDetail(i) }; }),
      enquiries: this.state.enquiries.map((r, i) => ({ ...r, onStatus: (e) => this.setEnquiryStatus(i, e.target.value), onView: () => this.openDetail(i) })),

      blogs: this.state.blogs.map((b, i) => ({
        ...b,
        statusBg: b.status === 'Published' ? '#e8f3ee' : '#fdecd2',
        statusColor: b.status === 'Published' ? '#2D5A27' : '#775a19',
        onEdit: () => this.openEdit('blogs', i), onDelete: () => this.removeItem('blogs', i)
      })),

      testimonials: this.state.testimonials.map((t, i) => ({
        ...t,
        stars: '★★★★★'.slice(0, Number(t.rating || 5)) + '☆☆☆☆☆'.slice(0, 5 - Number(t.rating || 5)),
        statusBg: t.status === 'Published' ? '#e8f3ee' : '#fdecd2',
        statusColor: t.status === 'Published' ? '#2D5A27' : '#775a19',
        onEdit: () => this.openEdit('testimonials', i), onDelete: () => this.removeItem('testimonials', i)
      })),

      services: this.state.services.map((p, i) => ({
        ...p,
        statusBg: p.status === 'Live' ? '#e8f3ee' : '#fdecd2',
        statusColor: p.status === 'Live' ? '#2D5A27' : '#775a19',
        onEdit: () => this.openEdit('services', i), onDelete: () => this.removeItem('services', i)
      })),

      banners: this.state.banners.map((b, i) => ({
        ...b,
        statusBg: b.status === 'Live' ? '#e8f3ee' : '#e5e2dd',
        statusColor: b.status === 'Live' ? '#2D5A27' : '#414846',
        onEdit: () => this.openEdit('banners', i), onDelete: () => this.removeItem('banners', i)
      })),

      faqs: this.state.faqs.map((q, i) => ({
        ...q,
        statusBg: q.status === 'Published' ? '#e8f3ee' : '#fdecd2',
        statusColor: q.status === 'Published' ? '#2D5A27' : '#775a19',
        onEdit: () => this.openEdit('faqs', i), onDelete: () => this.removeItem('faqs', i)
      })),

      seoRows: this.state.seoRows.map((r, i) => ({
        ...r,
        descLabel: r.metaDescription.length + ' chars',
        aeoState: r.aeoSummary ? 'set' : 'empty', aeoBg: r.aeoSummary ? '#e8f3ee' : '#fdecd2', aeoColor: r.aeoSummary ? '#2D5A27' : '#775a19',
        geoState: r.geoPlacename ? 'set' : 'empty', geoBg: r.geoPlacename ? '#e8f3ee' : '#fdecd2', geoColor: r.geoPlacename ? '#2D5A27' : '#775a19',
        onEdit: () => this.openEdit('seo', i)
      })),

      team: this.state.team.map((p, i) => ({
        ...p,
        roleBg: p.role === ADMIN_ROLE ? '#e8f3ee' : '#e0ecf5',
        roleColor: p.role === ADMIN_ROLE ? '#2D5A27' : '#1f4a6b',
        isYou: p.email === user.email,
        // The founder account lives in the site's code, so the console can show
        // it but not change it. Nobody removes the account they are using.
        canEdit: !p.isOwner,
        canRemove: !p.isOwner && p.email !== user.email,
        onEdit: () => this.openEdit('team', i),
        onDelete: () => this.removeItem('team', i)
      })),

      settingGroups,

      // Who is signed in, and the way back out — both handed down by the route
      // guard in App.jsx, which owns the session.
      adminName: user.name || user.email || 'Administrator',
      adminEmail: user.email || '',
      adminRole: user.isOwner ? 'Founder · Admin' : (user.role || ''),
      onSignOut: this.props.onSignOut,

      detailOpen: !!d,
      detail: d ? { ...d, telHref: 'tel:' + (d.phone || '').replace(/\s/g, ''), mailHref: 'mailto:' + d.email, onStatus: (e) => this.setEnquiryStatus(d.idx, e.target.value) } : {},
      onCloseDetail: () => this.setState({ detail: null }),

      editorOpen: !!editor,
      editorTitle: editor ? ((editor.idx === -1 ? 'New ' : 'Edit ') + (editorTitleMap[editor.section] || 'Item')) : '',
      editorMode: editor ? (editor.idx === -1 ? 'Create' : 'Edit') : '',
      saveLabel: editor && editor.idx === -1 ? 'Create' : 'Save Changes',
      formFields,
      onSaveEditor: () => this.saveEditor(),
      onCancelEditor: () => this.setState({ editor: null, form: {} }),

      toast: this.state.toast
    };
  }

  render() {
    const $v = this.renderVals();
    return (
      <>
      <Seo title={"Admin Console — Gratitude Farms"} description={"Gratitude Farms — Admin Console"} />
        <div className="adm-shell" style={css("font-family:'Hanken Grotesk',sans-serif;display:flex;min-height:100vh;background:#F0EDE8;")}>
          <aside className="adm-aside" style={css("width:250px;flex-shrink:0;background:#1A3C34;color:#FAFAF9;display:flex;flex-direction:column;padding:24px 16px;position:sticky;top:0;height:100vh;box-sizing:border-box;")}>
            <A href="/" style={css("display:flex;align-items:center;gap:10px;text-decoration:none;padding:0 10px 24px;border-bottom:1px solid rgba(250,250,249,0.12);margin-bottom:20px;")}>
              <img src="/assets/logo-badge.png" alt="Gratitude Farms" style={css("width:34px;height:34px;object-fit:contain;")} />
              <span style={css("font-family:'Source Serif 4',serif;font-size:16.5px;font-weight:700;color:#FAFAF9;")}>
                {"Gratitude Admin"}
              </span>
            </A>
            <nav style={css("display:flex;flex-direction:column;gap:2px;overflow-y:auto;")}>
              {($v.navItems || []).map((item, itemIndex) => (
                <Fragment key={itemIndex}>
                  <button onClick={item.onClick} style={css(`display:flex;align-items:center;gap:12px;text-align:left;background:${item.bg};color:${item.color};border:none;padding:11px 14px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;font-family:'Hanken Grotesk',sans-serif;`)}>
                    <span style={css(`width:6px;height:6px;border-radius:999px;background:${item.color};opacity:${item.dotOpacity};flex-shrink:0;`)} />
                    {"\n          "}{item.label}{"\n        "}
                  </button>
                </Fragment>
              ))}
            </nav>
            <div style={css("margin-top:auto;padding:14px;background:rgba(250,250,249,0.06);border-radius:12px;")}>
              <div style={css("font-size:12.5px;color:#c5eadf;")}>
                {"Logged in as"}
              </div>
              <div style={css("font-size:14px;font-weight:700;color:#FAFAF9;margin-top:4px;overflow-wrap:anywhere;")}>
                {$v.adminName}
              </div>
              <div style={css("font-size:11.5px;color:#83a69c;overflow-wrap:anywhere;")}>
                {$v.adminEmail}
              </div>
              <div style={css("font-size:11px;color:#e9c176;margin-top:3px;font-weight:600;")}>
                {$v.adminRole}
              </div>
              <A href="/" style={css("display:block;margin-top:12px;text-decoration:none;color:#e9c176;font-size:12.5px;font-weight:600;")}>
                {"↩ Back to website"}
              </A>
              <button onClick={$v.onSignOut} style={css("display:block;margin-top:10px;background:none;border:none;padding:0;text-align:left;color:#c5eadf;font-size:12.5px;font-weight:600;cursor:pointer;font-family:'Hanken Grotesk',sans-serif;")}>
                {"Sign out"}
              </button>
            </div>
          </aside>
          <main style={css("flex:1;min-width:0;")}>
            <header className="adm-header" style={css("background:#FAFAF9;border-bottom:1px solid #e5e2dd;padding:20px 40px;display:flex;justify-content:space-between;align-items:center;gap:20px;position:sticky;top:0;z-index:20;")}>
              <div>
                <div style={css("font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.1em;color:#717976;text-transform:uppercase;")}>
                  {$v.sectionKicker}
                </div>
                <h1 style={css("font-family:'Source Serif 4',serif;font-size:24px;color:#1A3C34;margin:4px 0 0;")}>
                  {$v.sectionTitle}
                </h1>
              </div>
              <div style={css("display:flex;gap:12px;align-items:center;")}>
                <input type="search" placeholder="Search…" style={css("width:220px;max-width:34vw;background:#F5F2ED;border:1px solid #e5e2dd;border-radius:10px;padding:10px 14px;font-size:13.5px;font-family:'Hanken Grotesk',sans-serif;")} />
                {($v.canAdd) ? (
                  <>
                  <Hov as="button" onClick={$v.onAddNew} style={css("background:#1A3C34;color:#fff;border:none;border-radius:10px;padding:11px 18px;font-size:13.5px;font-weight:700;cursor:pointer;font-family:'Hanken Grotesk',sans-serif;white-space:nowrap;")} hoverStyle={css("background:#C5A059;color:#1A3C34;")}>
                    {"+ "}{$v.addLabel}
                  </Hov>
                  </>
                ) : null}
              </div>
            </header>
            <div className="adm-body" style={css("padding:36px 40px;")}>
              {($v.isDashboard) ? (
                <>
                <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;margin-bottom:28px;")}>
                  {($v.stats || []).map((st, stIndex) => (
                    <Fragment key={stIndex}>
                      <div style={css("background:#FAFAF9;border:1px solid #e5e2dd;border-radius:16px;padding:24px;")}>
                        <div style={css("font-size:12px;color:#717976;text-transform:uppercase;letter-spacing:0.05em;")}>
                          {st.label}
                        </div>
                        <div style={css("font-family:'Source Serif 4',serif;font-size:34px;color:#1A3C34;margin-top:8px;")}>
                          {st.value}
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
                <div className="gf-2col" style={css("display:grid;grid-template-columns:1.4fr 1fr;gap:20px;")}>
                  <div style={css("background:#FAFAF9;border:1px solid #e5e2dd;border-radius:16px;overflow:hidden;")}>
                    <div style={css("padding:20px 24px;border-bottom:1px solid #e5e2dd;display:flex;justify-content:space-between;align-items:center;")}>
                      <h3 style={css("font-family:'Source Serif 4',serif;font-size:17px;color:#1A3C34;margin:0;")}>
                        {"Recent Enquiries"}
                      </h3>
                      <button onClick={$v.goToEnquiries} style={css("background:none;border:none;color:#1A3C34;font-size:13px;font-weight:700;cursor:pointer;")}>
                        {"View All →"}
                      </button>
                    </div>
                    {($v.recentEnquiries || []).map((row, rowIndex) => (
                      <Fragment key={rowIndex}>
                        <Hov as="div" onClick={row.onView} style={css("display:flex;justify-content:space-between;align-items:center;padding:15px 24px;border-bottom:1px solid #F0EDE8;cursor:pointer;")} hoverStyle={css("background:#F5F2ED;")}>
                          <div>
                            <div style={css("font-size:14px;font-weight:700;color:#1A3C34;")}>
                              {row.name}
                            </div>
                            <div style={css("font-size:12.5px;color:#717976;")}>
                              {row.interest}{" · "}{row.date}
                            </div>
                          </div>
                          <span style={css(`font-size:11.5px;font-weight:700;padding:5px 12px;border-radius:999px;background:${row.badgeBg};color:${row.badgeColor};`)}>
                            {row.status}
                          </span>
                        </Hov>
                      </Fragment>
                    ))}
                  </div>
                  <div style={css("background:#FAFAF9;border:1px solid #e5e2dd;border-radius:16px;padding:24px;")}>
                    <h3 style={css("font-family:'Source Serif 4',serif;font-size:17px;color:#1A3C34;margin:0 0 16px;")}>
                      {"Quick Actions"}
                    </h3>
                    <div style={css("display:flex;flex-direction:column;gap:10px;")}>
                      {($v.quickActions || []).map((qa, qaIndex) => (
                        <Fragment key={qaIndex}>
                          <Hov as="button" onClick={qa.onClick} style={css("text-align:left;background:#F5F2ED;border:1px solid #e5e2dd;border-radius:10px;padding:14px 16px;font-size:13.5px;font-weight:600;color:#1A3C34;cursor:pointer;font-family:'Hanken Grotesk',sans-serif;")} hoverStyle={css("border-color:#C5A059;")}>
                            {qa.label}
                          </Hov>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </div>
                </>
              ) : null}
              {($v.isEnquiries) ? (
                <>
                <div className="adm-row-scroll" style={css("background:#FAFAF9;border:1px solid #e5e2dd;border-radius:16px;")}>
                  <div className="adm-row" style={css("display:grid;grid-template-columns:1.3fr 1.3fr 0.7fr 130px 70px;gap:16px;padding:14px 24px;border-bottom:1px solid #e5e2dd;background:#F5F2ED;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:0.06em;color:#717976;text-transform:uppercase;")}>
                    <span>
                      {"Name"}
                    </span>
                    <span>
                      {"Interest"}
                    </span>
                    <span>
                      {"Date"}
                    </span>
                    <span>
                      {"Status"}
                    </span>
                    <span />
                  </div>
                  {($v.enquiries || []).map((row, rowIndex) => (
                    <Fragment key={rowIndex}>
                      <div className="adm-row" style={css("display:grid;grid-template-columns:1.3fr 1.3fr 0.7fr 130px 70px;gap:16px;align-items:center;padding:14px 24px;border-bottom:1px solid #F0EDE8;")}>
                        <div style={css("min-width:0;")}>
                          <div style={css("font-size:14px;font-weight:700;color:#1A3C34;")}>
                            {row.name}
                          </div>
                          <div style={css("font-size:12px;color:#717976;overflow:hidden;text-overflow:ellipsis;")}>
                            {row.phone}
                          </div>
                        </div>
                        <span style={css("font-size:13px;color:#414846;")}>
                          {row.interest}
                        </span>
                        <span style={css("font-size:12.5px;color:#717976;")}>
                          {row.date}
                        </span>
                        <select value={row.status} onChange={row.onStatus} className="adm-input" style={css("padding:7px 10px;font-size:12.5px;font-weight:700;")}>
                          <option>
                            {"New"}
                          </option>
                          <option>
                            {"Contacted"}
                          </option>
                          <option>
                            {"In Progress"}
                          </option>
                          <option>
                            {"Closed"}
                          </option>
                        </select>
                        <button onClick={row.onView} style={css("background:#F5F2ED;border:1px solid #e5e2dd;border-radius:8px;padding:7px 10px;font-size:12px;font-weight:700;color:#1A3C34;cursor:pointer;")}>
                          {"View"}
                        </button>
                      </div>
                    </Fragment>
                  ))}
                </div>
                </>
              ) : null}
              {($v.isBlogs) ? (
                <>
                <div style={css("background:#FAFAF9;border:1px solid #e5e2dd;border-radius:16px;overflow:hidden;")}>
                  {($v.blogs || []).map((b, bIndex) => (
                    <Fragment key={bIndex}>
                      <div style={css("display:flex;justify-content:space-between;align-items:center;padding:16px 24px;border-bottom:1px solid #F0EDE8;gap:16px;")}>
                        <div style={css("flex:1;min-width:0;")}>
                          <div style={css("font-size:14px;font-weight:700;color:#1A3C34;")}>
                            {b.title}
                          </div>
                          <div style={css("font-size:12.5px;color:#717976;")}>
                            {b.category}{" · "}{b.author}{" · "}{b.dateDisplay}
                          </div>
                        </div>
                        <span style={css(`font-size:11.5px;font-weight:700;padding:5px 12px;border-radius:999px;background:${b.statusBg};color:${b.statusColor};flex-shrink:0;`)}>
                          {b.status}
                        </span>
                        <div style={css("display:flex;gap:8px;flex-shrink:0;")}>
                          <button onClick={b.onEdit} style={css("background:#F5F2ED;border:1px solid #e5e2dd;border-radius:8px;padding:7px 14px;font-size:12.5px;font-weight:700;color:#1A3C34;cursor:pointer;")}>
                            {"Edit"}
                          </button>
                          <button onClick={b.onDelete} style={css("background:#fff;border:1px solid #e6c9c4;border-radius:8px;padding:7px 12px;font-size:12.5px;font-weight:700;color:#a5493c;cursor:pointer;")}>
                            {"Delete"}
                          </button>
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
                </>
              ) : null}
              {($v.isTestimonials) ? (
                <>
                <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;")}>
                  {($v.testimonials || []).map((t, tIndex) => (
                    <Fragment key={tIndex}>
                      <div style={css("background:#FAFAF9;border:1px solid #e5e2dd;border-radius:16px;padding:24px;display:flex;flex-direction:column;gap:12px;")}>
                        <div style={css("display:flex;justify-content:space-between;align-items:flex-start;gap:10px;")}>
                          <div>
                            <div style={css("font-size:15px;font-weight:700;color:#1A3C34;")}>
                              {t.name}
                            </div>
                            <div style={css("font-size:12.5px;color:#717976;")}>
                              {t.role}
                            </div>
                          </div>
                          <span style={css(`font-size:11px;font-weight:700;padding:4px 10px;border-radius:999px;background:${t.statusBg};color:${t.statusColor};flex-shrink:0;`)}>
                            {t.status}
                          </span>
                        </div>
                        <div style={css("color:#C5A059;font-size:14px;letter-spacing:2px;")}>
                          {t.stars}
                        </div>
                        <p style={css("color:#414846;font-size:13.5px;line-height:1.6;margin:0;")}>
                          {t.quote}
                        </p>
                        <div style={css("display:flex;gap:8px;margin-top:auto;padding-top:6px;")}>
                          <button onClick={t.onEdit} style={css("background:#F5F2ED;border:1px solid #e5e2dd;border-radius:8px;padding:7px 14px;font-size:12.5px;font-weight:700;color:#1A3C34;cursor:pointer;")}>
                            {"Edit"}
                          </button>
                          <button onClick={t.onDelete} style={css("background:#fff;border:1px solid #e6c9c4;border-radius:8px;padding:7px 12px;font-size:12.5px;font-weight:700;color:#a5493c;cursor:pointer;")}>
                            {"Delete"}
                          </button>
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
                </>
              ) : null}
              {($v.isServices) ? (
                <>
                <p style={css("color:#717976;font-size:13.5px;margin:0 0 20px;max-width:640px;")}>
                  {"Manage every offering shown on the site — the four flagship services, farm programs, and the medicinal catalogue. Each entry maps to a live page."}
                </p>
                <div style={css("background:#FAFAF9;border:1px solid #e5e2dd;border-radius:16px;overflow:hidden;")}>
                  {($v.services || []).map((p, pIndex) => (
                    <Fragment key={pIndex}>
                      <div style={css("display:flex;justify-content:space-between;align-items:center;padding:16px 24px;border-bottom:1px solid #F0EDE8;gap:16px;")}>
                        <div style={css("flex:1;min-width:0;")}>
                          <div style={css("font-size:14px;font-weight:700;color:#1A3C34;")}>
                            {p.name}{" "}
                            <span style={css("color:#C5A059;")}>
                              {p.brand}
                            </span>
                          </div>
                          <div style={css("font-size:12.5px;color:#717976;")}>
                            {p.category}{" · "}{p.page}
                          </div>
                        </div>
                        <span style={css(`font-size:11.5px;font-weight:700;padding:5px 12px;border-radius:999px;background:${p.statusBg};color:${p.statusColor};flex-shrink:0;`)}>
                          {p.status}
                        </span>
                        <div style={css("display:flex;gap:8px;flex-shrink:0;")}>
                          <button onClick={p.onEdit} style={css("background:#F5F2ED;border:1px solid #e5e2dd;border-radius:8px;padding:7px 14px;font-size:12.5px;font-weight:700;color:#1A3C34;cursor:pointer;")}>
                            {"Edit"}
                          </button>
                          <button onClick={p.onDelete} style={css("background:#fff;border:1px solid #e6c9c4;border-radius:8px;padding:7px 12px;font-size:12.5px;font-weight:700;color:#a5493c;cursor:pointer;")}>
                            {"Delete"}
                          </button>
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
                </>
              ) : null}
              {($v.isBanners) ? (
                <>
                <p style={css("color:#717976;font-size:13.5px;margin:0 0 20px;max-width:680px;")}>
                  {"Manage the sliding hero banners on the homepage and services page — the image and the text that sits over it (eyebrow, headline, brand, tagline) plus where it links. Reorder, add, edit or remove slides."}
                </p>
                <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:20px;")}>
                  {($v.banners || []).map((bn, bnIndex) => (
                    <Fragment key={bnIndex}>
                      <div style={css("background:#FAFAF9;border:1px solid #e5e2dd;border-radius:16px;overflow:hidden;")}>
                        <div style={css(`position:relative;aspect-ratio:16/8;background-image:url('${bn.image}');background-size:cover;background-position:center;`)}>
                          <div style={css("position:absolute;inset:0;background:linear-gradient(90deg,rgba(26,60,52,0.85),rgba(26,60,52,0.2));")} />
                          <div style={css("position:absolute;left:18px;right:18px;bottom:16px;")}>
                            <div style={css("font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.1em;color:#e9c176;text-transform:uppercase;margin-bottom:6px;")}>
                              {bn.badge}
                            </div>
                            <div style={css("font-family:'Source Serif 4',serif;font-size:18px;color:#FAFAF9;font-weight:700;")}>
                              {bn.name}{" "}
                              <span style={css("color:#C5A059;")}>
                                {bn.brand}
                              </span>
                            </div>
                          </div>
                          <span style={css(`position:absolute;top:12px;right:12px;font-size:10.5px;font-weight:700;padding:4px 10px;border-radius:999px;background:${bn.statusBg};color:${bn.statusColor};`)}>
                            {bn.status}
                          </span>
                        </div>
                        <div style={css("padding:16px 18px;")}>
                          <p style={css("color:#414846;font-size:12.5px;line-height:1.55;margin:0 0 6px;")}>
                            {bn.tagline}
                          </p>
                          <div style={css("font-size:11px;color:#9aa19d;margin-bottom:14px;")}>
                            {"→ "}{bn.link}
                          </div>
                          <div style={css("display:flex;gap:8px;")}>
                            <button onClick={bn.onEdit} style={css("background:#F5F2ED;border:1px solid #e5e2dd;border-radius:8px;padding:7px 16px;font-size:12.5px;font-weight:700;color:#1A3C34;cursor:pointer;")}>
                              {"Edit"}
                            </button>
                            <button onClick={bn.onDelete} style={css("background:#fff;border:1px solid #e6c9c4;border-radius:8px;padding:7px 12px;font-size:12.5px;font-weight:700;color:#a5493c;cursor:pointer;")}>
                              {"Delete"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
                </>
              ) : null}
              {($v.isFaqs) ? (
                <>
                <p style={css("color:#717976;font-size:13.5px;margin:0 0 20px;max-width:700px;")}>
                  {"Manage FAQs shown across the site. Well-structured Q&A is one of the strongest signals for Answer Engine Optimization (AEO) — it lets Google, and AI assistants, quote your exact answers. Each FAQ is tagged to the page it appears on and is published with FAQ structured data."}
                </p>
                <div style={css("background:#FAFAF9;border:1px solid #e5e2dd;border-radius:16px;overflow:hidden;")}>
                  {($v.faqs || []).map((q, qIndex) => (
                    <Fragment key={qIndex}>
                      <div style={css("display:flex;justify-content:space-between;align-items:flex-start;padding:18px 24px;border-bottom:1px solid #F0EDE8;gap:16px;")}>
                        <div style={css("flex:1;min-width:0;")}>
                          <div style={css("font-size:14px;font-weight:700;color:#1A3C34;")}>
                            {q.question}
                          </div>
                          <div style={css("font-size:12.5px;color:#717976;line-height:1.5;margin-top:4px;")}>
                            {q.answer}
                          </div>
                          <div style={css("font-family:'JetBrains Mono',monospace;font-size:10px;color:#C5A059;text-transform:uppercase;letter-spacing:0.06em;margin-top:8px;")}>
                            {"On: "}{q.page}
                          </div>
                        </div>
                        <span style={css(`font-size:11px;font-weight:700;padding:4px 10px;border-radius:999px;background:${q.statusBg};color:${q.statusColor};flex-shrink:0;`)}>
                          {q.status}
                        </span>
                        <div style={css("display:flex;gap:8px;flex-shrink:0;")}>
                          <button onClick={q.onEdit} style={css("background:#F5F2ED;border:1px solid #e5e2dd;border-radius:8px;padding:7px 14px;font-size:12.5px;font-weight:700;color:#1A3C34;cursor:pointer;")}>
                            {"Edit"}
                          </button>
                          <button onClick={q.onDelete} style={css("background:#fff;border:1px solid #e6c9c4;border-radius:8px;padding:7px 12px;font-size:12.5px;font-weight:700;color:#a5493c;cursor:pointer;")}>
                            {"Delete"}
                          </button>
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
                </>
              ) : null}
              {($v.isSeo) ? (
                <>
                <p style={css("color:#717976;font-size:13.5px;margin:0 0 20px;max-width:720px;")}>
                  {"Control how each page is understood by search engines, social platforms and AI answer engines. Standard SEO (title, description, keywords, canonical), "}
                  <strong>
                    {"AEO"}
                  </strong>
                  {" (Answer Engine Optimization — a concise answer AI assistants can quote) and "}
                  <strong>
                    {"GEO"}
                  </strong>
                  {" (Generative Engine Optimization — region and entity context) are all edited per page."}
                </p>
                <div style={css("background:#FAFAF9;border:1px solid #e5e2dd;border-radius:16px;overflow:hidden;")}>
                  {($v.seoRows || []).map((srow, srowIndex) => (
                    <Fragment key={srowIndex}>
                      <div style={css("display:flex;justify-content:space-between;align-items:center;gap:16px;padding:16px 24px;border-bottom:1px solid #F0EDE8;")}>
                        <div style={css("flex:1;min-width:0;")}>
                          <div style={css("font-size:14px;font-weight:700;color:#1A3C34;")}>
                            {srow.page}
                          </div>
                          <div style={css("font-size:12.5px;color:#717976;overflow:hidden;text-overflow:ellipsis;")}>
                            {srow.metaDescription}
                          </div>
                          <div style={css("display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;")}>
                            <span style={css("font-size:10px;font-weight:700;padding:3px 9px;border-radius:999px;background:#eef1ee;color:#414846;")}>
                              {srow.descLabel}
                            </span>
                            <span style={css(`font-size:10px;font-weight:700;padding:3px 9px;border-radius:999px;background:${srow.aeoBg};color:${srow.aeoColor};`)}>
                              {"AEO "}{srow.aeoState}
                            </span>
                            <span style={css(`font-size:10px;font-weight:700;padding:3px 9px;border-radius:999px;background:${srow.geoBg};color:${srow.geoColor};`)}>
                              {"GEO "}{srow.geoState}
                            </span>
                          </div>
                        </div>
                        <button onClick={srow.onEdit} style={css("background:#F5F2ED;border:1px solid #e5e2dd;border-radius:8px;padding:7px 14px;font-size:12.5px;font-weight:700;color:#1A3C34;cursor:pointer;flex-shrink:0;")}>
                          {"Edit SEO"}
                        </button>
                      </div>
                    </Fragment>
                  ))}
                </div>
                </>
              ) : null}
              {($v.isTeam) ? (
                <>
                <p style={css("color:#717976;font-size:13.5px;margin:0 0 18px;max-width:720px;")}>
                  {"Everyone who can sign in to this console. An "}
                  <strong>
                    {"Admin"}
                  </strong>
                  {" can add and remove people; a "}
                  <strong>
                    {"Member"}
                  </strong>
                  {" can do everything else but never sees this section. Use “Add Person” to create an account, and tell them the password you set — it cannot be read back here."}
                </p>
                <div style={css("background:#fdf6e8;border:1px solid #ecd9ac;border-radius:12px;padding:14px 18px;margin:0 0 24px;max-width:720px;")}>
                  <div style={css("font-size:12.5px;font-weight:700;color:#775a19;margin-bottom:4px;")}>
                    {"Accounts are saved in this browser"}
                  </div>
                  <div style={css("font-size:12.5px;color:#775a19;line-height:1.6;")}>
                    {"The site has no server, so a person you add here can sign in on this computer only, and clearing this browser’s site data removes them. The founder account works everywhere because it ships with the site."}
                  </div>
                </div>
                <div style={css("background:#FAFAF9;border:1px solid #e5e2dd;border-radius:16px;overflow:hidden;max-width:940px;")}>
                  {($v.team || []).map((p, pIndex) => (
                    <Fragment key={pIndex}>
                      <div style={css("display:flex;justify-content:space-between;align-items:center;gap:16px;padding:16px 24px;border-bottom:1px solid #F0EDE8;flex-wrap:wrap;")}>
                        <div style={css("flex:1;min-width:180px;")}>
                          <div style={css("font-size:14px;font-weight:700;color:#1A3C34;")}>
                            {p.name}
                            {(p.isYou) ? (
                              <>
                              <span style={css("font-size:10.5px;font-weight:700;color:#C5A059;margin-left:8px;letter-spacing:0.04em;")}>
                                {"YOU"}
                              </span>
                              </>
                            ) : null}
                          </div>
                          <div style={css("font-size:12.5px;color:#717976;overflow-wrap:anywhere;")}>
                            {p.email}
                          </div>
                          <div style={css("font-family:'JetBrains Mono',monospace;font-size:10px;color:#9aa19d;text-transform:uppercase;letter-spacing:0.06em;margin-top:6px;")}>
                            {"Added: "}{p.added}
                          </div>
                        </div>
                        <span style={css(`font-size:11.5px;font-weight:700;padding:5px 12px;border-radius:999px;background:${p.roleBg};color:${p.roleColor};flex-shrink:0;`)}>
                          {p.role}
                        </span>
                        <div style={css("display:flex;gap:8px;flex-shrink:0;align-items:center;")}>
                          {(p.canEdit) ? (
                            <>
                            <button onClick={p.onEdit} style={css("background:#F5F2ED;border:1px solid #e5e2dd;border-radius:8px;padding:7px 14px;font-size:12.5px;font-weight:700;color:#1A3C34;cursor:pointer;")}>
                              {"Edit"}
                            </button>
                            </>
                          ) : null}
                          {(p.canRemove) ? (
                            <>
                            <button onClick={p.onDelete} style={css("background:#fff;border:1px solid #e6c9c4;border-radius:8px;padding:7px 12px;font-size:12.5px;font-weight:700;color:#a5493c;cursor:pointer;")}>
                              {"Remove"}
                            </button>
                            </>
                          ) : null}
                          {(!p.canEdit) ? (
                            <>
                            <span style={css("font-size:11.5px;color:#9aa19d;")}>
                              {"Set in code"}
                            </span>
                            </>
                          ) : null}
                          {(p.canEdit && !p.canRemove) ? (
                            <>
                            <span style={css("font-size:11.5px;color:#9aa19d;")}>
                              {"Signed in"}
                            </span>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
                </>
              ) : null}
              {($v.isSettings) ? (
                <>
                <div style={css("display:flex;flex-direction:column;gap:20px;max-width:720px;")}>
                  {($v.settingGroups || []).map((g, gIndex) => (
                    <Fragment key={gIndex}>
                      <div style={css("background:#FAFAF9;border:1px solid #e5e2dd;border-radius:16px;padding:28px;")}>
                        <h3 style={css("font-family:'Source Serif 4',serif;font-size:18px;color:#1A3C34;margin:0 0 4px;")}>
                          {g.title}
                        </h3>
                        <p style={css("color:#717976;font-size:13px;margin:0 0 20px;")}>
                          {g.hint}
                        </p>
                        <div className="gf-2col" style={css("display:grid;grid-template-columns:1fr 1fr;gap:18px;")}>
                          {(g.fields || []).map((f, fIndex) => (
                            <Fragment key={fIndex}>
                              <div style={css(`grid-column:${f.span};`)}>
                                <label style={css("font-size:12px;font-weight:700;color:#1A3C34;display:block;margin-bottom:8px;")}>
                                  {f.label}
                                </label>
                                {(f.isText) ? (
                                  <>
                                  <input value={f.value} onInput={f.onInput} className="adm-input" />
                                  </>
                                ) : null}
                                {(f.isArea) ? (
                                  <>
                                  <textarea rows="2" onInput={f.onInput} className="adm-input" style={css("resize:vertical;")}>
                                    {f.value}
                                  </textarea>
                                  </>
                                ) : null}
                                {(f.isToggle) ? (
                                  <>
                                  <button onClick={f.onToggle} style={css(`width:52px;height:28px;border-radius:999px;border:none;cursor:pointer;background:${f.toggleBg};position:relative;transition:background 0.2s ease;`)}>
                                    <span style={css(`position:absolute;top:3px;left:${f.knobLeft};width:22px;height:22px;border-radius:999px;background:#fff;transition:left 0.2s ease;`)} />
                                  </button>
                                  </>
                                ) : null}
                              </div>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    </Fragment>
                  ))}
                  <div>
                    <Hov as="button" onClick={$v.onSaveSettings} style={css("background:#1A3C34;color:#fff;border:none;border-radius:10px;padding:14px 28px;font-size:14px;font-weight:700;cursor:pointer;font-family:'Hanken Grotesk',sans-serif;")} hoverStyle={css("background:#C5A059;color:#1A3C34;")}>
                      {"Save Settings"}
                    </Hov>
                  </div>
                </div>
                </>
              ) : null}
            </div>
          </main>
          {($v.detailOpen) ? (
            <>
            <div onClick={$v.onCloseDetail} style={css("position:fixed;inset:0;background:rgba(26,60,52,0.45);z-index:40;")} />
            <div style={css("position:fixed;top:0;right:0;bottom:0;width:min(500px,94vw);background:#FCF9F4;z-index:50;box-shadow:-16px 0 48px rgba(26,60,52,0.2);display:flex;flex-direction:column;")}>
              <div style={css("padding:22px 28px;border-bottom:1px solid #e5e2dd;display:flex;justify-content:space-between;align-items:center;background:#FAFAF9;")}>
                <div>
                  <div style={css("font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:0.08em;color:#717976;text-transform:uppercase;")}>
                    {"Enquiry Detail"}
                  </div>
                  <h2 style={css("font-family:'Source Serif 4',serif;font-size:20px;color:#1A3C34;margin:3px 0 0;")}>
                    {$v.detail.name}
                  </h2>
                </div>
                <button onClick={$v.onCloseDetail} style={css("background:none;border:1px solid #c1c8c4;color:#414846;border-radius:999px;width:34px;height:34px;font-size:16px;cursor:pointer;")}>
                  {"×"}
                </button>
              </div>
              <div style={css("flex:1;overflow-y:auto;padding:26px 28px;display:flex;flex-direction:column;gap:20px;")}>
                <div className="gf-2col" style={css("display:grid;grid-template-columns:1fr 1fr;gap:16px;")}>
                  <div>
                    <div style={css("font-size:11px;color:#717976;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;")}>
                      {"Phone"}
                    </div>
                    <A href={$v.detail.telHref} style={css("font-size:15px;font-weight:700;color:#1A3C34;text-decoration:none;")}>
                      {$v.detail.phone}
                    </A>
                  </div>
                  <div>
                    <div style={css("font-size:11px;color:#717976;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;")}>
                      {"Email"}
                    </div>
                    <A href={$v.detail.mailHref} style={css("font-size:14px;font-weight:600;color:#1A3C34;text-decoration:none;word-break:break-all;")}>
                      {$v.detail.email}
                    </A>
                  </div>
                  <div>
                    <div style={css("font-size:11px;color:#717976;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;")}>
                      {"Interest"}
                    </div>
                    <div style={css("font-size:14px;color:#1c1c19;")}>
                      {$v.detail.interest}
                    </div>
                  </div>
                  <div>
                    <div style={css("font-size:11px;color:#717976;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;")}>
                      {"Audience"}
                    </div>
                    <div style={css("font-size:14px;color:#1c1c19;")}>
                      {$v.detail.audience}
                    </div>
                  </div>
                  <div>
                    <div style={css("font-size:11px;color:#717976;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;")}>
                      {"Received"}
                    </div>
                    <div style={css("font-size:14px;color:#1c1c19;")}>
                      {$v.detail.date}
                    </div>
                  </div>
                  <div>
                    <div style={css("font-size:11px;color:#717976;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;")}>
                      {"Location"}
                    </div>
                    <div style={css("font-size:14px;color:#1c1c19;")}>
                      {$v.detail.location}
                    </div>
                  </div>
                </div>
                <div>
                  <div style={css("font-size:11px;color:#717976;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;")}>
                    {"Message"}
                  </div>
                  <div style={css("background:#FAFAF9;border:1px solid #e5e2dd;border-radius:12px;padding:18px;font-size:14px;line-height:1.7;color:#28322e;")}>
                    {$v.detail.message}
                  </div>
                </div>
                <div>
                  <div style={css("font-size:11px;color:#717976;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;")}>
                    {"Status"}
                  </div>
                  <select value={$v.detail.status} onChange={$v.detail.onStatus} className="adm-input">
                    <option>
                      {"New"}
                    </option>
                    <option>
                      {"Contacted"}
                    </option>
                    <option>
                      {"In Progress"}
                    </option>
                    <option>
                      {"Closed"}
                    </option>
                  </select>
                </div>
              </div>
              <div style={css("padding:18px 28px;border-top:1px solid #e5e2dd;display:flex;gap:12px;background:#FAFAF9;")}>
                <A href={$v.detail.mailHref} style={css("flex:1;text-align:center;text-decoration:none;background:#1A3C34;color:#fff;border-radius:10px;padding:13px;font-size:14px;font-weight:700;")}>
                  {"Reply by Email"}
                </A>
                <A href={$v.detail.telHref} style={css("text-decoration:none;background:#fff;border:1px solid #c1c8c4;color:#414846;border-radius:10px;padding:13px 22px;font-size:14px;font-weight:700;")}>
                  {"Call"}
                </A>
              </div>
            </div>
            </>
          ) : null}
          {($v.editorOpen) ? (
            <>
            <div onClick={$v.onCancelEditor} style={css("position:fixed;inset:0;background:rgba(26,60,52,0.45);z-index:40;")} />
            <div style={css("position:fixed;top:0;right:0;bottom:0;width:min(560px,94vw);background:#FCF9F4;z-index:50;box-shadow:-16px 0 48px rgba(26,60,52,0.2);display:flex;flex-direction:column;")}>
              <div style={css("padding:22px 28px;border-bottom:1px solid #e5e2dd;display:flex;justify-content:space-between;align-items:center;background:#FAFAF9;")}>
                <div>
                  <div style={css("font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:0.08em;color:#717976;text-transform:uppercase;")}>
                    {$v.editorMode}
                  </div>
                  <h2 style={css("font-family:'Source Serif 4',serif;font-size:20px;color:#1A3C34;margin:3px 0 0;")}>
                    {$v.editorTitle}
                  </h2>
                </div>
                <button onClick={$v.onCancelEditor} style={css("background:none;border:1px solid #c1c8c4;color:#414846;border-radius:999px;width:34px;height:34px;font-size:16px;cursor:pointer;")}>
                  {"×"}
                </button>
              </div>
              <div style={css("flex:1;overflow-y:auto;padding:24px 28px;display:flex;flex-direction:column;gap:18px;")}>
                {($v.formFields || []).map((f, fIndex) => (
                  <Fragment key={fIndex}>
                    <div>
                      {(f.isHeading) ? (
                        <>
                        <div style={css("font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.08em;color:#C5A059;text-transform:uppercase;padding-top:8px;border-top:1px solid #e5e2dd;")}>
                          {f.label}
                        </div>
                        </>
                      ) : null}
                      {(f.isField) ? (
                        <>
                        <label style={css("font-size:12px;font-weight:700;color:#1A3C34;display:block;margin-bottom:8px;")}>
                          {f.label}
                        </label>
                        {(f.isImage) ? (
                          <>
                          {(f.value) ? (
                            <>
                            <div style={css(`aspect-ratio:16/8;border-radius:10px;overflow:hidden;border:1px solid #e5e2dd;margin-bottom:10px;background-image:url('${f.value}');background-size:cover;background-position:center;`)} />
                            </>
                          ) : null}
                          </>
                        ) : null}
                        {(f.isText) ? (
                          <>
                          <input value={f.value} onInput={f.onInput} className="adm-input" />
                          </>
                        ) : null}
                        {(f.isPassword) ? (
                          <>
                          <input type="password" value={f.value} onInput={f.onInput} className="adm-input" autoComplete="new-password" />
                          </>
                        ) : null}
                        {(f.isArea) ? (
                          <>
                          <textarea rows={f.rows} onInput={f.onInput} className="adm-input" style={css("resize:vertical;")}>
                            {f.value}
                          </textarea>
                          </>
                        ) : null}
                        {(f.isSelect) ? (
                          <>
                          <select value={f.value} onChange={f.onInput} className="adm-input">
                            {(f.options || []).map((opt, optIndex) => (
                              <Fragment key={optIndex}>
                                <option>
                                  {opt}
                                </option>
                              </Fragment>
                            ))}
                          </select>
                          </>
                        ) : null}
                        {(f.hint) ? (
                          <>
                          <div style={css("font-size:11px;color:#9aa19d;margin-top:6px;")}>
                            {f.hint}
                          </div>
                          </>
                        ) : null}
                        </>
                      ) : null}
                    </div>
                  </Fragment>
                ))}
              </div>
              <div style={css("padding:18px 28px;border-top:1px solid #e5e2dd;display:flex;gap:12px;background:#FAFAF9;")}>
                <Hov as="button" onClick={$v.onSaveEditor} style={css("flex:1;background:#1A3C34;color:#fff;border:none;border-radius:10px;padding:13px;font-size:14px;font-weight:700;cursor:pointer;font-family:'Hanken Grotesk',sans-serif;")} hoverStyle={css("background:#C5A059;color:#1A3C34;")}>
                  {$v.saveLabel}
                </Hov>
                <button onClick={$v.onCancelEditor} style={css("background:#fff;border:1px solid #c1c8c4;color:#414846;border-radius:10px;padding:13px 22px;font-size:14px;font-weight:700;cursor:pointer;font-family:'Hanken Grotesk',sans-serif;")}>
                  {"Cancel"}
                </button>
              </div>
            </div>
            </>
          ) : null}
          {($v.toast) ? (
            <>
            <div style={css("position:fixed;left:50%;bottom:32px;transform:translateX(-50%);background:#1A3C34;color:#FAFAF9;padding:14px 26px;border-radius:12px;font-size:13.5px;font-weight:600;box-shadow:0 12px 32px rgba(0,0,0,0.25);z-index:60;")}>
              {$v.toast}
            </div>
            </>
          ) : null}
        </div>
      </>
    );
  }
}

export default AdminDashboard;
