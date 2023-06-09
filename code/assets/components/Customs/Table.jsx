import React, { useContext, useEffect } from 'react';
import TableBadge from './TableBadge';
import { Link } from 'react-router-dom';

// Data is passed to the table component from data prop
export default function Table({ data, consultFnc }) {
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
	// Contenue de la barre de recherche
	const [search, setSearch] = React.useState('');
	// Champs qui seront utilisés pour la recherche
	const [searchField, setSearchField] = React.useState([]);

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

	useEffect(() => {
		/*
		*  Parcourir les propriétés de l'objet headers
		*  Chaque propriété est un objet avec une propriété search
		*  Si search existe et est true, ajouter le nom de la propriété à un tableau
		*  sinon, ne rien faire
		*  Ces propriétés seront utilisées pour la recherche
		*/
		let searchFields = [];
		Object.keys(headers).forEach((key) => {
			if (headers[key].search) {
				searchFields.push(key);
			}
		});
		setSearchField(searchFields);
	}, [headers]);

	useEffect(() => {
		sortDataBySearchField(search);
	}, [search]);

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

	const sortDataBySearchField = (searchValue) => {
		if (!searchValue) {
			initData(data);
			return;
		}

		const regex = new RegExp(searchValue, 'i');

		const filteredData = localData.data.filter((item) => {
			for (let i = 0; i < searchField.length; i++) {
				const prop = searchField[i];
				if (regex.test(item[prop])) {
					return true; // Found match in this item, return true to keep it in filteredData
				}
			}
			return false; // No match found in this item, exclude it from filteredData
		});

		initData({
			title: localData.title,
			count: filteredData.length,
			headers: localData.headers,
			filters: localData.filters,
			data: filteredData,
		});
	};


	return (
		<div className="bg-white shadow-lg rounded-sm border border-slate-200 relative">
			<header className="px-5 py-4">
				<h2 className="font-semibold text-slate-800">
					{title}{' '}
					<span className="text-slate-400 font-medium">{count}</span>

					{/* Input box to search */}
				</h2>
				<div className="mt-4 relative">
					<input
						type="text"
						name="search"
						id="search"
						className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
						placeholder="Rechercher"
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
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
											{row.buttons ? (
												<>
													{/* Buttons */}
													{row.buttons.map(
														// If type is download, launch a download
														(button, index) => {
															return (
																<button
																	className={`btn border-slate-200 bg-emerald-500 hover:bg-emerald-600 hover:border-slate-300 text-${button.color} mr-2`}
																	key={index}
																	onClick={() => {
																		if (
																			button.type ===
																			'download'
																		) {
																			// Open in new tab
																			window.open(
																				button.link,
																				'_blank'
																			);
																		}
																	}}
																>
																	{
																		button.title
																	}
																</button>
															);
														}
													)}
												</>
											) : null}
											<span onClick={(e) => {
												e.stopPropagation();
												consultFnc(row);
											}}>
												<button className="btn border-slate-200 hover:border-slate-300 text-indigo-500">
													Consulter
												</button>
											</span>
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
