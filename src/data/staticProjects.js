const projectImage = (filename) => `/images/projects/${filename}`;

const staticProjects = [
  {
    id: "static-brick-home",
    detailPath: "/projects/static/static-brick-home",
    title: "Brick Home",
    category: "Architecture",
    image: projectImage("brick-home-cover.jpg"),
    gallery: [
      projectImage("brick-home-cover.jpg"),
      projectImage("brick-home-gallery-01.jpg"),
    ],
  },
  {
    id: "static-modern-residence-01",
    detailPath: "/projects/static/static-modern-residence-01",
    title: "Modern Residence 01",
    category: "Architecture",
    image: projectImage("modern-residence-01-cover.png"),
    gallery: [projectImage("modern-residence-01-cover.png")],
  },
  {
    id: "static-modern-residence-02",
    detailPath: "/projects/static/static-modern-residence-02",
    title: "Modern Residence 02",
    category: "Architecture",
    image: projectImage("modern-residence-02-cover.png"),
    gallery: [projectImage("modern-residence-02-cover.png")],
  },
  {
    id: "static-poolside-residence",
    detailPath: "/projects/static/static-poolside-residence",
    title: "Poolside Residence",
    category: "Architecture",
    image: projectImage("poolside-residence-cover.png"),
    gallery: [projectImage("poolside-residence-cover.png")],
  },
  {
    id: "static-dusk-residence",
    detailPath: "/projects/static/static-dusk-residence",
    title: "Dusk Residence",
    category: "Architecture",
    image: projectImage("dusk-residence-cover.png"),
    gallery: [projectImage("dusk-residence-cover.png")],
  },
  {
    id: "static-arched-architecture",
    detailPath: "/projects/static/static-arched-architecture",
    title: "Arched Architecture Study",
    category: "Architecture",
    image: projectImage("arched-architecture-cover.png"),
    gallery: [
      projectImage("arched-architecture-cover.png"),
      projectImage("arched-architecture-gallery-01.png"),
    ],
  },
  {
    id: "static-contemporary-villa",
    detailPath: "/projects/static/static-contemporary-villa",
    title: "Contemporary Villa",
    category: "Architecture",
    image: projectImage("contemporary-villa-cover.png"),
    gallery: [projectImage("contemporary-villa-cover.png")],
  },
  {
    id: "static-modern-home-elevation",
    detailPath: "/projects/static/static-modern-home-elevation",
    title: "Modern Home Elevation",
    category: "Architecture",
    image: projectImage("modern-home-elevation-cover.png"),
    gallery: [projectImage("modern-home-elevation-cover.png")],
  },
];

export default staticProjects;
