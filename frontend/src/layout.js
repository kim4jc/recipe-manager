import { Outlet } from 'react-router-dom';
import Header from './header.js';

export default function Layout({ headerUsername, setHeaderUsername }){
    return (
        <main className="p-2.5 max-w-full mx-auto">
            <Header headerUsername={headerUsername} setHeaderUsername={setHeaderUsername}/>
            <Outlet/>
        </main>
    );
}