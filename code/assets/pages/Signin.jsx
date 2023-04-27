import React, { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import AuthImage from '../images/auth-image.jpg';
import Banner2 from '../components/Banner2';
import { AuthContext } from '../providers/AuthContext';

function Signin() {
	const { Login } = useContext(AuthContext);
	const [identifiant, setIdentifiant] = useState('');
	const [password, setPassword] = React.useState('');
	const [error, setError] = React.useState('');
	const [loading, setLoading] = React.useState(false);

	const history = useHistory();

	//On mount change page title
	React.useEffect(() => {
		document.title = 'Connexion - Iska Contrat';
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');
		const res = await Login(
			identifiant,
			password,
			() => {
				setLoading(true);
				console.log('Logging in...');
			},
			() => {
				localStorage.removeItem('jwt-expired');
				console.log('Logged in!');
				history.push('/');
			},
			(error) => {
				setError(error);
				console.log(error);
				setLoading(false);
				console.log('Error logging in!');
			}
		);
		console.log(res);
	};

	return (
		<main className="bg-white">
			<div className="relative md:flex">
				{/* Content */}
				<div className="md:w-1/2">
					<div className="min-h-screen h-full flex flex-col after:flex-1">
						{/* Header */}
						<div className="flex-1">
							<div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
								{/* Logo */}
								<Link className="block" to="/">
									<svg
										width="32"
										height="32"
										viewBox="0 0 32 32"
									>
										<defs>
											<linearGradient
												x1="28.538%"
												y1="20.229%"
												x2="100%"
												y2="108.156%"
												id="logo-a"
											>
												<stop
													stopColor="#A5B4FC"
													stopOpacity="0"
													offset="0%"
												/>
												<stop
													stopColor="#A5B4FC"
													offset="100%"
												/>
											</linearGradient>
											<linearGradient
												x1="88.638%"
												y1="29.267%"
												x2="22.42%"
												y2="100%"
												id="logo-b"
											>
												<stop
													stopColor="#38BDF8"
													stopOpacity="0"
													offset="0%"
												/>
												<stop
													stopColor="#38BDF8"
													offset="100%"
												/>
											</linearGradient>
										</defs>
										<rect
											fill="#6366F1"
											width="32"
											height="32"
											rx="16"
										/>
										<path
											d="M18.277.16C26.035 1.267 32 7.938 32 16c0 8.837-7.163 16-16 16a15.937 15.937 0 01-10.426-3.863L18.277.161z"
											fill="#4F46E5"
										/>
										<path
											d="M7.404 2.503l18.339 26.19A15.93 15.93 0 0116 32C7.163 32 0 24.837 0 16 0 10.327 2.952 5.344 7.404 2.503z"
											fill="url(#logo-a)"
										/>
										<path
											d="M2.223 24.14L29.777 7.86A15.926 15.926 0 0132 16c0 8.837-7.163 16-16 16-5.864 0-10.991-3.154-13.777-7.86z"
											fill="url(#logo-b)"
										/>
									</svg>
								</Link>
							</div>
						</div>

						<div className="max-w-sm mx-auto px-4 py-8">
							<h1 className="text-3xl text-slate-800 font-bold mb-6">
								Ravi de vous revoir !
							</h1>
							{/* Display error if any */}
							{error && (
								<div
									className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
									role="alert"
								>
									<span className="block sm:inline">
										{error}
									</span>
								</div>
							)}

							<Banner2
								open={true}
								setOpen={localStorage.getItem('jwt-expired')}
								className="mb-2"
							>
								Votre session a expiré, veuillez vous
								reconnecter.
							</Banner2>
							{/* Form */}
							<form onSubmit={handleSubmit}>
								<div className="space-y-4">
									<div>
										<label
											className="block text-sm font-medium mb-1"
											htmlFor="email"
										>
											Identifiant
										</label>
										<input
											id="identifiant"
											className="form-input w-full"
											type="text"
											onChange={(e) =>
												setIdentifiant(e.target.value)
											}
										/>
									</div>
									<div>
										<label
											className="block text-sm font-medium mb-1"
											htmlFor="password"
										>
											Mot de passe
										</label>
										<input
											id="password"
											className="form-input w-full"
											type="password"
											autoComplete="on"
											onChange={(e) =>
												setPassword(e.target.value)
											}
										/>
									</div>
								</div>
								<div className="flex items-center justify-between mt-6">
									<div className="mr-1">
										<Link
											className="text-sm underline hover:no-underline"
											to="/reset-password"
										>
											Mot de passe oublié ?
										</Link>
									</div>
									{/* Animate button when loading */}
									<button
										className={`btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3 ${
											loading
												? 'disabled:cursor-not-allowed disabled:opacity-50'
												: ''
										}`}
										type="submit"
										disabled={loading}
									>
										{loading ? (
											<>
												<svg
													className="animate-spin w-4 h-4 fill-current shrink-0"
													viewBox="0 0 16 16"
												>
													<path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
												</svg>
												<span className="ml-2">
													Connexion...
												</span>
											</>
										) : (
											'Se connecter'
										)}
									</button>
								</div>
							</form>
							{/* Footer */}
							<div className="pt-5 mt-6 border-t border-slate-200">
								<div className="text-sm">
									Vous n'avez pas de compte?
									<br />
									<span className="font-medium text-indigo-500 hover:text-indigo-600">
										Contactez votre administrateur
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Image */}
				<div
					className="hidden md:block absolute top-0 bottom-0 right-0 md:w-1/2"
					aria-hidden="true"
				>
					<img
						className="object-cover object-center w-full h-full"
						src={AuthImage}
						width="760"
						height="1024"
						alt="Authentication"
					/>
				</div>
			</div>
		</main>
	);
}

export default Signin;
