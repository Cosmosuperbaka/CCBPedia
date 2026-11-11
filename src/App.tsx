import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { TournamentsPage } from './pages/TournamentsPage';
import { TournamentPage } from './pages/TournamentPage';
import { PlayersPage } from './pages/PlayersPage';
import { PlayerPage } from './pages/PlayerPage';
import { RankingsPage } from './pages/RankingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="tournaments" element={<TournamentsPage />} />
        <Route path="tournaments/:id" element={<TournamentPage />} />
        <Route path="players" element={<PlayersPage />} />
        <Route path="players/:name" element={<PlayerPage />} />
        <Route path="rankings" element={<RankingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
