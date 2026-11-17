import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import InterviewManagement from "./admin/InterviewManagement.jsx";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen flex-col bg-[#050B1E] text-white">
      <Navbar />
      <main className="flex-1 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <InterviewManagement />
        </div>
      </main>
      <Footer />
    </div>
  );
}