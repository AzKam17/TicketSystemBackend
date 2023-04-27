import React, { useContext, useState } from 'react';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import ContratNewFormv2 from '../../components/Customs/Forms/Contrat/ContratNewFormv2';
import { AuthContext } from '../../providers/AuthContext';

export default function ContratNew() {
	const { user } = useContext(AuthContext);
	const title =
		(user.is_juridique
			? 'Nouveau contrat'
			: 'Nouvelle demande de contrat') + ' - Gestion Contractuelle';
	document.title = title;
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="flex h-screen overflow-hidden">
			{/* Sidebar */}
			<Sidebar
				sidebarOpen={sidebarOpen}
				setSidebarOpen={setSidebarOpen}
			/>

			{/* Content area */}
			<div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
				{/*  Site header */}
				<Header
					sidebarOpen={sidebarOpen}
					setSidebarOpen={setSidebarOpen}
				/>

				<main>
					<div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
						<div className="flex flex-row mb-5">
							<div className="mb-4 sm:mb-0 ml-0">
								<h1 className="text-2xl md:text-3xl text-slate-800 font-bold">
									{title}
								</h1>
							</div>
						</div>

						<ContratNewFormv2 />
					</div>
				</main>
			</div>
		</div>
	);
}
