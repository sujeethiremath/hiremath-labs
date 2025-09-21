import Link from "next/link";

export default function TopNav() {
  const handleScroll = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Adjust offset for fixed navbar
      const yOffset = -80; // height of navbar
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };
  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <span className="text-xl font-bold text-blue-600">Hiremath Labs</span>
        <ul className="flex space-x-6">
          <li>
            <button
              onClick={() => handleScroll("summary")}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Summary
            </button>
          </li>
          <li>
            <button
              onClick={() => handleScroll("projects")}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Projects
            </button>
          </li>
          <li>
            <button
              onClick={() => handleScroll("contact")}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Contact
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
