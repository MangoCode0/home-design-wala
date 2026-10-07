import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { enquiryStatuses, initialCategories, initialEnquiries, initialProjects, initialServices } from "./adminData";

const navItems = [
  ["Dashboard", "/admin/dashboard", "▦"],
  ["Projects", "/admin/projects", "⌂"],
  ["Enquiries", "/admin/enquiries", "✉"],
  ["Services", "/admin/services", "◇"],
  ["Categories", "/admin/categories", "▤"],
  ["Settings", "/admin/settings", "⚙"],
];

const titleMap = { dashboard: "Dashboard", projects: "Projects", enquiries: "Enquiries", services: "Services", categories: "Categories", settings: "Settings" };
const formatDate = () => new Intl.DateTimeFormat("en-IN", { month: "short", day: "2-digit", year: "numeric" }).format(new Date());

function PageHeading({ eyebrow = "WORKSPACE", title, description, action }) {
  return <div className="admin-page-heading"><div><span className="admin-eyebrow">{eyebrow}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <div className="admin-heading-action">{action}</div>}</div>;
}

function StatusBadge({ children }) {
  return <span className={`admin-status admin-status--${String(children).toLowerCase().replaceAll(" ", "-")}`}>{children}</span>;
}

function Button({ children, variant = "primary", className = "", ...props }) {
  return <button className={`admin-button admin-button--${variant} ${className}`} {...props}>{children}</button>;
}

function EmptyState({ title, message }) {
  return <div className="admin-empty"><span>◇</span><strong>{title}</strong><p>{message}</p></div>;
}

function AdminLayout() {
  const [projects, setProjects] = useState(initialProjects);
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [services, setServices] = useState(initialServices);
  const [categories, setCategories] = useState(initialCategories);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const pageKey = location.pathname.split("/")[2] || "dashboard";
  const pageTitle = pageKey === "projects" && location.pathname.endsWith("/new") ? "Add project" : titleMap[pageKey] || "Dashboard";
  const context = { projects, setProjects, enquiries, setEnquiries, services, setServices, categories, setCategories };

  return <div className="admin-shell">
    <button className={`admin-backdrop ${sidebarOpen ? "is-visible" : ""}`} onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />
    <aside className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`}>
      <Link to="/admin/dashboard" className="admin-brand"><span className="admin-brand-mark">H</span><span><strong>Home Design Wala</strong><small>ADMIN STUDIO</small></span></Link>
      <div className="admin-nav-label">MENU</div>
      <nav className="admin-nav">{navItems.map(([label, to, icon]) => <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)} className={({ isActive }) => `admin-nav-link ${isActive ? "is-active" : ""}`}><span className="admin-nav-icon">{icon}</span>{label}{label === "Enquiries" && <span className="admin-nav-count">{enquiries.filter((item) => item.status === "New").length}</span>}</NavLink>)}</nav>
      <div className="admin-sidebar-bottom"><div className="admin-profile"><span className="admin-avatar">H</span><span><strong>Studio Admin</strong><small>Demo workspace</small></span></div><Link className="admin-logout" to="/admin/login"><span>↪</span>Log out</Link></div>
    </aside>
    <div className="admin-main">
      <header className="admin-topbar"><button className="admin-menu-toggle" onClick={() => setSidebarOpen(true)} aria-label="Open navigation">☰</button><div className="admin-breadcrumb">Home <span>/</span> <strong>{pageTitle}</strong></div><div className="admin-topbar-right"><span className="admin-live-dot" /> Demo mode <span className="admin-topbar-divider" /><span className="admin-topbar-date">{formatDate()}</span></div></header>
      <main className="admin-content"><Outlet context={context} /></main>
      <footer className="admin-footer">Home Design Wala <span>·</span> Admin workspace <span className="admin-footer-note">Frontend preview — changes are temporary</span></footer>
    </div>
  </div>;
}

function Login() {
  return <main className="admin-login-page"><section className="admin-login-card"><Link to="/" className="admin-brand admin-login-brand"><span className="admin-brand-mark">H</span><span><strong>Home Design Wala</strong><small>ADMIN STUDIO</small></span></Link><span className="admin-eyebrow">WELCOME BACK</span><h1>Studio, at a glance.</h1><p>This is a frontend preview. Sign-in and account security are not connected yet.</p><Link to="/admin/dashboard" className="admin-button admin-button--primary admin-login-continue">Continue to demo workspace <span>→</span></Link><Link to="/" className="admin-back-public">← Back to the public website</Link><div className="admin-demo-note">DEMO MODE <span>·</span> No credentials required</div></section><span className="admin-login-foot">HOME DESIGN WALA <span>·</span> DESIGN THAT FEELS LIKE HOME</span></main>;
}

function Dashboard() {
  const { projects, enquiries } = useOutletContext();
  const metrics = [
    ["Total projects", projects.length, "⌂", "Across all categories"],
    ["Total enquiries", enquiries.length, "✉", "All incoming requests"],
    ["New enquiries", enquiries.filter((item) => item.status === "New").length, "↗", "Awaiting first response"],
    ["Published projects", projects.filter((item) => item.status === "Published").length, "◉", "Visible on the website"],
  ];
  return <>
    <PageHeading eyebrow={`TODAY · ${formatDate().toUpperCase()}`} title="Good evening, Studio." description="Here’s what’s happening with your design business today." />
    <div className="admin-metric-grid">{metrics.map(([label, value, icon, note]) => <article className="admin-metric-card" key={label}><div className="admin-metric-top"><span>{label}</span><span className="admin-metric-icon">{icon}</span></div><strong>{value}</strong><small>{note}</small></article>)}</div>
    <div className="admin-dashboard-grid">
      <section className="admin-panel admin-recent-enquiries"><div className="admin-panel-heading"><div><span className="admin-eyebrow">INBOX</span><h2>Recent enquiries</h2></div><Link to="/admin/enquiries" className="admin-text-link">View all <span>→</span></Link></div>
        {enquiries.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>NAME</th><th>PROJECT</th><th>DATE</th><th>STATUS</th></tr></thead><tbody>{enquiries.slice(0, 4).map((item) => <tr key={item.id}><td><strong>{item.name}</strong><small>{item.city}</small></td><td>{item.project}</td><td>{item.date}</td><td><StatusBadge>{item.status}</StatusBadge></td></tr>)}</tbody></table></div> : <EmptyState title="Your inbox is clear" message="New website enquiries will appear here." />}
      </section>
      <section className="admin-panel admin-recent-projects"><div className="admin-panel-heading"><div><span className="admin-eyebrow">PORTFOLIO</span><h2>Recent projects</h2></div><Link to="/admin/projects" className="admin-text-link">View all <span>→</span></Link></div>
        {projects.slice(0, 4).map((project) => <Link to={`/admin/projects/${project.id}/edit`} className="admin-project-mini" key={project.id}><img src={project.image} alt="" /><span><strong>{project.title}</strong><small>{project.category} · {project.location}</small></span><StatusBadge>{project.status}</StatusBadge></Link>)}
      </section>
    </div>
  </>;
}

function Projects() {
  const { projects, setProjects, categories } = useOutletContext();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [status, setStatus] = useState("All statuses");
  const [deleteProject, setDeleteProject] = useState(null);
  const filtered = projects.filter((project) => `${project.title} ${project.location} ${project.category} ${project.style || ""}`.toLowerCase().includes(search.toLowerCase()) && (category === "All categories" || project.category === category) && (status === "All statuses" || project.status === status));
  const remove = () => {
    if (!deleteProject) return;
    // TODO: Replace in-memory deletion with the project API when the backend is ready.
    setProjects((current) => current.filter((project) => project.id !== deleteProject.id));
    setDeleteProject(null);
  };
  const toggle = (project) => setProjects((current) => current.map((item) => item.id === project.id ? { ...item, status: item.status === "Published" ? "Draft" : "Published" } : item));
  return <>
    <PageHeading title="Projects" description="Manage the work showcased on your public portfolio." action={<Link to="/admin/projects/new" className="admin-button admin-button--primary">＋ Add Project</Link>} />
    <section className="admin-panel admin-list-panel"><div className="admin-toolbar"><label className="admin-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search projects…" /></label><select className="admin-select" value={category} onChange={(event) => setCategory(event.target.value)}><option>All categories</option>{categories.map((item) => <option key={item.id}>{item.name}</option>)}</select><select className="admin-select" value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option><option>Published</option><option>Draft</option></select><span className="admin-result-count">{filtered.length} projects</span></div>
      <div className="admin-table-wrap"><table className="admin-table admin-project-table"><thead><tr><th>PROJECT</th><th>CATEGORY</th><th>LOCATION</th><th>UPDATED</th><th>STATUS</th><th className="admin-actions-head">ACTIONS</th></tr></thead><tbody>{filtered.map((project) => <tr key={project.id}><td><div className="admin-project-cell"><img src={project.image} alt={`${project.title} cover`} /><span><strong>{project.title}</strong><small>{project.size || "Area not specified"}</small></span></div></td><td>{project.category}</td><td>{project.location}</td><td>{project.date}</td><td><StatusBadge>{project.status}</StatusBadge></td><td className="admin-row-actions"><Link to={`/admin/projects/${project.id}/edit`} aria-label={`Edit ${project.title}`} title="Edit">✎</Link><Link to={`/admin/projects/${project.id}`} aria-label={`View ${project.title}`} title="View">◉</Link><button onClick={() => toggle(project)} title={project.status === "Published" ? "Move to draft" : "Publish"} aria-label={project.status === "Published" ? `Move ${project.title} to draft` : `Publish ${project.title}`}>{project.status === "Published" ? "◌" : "↑"}</button><button onClick={() => setDeleteProject(project)} title="Delete" aria-label={`Delete ${project.title}`}>×</button></td></tr>)}</tbody></table>{!filtered.length && <EmptyState title="No projects found" message="Try adjusting your filters or add a project to your portfolio." />}</div>
    </section>
    {deleteProject && <div className="admin-modal-backdrop" role="presentation" onClick={() => setDeleteProject(null)}><section className="admin-modal admin-delete-modal" role="dialog" aria-modal="true" aria-labelledby="delete-project-title" onClick={(event) => event.stopPropagation()}><button className="admin-modal-close" onClick={() => setDeleteProject(null)} aria-label="Close">×</button><span className="admin-eyebrow">PORTFOLIO</span><h2 id="delete-project-title">Delete this project?</h2><p><strong>{deleteProject.title}</strong> will be removed from this temporary demo list. This cannot be undone in the current session.</p><div className="admin-delete-actions"><Button variant="secondary" onClick={() => setDeleteProject(null)}>Cancel</Button><Button className="admin-button--danger" onClick={remove}>Delete project</Button></div></section></div>}
  </>;
}

function UploadField({ title, hint, value, onChange, multiple = false, accept = "image/*" }) {
  const files = value || [];
  const selectedNames = files.map((file) => file.name);
  return <label className="admin-upload"><input type="file" accept={accept} multiple={multiple} onChange={(event) => onChange(Array.from(event.target.files || []))} /><span className="admin-upload-icon">↑</span><strong>{selectedNames.length ? selectedNames.join(", ") : title}</strong><small>{selectedNames.length ? "Selected for this preview only" : hint}</small></label>;
}

function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, setProjects, categories } = useOutletContext();
  const existing = projects.find((project) => project.id === id);
  const [form, setForm] = useState(() => existing || { title: "", category: categories[0]?.name || "", location: "", size: "", plotSize: "", bedrooms: "", bathrooms: "", floors: "", style: "", description: "", features: "", status: "Draft" });
  const [coverFile, setCoverFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [floorPlanFile, setFloorPlanFile] = useState(null);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setForm(existing || { title: "", category: categories[0]?.name || "", location: "", size: "", plotSize: "", bedrooms: "", bathrooms: "", floors: "", style: "", description: "", features: "", status: "Draft" });
    setCoverFile(null);
    setGalleryFiles([]);
    setFloorPlanFile(null);
    setSaved(false);
  }, [id, existing, categories]);
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const save = (event) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    const project = {
      ...form,
      title: form.title.trim(),
      id: existing?.id || `hdw-${Date.now()}`,
      date: formatDate(),
      image: coverFile ? URL.createObjectURL(coverFile) : existing?.image || "/images/project-1.svg",
      gallery: galleryFiles.length ? galleryFiles.map((file) => URL.createObjectURL(file)) : existing?.gallery || [],
      floorPlan: floorPlanFile ? { url: URL.createObjectURL(floorPlanFile), name: floorPlanFile.name } : existing?.floorPlan || "",
      features: Array.isArray(form.features) ? form.features : form.features.split(",").map((item) => item.trim()).filter(Boolean),
    };
    // TODO: Replace temporary in-memory saving with the projects API when the backend is ready.
    setProjects((current) => existing ? current.map((item) => item.id === existing.id ? project : item) : [project, ...current]);
    setSaved(true);
    window.setTimeout(() => navigate("/admin/projects"), 550);
  };
  if (id && !existing) return <><PageHeading eyebrow="PORTFOLIO" title="Project not found" description="This project is not available in the current demo data." /><Link to="/admin/projects" className="admin-button admin-button--secondary">← Back to Projects</Link></>;
  const field = (label, name, options = {}) => <label className={`admin-field ${options.wide ? "is-wide" : ""}`} key={name}><span>{label}{options.required && <i> *</i>}</span>{options.select ? <select name={name} value={form[name] || ""} onChange={update}>{options.select.map((item) => <option key={item}>{item}</option>)}</select> : options.area ? <textarea name={name} value={form[name] || ""} onChange={update} rows="4" placeholder={options.placeholder} /> : <input name={name} type={options.type || "text"} value={name === "features" && Array.isArray(form[name]) ? form[name].join(", ") : form[name] || ""} onChange={update} placeholder={options.placeholder || ""} required={options.required} />}</label>;
  return <form onSubmit={save}>
    <PageHeading eyebrow="PORTFOLIO" title={existing ? "Edit project" : "Add a project"} description="Add the details that help visitors imagine living here." />
    <div className="admin-form-layout"><div className="admin-form-main">
      <section className="admin-panel admin-form-section"><div className="admin-section-title"><span>01</span><div><h2>Project details</h2><p>Core information about this home.</p></div></div><div className="admin-form-grid">{field("Project title", "title", { required: true, placeholder: "e.g. The Courtyard House", wide: true })}{field("Category", "category", { select: categories.length ? categories.map((item) => item.name) : ["General"] })}{field("Location", "location", { placeholder: "City, State" })}{field("Plot size", "plotSize", { placeholder: "e.g. 30 × 50 ft" })}{field("Built-up area", "size", { placeholder: "e.g. 2,400 sq. ft." })}{field("Bedrooms", "bedrooms", { type: "number" })}{field("Bathrooms", "bathrooms", { type: "number" })}{field("Floors", "floors", { type: "number" })}{field("Style", "style", { placeholder: "e.g. Contemporary" })}{field("Description", "description", { area: true, wide: true, placeholder: "Tell the story behind this design…" })}{field("Features", "features", { placeholder: "Courtyard, natural stone, open-plan living", wide: true })}</div></section>
      <section className="admin-panel admin-form-section"><div className="admin-section-title"><span>02</span><div><h2>Project imagery</h2><p>Select files for a local preview only. Nothing is uploaded to a server.</p></div></div><div className="admin-upload-grid"><UploadField title="Choose cover image" hint="JPG, PNG or WebP · Recommended 1600 × 1100" value={coverFile ? [coverFile] : []} onChange={(files) => setCoverFile(files[0] || null)} /><UploadField title="Choose gallery images" hint="Select multiple images for the gallery" value={galleryFiles} onChange={setGalleryFiles} multiple /><UploadField title="Choose floor plan" hint="Image or PDF · Optional" value={floorPlanFile ? [floorPlanFile] : []} onChange={(files) => setFloorPlanFile(files[0] || null)} accept="image/*,.pdf" /></div><p className="admin-temporary-note">Selected media previews are held in temporary browser memory for this session.</p></section>
    </div><aside className="admin-form-side"><section className="admin-panel admin-publish-panel"><span className="admin-eyebrow">VISIBILITY</span><h2>Publishing</h2><label className="admin-field"><span>Project status</span><select name="status" value={form.status} onChange={update}><option>Draft</option><option>Published</option></select></label><p>{form.status === "Published" ? "This project is marked to appear on the public website." : "This project is saved as a draft and is not marked for the public website."}</p></section><div className="admin-form-actions"><Button type="submit" disabled={saved}>{saved ? "Saved — returning…" : existing ? "Save changes" : "Save Project"}</Button><Link to="/admin/projects" className="admin-button admin-button--secondary">Cancel</Link></div><p className="admin-temporary-note">Demo only · Your changes last for this browser session and are not sent to a server.</p></aside></div>
  </form>;
}

function ProjectDetails() {
  const { id } = useParams();
  const { projects } = useOutletContext();
  const project = projects.find((item) => item.id === id);
  if (!project) return <><PageHeading eyebrow="PORTFOLIO" title="Project not found" description="This project is not available in the current demo data." /><Link to="/admin/projects" className="admin-button admin-button--secondary">← Back to Projects</Link></>;

  return <>
    <PageHeading eyebrow="PORTFOLIO · PROJECT DETAILS" title={project.title} description={`${project.category} · ${project.location}`} action={<Link to={`/admin/projects/${project.id}/edit`} className="admin-button admin-button--primary">Edit project</Link>} />
    <div className="admin-project-details">
      <section className="admin-panel admin-project-cover"><img src={project.image} alt={`${project.title} cover`} /><div><StatusBadge>{project.status}</StatusBadge><h2>{project.title}</h2><p>{project.description || "No project description has been added."}</p></div></section>
      <section className="admin-panel admin-detail-panel"><div className="admin-section-title"><span>01</span><div><h2>Project information</h2><p>Key details for this portfolio project.</p></div></div><dl className="admin-project-facts">{[["Category", project.category], ["Location", project.location], ["Plot size", project.plotSize], ["Built-up area", project.size], ["Bedrooms", project.bedrooms], ["Bathrooms", project.bathrooms], ["Floors", project.floors], ["Style", project.style]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || "—"}</dd></div>)}</dl>{project.features?.length > 0 && <div className="admin-feature-list"><span>FEATURES</span><div>{project.features.map((feature) => <span className="admin-feature-chip" key={feature}>{feature}</span>)}</div></div>}</section>
      <section className="admin-panel admin-detail-panel"><div className="admin-section-title"><span>02</span><div><h2>Gallery</h2><p>Project images selected for this preview.</p></div></div>{project.gallery?.length ? <div className="admin-gallery-grid">{project.gallery.map((image, index) => <img key={`${image}-${index}`} src={image} alt={`${project.title} gallery ${index + 1}`} />)}</div> : <EmptyState title="No gallery images" message="No gallery images have been selected for this project." />}</section>
      <section className="admin-panel admin-detail-panel"><div className="admin-section-title"><span>03</span><div><h2>Floor plan</h2><p>Plan file selected for this preview.</p></div></div>{project.floorPlan ? (typeof project.floorPlan === "string" ? project.floorPlan : project.floorPlan.name).toLowerCase().endsWith(".pdf") ? <a className="admin-floorplan-link" href={typeof project.floorPlan === "string" ? project.floorPlan : project.floorPlan.url} target="_blank" rel="noreferrer">Open selected floor plan ↗</a> : <img className="admin-floorplan-preview" src={typeof project.floorPlan === "string" ? project.floorPlan : project.floorPlan.url} alt={`${project.title} floor plan`} /> : <EmptyState title="No floor plan added" message="No floor plan has been selected for this project." />}</section>
    </div>
    <Link to="/admin/projects" className="admin-button admin-button--secondary admin-details-back">← Back to Projects</Link>
  </>;
}

function Enquiries() {
  const { enquiries, setEnquiries } = useOutletContext();
  const [selectedId, setSelectedId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const selected = enquiries.find((item) => item.id === selectedId);
  const filtered = enquiries.filter((item) => `${item.name} ${item.city} ${item.project} ${item.phone}`.toLowerCase().includes(search.toLowerCase()) && (statusFilter === "All statuses" || item.status === statusFilter));
  const setStatus = (id, value) => setEnquiries((current) => current.map((item) => item.id === id ? { ...item, status: value } : item));
  const saveNotes = (id, notes) => setEnquiries((current) => current.map((item) => item.id === id ? { ...item, notes } : item));
  const removeEnquiry = () => {
    if (!deleteTarget) return;
    // TODO: Replace local enquiry removal with the FastAPI endpoint.
    setEnquiries((current) => current.filter((item) => item.id !== deleteTarget.id));
    if (selectedId === deleteTarget.id) setSelectedId(null);
    setDeleteTarget(null);
  };
  return <>
    <PageHeading title="Enquiries" description="Keep track of incoming project conversations." />
    <section className="admin-panel admin-list-panel"><div className="admin-toolbar"><label className="admin-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, city or project…" /></label><select className="admin-select" aria-label="Filter enquiries by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All statuses</option>{enquiryStatuses.map((value) => <option key={value}>{value}</option>)}</select><span className="admin-result-count">{filtered.length} enquiries</span></div><div className="admin-table-wrap"><table className="admin-table admin-enquiry-table"><thead><tr><th>NAME</th><th>PHONE</th><th>CITY</th><th>PROJECT</th><th>DATE</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}><td><strong>{item.name}</strong><small>{item.id}</small></td><td>{item.phone}</td><td>{item.city}</td><td>{item.project}</td><td>{item.date}</td><td><select aria-label={`Status for ${item.name}`} className={`admin-status-select admin-status-select--${item.status.toLowerCase().replaceAll(" ", "-")}`} value={item.status} onChange={(event) => setStatus(item.id, event.target.value)}>{enquiryStatuses.map((value) => <option key={value}>{value}</option>)}</select></td><td className="admin-record-actions"><button className="admin-view-button" onClick={() => setSelectedId(item.id)}>View details</button><button className="admin-icon-action admin-icon-delete" aria-label={`Delete enquiry from ${item.name}`} onClick={() => setDeleteTarget(item)}>×</button></td></tr>)}</tbody></table>{!filtered.length && <EmptyState title="No enquiries found" message="Try changing the search or status filter." />}</div></section>
    {selected && <div className="admin-modal-backdrop" role="presentation" onClick={() => setSelectedId(null)}><section className="admin-modal admin-enquiry-modal" role="dialog" aria-modal="true" aria-labelledby="enquiry-modal-title" onClick={(event) => event.stopPropagation()}><button className="admin-modal-close" onClick={() => setSelectedId(null)} aria-label="Close">×</button><span className="admin-eyebrow">{selected.id} · {selected.date}</span><h2 id="enquiry-modal-title">{selected.name}</h2><div className="admin-detail-list"><p><span>Phone</span><a href={`tel:${selected.phone}`}>{selected.phone}</a></p><p><span>Email</span><a href={`mailto:${selected.email}`}>{selected.email}</a></p><p><span>City</span><strong>{selected.city}</strong></p><p><span>Project</span><strong>{selected.project}</strong></p><p><span>Status</span><StatusBadge>{selected.status}</StatusBadge></p><label className="admin-field admin-enquiry-modal-status"><span>Update status</span><select value={selected.status} onChange={(event) => setStatus(selected.id, event.target.value)}>{enquiryStatuses.map((value) => <option key={value}>{value}</option>)}</select></label></div><div className="admin-message-box"><span>MESSAGE</span><p>{selected.message}</p></div><label className="admin-field admin-notes-field"><span>Internal admin notes</span><textarea rows="4" value={selected.notes || ""} onChange={(event) => saveNotes(selected.id, event.target.value)} placeholder="Add a note for the studio team…" /></label><p className="admin-temporary-note">Notes and updates are temporary demo data.</p><div className="admin-modal-footer"><Button variant="secondary" onClick={() => setSelectedId(null)}>Done</Button><Button className="admin-button--danger" onClick={() => setDeleteTarget(selected)}>Delete enquiry</Button></div></section></div>}
    {deleteTarget && <ConfirmDialog title="Delete this enquiry?" itemName={deleteTarget.name} onCancel={() => setDeleteTarget(null)} onConfirm={removeEnquiry} />}
  </>;
}

function ConfirmDialog({ title, itemName, onCancel, onConfirm }) {
  return <div className="admin-modal-backdrop" role="presentation" onClick={onCancel}><section className="admin-modal admin-delete-modal" role="dialog" aria-modal="true" aria-labelledby="admin-confirm-title" onClick={(event) => event.stopPropagation()}><button className="admin-modal-close" onClick={onCancel} aria-label="Close">×</button><span className="admin-eyebrow">DEMO WORKSPACE</span><h2 id="admin-confirm-title">{title}</h2><p><strong>{itemName}</strong> will be removed from the current temporary list. This cannot be undone for this session.</p><div className="admin-delete-actions"><Button variant="secondary" onClick={onCancel}>Cancel</Button><Button className="admin-button--danger" onClick={onConfirm}>Delete</Button></div></section></div>;
}

function ManageList({ kind, items, setItems }) {
  const serviceMode = kind === "Service";
  const { setProjects } = useOutletContext();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [status, setStatus] = useState("Draft");
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const getId = (item) => item.id;
  const editingItem = items.find((item) => getId(item) === editing);
  const resetForm = () => { setName(""); setDescription(""); setFullDescription(""); setIcon(""); setStatus("Draft"); setEditing(null); };
  const addOrSave = (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    // TODO: Replace local service/category writes with FastAPI endpoints and PostgreSQL persistence.
    if (editing) {
      const oldName = editingItem?.name;
      const updated = serviceMode
        ? { ...editingItem, name: name.trim(), description: description.trim(), fullDescription: fullDescription.trim(), icon: icon.trim(), status }
        : { ...editingItem, name: name.trim(), description: description.trim(), status };
      setItems((current) => current.map((item) => item.id === editing ? updated : item));
      if (!serviceMode && oldName !== updated.name) setProjects((current) => current.map((project) => project.category === oldName ? { ...project, category: updated.name } : project));
    } else {
      const newItem = serviceMode
        ? { id: `srv-${Date.now()}`, name: name.trim(), description: description.trim(), fullDescription: fullDescription.trim(), icon: icon.trim(), status }
        : { id: `cat-${Date.now()}`, name: name.trim(), description: description.trim(), status };
      setItems((current) => [...current, newItem]);
    }
    resetForm();
  };
  const startEdit = (item) => { setEditing(item.id); setName(item.name); setDescription(item.description || ""); setFullDescription(item.fullDescription || ""); setIcon(item.icon || ""); setStatus(item.status); };
  const remove = () => {
    if (!deleteTarget) return;
    // TODO: Replace local delete with a backend delete request.
    setItems((current) => current.filter((item) => item.id !== deleteTarget.id));
    if (!serviceMode) setProjects((current) => current.map((project) => project.category === deleteTarget.name ? { ...project, category: "Uncategorised" } : project));
    if (editing === deleteTarget.id) resetForm();
    setDeleteTarget(null);
  };
  const toggle = (item) => setItems((current) => current.map((value) => value.id === item.id ? { ...value, status: value.status === "Published" ? "Draft" : "Published" } : value));
  return <>
    <PageHeading title={serviceMode ? "Services" : "Categories"} description={serviceMode ? "Shape the services visitors can explore." : "Organise projects into easy-to-browse collections."} />
    <div className="admin-manage-grid"><section className="admin-panel admin-manage-list"><div className="admin-panel-heading"><div><span className="admin-eyebrow">{serviceMode ? "OFFERINGS" : "PORTFOLIO"}</span><h2>{serviceMode ? "Service list" : "Project categories"}</h2></div><span className="admin-count-pill">{items.length}</span></div>{items.map((item) => <div className="admin-manage-item" key={item.id}><span className="admin-manage-icon">{serviceMode ? item.icon || "◇" : "▤"}</span><div className="admin-manage-copy"><strong>{item.name}</strong><small>{item.description || "No description added."}</small></div><StatusBadge>{item.status}</StatusBadge><button className="admin-icon-action" onClick={() => startEdit(item)} aria-label={`Edit ${item.name}`} title="Edit">✎</button><button className="admin-icon-action" onClick={() => toggle(item)} aria-label={`${item.status === "Published" ? "Unpublish" : "Publish"} ${item.name}`} title={item.status === "Published" ? "Unpublish" : "Publish"}>{item.status === "Published" ? "◌" : "↑"}</button><button className="admin-icon-action admin-icon-delete" onClick={() => setDeleteTarget(item)} aria-label={`Delete ${item.name}`} title="Delete">×</button></div>)}{!items.length && <EmptyState title={`No ${kind.toLowerCase()}s yet`} message={`Add your first ${kind.toLowerCase()} using the form.`} />}</section>
    <section className="admin-panel admin-add-panel"><span className="admin-eyebrow">{editing ? "UPDATE" : "NEW ENTRY"}</span><h2>{editing ? `Edit ${kind.toLowerCase()}` : `Add ${kind.toLowerCase()}`}</h2><p>{serviceMode ? "Give visitors a clear idea of how your studio can help." : "Use a concise name that makes projects easy to find."}</p><form onSubmit={addOrSave}><label className="admin-field"><span>{kind} name <i>*</i></span><input value={name} onChange={(event) => setName(event.target.value)} required placeholder={serviceMode ? "e.g. Architectural Design" : "e.g. Modern Homes"} /></label><label className="admin-field"><span>{serviceMode ? "Short description" : "Description"}</span><textarea rows="3" value={description} onChange={(event) => setDescription(event.target.value)} placeholder={serviceMode ? "A concise introduction for the service list…" : "Describe the projects in this category…"} /></label>{serviceMode && <><label className="admin-field"><span>Full description</span><textarea rows="5" value={fullDescription} onChange={(event) => setFullDescription(event.target.value)} placeholder="A fuller explanation of this service…" /></label><label className="admin-field"><span>Icon</span><input value={icon} onChange={(event) => setIcon(event.target.value)} placeholder="e.g. ⌂, ◇, or a short icon name" /></label></>}<label className="admin-field"><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option>Draft</option><option>Published</option></select></label><Button type="submit">{editing ? `Save ${kind.toLowerCase()}` : `Add ${kind.toLowerCase()}`}</Button>{editing && <button type="button" className="admin-cancel-edit" onClick={resetForm}>Cancel editing</button>}</form><p className="admin-temporary-note">Changes are held in local page state only. They are not permanently saved.</p></section></div>
    {deleteTarget && <ConfirmDialog title={`Delete this ${kind.toLowerCase()}?`} itemName={deleteTarget.name} onCancel={() => setDeleteTarget(null)} onConfirm={remove} />}
  </>;
}

function Services() { const { services, setServices } = useOutletContext(); return <ManageList kind="Service" items={services} setItems={setServices} />; }
function Categories() { const { categories, setCategories } = useOutletContext(); return <ManageList kind="Category" items={categories} setItems={setCategories} />; }

function Settings() {
  const [saved, setSaved] = useState(false);
  return <><PageHeading title="Settings" description="Keep your studio details and website preferences in one place." /><form onSubmit={(event) => { event.preventDefault(); setSaved(true); window.setTimeout(() => setSaved(false), 2200); }}><div className="admin-settings-grid"><section className="admin-panel admin-settings-panel"><div className="admin-section-title"><span>01</span><div><h2>Business information</h2><p>How your studio is introduced across the website.</p></div></div><div className="admin-settings-fields"><label className="admin-field"><span>Business name</span><input defaultValue="Home Design Wala" /></label><label className="admin-field"><span>Short description</span><textarea defaultValue="Thoughtful architecture and interiors, designed around the way you live." rows="3" /></label><label className="admin-field"><span>Business address</span><input placeholder="Street, city, state, PIN" /></label></div></section>
    <section className="admin-panel admin-settings-panel"><div className="admin-section-title"><span>02</span><div><h2>Contact information</h2><p>Ways for prospective clients to get in touch.</p></div></div><div className="admin-settings-fields two"><label className="admin-field"><span>Business email</span><input type="email" placeholder="hello@yourstudio.in" /></label><label className="admin-field"><span>Phone number</span><input type="tel" placeholder="+91 00000 00000" /></label><label className="admin-field"><span>WhatsApp number</span><input type="tel" placeholder="+91 00000 00000" /></label><label className="admin-field"><span>Business hours</span><input placeholder="Mon–Sat, 10:00 AM–6:00 PM" /></label></div></section>
    <section className="admin-panel admin-settings-panel"><div className="admin-section-title"><span>03</span><div><h2>Social media</h2><p>Link your studio’s social profiles.</p></div></div><div className="admin-settings-fields two"><label className="admin-field"><span>Instagram URL</span><input type="url" placeholder="https://instagram.com/…" /></label><label className="admin-field"><span>Facebook URL</span><input type="url" placeholder="https://facebook.com/…" /></label><label className="admin-field"><span>YouTube URL</span><input type="url" placeholder="https://youtube.com/…" /></label><label className="admin-field"><span>Pinterest URL</span><input type="url" placeholder="https://pinterest.com/…" /></label></div></section>
    <section className="admin-panel admin-settings-panel"><div className="admin-section-title"><span>04</span><div><h2>Website preferences</h2><p>Basic information presented in search and browser tabs.</p></div></div><div className="admin-settings-fields"><label className="admin-field"><span>Website title</span><input defaultValue="Home Design Wala | Designs That Feel Like Home" /></label><label className="admin-field"><span>Meta description</span><textarea defaultValue="Architecture and interior design shaped around the way you live." rows="3" /></label></div></section>
    </div><div className="admin-settings-submit"><span>{saved ? "Preview saved in this page session." : "Settings are not connected to a server yet."}</span><Button type="submit">{saved ? "Saved" : "Save settings"}</Button></div></form></>;
}

const AdminApp = { Layout: AdminLayout, Login, Dashboard, Projects, ProjectForm, ProjectDetails, Enquiries, Services, Categories, Settings };
export default AdminApp;
