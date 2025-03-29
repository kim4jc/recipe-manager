import { Outlet } from 'react-router-dom';
import Header from './header.js';

export default function Layout(){
    return (
        <main className="p-2.5 max-w-2xl mx-auto">
            <Header/>
            <Outlet/>
        </main>
    );
}