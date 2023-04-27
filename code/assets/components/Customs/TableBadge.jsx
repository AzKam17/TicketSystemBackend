import React, { useEffect } from 'react';

export default function TableBadge({ color, text }) {
	const [colorClass, setColorClass] = React.useState('');

	useEffect(() => {
		switch (color) {
			case 'default':
				setColorClass('bg-sky-100 text-sky-600');
				break;
			case 'primary':
				setColorClass('bg-indigo-100 text-indigo-600');
				break;
			case 'secondary':
				setColorClass('bg-slate-100 text-slate-500');
				break;
			case 'success':
				setColorClass('bg-emerald-100 text-emerald-600');
				break;
			case 'danger':
				setColorClass('bg-rose-100 text-rose-600');
				break;
		}
	}, [color]);

	return (
		<div
			className={`text-xs inline-flex font-medium ${colorClass} rounded-full text-center px-2.5 py-1`}
		>
			{text}
		</div>
	);
}
