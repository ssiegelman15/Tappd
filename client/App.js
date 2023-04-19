import React, { useState, useEffect } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Feed from './pages/Feed/Feed';
import MobileNav from './components/nav/Nav';

import Home from './pages/Home/Home';
import Profile from './pages/Profile';
import Welcome from './components/HomePage/HomePage';
import FavoriteMovies from './components/FavoriteMovies/';
import SearchBar from './components/SearchBar/SearchBar';

// import axios
import axios from 'axios';

export const AppContext = React.createContext();
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export function App() {
	// Declare a new state variable called "results"
	const [details, setDetails] = useState([]);
	const [trailer, setTrailer] = useState('8trTO5mJYsg');
	const [APIErrors, setAPIErrors] = useState(null);

	// Get movie & trailer data from API
	// Add error catching for movies that don't have trailer videos & add rendering of something to show there's no trailer
	const searchMovie = async (query) => {
		console.log(query);
		const response = await axios.get(
			`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${query}&page=1&include_adult=false`
		);

		if (response.data.results.length === 0) {
			console.warn(`No results found for ${query}`);
			setAPIErrors(`No results found for ${query}`);
			return undefined;
		}

		setDetails(response?.data?.results[0]);

		const responseTwo = await axios.get(
			`https://api.themoviedb.org/3/movie/${response.data.results[0].id}/videos?api_key=${API_KEY}&language=en-US`
		);

		if (responseTwo.data.results.length) {
			setTrailer(responseTwo.data.results[0].key);
		} else {
			setTrailer('');
		}

		return { details: response.data.results[0], trailer: responseTwo.data.results[0].key };
	};

	useEffect(() => {
		searchMovie('Kill Bill');
	}, []);

	const globalState = {
		details: details,
		trailer: trailer,
		searchMovie
	};

	return (
		<AppContext.Provider value={globalState}>
			<ApolloProvider client={client}>
				<Router>
					<MobileNav />
					<Routes>
						<Route path="/" element={<Welcome />} />
						<Route
							path="/home"
							element={
								<>
									<SearchBar errors={APIErrors} setAPIErrors={setAPIErrors} />
									<Home />
								</>
							}
						/>

						<Route
							path="/feed"
							element={
								<>
									<Feed />
								</>
							}
						/>
						<Route
							path="/profile"
							element={
								<>
									<Profile />
								</>
							}
						/>
						<Route path="/profiles/:username" element={<Profile />} />
						<Route
							path="/FavoriteMovies"
							element={
								<>
									<FavoriteMovies />
								</>
							}
						/>
					</Routes>
				</Router>
			</ApolloProvider>
		</AppContext.Provider>
	);
}
