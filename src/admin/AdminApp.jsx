import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { apiRequest, clearAuthToken, getApi, getAuthToken, setAuthToken } from "../api/client";
import useApiCollection from "../hooks/useApiCollection";
import useApiResource from "../hooks/useApiResource";
import { enquiryStatuses } from "./adminData";

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
const blankProject = (category = "") => ({
  title: "", category, location: "", plotSize: "", size: "", bedrooms: "", bathrooms: "",
  floors: "", style: "", description: "", features: "", image: "", gallery: "", floorPlanUrl: "", status: "Draft",
});

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
  const [auth, setAuth] = useState({ checking: true, user: null, error: "" });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    if (!getAuthToken()) {
      navigate("/admin/login", { replace: true, state: { from: location.pathname } });
      setAuth({ checking: false, user: null });
      return () => { active = false; };
    }
    getApi("/api/auth/me", { authenticated: true })
      .then((user) => {
        if (active) setAuth({ checking: false, user });
      })
      .catch(() => {
        if (active) {
          const error = "Unable to verify the administrator session.";
          setAuth({ checking: false, user: null, error });
          if (!getAuthToken()) navigate("/admin/login", { replace: true });
        }
      });
    return () => { active = false; };
  }, [location.pathname, navigate]);

  if (auth.checking) return <main className="admin-login-page"><p role="status">Checking administrator session…</p></main>;
  if (!auth.user) return <main className="admin-login-page"><section className="admin-login-card"><p className="admin-error" role="alert">{auth.error || "Administrator sign-in is required."}</p><Link to="/admin/login" className="admin-button admin-button--primary">Sign in</Link></section></main>;
  return <AdminWorkspace user={auth.user} />;
}

function AdminWorkspace({ user }) {
  const projects = useApiCollection("/api/projects/admin/", { authenticated: true });
  const enquiries = useApiCollection("/api/enquiries/", { authenticated: true });
  const services = useApiCollection("/api/services/admin/", { authenticated: true });
  const categories = useApiCollection("/api/categories/admin/", { authenticated: true });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const pageKey = location.pathname.split("/")[2] || "dashboard";
  const pageTitle = pageKey === "projects" && location.pathname.endsWith("/new") ? "Add project" : titleMap[pageKey] || "Dashboard";
  const collections = [projects, enquiries, services, categories];
  const loading = collections.some((collection) => collection.loading);
  const errors = collections.filter((collection) => collection.error);
  const context = { projects, enquiries, services, categories };

  useEffect(() => {
    const expireSession = () => navigate("/admin/login", { replace: true });
    window.addEventListener("admin-session-expired", expireSession);
    return () => window.removeEventListener("admin-session-expired", expireSession);
  }, [navigate]);

  const logout = () => {
    clearAuthToken();
    navigate("/admin/login", { replace: true });
  };

  return <div className="admin-shell">
    <button className={`admin-backdrop ${sidebarOpen ? "is-visible" : ""}`} onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />
    <aside className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`}>
      <Link to="/admin/dashboard" className="admin-brand"><span className="admin-brand-mark">H</span><span><strong>Home Design Wala</strong><small>ADMIN STUDIO</small></span></Link>
      <div className="admin-nav-label">MENU</div>
      <nav className="admin-nav">{navItems.map(([label, to, icon]) => <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)} className={({ isActive }) => `admin-nav-link ${isActive ? "is-active" : ""}`}><span className="admin-nav-icon">{icon}</span>{label}{label === "Enquiries" && <span className="admin-nav-count">{enquiries.items.filter((item) => item.status === "New").length}</span>}</NavLink>)}</nav>
      <div className="admin-sidebar-bottom"><div className="admin-profile"><span className="admin-avatar">H</span><span><strong>{user.username}</strong><small>Administrator</small></span></div><button className="admin-logout" onClick={logout}><span>↪</span>Log out</button></div>
    </aside>
    <div className="admin-main">
      <header className="admin-topbar"><button className="admin-menu-toggle" onClick={() => setSidebarOpen(true)} aria-label="Open navigation">☰</button><div className="admin-breadcrumb">Home <span>/</span> <strong>{pageTitle}</strong></div><div className="admin-topbar-right"><span className="admin-live-dot" /> Administrator <span className="admin-topbar-divider" /><span className="admin-topbar-date">{formatDate()}</span></div></header>
      <main className="admin-content">
        {loading && <p role="status">Loading workspace data…</p>}
        {errors.map((collection, index) => <p className="admin-error" role="alert" key={`${index}-${collection.error}`}>{collection.error}</p>)}
        <Outlet context={context} />
      </main>
      <footer className="admin-footer">Home Design Wala <span>·</span> Admin workspace</footer>
    </div>
  </div>;
}

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const result = await apiRequest("/api/auth/login", { method: "POST", body: { username, password } });
      setAuthToken(result.access_token);
      navigate(location.state?.from || "/admin/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  return <main className="admin-login-page"><section className="admin-login-card">
    <Link to="/" className="admin-brand admin-login-brand"><span className="admin-brand-mark">H</span><span><strong>Home Design Wala</strong><small>ADMIN STUDIO</small></span></Link>
    <span className="admin-eyebrow">ADMINISTRATOR SIGN-IN</span><h1>Welcome back.</h1>
    <p>Sign in with the administrator credentials configured for this service.</p>
    <form onSubmit={submit}>
      <label className="admin-field"><span>Username</span><input autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} /></label>
      <label className="admin-field"><span>Password</span><input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
      {error && <p className="admin-error" role="alert">{error}</p>}
      <Button type="submit" disabled={submitting}>{submitting ? "Signing in…" : "Sign in"}</Button>
    </form>
    <Link to="/" className="admin-back-public">← Back to the public website</Link>
  </section><span className="admin-login-foot">HOME DESIGN WALA <span>·</span> DESIGN THAT FEELS LIKE HOME</span></main>;
}

function Dashboard() {
  const { projects, enquiries } = useOutletContext();
  const projectItems = projects.items;
  const enquiryItems = enquiries.items;
  const metrics = [
    ["Total projects", projectItems.length, "⌂", "Across all categories"],
    ["Total enquiries", enquiryItems.length, "✉", "All incoming requests"],
    ["New enquiries", enquiryItems.filter((item) => item.status === "New").length, "↗", "Awaiting first response"],
    ["Published projects", projectItems.filter((item) => item.status === "Published").length, "◉", "Visible on the website"],
  ];
  return <>
    <PageHeading eyebrow={`TODAY · ${formatDate().toUpperCase()}`} title="Good evening, Studio." description="Here’s what’s happening with your design business today." />
    <div className="admin-metric-grid">{metrics.map(([label, value, icon, note]) => <article className="admin-metric-card" key={label}><div className="admin-metric-top"><span>{label}</span><span className="admin-metric-icon">{icon}</span></div><strong>{value}</strong><small>{note}</small></article>)}</div>
    <div className="admin-dashboard-grid">
      <section className="admin-panel admin-recent-enquiries"><div className="admin-panel-heading"><div><span className="admin-eyebrow">INBOX</span><h2>Recent enquiries</h2></div><Link to="/admin/enquiries" className="admin-text-link">View all <span>→</span></Link></div>
        {enquiryItems.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>NAME</th><th>PROJECT</th><th>DATE</th><th>STATUS</th></tr></thead><tbody>{enquiryItems.slice(0, 4).map((item) => <tr key={item.id}><td><strong>{item.name}</strong><small>{item.city}</small></td><td>{item.project}</td><td>{item.date}</td><td><StatusBadge>{item.status}</StatusBadge></td></tr>)}</tbody></table></div> : <EmptyState title="Your inbox is clear" message="New website enquiries will appear here." />}
      </section>
      <section className="admin-panel admin-recent-projects"><div className="admin-panel-heading"><div><span className="admin-eyebrow">PORTFOLIO</span><h2>Recent projects</h2></div><Link to="/admin/projects" className="admin-text-link">View all <span>→</span></Link></div>
        {projectItems.length ? projectItems.slice(0, 4).map((project) => <Link to={`/admin/projects/${project.id}/edit`} className="admin-project-mini" key={project.id}>{project.image && <img src={project.image} alt="" />}<span><strong>{project.title}</strong><small>{project.category} · {project.location}</small></span><StatusBadge>{project.status}</StatusBadge></Link>) : <EmptyState title="No projects yet" message="Add a project to start building the portfolio." />}
      </section>
    </div>
  </>;
}

function Projects() {
  const { projects, categories } = useOutletContext();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [status, setStatus] = useState("All statuses");
  const [deleteProject, setDeleteProject] = useState(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const filtered = useMemo(() => projects.items.filter((project) => `${project.title} ${project.location} ${project.category} ${project.style || ""}`.toLowerCase().includes(search.toLowerCase()) && (category === "All categories" || project.category === category) && (status === "All statuses" || project.status === status)), [projects.items, search, category, status]);

  const remove = async () => {
    if (!deleteProject) return;
    setBusyId(deleteProject.id);
    setError("");
    try {
      await apiRequest(`/api/projects/${deleteProject.id}`, { method: "DELETE", authenticated: true });
      projects.setItems((current) => current.filter((item) => item.id !== deleteProject.id));
      setDeleteProject(null);
    } catch (requestError) {
      setError(requestError.message || "Unable to delete this project.");
    } finally {
      setBusyId("");
    }
  };

  const toggle = async (project) => {
    setBusyId(project.id);
    setError("");
    try {
      const updated = await apiRequest(`/api/projects/${project.id}`, { method: "PUT", authenticated: true, body: { status: project.status === "Published" ? "Draft" : "Published" } });
      projects.setItems((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (requestError) {
      setError(requestError.message || "Unable to update this project.");
    } finally {
      setBusyId("");
    }
  };

  return <>
    <PageHeading title="Projects" description="Manage the work showcased on your public portfolio." action={<Link to="/admin/projects/new" className="admin-button admin-button--primary">＋ Add Project</Link>} />
    {error && <p className="admin-error" role="alert">{error}</p>}
    <section className="admin-panel admin-list-panel"><div className="admin-toolbar"><label className="admin-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search projects…" /></label><select className="admin-select" value={category} onChange={(event) => setCategory(event.target.value)}><option>All categories</option>{categories.items.map((item) => <option key={item.id}>{item.name}</option>)}</select><select className="admin-select" value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option><option>Published</option><option>Draft</option></select><span className="admin-result-count">{filtered.length} projects</span></div>
      <div className="admin-table-wrap"><table className="admin-table admin-project-table"><thead><tr><th>PROJECT</th><th>CATEGORY</th><th>LOCATION</th><th>UPDATED</th><th>STATUS</th><th className="admin-actions-head">ACTIONS</th></tr></thead><tbody>{filtered.map((project) => <tr key={project.id}><td><div className="admin-project-cell">{project.image && <img src={project.image} alt={`${project.title} cover`} />}<span><strong>{project.title}</strong><small>{project.size || "Area not specified"}</small></span></div></td><td>{project.category}</td><td>{project.location}</td><td>{project.date}</td><td><StatusBadge>{project.status}</StatusBadge></td><td className="admin-row-actions"><Link to={`/admin/projects/${project.id}/edit`} aria-label={`Edit ${project.title}`} title="Edit">✎</Link><Link to={`/admin/projects/${project.id}`} aria-label={`View ${project.title}`} title="View">◉</Link><button disabled={busyId === project.id} onClick={() => toggle(project)} title={project.status === "Published" ? "Move to draft" : "Publish"} aria-label={project.status === "Published" ? `Move ${project.title} to draft` : `Publish ${project.title}`}>{project.status === "Published" ? "◌" : "↑"}</button><button disabled={busyId === project.id} onClick={() => setDeleteProject(project)} title="Delete" aria-label={`Delete ${project.title}`}>×</button></td></tr>)}</tbody></table>{!filtered.length && <EmptyState title={projects.items.length ? "No projects found" : "No projects yet"} message={projects.items.length ? "Try adjusting your filters or search." : "Add a project to start building the portfolio."} />}</div>
    </section>
    {deleteProject && <ConfirmDialog title="Delete this project?" itemName={deleteProject.title} busy={Boolean(busyId)} onCancel={() => setDeleteProject(null)} onConfirm={remove} />}
  </>;
}

function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, categories } = useOutletContext();
  const existing = projects.items.find((project) => project.id === id);
  const [form, setForm] = useState(() => existing ? { ...existing, gallery: (existing.gallery || []).join("\n"), floorPlanUrl: existing.floorPlan?.url || "" } : blankProject(categories.items[0]?.name || ""));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(existing ? { ...existing, gallery: (existing.gallery || []).join("\n"), floorPlanUrl: existing.floorPlan?.url || "" } : blankProject(categories.items[0]?.name || ""));
  }, [id, existing, categories.items]);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const save = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      title: form.title.trim(),
      bedrooms: form.bedrooms === "" ? null : Number(form.bedrooms),
      bathrooms: form.bathrooms === "" ? null : Number(form.bathrooms),
      floors: String(form.floors || ""),
      features: Array.isArray(form.features) ? form.features : form.features.split(",").map((item) => item.trim()).filter(Boolean),
      image: form.image.trim(),
      gallery: typeof form.gallery === "string" ? form.gallery.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean) : form.gallery,
      floorPlan: form.floorPlanUrl?.trim() ? { url: form.floorPlanUrl.trim(), name: "" } : form.floorPlan || null,
    };
    delete payload.floorPlanUrl;
    try {
      const saved = await apiRequest(existing ? `/api/projects/${existing.id}` : "/api/projects/", {
        method: existing ? "PUT" : "POST",
        authenticated: true,
        body: payload,
      });
      projects.setItems((current) => existing
        ? current.map((item) => item.id === saved.id ? saved : item)
        : [saved, ...current]);
      navigate("/admin/projects");
    } catch (requestError) {
      setError(requestError.message || "Unable to save this project.");
    } finally {
      setSaving(false);
    }
  };

  if (id && !existing) return <><PageHeading eyebrow="PORTFOLIO" title="Project not found" description="This project is not available in the database." /><Link to="/admin/projects" className="admin-button admin-button--secondary">← Back to Projects</Link></>;
  const field = (label, name, options = {}) => <label className={`admin-field ${options.wide ? "is-wide" : ""}`} key={name}><span>{label}{options.required && <i> *</i>}</span>{options.select ? <select name={name} value={form[name] || ""} onChange={update}><option value="">{options.select.length ? "Select a category" : "No categories available"}</option>{options.select.map((item) => <option key={item}>{item}</option>)}</select> : options.area ? <textarea name={name} value={form[name] || ""} onChange={update} rows="4" placeholder={options.placeholder} /> : <input name={name} type={options.type || "text"} value={name === "features" && Array.isArray(form[name]) ? form[name].join(", ") : form[name] || ""} onChange={update} placeholder={options.placeholder || ""} required={options.required} />}</label>;
  return <form onSubmit={save}>
    <PageHeading eyebrow="PORTFOLIO" title={existing ? "Edit project" : "Add a project"} description="Add the details that help visitors imagine living here." />
    {error && <p className="admin-error" role="alert">{error}</p>}
    <div className="admin-form-layout"><div className="admin-form-main">
      <section className="admin-panel admin-form-section"><div className="admin-section-title"><span>01</span><div><h2>Project details</h2><p>Core information about this home.</p></div></div><div className="admin-form-grid">{field("Project title", "title", { required: true, placeholder: "Project title", wide: true })}{field("Category", "category", { select: categories.items.map((item) => item.name) })}{field("Location", "location", { placeholder: "City, State" })}{field("Plot size", "plotSize", { placeholder: "Plot size" })}{field("Built-up area", "size", { placeholder: "Built-up area" })}{field("Bedrooms", "bedrooms", { type: "number" })}{field("Bathrooms", "bathrooms", { type: "number" })}{field("Floors", "floors", { type: "number" })}{field("Style", "style", { placeholder: "Style" })}{field("Description", "description", { area: true, wide: true })}{field("Features", "features", { placeholder: "Separate features with commas", wide: true })}</div></section>
      <section className="admin-panel admin-form-section"><div className="admin-section-title"><span>02</span><div><h2>Project imagery</h2><p>Provide publicly accessible image URLs; uploads are not supported by the current API.</p></div></div><div className="admin-form-grid">{field("Cover image URL", "image", { wide: true, placeholder: "https://…" })}{field("Gallery image URLs", "gallery", { area: true, wide: true, placeholder: "One URL per line" })}{field("Floor plan URL", "floorPlanUrl", { wide: true, placeholder: "https://…" })}</div></section>
    </div><aside className="admin-form-side"><section className="admin-panel admin-publish-panel"><span className="admin-eyebrow">VISIBILITY</span><h2>Publishing</h2><label className="admin-field"><span>Project status</span><select name="status" value={form.status} onChange={update}><option>Draft</option><option>Published</option></select></label><p>{form.status === "Published" ? "This project will appear on the public website." : "This project is a private draft."}</p></section><div className="admin-form-actions"><Button type="submit" disabled={saving}>{saving ? "Saving…" : existing ? "Save changes" : "Save Project"}</Button><Link to="/admin/projects" className="admin-button admin-button--secondary">Cancel</Link></div></aside></div>
  </form>;
}

function ProjectDetails() {
  const { id } = useParams();
  const { projects } = useOutletContext();
  const project = projects.items.find((item) => item.id === id);
  if (!project) return <><PageHeading eyebrow="PORTFOLIO" title="Project not found" description="This project is not available in the database." /><Link to="/admin/projects" className="admin-button admin-button--secondary">← Back to Projects</Link></>;
  return <>
    <PageHeading eyebrow="PORTFOLIO · PROJECT DETAILS" title={project.title} description={`${project.category} · ${project.location}`} action={<Link to={`/admin/projects/${project.id}/edit`} className="admin-button admin-button--primary">Edit project</Link>} />
    <div className="admin-project-details">
      <section className="admin-panel admin-project-cover">{project.image && <img src={project.image} alt={`${project.title} cover`} />}<div><StatusBadge>{project.status}</StatusBadge><h2>{project.title}</h2><p>{project.description}</p></div></section>
      <section className="admin-panel admin-detail-panel"><div className="admin-section-title"><span>01</span><div><h2>Project information</h2><p>Key details for this portfolio project.</p></div></div><dl className="admin-project-facts">{[["Category", project.category], ["Location", project.location], ["Plot size", project.plotSize], ["Built-up area", project.size], ["Bedrooms", project.bedrooms], ["Bathrooms", project.bathrooms], ["Floors", project.floors], ["Style", project.style]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || "—"}</dd></div>)}</dl>{project.features?.length > 0 && <div className="admin-feature-list"><span>FEATURES</span><div>{project.features.map((feature) => <span className="admin-feature-chip" key={feature}>{feature}</span>)}</div></div>}</section>
      <section className="admin-panel admin-detail-panel"><div className="admin-section-title"><span>02</span><div><h2>Gallery</h2><p>Project gallery images.</p></div></div>{project.gallery?.length ? <div className="admin-gallery-grid">{project.gallery.map((image, index) => <img key={`${image}-${index}`} src={image} alt={`${project.title} gallery ${index + 1}`} />)}</div> : <EmptyState title="No gallery images" message="Add image URLs when editing this project." />}</section>
      <section className="admin-panel admin-detail-panel"><div className="admin-section-title"><span>03</span><div><h2>Floor plan</h2><p>Project floor plan.</p></div></div>{project.floorPlan?.url ? <a className="admin-floorplan-link" href={project.floorPlan.url} target="_blank" rel="noreferrer">Open floor plan ↗</a> : <EmptyState title="No floor plan added" message="Add a floor plan URL when editing this project." />}</section>
    </div>
    <Link to="/admin/projects" className="admin-button admin-button--secondary admin-details-back">← Back to Projects</Link>
  </>;
}

function Enquiries() {
  const { enquiries } = useOutletContext();
  const [selectedId, setSelectedId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const selected = enquiries.items.find((item) => item.id === selectedId);
  const filtered = enquiries.items.filter((item) => `${item.name} ${item.city} ${item.project} ${item.phone}`.toLowerCase().includes(search.toLowerCase()) && (statusFilter === "All statuses" || item.status === statusFilter));

  const updateEnquiry = async (id, body) => {
    setError("");
    setNotice("");
    try {
      const updated = await apiRequest(`/api/enquiries/${id}`, { method: "PUT", authenticated: true, body });
      enquiries.setItems((current) => current.map((item) => item.id === updated.id ? updated : item));
      setNotice("Enquiry updated.");
      return updated;
    } catch (requestError) {
      setError(requestError.message || "Unable to update this enquiry.");
      return null;
    }
  };

  const removeEnquiry = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    setError("");
    try {
      await apiRequest(`/api/enquiries/${deleteTarget.id}`, { method: "DELETE", authenticated: true });
      enquiries.setItems((current) => current.filter((item) => item.id !== deleteTarget.id));
      if (selectedId === deleteTarget.id) setSelectedId(null);
      setDeleteTarget(null);
    } catch (requestError) {
      setError(requestError.message || "Unable to delete this enquiry.");
    } finally {
      setBusy(false);
    }
  };

  return <>
    <PageHeading title="Enquiries" description="Keep track of incoming project conversations." />
    {error && <p className="admin-error" role="alert">{error}</p>}
    {notice && <p role="status">{notice}</p>}
    <section className="admin-panel admin-list-panel"><div className="admin-toolbar"><label className="admin-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, city or project…" /></label><select className="admin-select" aria-label="Filter enquiries by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All statuses</option>{enquiryStatuses.map((value) => <option key={value}>{value}</option>)}</select><span className="admin-result-count">{filtered.length} enquiries</span></div><div className="admin-table-wrap"><table className="admin-table admin-enquiry-table"><thead><tr><th>NAME</th><th>PHONE</th><th>CITY</th><th>PROJECT</th><th>DATE</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}><td><strong>{item.name}</strong><small>{item.id}</small></td><td>{item.phone}</td><td>{item.city}</td><td>{item.project}</td><td>{item.date}</td><td><select aria-label={`Status for ${item.name}`} className={`admin-status-select admin-status-select--${item.status.toLowerCase().replaceAll(" ", "-")}`} value={item.status} onChange={(event) => updateEnquiry(item.id, { status: event.target.value })}>{enquiryStatuses.map((value) => <option key={value}>{value}</option>)}</select></td><td className="admin-record-actions"><button className="admin-view-button" onClick={() => { setSelectedId(item.id); setNotes(item.notes || ""); }}>View details</button><button className="admin-icon-action admin-icon-delete" aria-label={`Delete enquiry from ${item.name}`} onClick={() => setDeleteTarget(item)}>×</button></td></tr>)}</tbody></table>{!filtered.length && <EmptyState title={enquiries.items.length ? "No enquiries found" : "No enquiries yet"} message={enquiries.items.length ? "Try changing the search or status filter." : "Enquiries submitted through the website will appear here."} />}</div></section>
    {selected && <div className="admin-modal-backdrop" role="presentation" onClick={() => setSelectedId(null)}><section className="admin-modal admin-enquiry-modal" role="dialog" aria-modal="true" aria-labelledby="enquiry-modal-title" onClick={(event) => event.stopPropagation()}><button className="admin-modal-close" onClick={() => setSelectedId(null)} aria-label="Close">×</button><span className="admin-eyebrow">{selected.id} · {selected.date}</span><h2 id="enquiry-modal-title">{selected.name}</h2><div className="admin-detail-list"><p><span>Phone</span><a href={`tel:${selected.phone}`}>{selected.phone}</a></p><p><span>Email</span><a href={`mailto:${selected.email}`}>{selected.email}</a></p><p><span>City</span><strong>{selected.city}</strong></p><p><span>Project</span><strong>{selected.project}</strong></p><p><span>Status</span><StatusBadge>{selected.status}</StatusBadge></p><label className="admin-field admin-enquiry-modal-status"><span>Update status</span><select value={selected.status} onChange={(event) => updateEnquiry(selected.id, { status: event.target.value })}>{enquiryStatuses.map((value) => <option key={value}>{value}</option>)}</select></label></div><div className="admin-message-box"><span>MESSAGE</span><p>{selected.message}</p></div><label className="admin-field admin-notes-field"><span>Internal admin notes</span><textarea rows="4" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Add an internal note…" /></label><div className="admin-modal-footer"><Button variant="secondary" disabled={busy} onClick={() => setSelectedId(null)}>Done</Button><Button disabled={busy} onClick={() => updateEnquiry(selected.id, { notes })}>Save notes</Button><Button className="admin-button--danger" onClick={() => setDeleteTarget(selected)}>Delete enquiry</Button></div></section></div>}
    {deleteTarget && <ConfirmDialog title="Delete this enquiry?" itemName={deleteTarget.name} busy={busy} onCancel={() => setDeleteTarget(null)} onConfirm={removeEnquiry} />}
  </>;
}

function ConfirmDialog({ title, itemName, busy = false, onCancel, onConfirm }) {
  return <div className="admin-modal-backdrop" role="presentation" onClick={onCancel}><section className="admin-modal admin-delete-modal" role="dialog" aria-modal="true" aria-labelledby="admin-confirm-title" onClick={(event) => event.stopPropagation()}><button className="admin-modal-close" onClick={onCancel} aria-label="Close">×</button><span className="admin-eyebrow">CONFIRM ACTION</span><h2 id="admin-confirm-title">{title}</h2><p><strong>{itemName}</strong> will be permanently removed. This cannot be undone.</p><div className="admin-delete-actions"><Button variant="secondary" disabled={busy} onClick={onCancel}>Cancel</Button><Button className="admin-button--danger" disabled={busy} onClick={onConfirm}>{busy ? "Deleting…" : "Delete"}</Button></div></section></div>;
}

function ManageList({ kind, collection, projects }) {
  const serviceMode = kind === "Service";
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [status, setStatus] = useState("Draft");
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const editingItem = collection.items.find((item) => item.id === editing);
  const resourcePath = serviceMode ? "/api/services/" : "/api/categories/";
  const resetForm = () => { setName(""); setDescription(""); setFullDescription(""); setIcon(""); setStatus("Draft"); setEditing(null); };

  const addOrSave = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError("");
    const body = serviceMode
      ? { name: name.trim(), description: description.trim(), fullDescription: fullDescription.trim(), icon: icon.trim(), status }
      : { name: name.trim(), description: description.trim(), status };
    try {
      const saved = await apiRequest(editing ? `${resourcePath}${editing}` : resourcePath, {
        method: editing ? "PUT" : "POST",
        authenticated: true,
        body,
      });
      collection.setItems((current) => editing
        ? current.map((item) => item.id === saved.id ? saved : item)
        : [...current, saved]);
      if (!serviceMode) projects.reload();
      resetForm();
    } catch (requestError) {
      setError(requestError.message || `Unable to save this ${kind.toLowerCase()}.`);
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (item) => { setEditing(item.id); setName(item.name); setDescription(item.description || ""); setFullDescription(item.fullDescription || ""); setIcon(item.icon || ""); setStatus(item.status); };
  const remove = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    setError("");
    try {
      await apiRequest(`${resourcePath}${deleteTarget.id}`, { method: "DELETE", authenticated: true });
      collection.setItems((current) => current.filter((item) => item.id !== deleteTarget.id));
      if (!serviceMode) projects.reload();
      if (editing === deleteTarget.id) resetForm();
      setDeleteTarget(null);
    } catch (requestError) {
      setError(requestError.message || `Unable to delete this ${kind.toLowerCase()}.`);
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (item) => {
    setBusy(true);
    setError("");
    try {
      const updated = await apiRequest(`${resourcePath}${item.id}`, { method: "PUT", authenticated: true, body: { status: item.status === "Published" ? "Draft" : "Published" } });
      collection.setItems((current) => current.map((value) => value.id === updated.id ? updated : value));
    } catch (requestError) {
      setError(requestError.message || `Unable to update this ${kind.toLowerCase()}.`);
    } finally {
      setBusy(false);
    }
  };

  return <>
    <PageHeading title={serviceMode ? "Services" : "Categories"} description={serviceMode ? "Shape the services visitors can explore." : "Organise projects into easy-to-browse collections."} />
    {error && <p className="admin-error" role="alert">{error}</p>}
    <div className="admin-manage-grid"><section className="admin-panel admin-manage-list"><div className="admin-panel-heading"><div><span className="admin-eyebrow">{serviceMode ? "OFFERINGS" : "PORTFOLIO"}</span><h2>{serviceMode ? "Service list" : "Project categories"}</h2></div><span className="admin-count-pill">{collection.items.length}</span></div>{collection.items.map((item) => <div className="admin-manage-item" key={item.id}><span className="admin-manage-icon">{serviceMode ? item.icon || "◇" : "▤"}</span><div className="admin-manage-copy"><strong>{item.name}</strong><small>{item.description || "No description added."}</small></div><StatusBadge>{item.status}</StatusBadge><button disabled={busy} className="admin-icon-action" onClick={() => startEdit(item)} aria-label={`Edit ${item.name}`} title="Edit">✎</button><button disabled={busy} className="admin-icon-action" onClick={() => toggle(item)} aria-label={`${item.status === "Published" ? "Unpublish" : "Publish"} ${item.name}`} title={item.status === "Published" ? "Unpublish" : "Publish"}>{item.status === "Published" ? "◌" : "↑"}</button><button disabled={busy} className="admin-icon-action admin-icon-delete" onClick={() => setDeleteTarget(item)} aria-label={`Delete ${item.name}`} title="Delete">×</button></div>)}{!collection.items.length && <EmptyState title={`No ${kind.toLowerCase()}s yet`} message={`Add your first ${kind.toLowerCase()} using the form.`} />}</section>
    <section className="admin-panel admin-add-panel"><span className="admin-eyebrow">{editing ? "UPDATE" : "NEW ENTRY"}</span><h2>{editing ? `Edit ${kind.toLowerCase()}` : `Add ${kind.toLowerCase()}`}</h2><p>{serviceMode ? "Give visitors a clear idea of how your studio can help." : "Use a concise name that makes projects easy to find."}</p><form onSubmit={addOrSave}><label className="admin-field"><span>{kind} name <i>*</i></span><input value={name} onChange={(event) => setName(event.target.value)} required /></label><label className="admin-field"><span>{serviceMode ? "Short description" : "Description"}</span><textarea rows="3" value={description} onChange={(event) => setDescription(event.target.value)} /></label>{serviceMode && <><label className="admin-field"><span>Full description</span><textarea rows="5" value={fullDescription} onChange={(event) => setFullDescription(event.target.value)} /></label><label className="admin-field"><span>Icon</span><input value={icon} onChange={(event) => setIcon(event.target.value)} /></label></>}<label className="admin-field"><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option>Draft</option><option>Published</option></select></label><Button type="submit" disabled={busy}>{busy ? "Saving…" : editing ? `Save ${kind.toLowerCase()}` : `Add ${kind.toLowerCase()}`}</Button>{editing && <button type="button" className="admin-cancel-edit" onClick={resetForm}>Cancel editing</button>}</form></section></div>
    {deleteTarget && <ConfirmDialog title={`Delete this ${kind.toLowerCase()}?`} itemName={deleteTarget.name} busy={busy} onCancel={() => setDeleteTarget(null)} onConfirm={remove} />}
  </>;
}

function Services() {
  const { services, projects } = useOutletContext();
  return <ManageList kind="Service" collection={services} projects={projects} />;
}

function Categories() {
  const { categories, projects } = useOutletContext();
  return <ManageList kind="Category" collection={categories} projects={projects} />;
}

const settingFields = [
  ["businessName", "Business name"], ["shortDescription", "Short description"], ["businessAddress", "Business address"],
  ["businessEmail", "Business email"], ["phoneNumber", "Phone number"], ["whatsappNumber", "WhatsApp number"],
  ["businessHours", "Business hours"], ["instagramUrl", "Instagram URL"], ["facebookUrl", "Facebook URL"],
  ["youtubeUrl", "YouTube URL"], ["pinterestUrl", "Pinterest URL"], ["websiteTitle", "Website title"],
  ["metaDescription", "Meta description"],
];

function Settings() {
  const { value, setValue, loading, error: loadError } = useApiResource("/api/settings/", { authenticated: true });
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (value) {
      const next = Object.fromEntries(settingFields.map(([key]) => [key, value[key] || ""]));
      setForm(next);
    }
  }, [value]);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const result = await apiRequest("/api/settings/", { method: "PUT", authenticated: true, body: form });
      setValue(result);
      setSaved(true);
    } catch (requestError) {
      setError(requestError.message || "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  };

  return <>
    <PageHeading title="Settings" description="Keep your studio details and website preferences in one place." />
    {loading && <p role="status">Loading settings…</p>}
    {(loadError || error) && <p className="admin-error" role="alert">{error || loadError}</p>}
    <form onSubmit={save}><div className="admin-settings-grid">
      <section className="admin-panel admin-settings-panel"><div className="admin-section-title"><span>01</span><div><h2>Business information</h2><p>How your studio is introduced across the website.</p></div></div><div className="admin-settings-fields">{settingFields.slice(0, 3).map(([name, label]) => <label className="admin-field" key={name}><span>{label}</span>{name === "shortDescription" || name === "businessAddress" ? <textarea rows="3" value={form[name] || ""} onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))} /> : <input value={form[name] || ""} onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))} />}</label>)}</div></section>
      <section className="admin-panel admin-settings-panel"><div className="admin-section-title"><span>02</span><div><h2>Contact information</h2><p>Ways for prospective clients to get in touch.</p></div></div><div className="admin-settings-fields two">{settingFields.slice(3, 7).map(([name, label]) => <label className="admin-field" key={name}><span>{label}</span><input type={name === "businessEmail" ? "email" : "text"} value={form[name] || ""} onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))} /></label>)}</div></section>
      <section className="admin-panel admin-settings-panel"><div className="admin-section-title"><span>03</span><div><h2>Social media</h2><p>Link your studio’s social profiles.</p></div></div><div className="admin-settings-fields two">{settingFields.slice(7, 11).map(([name, label]) => <label className="admin-field" key={name}><span>{label}</span><input type="url" value={form[name] || ""} onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))} /></label>)}</div></section>
      <section className="admin-panel admin-settings-panel"><div className="admin-section-title"><span>04</span><div><h2>Website preferences</h2><p>Basic information presented in search and browser tabs.</p></div></div><div className="admin-settings-fields">{settingFields.slice(11).map(([name, label]) => <label className="admin-field" key={name}><span>{label}</span>{name === "metaDescription" ? <textarea rows="3" value={form[name] || ""} onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))} /> : <input value={form[name] || ""} onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))} />}</label>)}</div></section>
    </div><div className="admin-settings-submit"><span role="status">{saved ? "Settings saved." : "Settings are stored on the server."}</span><Button type="submit" disabled={saving || loading || Boolean(loadError)}>{saving ? "Saving…" : saved ? "Saved" : "Save settings"}</Button></div></form>
  </>;
}

const AdminApp = { Layout: AdminLayout, Login, Dashboard, Projects, ProjectForm, ProjectDetails, Enquiries, Services, Categories, Settings };
export default AdminApp;
