'use client';

import SummarySection from './components/SummarySection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';

export default function Portfolio() {
	return (
		<main className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
			<SummarySection />
			<ProjectsSection />
			<ContactSection />
		</main>
	);
}
