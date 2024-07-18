'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const InitPage: React.FC = () => {
  const [param, setParam] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const paramValue = searchParams.get('param');
    setParam(paramValue);
  }, [searchParams]);

  return (
    <div>
      <h1>Telegram WebApp</h1>
      {param && (
        <div>
          <p>Parámetro recibido: {param}</p>
        </div>
      )}
    </div>
  );
};

export default InitPage;
