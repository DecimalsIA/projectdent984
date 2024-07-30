import { NextRequest, NextResponse } from 'next/server';
import { getAllDocuments } from '@/utils/firebase';

type Document = {
  payout: number;
  valuePambii: number;
  mapNumber: number;
};

export async function POST(req: NextRequest) {
  try {
    const { mapNumber } = await req.json();

    const poolValue: Document[] = await getAllDocuments('PoolMaps') as Document[];
    const filteredDocuments = poolValue.filter(doc => doc.mapNumber === mapNumber);
    const totals = filteredDocuments.reduce(
      (acc, curr) => {
        acc.payout += curr.payout || 0;
        acc.valuePambii += curr.valuePambii || 0;
        return acc;
      },
      { payout: 0, valuePambii: 0 }
    );

    const updatedTotals = {
      ...totals,
      percentageOfPool: totals.valuePambii !== 0 ? (totals.payout / totals.valuePambii) * 100 : 0
    };
    return NextResponse.json(updatedTotals);

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ payout: 0, valuePambii: 0, percentageOfPool: 0 }, { status: 500 });
  }
}
