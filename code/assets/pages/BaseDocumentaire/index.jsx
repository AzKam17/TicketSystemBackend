import React, { useContext, useEffect, useState } from 'react';

import cx from 'classnames';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import { Link, useHistory } from 'react-router-dom';
import TableBadge from '../../components/Customs/TableBadge';
import ModalBasic from '../../components/ModalBasic';
import Dropzone from '../../components/Customs/Dropzone';
import { ApiContext } from '../../providers/ApiContext';
import { toast } from 'react-toastify';
import loaderSVG from '../../misc/loader.svg';
import Table from '../../components/Customs/Table';
import TableBaseDocumentaire from './TableBaseDocumentaire';

function BaseDocumentaire() {
	const history = useHistory();
	const { Proxy } = useContext(ApiContext);
	const [files, setFiles] = useState([]);
	const [loading, setLoading] = useState(false);
	const [tableDataLoading, setTableDataLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [data, setData] = useState([]);

	useEffect(() => {
		document.title = 'Base Documentaire';
	}, []);

	useEffect(() => {
		loadData();
	}, []);

	useEffect(() => {
		loadData();
	}, [loading]);

	const loadData = () => {
		setTableDataLoading(true);
		Proxy()
			.get('/api/base_documentaire/')
			.then((response) => {
				setData(response.data);
				setTableDataLoading(false);
			});
	};

	const uploadFiles = () => {
		setLoading(true);
		let formData = new FormData();
		if (files.length > 0) {
			Object.keys(files).forEach((key) => {
				formData.append(key, files[key]);
			});
		}
		Proxy()
			.post('/api/base_documentaire/', formData)
			.then(
				(response) => {
					if (response.status === 200) {
						toast.success('Fichier(s) ajouté(s) avec succès');
					}
				},
				(error) => {
					toast.error('Une erreur est survenue');
				}
			)
			.finally(() => {
				setShowModal(false);
				setLoading(false);
			});
	};

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
									Base Documentaire
								</h1>
							</div>

							<div className="flex flex-row ml-auto">
								<div className="mb-4 sm:mb-0 ml-0">
									<button
										className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
										onClick={(e) => {
											e.stopPropagation();
											setShowModal(true);
										}}
									>
										<svg
											className="w-4 h-4 fill-current opacity-50 shrink-0"
											viewBox="0 0 16 16"
										>
											<path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
										</svg>
										<span className="hidden xs:block ml-2">
											Insérer un document.
										</span>
									</button>
								</div>
							</div>
						</div>

						{tableDataLoading ? (
							<div className="flex flex-col items-center justify-center h-80">
								<img
									src={loaderSVG}
									className="w-80"
									alt="Loading..."
								/>
							</div>
						) : (
							<TableBaseDocumentaire data={data} />
						)}

						<ModalBasic
							id="upload-modal"
							modalOpen={showModal}
							setModalOpen={() => setShowModal(false)}
							title={
								`Insérer un ou plusieurs documents ` +
								(files.length > 0
									? ` - ${files.length} fichier(s) sélectionné(s)`
									: '')
							}
							isHeaderSticky={true}
						>
							{files.length === 0 && (
								<>
									<div className="px-5 py-4">
										<div className="text-sm">
											<div className="font-medium text-slate-800 mb-2">
												Recommandations
											</div>
											<div className="space-y-2">
												<p>
													Nous vous recommandons de
													reunir tous vos documents
													dans un seul dossier, afin
													de pouvoir mieux les
													sélectionner.
												</p>
											</div>
										</div>
									</div>
									<hr className="border-slate-200 mr-2 ml-2" />
								</>
							)}
							<div className="text-center pt-2 px-2">
								<Dropzone
									onChange={(files) => {
										setFiles(files);
										console.log(files);
									}}
									style={{ height: '300px' }}
								/>

								<div className="sticky bottom-0 px-5 py-4 bg-white border-t border-slate-200">
									<div className="flex flex-wrap space-x-2 justify-center">
										<div className="space-y-3 mt-3 mb-3">
											<button
												className={cx(
													'btn-sm bg-indigo-500 hover:bg-indigo-600 text-white',
													{
														'opacity-50 cursor-not-allowed':
															files.length === 0
													}
												)}
												onClick={() => uploadFiles()}
											>
												{loading ? (
													<svg
														className="animate-spin w-4 h-4 fill-current shrink-0"
														viewBox="0 0 16 16"
													>
														<path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
													</svg>
												) : (
													<svg
														className="w-4 h-4 fill-current opacity-50 shrink-0"
														viewBox="0 0 16 16"
													>
														<path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
													</svg>
												)}

												<span className="hidden xs:block ml-2">
													Enregistrer
												</span>
											</button>
										</div>
									</div>
								</div>
							</div>
						</ModalBasic>
					</div>
				</main>
			</div>
		</div>
	);
}

function TableDocument(data) {
	const [title, setTitle] = React.useState('');
	const [count, setCount] = React.useState(0);
	const [headers, setHeaders] = React.useState([]);
	const [displayColumnsSelector, setDisplayColumnsSelector] =
		React.useState(false);
	const [selectedFilters, setSelectedFilters] = React.useState(data.filters);
	const [displayFiltersSelector, setDisplayFiltersSelector] =
		React.useState(false);

	const [currentPage, setCurrentPage] = React.useState(1);
	const [itemsPerPage, setItemsPerPage] = React.useState(8);
	const [indexOfLastItem, setIndexOfLastItem] = React.useState(
		currentPage * itemsPerPage
	);
	const [indexOfFirstItem, setIndexOfFirstItem] = React.useState(
		indexOfLastItem - itemsPerPage
	);
	const [localData, setLocalData] = React.useState(data || { data: [] });
	const [currentItems, setCurrentItems] = React.useState([]);

	useEffect(() => {
		initData(localData);
	}, [localData]);

	useEffect(() => {
		if (data) {
			if (data.data) {
				if (data.data.length > 0) {
					// Select all unique values in the data array for currentState label property
					let uniqueStates = [];
					// Add to array of unique states object with a selected property
					data.data.forEach((item) => {
						uniqueStates.push({
							label: item['currentState'].label,
							selected: false
						});
					});
					// Unique states array
					uniqueStates = uniqueStates.filter(
						(item, index, self) =>
							index ===
							self.findIndex((t) => t.label === item.label)
					);
					setSelectedFilters(uniqueStates);
				}
			}
		}
	}, [data]);

	const menuColumns = () => {
		setDisplayColumnsSelector(!displayColumnsSelector);
		setDisplayFiltersSelector(false);
	};

	const menuFilters = () => {
		setDisplayFiltersSelector(!displayFiltersSelector);
		setDisplayColumnsSelector(false);
	};

	const changeColumnDisplay = (index) => {
		let newHeaders = { ...headers };
		newHeaders[index].display = !newHeaders[index].display;
		setHeaders(newHeaders);
	};

	const nextPage = () => {
		if (indexOfLastItem < localData.data.length) {
			setCurrentPage(currentPage + 1);
			setIndexOfLastItem(indexOfLastItem + itemsPerPage);
			setIndexOfFirstItem(indexOfFirstItem + itemsPerPage);
		}
	};

	const prevPage = () => {
		if (indexOfFirstItem > 0) {
			setCurrentPage(currentPage - 1);
			setIndexOfLastItem(indexOfLastItem - itemsPerPage);
			setIndexOfFirstItem(indexOfFirstItem - itemsPerPage);
		}
	};

	useEffect(() => {
		if (localData.data) {
			if (localData.data.length > 0) {
				setCurrentItems(
					localData.data.slice(indexOfFirstItem, indexOfLastItem)
				);
			}
		}
	}, [indexOfLastItem, indexOfFirstItem]);

	function sortTable(key, type, order) {
		/*
			- key is the key of the object to sort by
			- type is the type of data to sort by
			- order is string, ASC or DESC
			type can be string, object, date
			date is formatted as d/m/Y
			object is an object with a key and a label, use label to sort by, label is string
			if order is DESC, sort using the key in reverse order else if ASC, sort using the key in ascending order
			and modify the localData.headers array to reflect the new order
		 */
		let sortedItems = [];
		if (order === 'DESC') {
			sortedItems = localData.data.sort((a, b) => {
				if (type === 'string') {
					return a[key].localeCompare(b[key]);
				} else if (type === 'object') {
					return a[key].label.localeCompare(b[key].label);
				} else if (type === 'date') {
					let date1 = a[key].split('/');
					let date2 = b[key].split('/');
					let d1 = new Date(date1[2], date1[1], date1[0]);
					let d2 = new Date(date2[2], date2[1], date2[0]);
					return d1 - d2;
				}
			});
		}
		if (order === 'ASC') {
			sortedItems = localData.data.sort((a, b) => {
				if (type === 'string') {
					return b[key].localeCompare(a[key]);
				} else if (type === 'object') {
					return b[key].label.localeCompare(a[key].label);
				} else if (type === 'date') {
					let date1 = a[key].split('/');
					let date2 = b[key].split('/');
					let d1 = new Date(date1[2], date1[1], date1[0]);
					let d2 = new Date(date2[2], date2[1], date2[0]);
					return d2 - d1;
				}
			});
		}
		let newHeaders = headers;
		newHeaders[key].order = order === 'ASC' ? 'DESC' : 'ASC';
		initData({
			title: localData.title,
			count: localData.count,
			headers: newHeaders,
			filters: localData.filters,
			data: sortedItems
		});
	}

	const initData = (data) => {
		if (data) {
			if (data.data) {
				if (data.data.length > 0) {
					console.log(data);
					setTitle(data.title);
					setCount(data.data.length);
					setHeaders(data.headers);
					setCurrentItems(
						data.data.slice(indexOfFirstItem, indexOfLastItem)
					);
				}
			}
		}
	};

	const diplaysSelectedFilterData = () => {
		const selectedFilterValue = [];
		// Loop through the selectedFilters array and find the selected value
		selectedFilters.forEach((filter) => {
			if (filter.selected) {
				selectedFilterValue.push(filter.label);
			}
		});
		// if selectedFilterValue empty return all data
		if (selectedFilterValue.length === 0) {
			initData(data);
			return;
		}
		// if selectedFilterValue not empty, filter the data
		const filteredData = localData.data.filter((item) => {
			return selectedFilterValue.includes(item['currentState'].label);
		});
		initData({
			title: localData.title,
			count: filteredData.length,
			headers: localData.headers,
			filters: localData.filters,
			data: filteredData
		});
	};

	return (
		<div className="bg-white shadow-lg rounded-sm border border-slate-200 relative">
			<header className="px-5 py-4">
				<h2 className="font-semibold text-slate-800">
					{title}{' '}
					<span className="text-slate-400 font-medium">{count}</span>
				</h2>
				{/* Dropdown  checkboxes representing the table filters and columns, use checkboxes */}
				<div className="absolute top-0 right-0 mt-3 mr-3 flex flex-row gap-5">
					<div className="relative inline-block text-left">
						<div>
							<button
								type="button"
								className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
								id="options-menu"
								aria-expanded="true"
								aria-haspopup="true"
								onClick={menuFilters}
							>
								Filtres
								<svg
									className="-mr-1 ml-2 h-5 w-5"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										fillRule="evenodd"
										d="M5 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm0 5a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm0 5a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 011-1z"
										clipRule="evenodd"
									/>
								</svg>
							</button>
						</div>
					</div>
					{displayFiltersSelector && (
						<div
							className="origin-top-right absolute right-5 mt-5 w-90 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
							role="menu"
							aria-orientation="vertical"
							aria-labelledby="options-menu"
						>
							<div className="py-1" role="none">
								{Object.values(selectedFilters).map(
									(filter, index) => (
										<div
											key={index}
											className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
											role="menuitem"
										>
											<input
												type="checkbox"
												className="mr-2"
												checked={filter.selected}
												onClick={() => {}}
												onChange={() => {
													let newFilters = [
														...selectedFilters
													];
													newFilters[index].selected =
														!newFilters[index]
															.selected;
													setSelectedFilters(
														newFilters
													);
													diplaysSelectedFilterData();
												}}
											/>
											{filter.label}
										</div>
									)
								)}
							</div>
						</div>
					)}

					<div className="relative inline-block text-left">
						<div>
							<button
								type="button"
								className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
								id="options-menu"
								aria-expanded="true"
								aria-haspopup="true"
								onClick={menuColumns}
							>
								Colonnes
								<svg
									className="-mr-1 ml-2 h-5 w-5"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										fillRule="evenodd"
										d="M5 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm0 5a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm0 5a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 011-1z"
										clipRule="evenodd"
									/>
								</svg>
							</button>
						</div>
						{displayColumnsSelector && (
							<div
								className="origin-top-right absolute right-0 mt-2 w-90 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
								role="menu"
								aria-orientation="vertical"
								aria-labelledby="options-menu"
							>
								<div className="py-1" role="none">
									{Object.values(headers).map(
										(header, index) => (
											<div
												key={index}
												className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
												role="menuitem"
											>
												<input
													type="checkbox"
													className="mr-2"
													checked={header.display}
													onClick={() => {
														changeColumnDisplay(
															Object.keys(
																headers
															)[index]
														);
													}}
												/>
												{header.title}
											</div>
										)
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			</header>
			<div>
				<div className="overflow-x-auto">
					<table className="table-auto w-full">
						{/* Table header */}
						<thead className="text-xs font-semibold uppercase text-slate-500 bg-slate-50 border-t border-b border-slate-200">
							<tr>
								{Object.keys(headers).map((key, index) => {
									return headers[key].display ? (
										<th
											className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"
											key={index}
											onClick={() => {
												sortTable(
													key,
													headers[key].type,
													headers[key].order
												);
											}}
										>
											{headers[key].title}
											<img
												src={require(`../../misc/sort_${headers[
													key
												].order.toLowerCase()}.svg`)}
												className="inline mr-5 w-6"
												alt={headers[key].title}
											/>
										</th>
									) : null;
								})}
								<th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
									Actions
								</th>
							</tr>
						</thead>
						{/* Table body */}
						<tbody className="text-sm divide-y divide-slate-200">
							{currentItems.map((row, index) => {
								return (
									<tr key={index}>
										{Object.keys(headers).map(
											(key, index) => {
												return headers[key].display ? (
													<td
														className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px"
														key={index}
													>
														{typeof row[key] ===
														'object' ? (
															<TableBadge
																color={
																	row[key]
																		.color
																}
																text={
																	row[key]
																		.label
																}
															/>
														) : (
															row[key]
														)}
													</td>
												) : null;
											}
										)}
										<td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
											<Link to={row.link}>
												<button className="btn border-slate-200 hover:border-slate-300 text-indigo-500">
													Consulter
												</button>
											</Link>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
				<div className="px-6 py-8 border border-slate-200 rounded-sm">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
						<nav
							className="mb-4 sm:mb-0 sm:order-1"
							role="navigation"
							aria-label="Navigation"
						>
							<ul className="flex justify-center">
								<li className="ml-3 first:ml-0">
									<a
										className={`relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 ${
											currentPage === 1
												? 'cursor-not-allowed'
												: 'text-indigo-500 hover:text-indigo-600'
										}`}
										onClick={prevPage}
									>
										&lt;- Précédent
									</a>
								</li>
								<li className="ml-3 first:ml-0">
									<a
										className={`relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 ${
											currentPage ===
											Math.ceil(count / itemsPerPage)
												? 'cursor-not-allowed'
												: 'text-indigo-500 hover:text-indigo-600'
										}`}
										onClick={nextPage}
									>
										Suivant -&gt;
									</a>
								</li>
							</ul>
						</nav>
						<div className="text-sm text-slate-500 text-center sm:text-left">
							Affichage de &nbsp;
							<span className="font-medium text-slate-600">
								{indexOfFirstItem + 1}
							</span>{' '}
							sur{' '}
							<span className="font-medium text-slate-600">
								{indexOfLastItem > count
									? count
									: indexOfLastItem}
							</span>{' '}
							de{' '}
							<span className="font-medium text-slate-600">
								{count}
							</span>{' '}
							résultats
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function ModalNewDocument(modalOpen, setModalOpen) {
	return (
		<ModalBasic
			id="feedback-modal"
			modalOpen={modalOpen}
			setModalOpen={setModalOpen}
			title={`Insérer un ou plusieurs documents`}
			isHeaderSticky={true}
		>
			<div className="px-5 pt-4 pb-1">
				<div className="text-sm">
					<h1 className="text-lg font-medium text-gray-900">
						Insérer un ou plusieurs documents
					</h1>
				</div>
			</div>
		</ModalBasic>
	);
}

export default BaseDocumentaire;
