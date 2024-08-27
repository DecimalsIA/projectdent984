'use client';

import BeePartsComponent from '@/components/BeeParts';
import useGetPartsMarketPlaceByType from '@/hooks/useGetPartsMarketPlaceByType';
import { useParams, useRouter } from 'next/navigation';

const SpecialMarketPage: React.FC = () => {
  const router = useRouter();
  const { category } = useParams();
  const userid = 'System';
  const cat: any = category;
  const { categories, loading, error, loadMore, hasMore } =
    useGetPartsMarketPlaceByType(userid, cat);

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col p-4 w-full">
      <div className="w-full mb-48">
        {loading && (
          <div className="min-h-[100vh] flex flex-row items-center center-block">
            Loading...
          </div>
        )}
        {error && <div>{error}</div>}
        {!loading &&
          categories.length > 0 &&
          categories.map((category, categoryIndex) => (
            <div
              key={`${category.title}-${categoryIndex}`}
              className="category-section"
            >
              <h2 className="m-3">PARTS {category.title} </h2>
              <BeePartsComponent
                partsData={category.parts.map((part, partIndex) => ({
                  ...part,
                  key: `${part.name}-${categoryIndex}-${partIndex}`, // Clave única usando el nombre, índice de categoría y parte
                }))}
                title={false}
              />
            </div>
          ))}
        {hasMore && !loading && (
          <button onClick={loadMore} className="mt-4">
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default SpecialMarketPage;
