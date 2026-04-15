import { useNavigate } from 'react-router-dom';

const similarProducts = [
  {
    title: 'True Wireless Earbuds',
    subtitle: 'Special offer',
    image: '/product-photos/earphones.webp',
    price: 'Rs. 2,999',
  },
  {
    title: 'Smart Watch',
    subtitle: 'Min. 40% Off',
    image: '/product-photos/watches.webp',
    price: 'Rs. 1,999',
  },
  {
    title: 'Wireless Neckband',
    subtitle: 'Widest Range',
    image: '/product-photos/Neckbans.webp',
    price: 'Rs. 1,499',
  },
  {
    title: 'USB Pen Drive',
    subtitle: 'Min. 50% Off',
    image: '/product-photos/Pendrives.webp',
    price: 'Rs. 899',
  },
];

export default function SimilarProducts() {
  const navigate = useNavigate();

  return (
    <section className="mt-4 bg-white border border-[#ebebeb] rounded-sm px-4 py-5 lg:px-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-[22px] font-semibold text-[#212121]">Similar Products</h2>
          <p className="text-sm text-[#878787] mt-1">More items you might want to check next</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {similarProducts.map((product) => (
          <button
            key={product.title}
            type="button"
            onClick={() => navigate('/product-details')}
            className="text-left border border-[#ededed] rounded-2xl p-4 bg-white hover:shadow-md transition-shadow"
          >
            <div className="bg-[#f8f8f8] rounded-xl aspect-[4/3] flex items-center justify-center p-4">
              <img
                src={product.image}
                alt={product.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="mt-3 space-y-1">
              <p className="text-[14px] font-medium text-[#212121] leading-5">{product.title}</p>
              <p className="text-[13px] text-[#008c48] font-semibold">{product.subtitle}</p>
              <p className="text-[15px] font-semibold text-[#212121]">{product.price}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
