import { useEffect, useState } from 'react';
import App from './App';
import AdminDashboard from './components/AdminDashboard';
export default function Router(){const [hash,setHash]=useState(window.location.hash);useEffect(()=>{const onHash=()=>setHash(window.location.hash);window.addEventListener('hashchange',onHash);return()=>window.removeEventListener('hashchange',onHash);},[]);return hash.startsWith('#/admin')?<AdminDashboard/>:<App/>;}
