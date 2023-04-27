import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import { useForm } from 'react-hook-form';
import InputTextv2 from '../../components/Customs/Forms/Fields/InputTextv2';
import InputDropdownv2 from '../../components/Customs/Forms/Fields/InputDropdownv2';
import InputTextAreav2 from '../../components/Customs/Forms/Fields/InputTextAreav2';
import InputDatev2 from '../../components/Customs/Forms/Fields/InputDatev2';
import DisplayDocuments from '../../components/Customs/DisplayDocuments';
import { ApiContext } from '../../providers/ApiContext';
import cx from 'classnames';
import loaderSVG from '../../misc/loader.svg';
import { toast } from 'react-toastify';

export default function ContratConsulter() {
	const history = useHistory();
	const { Proxy } = useContext(ApiContext);
	const params = useParams();
	const title = 'Consulter un contrat - Gestion Contractuelle';
	// Tableau des permissions
	const [edit, setEdit] = useState(true);
	const [contrat, setContrat] = useState(null);
	const [show, setShow] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const sendData = (data) => {};

	useEffect(() => {
		Proxy()
			.get(`/api/contrat/infos/${params.id}`)
			.then((response) => {
				setContrat(response.data);
				setShow(true);
				document.title = title;
			})
			.catch((error) => {
				if (error.response.data.errors === 'Contrat not found') {
					history.push('/404');
				}
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
						<div className="flex flex-row mb-5">
							<div className="mb-4 sm:mb-0 ml-0">
								<h1 className="text-2xl md:text-3xl text-slate-800 font-bold">
									{title}
								</h1>
							</div>
						</div>
						{/* Two cols one at 60%, the other at 40% */}
						{show ? (
							<ContratConsult
								data={contrat}
								editForm={edit}
								setEdit={setEdit}
							/>
						) : (
							<>
								{/* Center loader horizontally and vertically */}
								<div className="flex flex-col items-center justify-center h-full">
									<img src={loaderSVG} alt="Loading..." />
								</div>
							</>
						)}
					</div>
				</main>
			</div>
		</div>
	);
}

const ContratConsult = ({ data, editForm, setEdit }) => {
	const { register, control, handleSubmit, errors, getValues } = useForm({
		defaultValues: {
			objet: data.object,
			'type-contrat': data.typeContrat,
			'departement-initiateur': data.departementInitiateur,
			'identite-cocontractant': data.identiteCocontractant,
			'clauses-particulieres': data.clausesParticulieres,
			'date-entree-vigueur': data.dateEntreeVigueur,
			'date-fin-contrat': data.dateFinContrat,
			'delai-denonciation': data.delaiDenonciation,
			'mode-facturation': data.modeFacturation,
			'periodicite-paiement': data.periodicitePaiement,
			'mode-paiement': data.modePaiement,
			'mode-renouvellement': data.modeRenouvellement,
			'objet-modification': data.objetModification,
			'details-modification': data.detailsModification
		}
	});

	function getTableDelaiDenonciation() {
		let finalData = [];
		for (let i = 0; i < 12; i++) {
			finalData.push({
				value: i,
				label: i + ' mois',
				selected: data.delaiDenonciation === i + ' mois'
			});
		}
		return finalData;
	}

	// event prevent default and log data
	const onSubmit = (data) => {
		console.log(data);
	};

	useEffect(() => {
		console.log(data);
	}, []);

	return (
		<>
			<div className="flex flex-col md:flex-row w-full">
				<div className="w-5/6 md:w-2/3">
					<div className="bg-white p-5 shadow-lg rounded-sm border border-slate-200 mb-5">
						<hr className="my-6 border-t border-slate-200" />
						<form onSubmit={handleSubmit(onSubmit)}>
							<h2 className="text-xl text-slate-800 mb-2">
								Identification du contrat
							</h2>
							<hr />
							<div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-5">
								<div className="flex-1">
									<InputTextv2
										name="objet"
										control={control}
										disabled={editForm}
										label="Objet du contrat"
										placeholder="Objet du contrat"
										defaultValue=""
									/>
								</div>
								<div className="flex-1 flex flex-row gap-2">
									<div className="flex-1">
										<InputDropdownv2
											name="type-contrat"
											label="Type de contrat"
											control={control}
											disabled={editForm}
											data={data.typeContrat}
											isAnother={true}
										/>
									</div>
									<div className="flex-1">
										<InputDropdownv2
											name="departement-initiateur"
											label="Département initiateur"
											control={control}
											disabled={true}
											data={data.departementInitiateur}
											isAnother={false}
										/>
									</div>
								</div>
							</div>
							<div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-5">
								<div className="flex-1">
									<InputTextv2
										name={'identite-cocontractant'}
										control={control}
										disabled={editForm}
										label={'Identité du co-contractant'}
										placeholder="Identité du co-contractant"
										defaultValue=""
									/>
								</div>
							</div>
							<h2 className="text-xl text-slate-800 my-2">
								Conditions du contrat
							</h2>
							<hr />
							<div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-5">
								<div className="flex-1">
									<InputTextAreav2
										name="clauses-particulieres"
										control={control}
										disabled={editForm}
										label="Clauses particulières"
										placeholder="Clauses particulières"
										defaultValue=""
									/>
								</div>
							</div>
							<div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-5">
								<div className="flex-1">
									<InputDatev2
										name={'date-entree-vigueur'}
										control={control}
										disabled={editForm}
										label="Date d'entrée en vigueur"
										defaultValue={new Date()}
									/>
								</div>
								<div className="flex-1">
									<InputDatev2
										name={'date-fin-contrat'}
										control={control}
										disabled={editForm}
										label="Date de fin de contrat"
										defaultValue={new Date()}
									/>
								</div>
								<div className="flex-1">
									<InputDropdownv2
										name="delai-denonciation"
										label="Délai de dénonciation ou de préavis"
										control={control}
										disabled={editForm}
										isAnother={false}
										data={getTableDelaiDenonciation()}
									/>
								</div>
							</div>
							<div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-5">
								<div className="flex-1">
									<InputDropdownv2
										name={'mode-facturation'}
										label={'Mode de facturation'}
										control={control}
										disabled={editForm}
										data={data.modeFacturation}
										isAnother={true}
									/>
								</div>
							</div>
							<div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-5">
								<div className="flex-1">
									<InputDropdownv2
										name={'periodicite-paiement'}
										label={'Périodicité paiement'}
										control={control}
										disabled={editForm}
										data={data.periodicitePaiement}
										isAnother={true}
									/>
								</div>
							</div>
							<div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-5">
								<div className="flex-1">
									<InputDropdownv2
										name={'mode-paiement'}
										label={'Mode de paiement'}
										control={control}
										disabled={editForm}
										data={data.modePaiement}
										isAnother={true}
									/>
								</div>
							</div>

							<h2 className="text-xl text-slate-800 my-2">
								Conditions de renouvellement
							</h2>
							<div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-5">
								<div className="flex-1">
									<InputDropdownv2
										name={'mode-renouvellement'}
										label={'Mode de renouvellement'}
										control={control}
										disabled={editForm}
										data={data.modeRenouvellement}
										isAnother={false}
									/>
								</div>
							</div>

							<h2 className="text-xl text-slate-800 my-2">
								Conditions de modification
							</h2>
							<hr />
							<div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-5">
								<div className="flex-1">
									<InputTextv2
										name={'objet-modification'}
										label={
											'Objet des conditions de modifications'
										}
										placeholder={
											'Objet des conditions de modifications'
										}
										control={control}
										disabled={editForm}
										defaultValue=""
									/>
								</div>
							</div>

							<div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-5">
								<div className="flex-1">
									<InputTextAreav2
										name="details-modification"
										control={control}
										disabled={editForm}
										label="Détails des conditions de modifications"
										placeholder="Détails des conditions de modifications"
										defaultValue=""
									/>
								</div>
							</div>

							<div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-5">
								<div className="flex-1">
									<DisplayDocuments
										documents={data.documents}
									/>
								</div>
							</div>
						</form>
					</div>
				</div>
				<div className="w-1/2 md:w-1/3">
					<ContratAction
						id={data.id}
						data={data.perms}
						logs={data.logs}
						edit={editForm}
						setEdit={setEdit}
						getFormValues={getValues}
					/>
				</div>
			</div>
		</>
	);
};

const ContratAction = ({ id, data, logs, edit, setEdit, getFormValues }) => {
	// Rediriger à l'accueil après une opération
	const history = useHistory();
	const { Proxy } = useContext(ApiContext);
	const [editLoading, setEditLoading] = useState(false);
	const [showUsersJuridiquesSelect, setShowUsersJuridiquesSelect] =
		useState(false);
	const [usersJuridiques, setUsersJuridiques] = useState([]);
	const [selectedUserJuridique, setSelectedUserJuridique] = useState(null);

	const loadUsersJuridiques = async () => {
		Proxy()
			.get('/api/user/user_juridique')
			.then((res) => {
				console.log(res.data);
				setUsersJuridiques(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const defaultValues = {
		crud_actions: {
			edit: false,
			remove: false
		},
		possible_actions: {
			pending_agent_approval: false,
			pending_legal_department_manager_approval: false,
			pending_manager_approval: false
		}
	};

	const updateContrat = async (values) => {
		Proxy()
			.put(`/api/contrat/${id}`, values)
			.then((res) => {
				console.log(res);
				setEditLoading(false);
				setEdit(false);
				toast.success('Contrat mis à jour');
				history.push('/contrat');
			})
			.catch((err) => {
				console.log(err);
				setEditLoading(false);
				setEdit(false);
				toast.error({
					title: 'Erreur lors de la mise à jour du contrat',
					description: err.response.data.errors
				});
			});
	};

	const changeState = async (value) => {
		Proxy()
			.put(`/api/contrat/update_state/${id}`, {
				action: value
			})
			.then((res) => {
				console.log(res);
				setEditLoading(false);
				setEdit(false);
				toast.success(res.data.message);
				history.push('/contrat');
			})
			.catch((err) => {
				console.log(err);
				setEditLoading(false);
				setEdit(false);
				toast.error(err.data.message);
			});
	};

	const assignToUserJuridique = async () => {
		if (selectedUserJuridique === null) {
			toast.error('Veuillez sélectionner un agent');
			return;
		}
		Proxy()
			.put(`/api/contrat/reassign_to_agent`, {
				contrat_id: id,
				user_id: selectedUserJuridique
			})
			.then((res) => {
				console.log(res.data);
				setEditLoading(false);
				setEdit(false);
				toast.success(res.data.message);
				history.push('/contrat');
			})
			.catch((err) => {
				console.log(err.data);
				setEditLoading(false);
				setEdit(false);
				toast.error(err.data.message);
			});
	};

	useEffect(() => {
		if (showUsersJuridiquesSelect) {
			loadUsersJuridiques();
		}
	}, [showUsersJuridiquesSelect]);

	useEffect(() => {
		console.log(selectedUserJuridique);
	}, [selectedUserJuridique]);

	return (
		<div className="bg-white p-5 shadow-lg rounded-sm border border-slate-200 mb-5 w-full h-80">
			{/* Block Historique */}
			<h2 className="text-xl text-slate-800 mb-2">Historique</h2>
			<hr className="my-6 border-t border-slate-200" />
			<div className="space-y-3">
				{logs.map((log, index) => (
					<div className="place-content-center w-full" key={index}>
						<div className="inline-flex flex-col w-full px-4 py-2 rounded-sm text-sm bg-white shadow-lg border border-slate-200 text-slate-600">
							<div className="flex w-full justify-between items-start">
								<div className="flex">
									<div>
										<div className="font-medium text-slate-800 mb-1">
											<div
												className={
													'text-xs inline-flex font-medium bg-indigo-100 text-indigo-600 rounded-full text-center px-2.5 py-1 ' +
													log.color
												}
											>
												{log.title ||
													'Changement de statut'}
											</div>
											&nbsp;|&nbsp;<i>12/12/2020</i>
										</div>
										<div>
											{log.text ||
												'Le contrat a été mis à jour'}
										</div>
									</div>
								</div>
							</div>
							<div className="text-right mt-1"></div>
						</div>
					</div>
				))}
			</div>
			{/* Block Actions Utilisateurs */}
			<h2 className="text-xl text-slate-800 my-2 mb-1">Actions</h2>
			<hr className="my-6 border-t border-slate-200" />
			{data.crud_actions.edit === true && (
				<>
					<h4 className="text-lg text-slate-800 mb-2">
						Modifier le contrat
					</h4>
					{edit === true ? (
						<button
							className="btn bg-indigo-500 hover:bg-indigo-600 text-white my-1 w-full"
							onClick={() => setEdit(false)}
						>
							Modifier
						</button>
					) : (
						<div className={'flex space-x-1'}>
							<button
								className={cx(
									'btn bg-emerald-500 hover:bg-emerald-600 text-white my-1 w-1/2',
									{
										'cursor-not-allowed': editLoading,
										'opacity-50': editLoading
									}
								)}
								onClick={() => {
									updateContrat(getFormValues());
									setEditLoading(true);
								}}
							>
								{editLoading ? (
									<>
										<svg
											className="animate-spin w-4 h-4 fill-current shrink-0"
											viewBox="0 0 16 16"
										>
											<path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
										</svg>
										<span className="ml-2">
											Enregistrement en cours...
										</span>
									</>
								) : (
									'Enregistrer'
								)}
							</button>
							<button
								className={cx(
									'btn bg-rose-500 hover:bg-rose-600 text-white my-1 w-1/2',
									{
										'cursor-not-allowed': editLoading,
										'opacity-50': editLoading
									}
								)}
								onClick={() => setEdit(true)}
							>
								Annuler la modification
							</button>
						</div>
					)}
				</>
			)}
			{data.possible_actions.pending_manager_approval === true && (
				<>
					<hr className="my-1 border-t border-slate-200" />
					<div className={'flex space-x-1'}>
						<button
							className="btn bg-emerald-500 hover:bg-emerald-600 text-white my-1 w-1/2"
							onClick={() => {
								changeState('approve_manager');
							}}
						>
							Transmettre au département juridique
						</button>
						<button
							className={cx(
								'btn border-slate-200 hover:bg-rose-600 hover:text-white text-slate-600 my-1 w-1/2'
							)}
							onClick={() => changeState('reject_manager')}
						>
							Rejeter la demande
						</button>
					</div>
				</>
			)}
			{data.possible_actions.pending_legal_department_manager_approval ===
				true && (
				<>
					<hr className="my-1 border-t border-slate-200" />
					{!showUsersJuridiquesSelect ? (
						<button
							className="btn bg-emerald-500 hover:bg-emerald-600 text-white my-1 w-full"
							onClick={() => {
								setShowUsersJuridiquesSelect(true);
							}}
						>
							Affecter la demande de contrat à un agent
						</button>
					) : (
						<div className={'flex space-x-1'}>
							<select
								id="country"
								className="form-select w-1/2"
								onChange={(e) => {
									if (e.target.value !== 'null') {
										setSelectedUserJuridique(
											e.target.value
										);
									}
								}}
							>
								<option value="null">
									Sélectionner un agent
								</option>
								{usersJuridiques.map((user) => (
									<option
										value={user.value}
										key={user.value}
										/* Select first per default */
									>
										{user.label}
									</option>
								))}
							</select>
							<div className="w-1/2 flex space-x-1">
								<button
									className={cx('btn my-1 w-1/2', {
										'cursor-not-allowed text-emerald-500 border-slate-200 hover:border-slate-300':
											selectedUserJuridique === null,
										'bg-emerald-500 hover:bg-emerald-600 text-white':
											selectedUserJuridique != null
									})}
									onClick={() => {
										assignToUserJuridique();
									}}
								>
									Valider
								</button>
								<button
									className={cx(
										'btn border-slate-200 hover:bg-rose-600 hover:text-white text-slate-600 my-1 w-1/2'
									)}
									onClick={() =>
										setShowUsersJuridiquesSelect(false)
									}
								>
									Annuler
								</button>
							</div>
						</div>
					)}
				</>
			)}
			{data.possible_actions.pending_agent_approval === true && (
				<>
					<hr className="my-1 border-t border-slate-200" />
					<button
						className="btn bg-emerald-500 hover:bg-emerald-600 text-white my-1 w-full"
						onClick={() => {
							changeState(
								data.possible_actions
									.pending_legal_department_manager_approval ===
									true
									? 'approve_legal_department'
									: 'approve_agent'
							);
						}}
					>
						Valider la demande de contrat
					</button>
					<button
						className="btn bg-rose-500 hover:bg-rose-600 text-white my-1 w-full"
						onClick={() => {
							changeState(
								data.possible_actions
									.pending_legal_department_manager_approval ===
									true
									? 'reject_legal_department'
									: 'reject_agent'
							);
						}}
					>
						Refuser la demande de contrat
					</button>
				</>
			)}
		</div>
	);
};
