import React from 'react';

export default function DisplayDocuments({ documents }) {
	return (
		<div className="container">
			<table className="table-auto w-full bg-slate-50">
				<thead className="text-xs font-semibold uppercase text-slate-500 border-t border-b border-slate-200">
					<tr>
						<th className="px-4 py-3">Fichier</th>
						<th className="px-4 py-3">Actions</th>
					</tr>
				</thead>
				<tbody className="text-sm divide-y divide-slate-200">
					{documents.map((document, index) => (
						<tr key={index}>
							<td className="px-4 py-3">{document.name}</td>
							<td className="px-4 py-3">
								<button
									className="btn bg-emerald-500 hover:bg-emerald-600 text-white"
									onClick={() => {
										window.open(document.link);
									}}
								>
									Télécharger
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
