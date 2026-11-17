import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";
import JobManagement from "./JobManagement.jsx";

const t = localStorage.getItem("token");
if (!t) console.log("NO TOKEN");
else {
  const p = JSON.parse(atob(t.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
  console.log("role:", p.role ?? p.roles ?? p.authorities, "| expires:", new Date(p.exp * 1000).toString(), "| now:", new Date().toString());
}

export default function AdminJobs() {
  return (
   
   <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-24 pb-10 px-4">
        <JobManagement />
      </main>
      <Footer />
    </div>
  );
}