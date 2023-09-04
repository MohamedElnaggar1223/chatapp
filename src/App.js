import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';
import Login from './features/auth/Login';
import Settings from './features/settings/Settings';
import SignUp from './features/auth/SignUp';
import Prefetch from './features/auth/Prefetch';
import RenderLogin from './features/auth/RenderLogin';
import Socket from './features/auth/Socket';
import Logout from './features/auth/Logout';
import NewFriend from './features/users/NewFriend';
import { AnimatePresence } from 'framer-motion';

function App() {
	const location = useLocation()

  	return (
		<AnimatePresence mode='wait'>
			<Routes location={location} key={location.key}>
				<Route path='/' element={<Layout />}>
					<Route index element={<PublicLayout />} />
					<Route path='login' element={<Login />} />
					<Route path='signup' element={<SignUp />} />

					<Route element={<RenderLogin />}>
						
							<Route element={<Prefetch />}>
								<Route path='settings'>
									<Route index element={<Settings />} />

								</Route>

								<Route path='messages'>
									<Route index element={<Socket />} />

								</Route>

								<Route path='addfriends'>
									<Route index element={<NewFriend />} />
								
								</Route>

								{/*@ts-ignore */}
								<Route path='logout' element={<Logout />} />
								{/* <Route path='logout' element={<Logout />} /> */}
							</Route>
						
					</Route>

				</Route>
			</Routes>
		</AnimatePresence>
  	)
}

export default App