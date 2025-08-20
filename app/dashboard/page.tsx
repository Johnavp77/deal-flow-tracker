"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs/client";

interface Deal {
  id: string;
  amount?: number | null;
  stage_id?: string | null;
  created_at?: string | null;
}

interface Activity {
  id: string;
  type?: string | null;
  note?: string | null;
  created_at?: string | null;
}

export default function Dashboard() {
  const supabase = createClientComponentClient();
  const [totalDeals, setTotalDeals] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [dealsPerStage, setDealsPerStage] = useState<Record<string, number>>({});
  const [avgTimeInStage, setAvgTimeInStage] = useState(0);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      // Fetch deals
      const { data: deals } = await supabase
        .from<Deal>("deals")
        .select("id, amount, stage_id, created_at");

      if (deals) {
        // Totals
        setTotalDeals(deals.length);
        setTotalValue(deals.reduce((sum, d) => sum + (d.amount ?? 0), 0));

        // Deals per stage
        const stageCounts: Record<string, number> = {};
        deals.forEach((d) => {
          const stage = d.stage_id ?? "Unassigned";
          stageCounts[stage] = (stageCounts[stage] || 0) + 1;
        });
        setDealsPerStage(stageCounts);

        // Average time in stage (days)
        const now = Date.now();
        const totalDays = deals.reduce((sum, d) => {
          if (!d.created_at) return sum;
          return sum + (now - new Date(d.created_at).getTime()) / 86400000;
        }, 0);
        setAvgTimeInStage(deals.length ? totalDays / deals.length : 0);
      }

      // Recent activity (last 5)
      const { data: activities } = await supabase
        .from<Activity>("deal_activities")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (activities) setRecentActivity(activities);
    };

    fetchStats();
  }, [supabase]);

  return (
    <main className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-sm font-medium text-gray-500">Total Deals</h2>
          <p className="mt-2 text-3xl font-semibold">{totalDeals}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-sm font-medium text-gray-500">Pipeline Value</h2>
          <p className="mt-2 text-3xl font-semibold">
            ${totalValue.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-sm font-medium text-gray-500">
            Avg. Days in Stage
          </h2>
          <p className="mt-2 text-3xl font-semibold">
            {avgTimeInStage.toFixed(1)}
          </p>
        </div>
      </div>

      {/* Deals per Stage */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Deals per Stage</h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Object.entries(dealsPerStage).map(([stage, count]) => (
            <li
              key={stage}
              className="rounded bg-gray-50 p-4 shadow hover:bg-gray-100"
            >
              <span className="font-medium">{stage}</span>
              <span className="float-right text-xl font-bold">{count}</span>
            </li>
          ))}
          {!Object.keys(dealsPerStage).length && (
            <p className="text-sm text-gray-500">No stage data yet.</p>
          )}
        </ul>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
        <ul className="space-y-3">
          {recentActivity.map((a) => (
            <li key={a.id} className="rounded bg-white p-4 shadow">
              <p className="text-sm">
                <span className="font-medium">{a.type}</span>: {a.note}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(a.created_at ?? "").toLocaleString()}
              </p>
            </li>
          ))}
          {!recentActivity.length && (
            <p className="text-sm text-gray-500">No recent activity.</p>
          )}
        </ul>
      </section>
    </main>
  );
}
