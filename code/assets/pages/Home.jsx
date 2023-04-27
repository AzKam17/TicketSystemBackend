import React, {useEffect, useState} from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import DashboardAvatars from '../partials/dashboard/DashboardAvatars';
import FilterButton from '../components/DropdownFilter';
import Datepicker from '../components/Datepicker';
import DashboardCard01 from '../partials/dashboard/DashboardCard01';
import DashboardCard02 from '../partials/dashboard/DashboardCard02';
import DashboardCard03 from '../partials/dashboard/DashboardCard03';
import DashboardCard04 from '../partials/dashboard/DashboardCard04';
import DashboardCard05 from '../partials/dashboard/DashboardCard05';
import DashboardCard06 from '../partials/dashboard/DashboardCard06';
import DashboardCard07 from '../partials/dashboard/DashboardCard07';
import DashboardCard08 from '../partials/dashboard/DashboardCard08';
import DashboardCard09 from '../partials/dashboard/DashboardCard09';
import DashboardCard10 from '../partials/dashboard/DashboardCard10';
import DashboardCard11 from '../partials/dashboard/DashboardCard11';
import { Link } from 'react-router-dom';
import Card from '../components/Customs/Card';
import Table from '../components/Customs/Table';
import ModalBasic from '../components/ModalBasic';
import axios from "axios";

import loaderSVG from '../misc/loader.svg';
import TableBadge from "../components/Customs/TableBadge";

function Home() {
	document.title = 'Accueil';
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [loadingTable, setLoadingTable] = useState(true);
	const [loadingStats, setLoadingStats] = useState(true);


	const [newSub, setNewSub] = useState(false);
	const [showParticipantModal, setShowParticipantModal] = useState(false);
	const [showImportModal, setShowImportModal] = useState(false);

	const [data, setData] = useState([]);
	const [stats, setStats] = useState([]);
	const [userModalData, setUserModalData] = useState(null);
	const [file, setFile] = useState(null);

	useEffect(() => {
		// Call api /api/participants to get all participants
		// use axios
		axios
			.get('/api/participants')
			.then((res) => {
				setData(res.data);
				setLoadingTable(false);
			})

		// Call api /api/participants/stats to get stats
		axios
			.get('/api/participants/stats')
			.then((res) => {
				console.log(res.data);
				setStats(res.data);
				setLoadingStats(false);
			})
	}, []);

	useEffect(() => {
		setUserModalData(null);
	}, [showParticipantModal]);

	const Loader = () => {
		return (
			<div className="flex flex-col items-center justify-center h-80">
				<img src={loaderSVG} className="w-80" alt="Loading..." />
			</div>
		);
	};

	const getUserModalData = (id) => {
		axios
			.get(`/api/participants/infos/${id}`)
			.then((res) => {
				setUserModalData(res.data);
				setShowParticipantModal(true);
			});
	}

	const uploadFile = () => {
		let formData = new FormData();
		formData.append('file', file);
		axios
			.post('/api/participants/excel/import', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then((res) => {
				alert(res.data.message);
				window.location.reload();
			})
			.catch((err) => {
				alert(err.response.data.message);
			});

	}

	return (
		<div className="flex h-screen overflow-hidden">
			{/* Sidebar */}
			<Sidebar
				sidebarOpen={sidebarOpen}
				setSidebarOpen={setSidebarOpen}
			/>

			{/* Content area */}
			<div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
				{/*  Site headder */}
				<Header
					sidebarOpen={sidebarOpen}
					setSidebarOpen={setSidebarOpen}
				/>

				<main>
					<div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
						{/* Welcome banner */}
						<WelcomeBanner />

						<div className="flex flex-row mb-5">
							<div className="mb-4 sm:mb-0 ml-0">
								<h1 className="text-2xl md:text-3xl text-slate-800 font-bold">
									Gestion de l'évènement
								</h1>
							</div>

							{/* two buttons aligned right */}
							<div className="flex flex-row ml-auto">
								<div className="mb-4 sm:mb-0 ml-0">
									<a href="/api/participants/excel/export" target={"_blank"}>

									<button className="btn bg-emerald-500 hover:bg-emerald-600 text-white mr-2">
										<svg
											className="w-4 h-4 fill-current opacity-50 shrink-0"
											viewBox="0 0 16 16"
										>
											<path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
										</svg>
										<span className="hidden xs:block ml-2">
											Export au format Excel
										</span>
									</button>
								</a>


									<button className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
										<svg
											className="w-4 h-4 fill-current opacity-50 shrink-0"
											viewBox="0 0 16 16"
										>
											<path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
										</svg>
										<span
											className="hidden xs:block ml-2"
											onClick={(e) => {
												e.stopPropagation();
												setNewSub(true);
											}}
										>
											Ajouter une nouvelle personne.
										</span>
									</button>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-12 gap-6 mb-5">
							{
								loadingStats ? <Loader /> : (
									<>
										<Card title={'Personnes inscrites'} value={stats.subbed} />
										<Card title={'Codes QR Scannés'} value={stats.scanned} />
									</>
								)
							}

						</div>


						{loadingTable ? <Loader /> : <Table data={data} consultFnc={(e) => {
							getUserModalData(e.id);
							setShowParticipantModal(true);
						}}/>}

						<ModalBasic
							id="feedback-modal"
							modalOpen={newSub}
							setModalOpen={() => setNewSub(null)}
							title={`Ajouter un nouveau participant.`}
							isHeaderSticky={true}
						>
							<div className="px-5 pt-4 pb-1">
								<div className="text-sm">
									<h3 className="text-lg leading-6 font-medium text-gray-900">
										Importer un fichier Excel
									</h3>
									<ul className="space-y-2 mb-4">
										<li className={`flex flex-row items-center justify-center`}>
											<span>
												<input
													type="file"
													name="file"
													id="file"
													className="hidden"
													onChange={(e) => { setFile(e.target.files[0]) }}
												/>
												<label htmlFor="file" className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
													<svg
														className="w-4 h-4 fill-current opacity-50 shrink-0"
														viewBox="0 0 16 16"
													>
														<path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
													</svg>
													<span className="hidden xs:block ml-2">
														{
															file ? file.name : 'Choisir un fichier'
														}
													</span>
												</label>
											</span>
											{
												file ? (
													<button className="btn bg-emerald-500 hover:bg-emerald-600 text-white ml-2" onClick={uploadFile}>
														<svg
															className="w-4 h-4 fill-current opacity-50 shrink-0"
															viewBox="0 0 16 16"
														>
															<path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
														</svg>
														<span className="hidden xs:block ml-2">
															Importer
														</span>
													</button>
												) : null
											}
										</li>
									</ul>
								</div>
							</div>
						</ModalBasic>


						<ModalBasic
							id="participant-modal"
							modalOpen={showParticipantModal}
							setModalOpen={() => setShowParticipantModal(null)}
							title={userModalData ? `${userModalData.nom_prenoms}` : ''}
							isHeaderSticky={true}
						>
							<div className="px-5 pt-4 pb-1">
								<div className="text-sm">
									<ul className="space-y-2 mb-4">
										{
											!userModalData ?
											<Loader /> : (
												<>
													<li className={`flex flex-row items-center justify-center`}>
														<span>
															<img src={userModalData.qr} className={`w-60 h-60 center`} alt="QR Code" />
														</span>
													</li>
													<li>
														<span className="font-bold">Nom et prénoms: </span>
														<span>{userModalData.nom_prenoms}</span>
													</li>
													<li>
														<span className="font-bold">Email: </span>
														<span>{userModalData.mail}</span>
													</li>
													<li>
														<span className="font-bold">Etat du scan: </span>
														<span>
															<TableBadge color={userModalData.currentState.color} text={userModalData.currentState.label} />
														</span>
													</li>
													<li>
														<span className="font-bold">Inscrit à: </span>
														<span>{userModalData.subbedAt}</span>
													</li>

													<li>
														<span className="font-bold">Informations additionnelles: </span>
														<span>{userModalData.addFields}</span>
													</li>
													</>
												)

										}
									</ul>
								</div>
							</div>
						</ModalBasic>

					</div>
				</main>
			</div>
		</div>
	);
}

export default Home;
