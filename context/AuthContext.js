import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { BASE_URL } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [userToken, setUserToken] = useState(null);
	const [userInfo, setUserInfo] = useState(null);

	const login = (name, password) => {
		setIsLoading(true);

		axios
			.post(`${BASE_URL}/admin/login`, {
				name: name,
				password: password,
			})
			.then((res) => {
				let userInfo = res.data;
				setUserInfo(userInfo);
				setUserToken(userInfo.token);

				AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
				AsyncStorage.setItem('userToken', userInfo.token);

				console.log(userInfo.token);
			})
			.catch((e) => {
				console.log(`login : ${e}`);
			});
		setIsLoading(false);
	};

	const logout = () => {
		setIsLoading(true);
		setUserToken(null);
		AsyncStorage.removeItem('userInfo');
		AsyncStorage.removeItem('userToken');
		setIsLoading(false);
	};

	const isLoggedIn = async () => {
		try {
			setIsLoading(true);
			let userInfo = await AsyncStorage.getItem('userToken');
			let userToken = await AsyncStorage.getItem('userToken');
			userInfo = JSON.parse(userInfo);

			if (userInfo) {
				setUserToken(userToken);
				setUserToken(userInfo);
			}

			setIsLoading(false);
		} catch (e) {
			console.log(`isLogged in error ${e}`);
		}
	};

	useEffect(() => {
		isLoggedIn();
	}, []);

	return (
		<AuthContext.Provider value={{ login, logout, isLoading, userToken }}>
			{children}
		</AuthContext.Provider>
	);
};
