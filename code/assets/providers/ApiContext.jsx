import React, { createContext, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { useHistory } from 'react-router-dom';

const API_PREFIX = '/api';

export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
	const history = useHistory();
	const { Logout, jwt } = useContext(AuthContext);
	const Proxy = () => {
		const instance = axios.create();

		instance.interceptors.request.use(
			(config) => {
				config.headers['Authorization'] = `Bearer ${jwt}`;
				return config;
			},
			(error) => Promise.reject(error)
		);

		instance.interceptors.response.use(
			// If status is 401, logout
			(response) => {
				return response;
			},
			(error) => {
				console.log('err', error);
				if (error.response.status === 401) {
					Logout(() => {
						localStorage.removeItem('jwt');
						window.location.pathname = '/connexion';
					}, true);
				}
				return Promise.reject(error);
			}
		);

		return instance;
	};

	return (
		<ApiContext.Provider value={{ Proxy }}>{children}</ApiContext.Provider>
	);
};
