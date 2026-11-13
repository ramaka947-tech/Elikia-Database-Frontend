// Routes de l'application (fichier partagé, géré par Rama)
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Repertoire from './pages/Repertoire.jsx';
import Fiche from './pages/Fiche.jsx';
import CompanyForm from './pages/CompanyForm.jsx';
import Import from './pages/Import.jsx';
import MesListes from './pages/MesListes.jsx';
import ListeDetail from './pages/ListeDetail.jsx';
import Profil from './pages/Profil.jsx';
import Utilisateurs from './pages/Utilisateurs.jsx';
import NotFound from './pages/NotFound.jsx';
import Legal from './pages/Legal.jsx';
import Messages from './pages/Messages.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/inscription" element={<Register />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/conditions" element={<Legal type="conditions" />} />
      <Route path="/confidentialite" element={<Legal type="confidentialite" />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/tableau-de-bord" element={<Dashboard />} />
          <Route path="/entreprises" element={<Repertoire />} />
          <Route path="/entreprises/:id" element={<Fiche />} />
          <Route path="/listes" element={<MesListes />} />
          <Route path="/listes/:id" element={<ListeDetail />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:id" element={<Messages />} />

          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/entreprises/nouveau" element={<CompanyForm />} />
            <Route path="/entreprises/:id/modifier" element={<CompanyForm />} />
            <Route path="/admin/import" element={<Import />} />
            <Route path="/admin/utilisateurs" element={<Utilisateurs />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
