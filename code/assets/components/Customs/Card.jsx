import React from 'react';
import Tooltip from '../Tooltip';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import Transition from '../../utils/Transition';

function Card({ title, value, tooltip }) {
	const [showButton, setShowButton] = React.useState(false);
	return (
		<div
			onMouseEnter={() => setShowButton(true)}
			onMouseLeave={() => setShowButton(false)}
			className="flex flex-col col-span-full sm:col-span-6 xl:col-span-3 bg-white shadow-lg rounded-sm border border-slate-200 hover:shadow-lg"
		>
			<div className="px-5 py-5">
				<header>
					<h3 className="text-sm font-semibold text-slate-500 mb-1 flex flex-row">
						<span className="text-slate-800">{title}</span>
						{tooltip && (
							<Tooltip bg="dark" className="relative mr-0 ml-3">
								<div className="text-xs text-slate-200 whitespace-nowrap">
									{tooltip}
								</div>
							</Tooltip>
						)}
					</h3>
					<div className="text-2xl font-bold text-slate-800 mb-1">
						{' '}
						{value}{' '}
					</div>
					{/* Button aligned to the right
					<div className="flex flex-wrap items-center justify-end h-8">
						<Transition
							show={showButton && value > 0}
							tag="div"
							className={`rounded overflow-hidden`}
							enter="transition ease-out duration-200 transform"
							enterStart="opacity-0 -translate-y-2"
							enterEnd="opacity-100 translate-y-0"
							leave="transition ease-out duration-200"
							leaveStart="opacity-100"
							leaveEnd="opacity-0"
						>
							<button
								className={cx(
									'btn-sm border-slate-200 text-white hover:border-slate-300 shadow-sm flex items-center',
									{
										'bg-indigo-500': value > 0,
										'bg-slate-200': value === 0
									}
								)}
							>
								<span>Consulter</span>
								<svg
									className="w-3 h-3 shrink-0 fill-current text-white ml-2"
									viewBox="0 0 12 12"
								>
									<path d="M4.293 1.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L7.586 6l-3.293-3.293a1 1 0 010-1.414z"></path>
								</svg>
							</button>
						</Transition>
					</div>
					*/}
				</header>
			</div>
		</div>
	);
}

export default Card;
