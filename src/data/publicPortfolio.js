import staticProjects from "./staticProjects";

const normalize = (value) => String(value || "").trim().toLocaleLowerCase();
const toSlug = (value) => normalize(value).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function isPublished(project) {
  return String(project.status || "").toLocaleLowerCase() === "published";
}

function getProjectContentKey(project) {
  return `${normalize(project.title)}:${normalize(project.image)}`;
}

export function getPublicProjects(apiProjects = []) {
  const projects = staticProjects.map((project) => ({ ...project }));
  const seenIds = new Set(projects.map((project) => String(project.id)));
  const contentIndexes = new Map();
  const titleIndexes = new Map();
  projects.forEach((project, index) => {
    if (project.image) contentIndexes.set(getProjectContentKey(project), index);
    titleIndexes.set(normalize(project.title), index);
  });

  apiProjects.filter(isPublished).forEach((project) => {
    const identity = project.id === undefined || project.id === null ? "" : String(project.id);
    if (identity && seenIds.has(identity)) return;
    if (identity) seenIds.add(identity);

    const contentKey = project.image ? getProjectContentKey(project) : "";
    const existingIndex = contentKey
      ? contentIndexes.get(contentKey)
      : titleIndexes.get(normalize(project.title));
    if (existingIndex !== undefined) {
      const staticProject = projects[existingIndex];
      projects[existingIndex] = {
        ...staticProject,
        ...project,
        id: staticProject.id,
        image: project.image || staticProject.image,
        detailPath: staticProject.detailPath,
        gallery: staticProject.gallery,
      };
      return;
    }

    if (contentKey) contentIndexes.set(contentKey, projects.length);
    if (project.title) titleIndexes.set(normalize(project.title), projects.length);
    projects.push(project);
  });

  return projects;
}

function findCategoryForProject(project, categories) {
  const value = String(project.category || "").trim();
  if (!value) return null;

  return categories.find((category) => (
    normalize(value) === normalize(category.name)
    || (category.id !== undefined && value === String(category.id))
    || toSlug(value) === toSlug(category.name)
  )) || null;
}

export function getProjectCategoryName(project, categories) {
  const matchedCategory = findCategoryForProject(project, categories);
  if (matchedCategory) return matchedCategory.name;

  const value = String(project.category || "").trim();
  return /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i.test(value)
    ? "Uncategorised"
    : value || "Uncategorised";
}

export function getProjectsForCategory(category, projects, categories) {
  return projects.filter((project) => (
    normalize(getProjectCategoryName(project, categories)) === normalize(category.name)
  ));
}

export function buildPublicPortfolio(apiCategories = [], apiProjects = []) {
  const projects = getPublicProjects(apiProjects);
  const categoriesByName = new Map();

  [...apiCategories.filter(isPublished), ...staticProjects.map((project) => ({ name: project.category }))]
    .forEach((category) => {
      const name = String(category.name || "").trim();
      if (!name) return;
      const key = normalize(name);
      const existing = categoriesByName.get(key);
      if (!existing || (!existing.id && category.id)) {
        categoriesByName.set(key, { ...existing, ...category, name });
      }
    });

  projects.forEach((project) => {
    const categoryName = getProjectCategoryName(project, [...categoriesByName.values()]);
    const key = normalize(categoryName);
    if (!categoriesByName.has(key)) categoriesByName.set(key, { name: categoryName });
  });

  const categories = [...categoriesByName.values()];
  return {
    projects,
    categories: categories.map((category) => ({
      ...category,
      projects: getProjectsForCategory(category, projects, categories),
    })),
  };
}
