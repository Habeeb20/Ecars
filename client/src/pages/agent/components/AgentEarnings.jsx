/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { agentApi } from '../../../api/agentApi';
import { earningLabel } from './UI';
import {
  naira, fmtDate, fullName, useAsync, Spinner, ErrorBox, Empty, Pill, Card,
  PageHeader, Stat, FilterTabs, Pager, Th, Td,
} from './ui';

const AgentEarnings = () => {
  const overview = useAsync(() => agentApi.overview(), []);
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [status]);

  const ledger = useAsync(
    () => agentApi.earnings({ status: status === 'all' ? undefined : status, page }),
    [status, page]
  );

  if (overview.loading) return <Spinner />;
  if (overview.error) return <ErrorBox message={overview.error} onRetry={overview.reload} />;
  const s = overview.data.data;
  const rows = ledger.data?.data || [];

  return (
    <>
      <PageHeader title="Points & earnings" subtitle="Everything you've earned from signing users up and from their activity." />

      <div className="grid lg:grid-cols-4 gap-4 mb-4">
        <Card className="p-5 flex items-center gap-4 lg:col-span-1">
          <div className="h-11 w-11 rounded-full bg-amber-100 flex items-center justify-center">
            <Star className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Points</p>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">{s.points}</p>
          </div>
        </Card>
        <div className="lg:col-span-3 grid sm:grid-cols-3 gap-4">
          <Stat label="Total earned" value={naira(s.earned.total)} />
          <Stat label="From signups" value={naira(s.earned.signup)} hint="₦100 per signup" />
          <Stat label="From user activity" value={naira(s.earned.activity)} hint="₦900 per active user" />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Stat label="Available" value={naira(s.balance.available)} tone="good" hint="Ready to withdraw" />
        <Stat label="Requested" value={naira(s.balance.requested)} tone="warn" hint="Waiting for admin" />
        <Stat label="Paid out" value={naira(s.balance.paid)} />
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-slate-100">
          <p className="font-semibold text-slate-900">Earnings history</p>
          <FilterTabs
            value={status}
            onChange={setStatus}
            options={[
              { value: 'all', label: 'All' },
              { value: 'available', label: 'Available' },
              { value: 'requested', label: 'Requested' },
              { value: 'paid', label: 'Paid' },
            ]}
          />
        </div>

        {ledger.error ? (
          <div className="p-4"><ErrorBox message={ledger.error} onRetry={ledger.reload} /></div>
        ) : ledger.loading ? (
          <Spinner />
        ) : rows.length === 0 ? (
          <Empty title="No earnings here yet" hint="Earnings appear when your users sign up or start using their account." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50/70">
                <tr>
                  <Th>Date</Th>
                  <Th>User</Th>
                  <Th>What for</Th>
                  <Th>Status</Th>
                  <Th right>Amount</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((e) => (
                  <tr key={e._id} className="hover:bg-slate-50/60">
                    <Td className="text-slate-600 whitespace-nowrap">{fmtDate(e.createdAt)}</Td>
                    <Td className="font-medium text-slate-900">{fullName(e.user)}</Td>
                    <Td className="text-slate-600">
                      {earningLabel(e)}
                    </Td>
                    <Td><Pill kind={e.status} /></Td>
                    <Td right className="font-semibold text-slate-900">{naira(e.amount)}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pager meta={ledger.data?.meta} onPage={setPage} />
      </Card>
    </>
  );
};

export default AgentEarnings;