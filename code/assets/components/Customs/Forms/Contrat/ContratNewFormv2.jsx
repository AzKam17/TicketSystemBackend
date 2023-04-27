import React, { useContext, useEffect } from 'react';

import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import InputTextv2 from '../Fields/InputTextv2';
import InputDropdownv2 from '../Fields/InputDropdownv2';
import InputTextAreav2 from '../Fields/InputTextAreav2';
import InputDatev2 from '../Fields/InputDatev2';
import Dropzone from '../../Dropzone';
import { create } from '../../../../repository/ContratRepository';
import { LogoutContext } from '../../../../providers/LogoutContext';
import { useHistory } from 'react-router-dom';
import { ApiContext } from '../../../../providers/ApiContext';
import { DataProviderContext } from '../../../../providers/DataProvider';
import { AuthContext } from '../../../../providers/AuthContext';

const ContratNewFormv2 = () => {
	const history = useHistory();
	const { Proxy } = useContext(ApiContext);
	const { user } = useContext(AuthContext);
	const { handleSubmit, control } = useForm();
	const onSubmit = (data) => {
		let formData = new FormData();
		Object.keys(data).forEach((key) => {
			formData.append(key, data[key]);
		});
		if (files) {
			Object.keys(files).forEach((key) => {
				formData.append(key, files[key]);
			});
		}
		Proxy()
			.post('/api/contrat/new', formData)
			.then((response) => {
				if (response.status === 200) {
					toast.success('Contrat créé avec succès');
					history.push('/contrat');
				}
			});
	};

	const [typeContrat, setTypeContrat] = React.useState([]);
	const [departement, setDepartement] = React.useState([]);
	const [modeFacturation, setModeFacturation] = React.useState([]);
	const [periodicitePaiement, setPeriodicitePaiement] = React.useState([]);
	const [modePaiement, setModePaiement] = React.useState([]);
	const [modeRenouvellement, setModeRenouvellement] = React.useState([]);
	const [files, setFiles] = React.useState([]);

	useEffect(() => {
		const MonProxy = Proxy();
		MonProxy.get('/api/contrat/type-contrat').then((response) => {
			setTypeContrat(response.data);
		});
		MonProxy.get('/api/account/departement').then((response) => {
			setDepartement(response.data);
		});
		MonProxy.get('/api/contrat/mode-facturation').then((response) => {
			setModeFacturation(response.data);
		});
		MonProxy.get('/api/contrat/periodicite-paiement').then((response) => {
			setPeriodicitePaiement(response.data);
		});
		MonProxy.get('/api/contrat/mode-paiement').then((response) => {
			setModePaiement(response.data);
		});
		MonProxy.get('/api/contrat/mode-renouvellement').then((response) => {
			setModeRenouvellement(response.data);
		});
	}, []);

	return (
		<div className="bg-white p-5 shadow-lg rounded-sm border border-slate-200 mb-5">
			<header className="mb-6">
				<h2 className="text-xl text-slate-800 mb-2">
					Initer{' '}
					{user.is_juridique
						? 'un nouveau contrat'
						: 'une nouvelle demande de contrat'}
					{'.'}
				</h2>
				<p>
					Remplissez les champs ci-dessous pour initier{' '}
					{user.is_juridique
						? 'un nouveau contrat'
						: 'une nouvelle demande de contrat'}
					. Tous les champs sont obligatoires. Les champs laissés
					vides seront remplis par défaut par "Non renseigné".
				</p>
			</header>
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
							disabled={false}
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
								disabled={false}
								data={typeContrat}
								isAnother={true}
							/>
						</div>
						<div className="flex-1">
							{user.role === 'ROLE_USER_JURIDIQUE' ||
							user.role === 'ROLE_MANAGER_JURIDIQUE' ||
							user.role === 'ROLE_ADMIN' ? (
								<InputDropdownv2
									name="departement-initiateur"
									label="Département initiateur"
									control={control}
									disabled={false}
									data={departement}
									isAnother={false}
								/>
							) : (
								<InputTextv2
									name="departement-initiateur"
									label="Département initiateur"
									control={control}
									defaultValue={user.departement}
									disabled={true}
								/>
							)}
						</div>
					</div>
				</div>
				<div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-5">
					<div className="flex-1">
						<InputTextv2
							name={'identite-cocontractant'}
							control={control}
							disabled={false}
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
							disabled={false}
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
							disabled={false}
							label="Date d'entrée en vigueur"
							defaultValue={new Date()}
						/>
					</div>
					<div className="flex-1">
						<InputDatev2
							name={'date-fin-contrat'}
							control={control}
							disabled={false}
							label="Date de fin de contrat"
							defaultValue={new Date()}
						/>
					</div>
					<div className="flex-1">
						<InputDropdownv2
							name="delai-denonciation"
							label="Délai de dénonciation ou de préavis"
							control={control}
							disabled={false}
							isAnother={false}
							data={[
								{ value: 1, label: '1 mois' },
								{ value: 2, label: '2 mois' },
								{ value: 3, label: '3 mois' },
								{ value: 4, label: '4 mois' },
								{ value: 5, label: '5 mois' },
								{ value: 6, label: '6 mois' },
								{ value: 7, label: '7 mois' },
								{ value: 8, label: '8 mois' },
								{ value: 9, label: '9 mois' },
								{ value: 10, label: '10 mois' },
								{ value: 11, label: '11 mois' },
								{ value: 12, label: '12 mois' }
							]}
						/>
					</div>
				</div>
				<div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-5">
					<div className="flex-1">
						<InputDropdownv2
							name={'mode-facturation'}
							label={'Mode de facturation'}
							control={control}
							disabled={false}
							data={modeFacturation}
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
							disabled={false}
							data={periodicitePaiement}
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
							disabled={false}
							data={modePaiement}
							isAnother={true}
						/>
					</div>
				</div>

				<h2 className="text-xl text-slate-800 my-2">
					Conditions de renouvellement
				</h2>
				<hr />
				<div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-5">
					<div className="flex-1">
						<InputDropdownv2
							name={'mode-renouvellement'}
							label={'Mode de renouvellement'}
							control={control}
							disabled={false}
							data={modeRenouvellement}
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
							label={'Objet des conditions de modifications'}
							placeholder={
								'Objet des conditions de modifications'
							}
							control={control}
							disabled={false}
							defaultValue=""
						/>
					</div>
				</div>
				<div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-5">
					<div className="flex-1">
						<InputTextAreav2
							name="details-modification"
							control={control}
							disabled={false}
							label="Détails des conditions de modifications"
							placeholder="Détails des conditions de modifications"
							defaultValue=""
						/>
					</div>
				</div>
				<h2 className="text-xl text-slate-800 my-2">Pièces jointes</h2>
				<p>
					Nous vous recommandons de copier les fichiers dans un
					dossier pour pouvoir les sélectionner plus facilement.
				</p>
				<hr />
				<div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-5">
					<div className="flex-1">
						<Dropzone onChange={(e) => setFiles(e)} />
					</div>
				</div>
				<div className="flex justify-end mt-5">
					<button
						type="submit"
						className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
					>
						Enregistrer
					</button>
				</div>
			</form>
		</div>
	);
};

export default ContratNewFormv2;
