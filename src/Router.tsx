import { useEffect, useState } from 'react';
import App from './App';
import PartsCatalog from './components/PartsCatalog';
import AdminGate from './components/AdminGate';
import ResultsPresentation from './components/ResultsPresentation';
import AdminDashboard from './components/AdminDashboard';
export default function Router(){const [hash,setHash]=useState(window.location.hash);useEffect(()=>{const onHash=()=>setHash(window.location.hash);window.addEventListener('hashchange',onHash);return()=>window.removeEventListener('hashchange',onHash);},[]);return /^#\/parts\/?$/.test(hash)?<PartsCatalog/>:hash.startsWith('#/admin')?<AdminGate>{/^#\/admin\/results\/?$/.test(hash)?<ResultsPresentation/>:<AdminDashboard/>}</AdminGate>:<App/>;}
