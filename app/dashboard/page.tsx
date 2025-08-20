"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs/client";

interface Deal {
  id: string;
  amount?: number | null;
}

export default function Dashboard() {
  const supabase = createClientComponentClient();
  const [totalDeals, setTotalDeals] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from<Deal>("deals")
        .select("id, amount");

      if (!error && data) {
        setTotalDeals(data.length);
        const value = data.reduce((sum, d) => sum + (d.amount ?? 0), 0);
        setTotalValue(value);
      }
    };

    fetchStats();
  }, [supabase]);

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-sm font-medium text-gray-500">Total Deals</h2>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{totalDeals}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-sm font-medium text-gray-500">Pipeline Value</h2>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            ${totalValue.toLocaleString()}
          </p>
        </div>
      </div>
    </main>
  );
}
