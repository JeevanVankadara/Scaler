import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ProductFilters from './components/ProductFilters';
import ProductCard from './components/ProductCard';
import { ChevronRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || 'mobiles';

    return (
        <div className="min-h-screen bg-[#f1f3f6] flex flex-col">
            <NavBar />

            <main className="flex-1">
                <div className="max-w-[1300px] mx-auto flex gap-2 p-2">
                    {/* Left Filter */}
                    <aside className="w-[250px] shrink-0">
                        <ProductFilters />
                    </aside>

                    {/* Right Content */}
                    <div className="flex-1 bg-white shadow-sm">
                        {/* Breadcrumb */}
                        <div className="px-4 pt-3 pb-2 flex items-center gap-1.5 text-xs text-[#878787]">
                            <span className="hover:text-[#2874f0] cursor-pointer">Home</span>
                            <ChevronRight size={14} />
                            <span className="hover:text-[#2874f0] cursor-pointer">Mobiles & Accessories</span>
                            <ChevronRight size={14} />
                            <span className="text-[#212121]">Mobiles</span>
                        </div>

                        <div className="px-4 pb-3">
                            <h1 className="text-sm text-[#212121]">
                                Showing 1 – 24 of 11,204 results for <span className="font-medium">"{query}"</span>
                            </h1>
                        </div>


                        {/* Product List - 6 times */}
                        <div>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <ProductCard key={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}