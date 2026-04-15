import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BestGadgets({
  title = 'Best Gadgets & Appliances',
  bgColor = '#ede7f6',
  items = null,
}) {
  const navigate = useNavigate();

  const defaultItems = [
    { title: 'True Wireless', subtitle: 'Special offer', img: '/product-photos/earphones.webp' },
    { title: 'Smart Watches', subtitle: 'Min. 40% Off', img: '/product-photos/watches.webp' },
    { title: 'Neckband', subtitle: 'Widest Range', img: '/product-photos/Neckbans.webp' },
    { title: 'Trimmers', subtitle: 'Min. 50% Off', img: '/product-photos/Pendrives.webp' },
  ];

  const data = items || defaultItems;

  return (
    <div className="mt-3">
      <div className="rounded-xl p-3 sm:p-4" style={{ backgroundColor: bgColor }}>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-[18px] font-semibold text-[#212121]">{title}</h2>
          <button className="bg-[#111] hover:bg-black text-white rounded-full w-8 h-8 flex items-center justify-center transition">
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div className="bg-white rounded-xl p-3 sm:p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => navigate('/product-details')}
                className="text-left cursor-pointer group"
              >
                <div className="bg-[#f5f5f5] rounded-lg aspect-[4/3] flex items-center justify-center p-3 overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="mt-2 px-0.5">
                  <p className="text-[13px] text-[#212121] leading-tight">{item.title}</p>
                  <p className="text-[13px] font-bold text-[#212121] leading-tight">{item.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
