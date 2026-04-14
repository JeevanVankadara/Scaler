import { useState } from 'react';
import NavBar from './components/NavBar';
import CategoryNav from './components/CategoryNav';
import CategoryContent from './components/CategoryContent';

export default function Home() {
    const [selected, setSelected] = useState('for-you');

    return (
        <div className="min-h-screen bg-[#ffffff]">
            <NavBar cartCount={0} />
            <CategoryNav selected={selected} onSelect={setSelected} />

            <main className="max-w-7xl mx-auto px-10 mt-3">
                <CategoryContent category={selected} />
            </main>
        </div>
    );
}