// TODO: Replace these demo records with API-loaded data when the backend is available.
export const initialProjects = [
  { id: "hdw-101", title: "Courtyard House", category: "Modern Homes", location: "Jaipur, Rajasthan", plotSize: "40 × 60 ft", size: "2,400 sq. ft.", status: "Published", image: "/images/project-1.svg", date: "Oct 02, 2026", bedrooms: 4, bathrooms: 3, floors: "2", style: "Contemporary", description: "A light-filled family home arranged around a quiet central courtyard.", features: ["Central courtyard", "Natural stone", "Open-plan living"] },
  { id: "hdw-102", title: "The Aranya Residence", category: "Luxury Homes", location: "Udaipur, Rajasthan", plotSize: "50 × 70 ft", size: "3,100 sq. ft.", status: "Published", image: "/images/project-2.svg", date: "Sep 26, 2026", bedrooms: 4, bathrooms: 4, floors: "2", style: "Modern Indian", description: "A considered blend of local materials, shaded verandas and modern living.", features: ["Shaded veranda", "Local stone", "Garden views"] },
  { id: "hdw-103", title: "Compact City Living", category: "Small Homes", location: "Pune, Maharashtra", plotSize: "25 × 40 ft", size: "1,250 sq. ft.", status: "Draft", image: "/images/project-3.svg", date: "Sep 21, 2026", bedrooms: 3, bathrooms: 2, floors: "2", style: "Minimal", description: "A compact plan that makes room for flexible family life.", features: ["Flexible study", "Compact planning"] },
  { id: "hdw-104", title: "Saanjh Farmhouse", category: "Farmhouses", location: "Nashik, Maharashtra", plotSize: "60 × 90 ft", size: "2,800 sq. ft.", status: "Published", image: "/images/project-4.svg", date: "Sep 18, 2026", bedrooms: 3, bathrooms: 3, floors: "1", style: "Rustic Contemporary", description: "An understated country retreat connected to its surrounding landscape.", features: ["Wide verandas", "Garden court"] },
];

export const initialEnquiries = [
  { id: "ENQ-2408", name: "Aarav Mehta", phone: "+91 98765 43210", city: "Jaipur", project: "Modern 3BHK home", date: "Oct 07, 2026", status: "New", email: "aarav@example.com", message: "We are planning a 3BHK home on a 30 × 50 ft plot and would like to understand the design process.", notes: "" },
  { id: "ENQ-2407", name: "Diya Sharma", phone: "+91 98123 45670", city: "Pune", project: "Interior design", date: "Oct 06, 2026", status: "In Progress", email: "diya@example.com", message: "Looking for help creating a calm, functional interior for our new apartment.", notes: "" },
  { id: "ENQ-2406", name: "Kabir Singh", phone: "+91 99887 76655", city: "Udaipur", project: "Farmhouse design", date: "Oct 05, 2026", status: "Contacted", email: "kabir@example.com", message: "Interested in exploring design options for a small family farmhouse.", notes: "" },
  { id: "ENQ-2405", name: "Meera Patel", phone: "+91 97654 32109", city: "Ahmedabad", project: "Home renovation", date: "Oct 04, 2026", status: "New", email: "meera@example.com", message: "We would like to refresh the ground floor and improve natural light.", notes: "" },
  { id: "ENQ-2404", name: "Rohan Das", phone: "+91 91234 56789", city: "Jaipur", project: "Villa design", date: "Oct 03, 2026", status: "Completed", email: "rohan@example.com", message: "Requesting an initial conversation about a two-floor villa.", notes: "" },
];

export const initialServices = [
  { id: "srv-1", name: "Architectural Design", description: "Thoughtful home plans shaped around your plot, lifestyle and budget.", fullDescription: "We develop considered architectural plans that respond to your site, priorities and preferred way of living, from initial concept through design refinement.", icon: "⌂", status: "Published" },
  { id: "srv-2", name: "Interior Design", description: "Warm, functional interiors with considered materials and detailing.", fullDescription: "We shape practical, welcoming interiors with a coherent material palette, thoughtful storage and details tailored to your home.", icon: "◇", status: "Published" },
  { id: "srv-3", name: "Home Renovation", description: "Practical renovation guidance from layout changes to final finishes.", fullDescription: "We help clarify renovation priorities and explore layout, finish and lighting improvements for existing homes.", icon: "↻", status: "Published" },
  { id: "srv-4", name: "3D Visualisation", description: "A clear visual preview to help you explore your design direction.", fullDescription: "Visual previews help communicate spatial ideas, proportions and material direction before decisions are finalised.", icon: "▧", status: "Draft" },
];

export const initialCategories = [
  { id: "cat-1", name: "Modern Homes", description: "Contemporary homes with practical layouts and considered materials.", status: "Published" },
  { id: "cat-2", name: "Luxury Homes", description: "Distinctive residences with refined details and generous spaces.", status: "Published" },
  { id: "cat-3", name: "Small Homes", description: "Thoughtful plans that make compact spaces work harder.", status: "Published" },
  { id: "cat-4", name: "Farmhouses", description: "Relaxed homes connected to the outdoors and surrounding landscape.", status: "Published" },
  { id: "cat-5", name: "Interiors", description: "Interior projects shaped around comfort and everyday use.", status: "Published" },
];

export const enquiryStatuses = ["New", "Contacted", "In Progress", "Completed", "Rejected"];
