import { subDays } from "date-fns";

export const roles = ["citizen", "admin", "employee"];

export const users = [
  {
    id: "u-citizen-1",
    name: "Aarav Sharma",
    email: "citizen@sccms.demo",
    role: "citizen",
    joinedAt: "2025-02-10",
    password: "Demo@123",
  },
  {
    id: "u-admin-1",
    name: "Ritika Menon",
    email: "admin@sccms.demo",
    role: "admin",
    joinedAt: "2024-11-05",
    password: "Demo@123",
  },
  {
    id: "u-emp-1",
    name: "Kunal Verma",
    email: "employee@sccms.demo",
    role: "employee",
    department: "Roads",
    joinedAt: "2025-01-18",
    password: "Demo@123",
  },
];

export const employees = [
  { id: "e1", name: "Kunal Verma", email: "kunal@sccms.gov", department: "Roads", assignedCount: 3, joinedAt: "2025-01-18" },
  { id: "e2", name: "Neha Iyer", email: "neha@sccms.gov", department: "Sanitation", assignedCount: 5, joinedAt: "2024-10-12" },
  { id: "e3", name: "Ravi Pratap", email: "ravi@sccms.gov", department: "Utilities", assignedCount: 8, joinedAt: "2024-08-01" },
  { id: "e4", name: "Maya D'Souza", email: "maya@sccms.gov", department: "Parks", assignedCount: 2, joinedAt: "2025-03-22" },
];

const statusTimeline = (status, createdBy = "System") => [
  { status: "PENDING", actor: createdBy, note: "Complaint submitted", at: subDays(new Date(), 5).toISOString() },
  ...(status !== "PENDING" ? [{ status: "ASSIGNED", actor: "Ritika Menon", note: "Assigned to department", at: subDays(new Date(), 3).toISOString() }] : []),
  ...(status === "IN_PROGRESS" || status === "RESOLVED" || status === "CLOSED" ? [{ status: "IN_PROGRESS", actor: "Kunal Verma", note: "Work started", at: subDays(new Date(), 2).toISOString() }] : []),
  ...(status === "RESOLVED" || status === "CLOSED" ? [{ status: "RESOLVED", actor: "Kunal Verma", note: "Issue resolved", at: subDays(new Date(), 1).toISOString() }] : []),
];

export const complaints = [
  { id: "CMP-1001", title: "Large pothole on MG Road", category: "Roads/Potholes", description: "Dangerous pothole near bus stop causing traffic slowdowns.", status: "PENDING", citizenId: "u-citizen-1", citizenName: "Aarav Sharma", assignedTo: null, address: "MG Road, Indore", location: { type: "Point", coordinates: [75.8577, 22.7196] }, submittedAt: subDays(new Date(), 6).toISOString(), imageUrl: "", history: statusTimeline("PENDING", "Aarav Sharma") },
  { id: "CMP-1002", title: "Burst pipe near Sector 14", category: "Water Supply", description: "Water leakage flooding nearby footpath and lane.", status: "ASSIGNED", citizenId: "u-citizen-1", citizenName: "Aarav Sharma", assignedTo: "e3", address: "Sector 14 Market", location: { type: "Point", coordinates: [77.209, 28.6139] }, submittedAt: subDays(new Date(), 5).toISOString(), imageUrl: "", history: statusTimeline("ASSIGNED", "Aarav Sharma") },
  { id: "CMP-1003", title: "Garbage pile at Lake View", category: "Sanitation", description: "Uncollected waste for 4 days attracting stray animals.", status: "IN_PROGRESS", citizenId: "u-citizen-1", citizenName: "Aarav Sharma", assignedTo: "e2", address: "Lake View Road", location: { type: "Point", coordinates: [72.8777, 19.076] }, submittedAt: subDays(new Date(), 4).toISOString(), imageUrl: "", history: statusTimeline("IN_PROGRESS", "Aarav Sharma") },
  { id: "CMP-1004", title: "Streetlight outage on Palm Street", category: "Electricity", status: "RESOLVED", citizenId: "u-citizen-1", citizenName: "Aarav Sharma", assignedTo: "e3", address: "Palm Street", location: { type: "Point", coordinates: [73.8567, 18.5204] }, submittedAt: subDays(new Date(), 8).toISOString(), imageUrl: "", description: "Entire lane remains dark after 7 PM.", resolutionNotes: "Transformer fuse replaced and tested.", history: statusTimeline("RESOLVED", "Aarav Sharma") },
  { id: "CMP-1005", title: "Broken swing in neighborhood park", category: "Parks & Recreation", description: "Children could be injured due to loose chain.", status: "CLOSED", citizenId: "u-citizen-1", citizenName: "Aarav Sharma", assignedTo: "e4", address: "Greenfield Park", location: { type: "Point", coordinates: [72.5714, 23.0225] }, submittedAt: subDays(new Date(), 12).toISOString(), imageUrl: "", resolutionNotes: "Swing removed and replaced.", history: statusTimeline("CLOSED", "Aarav Sharma") },
  { id: "CMP-1006", title: "Open manhole near City Mall", category: "Public Safety", description: "No warning signs near open manhole cover.", status: "PENDING", citizenId: "u-citizen-1", citizenName: "Aarav Sharma", assignedTo: null, address: "City Mall Junction", location: { type: "Point", coordinates: [88.3639, 22.5726] }, submittedAt: subDays(new Date(), 3).toISOString(), imageUrl: "", history: statusTimeline("PENDING", "Aarav Sharma") },
  { id: "CMP-1007", title: "Sewage overflow in Block C", category: "Sanitation", description: "Sewage flowing on road for two blocks.", status: "ASSIGNED", citizenId: "u-citizen-1", citizenName: "Aarav Sharma", assignedTo: "e2", address: "Block C Residential Area", location: { type: "Point", coordinates: [80.9462, 26.8467] }, submittedAt: subDays(new Date(), 7).toISOString(), imageUrl: "", history: statusTimeline("ASSIGNED", "Aarav Sharma") },
  { id: "CMP-1008", title: "Traffic signal not working at Ring Road", category: "Public Safety", description: "Signal has been blinking amber for two days.", status: "IN_PROGRESS", citizenId: "u-citizen-1", citizenName: "Aarav Sharma", assignedTo: "e3", address: "Ring Road Circle", location: { type: "Point", coordinates: [78.4867, 17.385] }, submittedAt: subDays(new Date(), 2).toISOString(), imageUrl: "", history: statusTimeline("IN_PROGRESS", "Aarav Sharma") },
  { id: "CMP-1009", title: "Illegal dumping near riverfront", category: "Other", description: "Construction debris dumped at riverside walkway.", status: "PENDING", citizenId: "u-citizen-1", citizenName: "Aarav Sharma", assignedTo: null, address: "Riverfront Walkway", location: { type: "Point", coordinates: [85.1376, 25.5941] }, submittedAt: subDays(new Date(), 1).toISOString(), imageUrl: "", history: statusTimeline("PENDING", "Aarav Sharma") },
  { id: "CMP-1010", title: "Damaged footpath tiles near metro exit", category: "Public Safety", description: "Uneven tiles causing tripping hazards.", status: "ASSIGNED", citizenId: "u-citizen-1", citizenName: "Aarav Sharma", assignedTo: "e1", address: "Metro Exit Gate 2", location: { type: "Point", coordinates: [77.5946, 12.9716] }, submittedAt: subDays(new Date(), 9).toISOString(), imageUrl: "", history: statusTimeline("ASSIGNED", "Aarav Sharma") },
  { id: "CMP-1011", title: "Waterlogging after rain in Sector 8", category: "Roads/Potholes", description: "Drainage blockage causes long standing water.", status: "RESOLVED", citizenId: "u-citizen-1", citizenName: "Aarav Sharma", assignedTo: "e1", address: "Sector 8 Main Road", location: { type: "Point", coordinates: [76.2673, 9.9312] }, submittedAt: subDays(new Date(), 10).toISOString(), imageUrl: "", resolutionNotes: "Drain cleaned and water cleared.", history: statusTimeline("RESOLVED", "Aarav Sharma") },
  { id: "CMP-1012", title: "Park lights flickering in East Garden", category: "Parks & Recreation", description: "Multiple lights flicker intermittently after sunset.", status: "IN_PROGRESS", citizenId: "u-citizen-1", citizenName: "Aarav Sharma", assignedTo: "e4", address: "East Garden Park", location: { type: "Point", coordinates: [75.3433, 19.8762] }, submittedAt: subDays(new Date(), 11).toISOString(), imageUrl: "", history: statusTimeline("IN_PROGRESS", "Aarav Sharma") },
];
