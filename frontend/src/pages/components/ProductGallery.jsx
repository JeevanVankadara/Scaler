import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductGallery({ images, productName }) {
  const safeImages = useMemo(() => images?.length ? images : ['/product-photos/earphones.webp'], [images]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [safeImages]);

  const activeImage = safeImages[selectedIndex];

  const showPrevious = () => {
    setSelectedIndex((current) => (current === 0 ? safeImages.length - 1 : current - 1));
  };

  const showNext = () => {
    setSelectedIndex((current) => (current === safeImages.length - 1 ? 0 : current + 1));
  };

  return (
    <div className="relative lg:sticky top-20">
      <div className="bg-white border border-[#e8e8e8] rounded-sm p-5 lg:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="min-h-[360px] md:min-h-[470px] flex items-center justify-center bg-[#ffffff]">
          <img
            src={activeImage}
            alt={productName}
            className="max-h-[380px] md:max-h-[430px] w-full object-contain"
          />
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={showPrevious}
            className="h-12 w-12 flex items-center justify-center rounded-full text-[#b2b2b2] hover:text-[#2874f0] transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="flex items-center gap-4 overflow-x-auto px-1 py-1">
            {safeImages.map((image, index) => {
              const isActive = index === selectedIndex;

              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={`w-[92px] h-[112px] shrink-0 border rounded-sm bg-white p-2 transition-all ${
                    isActive
                      ? 'border-[#2874f0] shadow-[0_0_0_1px_#2874f0]'
                      : 'border-[#ededed] hover:border-[#bdbdbd]'
                  }`}
                  aria-label={`Show image ${index + 1}`}
                >
                  <img src={image} alt={`${productName} thumbnail ${index + 1}`} className="w-full h-full object-contain" />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={showNext}
            className="h-12 w-12 flex items-center justify-center rounded-full text-[#b2b2b2] hover:text-[#2874f0] transition-colors"
            aria-label="Next image"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
