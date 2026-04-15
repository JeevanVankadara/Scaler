import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function SimilarProducts({ productId }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!productId) return;
    fetch(`${API}/products/similar/${productId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setProducts(data.products.slice(0, 4));
      })
      .catch(() => { });
  }, [productId]);

  if (products.length === 0) return null;

  return (
    <section className="mt-4 bg-white border border-[#ebebeb] rounded-sm px-4 py-5 lg:px-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-[22px] font-semibold text-[#212121]">Similar Products</h2>
          <p className="text-sm text-[#878787] mt-1">More items you might want to check next</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <button
            key={product.id}
            type="button"
            onClick={() => navigate(`/product/${product.id}`)}
            className="text-left border border-[#ededed] rounded-2xl p-4 bg-white hover:shadow-md transition-shadow"
          >
            <div className="bg-[#f8f8f8] rounded-xl aspect-[4/3] flex items-center justify-center p-4">
              <img
                src={product.images?.[0] || '/product-photos/earphones.webp'}
                alt={product.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="mt-3 space-y-1">
              <p className="text-[14px] font-medium text-[#212121] leading-5 truncate">{product.title}</p>
              <p className="text-[13px] text-[#008c48] font-semibold">{product.discountLabel}</p>
              <p className="text-[15px] font-semibold text-[#212121]">₹{product.price.toLocaleString('en-IN')}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}