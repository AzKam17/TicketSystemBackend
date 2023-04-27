import React, { useState, useEffect, useContext } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { toFont } from 'chart.js/helpers';
import { ApiContext } from '../providers/ApiContext';
import { Link, useHistory } from 'react-router-dom';
import ModalBasic from '../components/ModalBasic';
import { map } from 'core-js/internals/array-iteration';

function NotificationsCalendar() {
	const today = new Date();
	const monthNames = [
		'Janvier',
		'Février',
		'Mars',
		'Avril',
		'Mai',
		'Juin',
		'Juillet',
		'Août',
		'Septembre',
		'Octobre',
		'Novembre',
		'Décembre'
	];
	const dayNames = [
		'Dimanche',
		'Lundi',
		'Mardi',
		'Mercredi',
		'Jeudi',
		'Vendredi',
		'Samedi'
	];

	const history = useHistory();
	const { Proxy } = useContext(ApiContext);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [month, setMonth] = useState(today.getMonth());
	// eslint-disable-next-line no-unused-vars
	const [year, setYear] = useState(today.getFullYear());
	const [daysInMonth, setDaysInMonth] = useState([]);
	const [startingBlankDays, setStartingBlankDays] = useState([]);
	const [endingBlankDays, setEndingBlankDays] = useState([]);
	const [events, setEvents] = useState([]);
	const [notificationsDays, setNotificationsDays] = useState(null);
	const [moreNotificationModal, setMoreNotificationModal] = useState(false);

	const isToday = (date) => {
		const day = new Date(year, month, date);
		return today.toDateString() === day.toDateString() ? true : false;
	};

	const getEvents = (date) => {
		return events.filter(
			(e) =>
				new Date(e.eventStart).toDateString() ===
				new Date(year, month, date).toDateString()
		);
	};

	const getDays = () => {
		const days = new Date(year, month + 1, 0).getDate();

		// starting empty cells (previous month)
		const startingDayOfWeek = new Date(year, month).getDay();
		let startingBlankDaysArray = [];
		for (let i = 1; i <= startingDayOfWeek; i++) {
			startingBlankDaysArray.push(i);
		}

		// ending empty cells (next month)
		const endingDayOfWeek = new Date(year, month + 1, 0).getDay();
		let endingBlankDaysArray = [];
		for (let i = 1; i < 7 - endingDayOfWeek; i++) {
			endingBlankDaysArray.push(i);
		}

		// current month cells
		let daysArray = [];
		for (let i = 1; i <= days; i++) {
			daysArray.push(i);
		}

		setStartingBlankDays(startingBlankDaysArray);
		setEndingBlankDays(endingBlankDaysArray);
		setDaysInMonth(daysArray);
	};

	const getDayNotifications = (date) => {
		const timestampInSec = parseInt(date.getTime() / 1000, 10);
		return events
			.filter((e) => e.timestamp === timestampInSec)
			.map((e, index) => {
				return (
					<li key={e.id}>
						<Link key={e.id} to={e.link}>
							<button className="w-full h-full text-left py-3 px-4 rounded bg-white border border-slate-200 hover:border-indigo-400 shadow-sm duration-150 ease-in-out">
								<div className="flex items-center">
									<div className="grow">
										<div className="flex flex-wrap items-center justify-between mb-0.5">
											<span className="font-semibold text-slate-800">
												{e.eventName}
											</span>
											<span>
												<div
													className={
														`w-6 h-6 border-3 border-black-500 rounded-full mr-3 ` +
														e.eventColor
													}
												></div>
											</span>
										</div>
										<div className="text-sm">
											{e.description}
										</div>
									</div>
								</div>
							</button>
						</Link>
					</li>
				);
			});
	};

	useEffect(() => {
		getDays();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [year, month]);

	useEffect(() => {
		document.title = 'Notifications';
	}, []);

	useEffect(() => {
		setMoreNotificationModal(notificationsDays !== null);
	}, [notificationsDays]);

	useEffect(() => {
		Proxy()
			.get('/api/notifications/calendar')
			.then((res) => {
				console.log(res.data);
				const result = res.data;
				// if res length is greater than 0
				if (result.length > 0) {
					// Map each event to this format:
					const finalEvents = result.map((event) => {
						return {
							id: event.id,
							eventStart: event.createdAt,
							eventEnd: '',
							eventName: event.title,
							objectId: event.objectId,
							link: event.link,
							eventColor: event.color,
							timestamp: event.timestamp,
							description: event.description
						};
					});
					setEvents(finalEvents);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

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
						{/* Page header */}
						<div className="sm:flex sm:justify-between sm:items-center mb-4">
							{/* Left: Title */}
							<div className="mb-4 sm:mb-0">
								<h1 className="text-2xl md:text-3xl text-slate-800 font-bold">
									<span>{`${monthNames[month]} ${year}`}</span>{' '}
								</h1>
							</div>

							{/* Right: Actions */}
							<div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
								{/* Previous month button */}
								<button
									className="btn px-2.5 bg-white border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-600 disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
									disabled={
										year === today.getFullYear() - 1 &&
										month === 0
									}
									onClick={() => {
										if (month === 0) setYear(year - 1);
										setMonth((month - 1 + 12) % 12);
										getDays();
									}}
								>
									<span className="sr-only">
										Previous month
									</span>
									<wbr />
									<svg
										className="h-4 w-4 fill-current"
										viewBox="0 0 16 16"
									>
										<path d="M9.4 13.4l1.4-1.4-4-4 4-4-1.4-1.4L4 8z" />
									</svg>
								</button>

								{/* Next month button */}
								<button
									className="btn px-2.5 bg-white border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-600 disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
									disabled={
										year === today.getFullYear() &&
										month === today.getMonth()
									}
									onClick={() => {
										if (month === 11) setYear(year + 1);
										setMonth((month + 1) % 12);
										getDays();
									}}
								>
									<span className="sr-only">Next month</span>
									<wbr />
									<svg
										className="h-4 w-4 fill-current"
										viewBox="0 0 16 16"
									>
										<path d="M6.6 13.4L5.2 12l4-4-4-4 1.4-1.4L12 8z" />
									</svg>
								</button>
							</div>
						</div>

						{/* Calendar table */}
						<div className="bg-white rounded-sm shadow overflow-hidden">
							{/* Days of the week */}
							<div className="grid grid-cols-7 gap-px border-b border-slate-200">
								{dayNames.map((day) => {
									return (
										<div className="px-1 py-3" key={day}>
											<div className="text-slate-500 text-sm font-medium text-center lg:hidden">
												{day.substring(0, 3)}
											</div>
											<div className="text-slate-500 text-sm font-medium text-center hidden lg:block">
												{day}
											</div>
										</div>
									);
								})}
							</div>

							{/* Day cells */}
							<div className="grid grid-cols-7 gap-px bg-slate-200">
								{/* Diagonal stripes pattern */}
								<svg className="sr-only">
									<defs>
										<pattern
											id="stripes"
											patternUnits="userSpaceOnUse"
											width="5"
											height="5"
											patternTransform="rotate(135)"
										>
											<line
												className="stroke-current text-slate-200 opacity-50"
												x1="0"
												y="0"
												x2="0"
												y2="5"
												strokeWidth="2"
											/>
										</pattern>
									</defs>
								</svg>
								{/* Empty cells (previous month) */}
								{startingBlankDays.map((blankday) => {
									return (
										<div
											className="bg-slate-50 h-20 sm:h-28 lg:h-36"
											key={blankday}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="100%"
												height="100%"
											>
												<rect
													width="100%"
													height="100%"
													fill="url(#stripes)"
												/>
											</svg>
										</div>
									);
								})}
								{/* Days of the current month */}
								{daysInMonth.map((day) => {
									return (
										<div
											className="relative bg-white h-20 sm:h-28 lg:h-36 overflow-hidden"
											key={day}
										>
											<div className="h-full flex flex-col justify-between">
												{/* Events */}
												<div className="grow flex flex-col relative p-0.5 sm:p-1.5 overflow-hidden">
													{getEvents(day).map(
														(event) => {
															return (
																<button
																	className="relative w-full text-left mb-1"
																	key={
																		event.id
																	}
																	onClick={() =>
																		history.push(
																			event.link
																		)
																	}
																>
																	<div
																		className={`px-2 py-0.5 rounded overflow-hidden ${event.eventColor}`}
																	>
																		{/* Event name */}
																		<div className="text-xs font-semibold truncate">
																			{
																				event.eventName
																			}
																		</div>
																		{/* Event time */}
																		<div className="text-xs uppercase truncate hidden sm:block">
																			{/* Start date */}
																			<span>
																				{event.objectId ||
																					''}
																			</span>
																		</div>
																	</div>
																</button>
															);
														}
													)}
													<div
														className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none"
														aria-hidden="true"
													></div>
												</div>
												{/* Cell footer */}
												<div className="flex justify-between items-center p-0.5 sm:p-1.5">
													{/* More button (if more than 2 events) */}
													{getEvents(day).length >
														2 && (
														<button
															className="text-xs text-slate-500 font-medium whitespace-nowrap text-center sm:py-0.5 px-0.5 sm:px-2 border border-slate-200 rounded"
															onClick={(e) => {
																e.stopPropagation();
																setNotificationsDays(
																	day
																);
															}}
														>
															<span className="md:hidden">
																+
															</span>
															<span>
																{getEvents(day)
																	.length - 2}
															</span>{' '}
															<span className="hidden md:inline">
																de +
															</span>
														</button>
													)}
													{/* Day number */}
													<button
														className={`inline-flex ml-auto w-6 h-6 items-center justify-center text-xs sm:text-sm font-medium text-center rounded-full hover:bg-indigo-100 ${
															isToday(day) &&
															'text-indigo-500'
														}`}
													>
														{day}
													</button>
												</div>
											</div>
										</div>
									);
								})}
								{/* Empty cells (next month) */}
								{endingBlankDays.map((blankday) => {
									return (
										<div
											className="bg-slate-50 h-20 sm:h-28 lg:h-36"
											key={blankday}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="100%"
												height="100%"
											>
												<rect
													width="100%"
													height="100%"
													fill="url(#stripes)"
												/>
											</svg>
										</div>
									);
								})}

								<ModalBasic
									id="feedback-modal"
									modalOpen={moreNotificationModal}
									setModalOpen={() =>
										setNotificationsDays(null)
									}
									title={`Notifications du ${notificationsDays} ${monthNames[month]} ${year}.`}
									isHeaderSticky={true}
								>
									<div className="px-5 pt-4 pb-1">
										<div className="text-sm">
											<ul className="space-y-2 mb-4">
												{getDayNotifications(
													new Date(
														year,
														month,
														notificationsDays
													)
												)}
											</ul>
										</div>
									</div>
								</ModalBasic>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}

export default NotificationsCalendar;
