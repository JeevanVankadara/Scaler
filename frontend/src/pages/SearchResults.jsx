import { useState, useEffect, useMemo } from 'react';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ProductFilters from './components/ProductFilters';
import ProductCard from './components/ProductCard';
import { ChevronRight } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';

  // All products for current query/category (before brand/price/sort filters)
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Client-side filters
  const [sortOrder, setSortOrder] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [maxPrice, setMaxPrice] = useState(100000);

  // Reset filters when query or category changes
  useEffect(() => {
    setSortOrder('');
    setSelectedBrands([]);
    setMaxPrice(100000);
  }, [query, categoryParam]);

  // Fetch products — only by query + category (no brand/price/sort sent to API)
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (categoryParam) params.set('category', categoryParam);

    fetch(`${API}/products?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setAllProducts(data.products);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [query, categoryParam]);

  // Derive all unique brands from the FULL result set (not the filtered one)
  const brands = useMemo(() => {
    const set = new Set(allProducts.map((p) => p.brand));
    return [...set].sort();
  }, [allProducts]);

  // Apply client-side brand, price, and sort filters
  const filteredProducts = useMemo(() => {
    let results = [...allProducts];

    // Brand filter
    if (selectedBrands.length > 0) {
      const lowerBrands = selectedBrands.map((b) => b.toLowerCase());
      results = results.filter((p) => lowerBrands.includes(p.brand.toLowerCase()));
    }

    // Price filter
    if (maxPrice < 100000) {
      results = results.filter((p) => p.price <= maxPrice);
    }

    // Sort
    if (sortOrder === 'low-high') results.sort((a, b) => a.price - b.price);
    else if (sortOrder === 'high-low') results.sort((a, b) => b.price - a.price);

    return results;
  }, [allProducts, selectedBrands, maxPrice, sortOrder]);

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex flex-col">
      <NavBar />
      <main className="flex-1">
        <div className="max-w-[1300px] mx-auto flex flex-col lg:flex-row gap-2 p-0 sm:p-2 border-t sm:border-0 border-gray-200">
          <aside className="w-full lg:w-[250px] shrink-0">
            <ProductFilters
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
              brands={brands}
              selectedBrands={selectedBrands}
              onBrandChange={setSelectedBrands}
              maxPrice={maxPrice}
              onPriceChange={setMaxPrice}
            />
          </aside>

          <div className="flex-1 bg-white shadow-sm">
            <div className="px-4 pt-3 pb-2 flex items-center gap-1.5 text-xs text-[#878787]">
              <Link to="/" className="hover:text-[#2874f0] cursor-pointer">Home</Link>
              <ChevronRight size={14} />
              <span className="text-[#212121]">Search Results</span>
            </div>

            <div className="px-4 pb-3">
              <h1 className="text-sm text-[#212121]">
                {loading
                  ? 'Searching...'
                  : `Showing 1 - ${filteredProducts.length} of ${filteredProducts.length} results for `}
                <span className="font-medium">"{query || categoryParam}"</span>
              </h1>
            </div>

            <div>
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-4 border-[#2874f0] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20 text-[#878787]">
                  <p className="text-lg">No products found</p>
                  <p className="text-sm mt-1">Try a different search term or adjust filters</p>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}