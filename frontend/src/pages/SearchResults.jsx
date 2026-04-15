import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ProductFilters from './components/ProductFilters';
import ProductCard from './components/ProductCard';
import { ChevronRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const staticProducts = [
  {
    title: 'Samsung Galaxy S25 FE 5G (Navy, 128 GB) (8 GB RAM)',
    image: '/product-photos/earphones.webp',
    rating: 4.6,
    reviews: '156 Ratings',
    highlights: [
      '8 GB RAM | 128 GB ROM',
      '6.7 inch Dynamic AMOLED 2X Display',
      '50MP + 12MP + 8MP Rear Camera',
      '12MP Front Camera',
      '4900 mAh Battery',
      'Fast performance for daily use',
    ],
    price: 44999,
    originalPrice: 59999,
    discountLabel: '25% off',
    exchangeValue: 32700,
  },
  {
    title: 'Noise Smart Watch (Classic Black Strap)',
    image: '/product-photos/watches.webp',
    rating: 4.1,
    reviews: '2,301 Ratings',
    highlights: [
      '1.8 inch Display',
      'Bluetooth Calling',
      'Heart Rate Monitoring',
      '100+ Sports Modes',
      'Up to 7 Days Battery',
      'IP68 Water Resistance',
    ],
    price: 2999,
    originalPrice: 5999,
    discountLabel: '50% off',
    exchangeValue: 900,
  },
  {
    title: 'Wireless Neckband Earphones (Deep Black)',
    image: '/product-photos/Neckbans.webp',
    rating: 4.3,
    reviews: '8,403 Ratings',
    highlights: [
      'Strong bass sound',
      'Long battery backup',
      'Comfort-fit neckband design',
      'Fast charging support',
      'Clear calling microphone',
      'Lightweight daily use design',
    ],
    price: 1499,
    originalPrice: 2499,
    discountLabel: '40% off',
    exchangeValue: 250,
  },
  {
    title: 'HP USB 3.2 Pen Drive (256 GB, Black)',
    image: '/product-photos/Pendrives.webp',
    rating: 4.2,
    reviews: '3,812 Ratings',
    highlights: [
      '256 GB Storage',
      'USB 3.2 High Speed Transfer',
      'Compact metal body',
      'Works with laptops and desktops',
      'Easy plug and play',
      'Portable everyday storage',
    ],
    price: 899,
    originalPrice: 1499,
    discountLabel: '40% off',
    exchangeValue: 200,
  },
];

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || 'mobiles';

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex flex-col">
      <NavBar />

      <main className="flex-1">
        <div className="max-w-[1300px] mx-auto flex gap-2 p-2">
          <aside className="w-[250px] shrink-0 hidden lg:block">
            <ProductFilters />
          </aside>

          <div className="flex-1 bg-white shadow-sm">
            <div className="px-4 pt-3 pb-2 flex items-center gap-1.5 text-xs text-[#878787]">
              <span className="hover:text-[#2874f0] cursor-pointer">Home</span>
              <ChevronRight size={14} />
              <span className="hover:text-[#2874f0] cursor-pointer">Mobiles & Accessories</span>
              <ChevronRight size={14} />
              <span className="text-[#212121]">Mobiles</span>
            </div>

            <div className="px-4 pb-3">
              <h1 className="text-sm text-[#212121]">
                Showing 1 - {staticProducts.length} of {staticProducts.length} results for{' '}
                <span className="font-medium">"{query}"</span>
              </h1>
            </div>

            <div>
              {staticProducts.map((product) => (
                <ProductCard key={product.title} product={product} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
