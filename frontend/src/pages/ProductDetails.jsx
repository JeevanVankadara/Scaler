import { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, MapPin, Star, Truck } from 'lucide-react';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ProductGallery from './components/ProductGallery';
import StickyBuyBar from './components/StickyBuyBar';
import SimilarProducts from './components/SimilarProducts';

const productImages = [
  '/product-photos/earphones.webp',
  '/product-photos/watches.webp',
  '/product-photos/Neckbans.webp',
  '/product-photos/Pendrives.webp',
];

const colorOptions = [
  { name: 'Black', image: '/product-photos/Pendrives.webp' },
  { name: 'Navy', image: '/product-photos/earphones.webp' },
  { name: 'Silver', image: '/product-photos/watches.webp' },
];

const variantOptions = [
  {
    label: '128 GB + 8 GB',
    inStock: true,
    price: 44999,
    originalPrice: 59999,
    discountLabel: '25% off',
  },
  {
    label: '512 GB + 8 GB',
    inStock: false,
  },
];

const highlights = [
  '8 GB RAM | 128 GB ROM',
  'Smooth display for streaming and scrolling',
  'Powerful camera setup for casual photography',
  'Reliable battery backup for day-long use',
  'Premium finish with comfortable in-hand feel',
  'Fast daily performance for apps and multitasking',
];

const description = [
  'This is a static product details page for now, built to match the layout and feel you wanted while using the available images from the public folder.',
  'The product copy is intentionally simple and random for placeholder use, with enough content to make the right side feel complete until real API data is connected later.',
  'You can now click on products from the home gadget cards or the search results list and land on this same styled details page.',
];

function formatPrice(value) {
  return `Rs. ${value.toLocaleString('en-IN')}`;
}

export default function ProductDetails() {
  const [selectedColor, setSelectedColor] = useState('Navy');
  const [selectedVariant, setSelectedVariant] = useState('128 GB + 8 GB');

  const activeVariant = useMemo(
    () => variantOptions.find((variant) => variant.label === selectedVariant) || variantOptions[0],
    [selectedVariant]
  );

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex flex-col">
      <NavBar />

      <main className="flex-1">
        <div className="max-w-[1440px] mx-auto px-3 py-3 lg:px-4 lg:py-5">
          <div className="bg-white border border-[#ebebeb]">
            <div className="px-4 py-3 text-xs text-[#878787] flex flex-wrap items-center gap-1.5 border-b border-[#f0f0f0]">
              <span>Home</span>
              <ChevronRight size={14} />
              <span>Mobiles & Accessories</span>
              <ChevronRight size={14} />
              <span>Mobiles</span>
              <ChevronRight size={14} />
              <span className="text-[#212121]">Samsung Galaxy S25 FE</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.06fr)_minmax(360px,500px)] gap-8 px-4 py-5 lg:px-6 lg:py-6">
              <div>
                <ProductGallery images={productImages} productName="Samsung Galaxy S25 FE 5G" />
              </div>

              <div className="min-h-0">
                <div className="flex flex-col h-full max-h-[calc(100vh-140px)]">
                  <div className="flex-1 overflow-y-auto pr-1 lg:pr-3 space-y-7">
                    <section>
                      <h2 className="text-[17px] font-semibold text-[#212121] mb-3">
                        Selected Color: <span className="font-normal">{selectedColor}</span>
                      </h2>
                      <div className="flex flex-wrap gap-3">
                        {colorOptions.map((color) => {
                          const isActive = selectedColor === color.name;

                          return (
                            <button
                              key={color.name}
                              type="button"
                              onClick={() => setSelectedColor(color.name)}
                              className={`w-[108px] h-[108px] border rounded-2xl p-2 bg-white transition-all ${
                                isActive
                                  ? 'border-[#212121] shadow-[0_0_0_1px_#212121]'
                                  : 'border-[#d9d9d9] hover:border-[#999999]'
                              }`}
                            >
                              <img src={color.image} alt={color.name} className="w-full h-full object-contain" />
                            </button>
                          );
                        })}
                      </div>
                    </section>

                    <section>
                      <h2 className="text-[17px] font-semibold text-[#212121] mb-3">
                        Variant: <span className="font-normal">{selectedVariant}</span>
                      </h2>
                      <div className="flex flex-wrap gap-3">
                        {variantOptions.map((variant) => {
                          const isActive = selectedVariant === variant.label;

                          return (
                            <button
                              key={variant.label}
                              type="button"
                              onClick={() => variant.inStock && setSelectedVariant(variant.label)}
                              className={`min-w-[192px] rounded-2xl border px-4 py-3 text-left transition-all ${
                                isActive
                                  ? 'border-[#212121] bg-[#f8fbff]'
                                  : 'border-[#d9d9d9]'
                              } ${variant.inStock ? 'hover:border-[#666666]' : 'opacity-80 cursor-not-allowed'}`}
                            >
                              <div className="text-[15px] font-semibold text-[#212121]">{variant.label}</div>
                              {variant.inStock ? (
                                <>
                                  <div className="mt-2 text-sm">
                                    <span className="text-[#008c48] font-semibold">{variant.discountLabel}</span>{' '}
                                    <span className="text-[#878787] line-through">{formatPrice(variant.originalPrice)}</span>
                                  </div>
                                  <div className="text-[17px] font-semibold text-[#212121]">{formatPrice(variant.price)}</div>
                                </>
                              ) : (
                                <div className="text-[#ff6161] text-[15px] mt-4">Out of stock</div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </section>

                    <section>
                      <span className="text-[#2874f0] text-sm font-semibold">Visit brand store</span>
                      <h1 className="mt-2 text-[24px] lg:text-[30px] leading-[1.3] font-normal text-[#212121]">
                        Samsung Galaxy S25 FE 5G (Navy, 128 GB) (8 GB RAM)
                      </h1>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="bg-[#388e3c] text-white text-sm px-2 py-1 rounded-md flex items-center gap-1 font-semibold">
                          4.6 <Star size={14} fill="white" strokeWidth={1.5} />
                        </span>
                        <span className="text-[#878787] text-[15px]">156</span>
                      </div>
                    </section>

                    <section>
                      <span className="inline-flex bg-[#008c48] text-white text-sm font-semibold px-3 py-1 rounded-md">
                        Hot Deal
                      </span>
                      <div className="mt-4 flex items-baseline gap-3 flex-wrap">
                        <span className="text-[#008c48] text-[19px] lg:text-[22px] font-semibold">25% off</span>
                        <span className="text-[#878787] text-[22px] lg:text-[24px] line-through">Rs. 59,999</span>
                        <span className="text-[#212121] text-[38px] lg:text-[46px] leading-none font-semibold">{formatPrice(activeVariant?.price || 44999)}</span>
                      </div>
                      <p className="mt-3 text-[15px] text-[#5f6368]">
                        +Rs. 199 Protect Promise Fee <ChevronRight size={16} className="inline" />
                      </p>
                    </section>

                    <section>
                      <h2 className="text-[18px] lg:text-[20px] font-semibold text-[#212121] mb-4">Delivery details</h2>
                      <div className="overflow-hidden rounded-2xl border border-[#ebebeb] bg-white">
                        <div className="bg-[#f0f7ff] px-4 py-4 flex flex-wrap items-center gap-2 text-[15px]">
                          <MapPin size={16} className="text-[#5f6368]" />
                          <span className="font-medium text-[#212121]">Location not set</span>
                          <button type="button" className="text-[#2874f0] font-semibold">Select delivery location</button>
                        </div>
                        <div className="px-4 py-4 border-t border-[#f0f0f0] bg-[#fafafa]">
                          <div className="flex items-center gap-2 font-semibold text-[#212121]">
                            <Truck size={18} />
                            <span>Delivery by 18 Apr, Sat</span>
                          </div>
                          <div className="ml-7 mt-1 text-[#e46b26] text-sm">Order in 01h 36m 39s</div>
                        </div>
                        <div className="px-4 py-4 border-t border-[#f0f0f0] bg-white">
                          <div className="text-[15px] font-medium text-[#212121]">Fulfilled by Flashstar Commerce</div>
                          <div className="text-sm text-[#5f6368] mt-1">4.6 stars | 8 years with Flipkart</div>
                          <button type="button" className="text-[#2874f0] text-sm font-semibold mt-2">See other sellers</button>
                        </div>
                      </div>
                    </section>

                    <section>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[18px] lg:text-[20px] font-semibold text-[#212121]">Product highlights</h2>
                        <ChevronDown size={18} className="text-[#5f6368] rotate-180" />
                      </div>
                      <div className="space-y-4">
                        {highlights.map((highlight) => (
                          <div key={highlight} className="flex items-start gap-3 text-[16px] text-[#212121]">
                            <span className="mt-1 text-[#5f6368]">•</span>
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h2 className="text-[18px] lg:text-[20px] font-semibold text-[#212121] mb-4">Description</h2>
                      <div className="space-y-3 text-[16px] leading-7 text-[#212121]">
                        {description.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    </section>

                    <div className="h-6" />
                  </div>

                  <StickyBuyBar price={activeVariant?.price || 44999} />
                </div>
              </div>
            </div>
          </div>

          <SimilarProducts />
        </div>
      </main>

      <Footer />
    </div>
  );
}
