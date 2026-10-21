/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { agentApi } from '../../../api/agentApi';
import {
  naira, fmtDate, fullName, useAsync, useDebounced, Spinner, ErrorBox, Empty,
  Pill, Card, PageHeader, FilterTabs, Pager, Th, Td,
} from './UI';

const AgentReferrals = ({ onNavigate }) => {
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const q = useDebounced(search);

  useEffect(() => setPage(1), [status, q]);

  const { data, loading, error, reload } = useAsync(
    () => agentApi.referrals({ status: status === 'all' ? undefined : status, search: q || undefined, page }),
    [status, q, page]
  );

  const rows = data?.data || [];

  return (
    <>
      <PageHeader
        title="My users"
        subtitle="Everyone you've signed up, and whether they've used their account yet."
      />

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-slate-100">
          <FilterTabs
            value={status}
            onChange={setStatus}
            options={[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Not used yet' },
            ]}
          />
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email or phone"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>
        </div>

        {error ? (
          <div className="p-4"><ErrorBox message={error} onRetry={reload} /></div>
        ) : loading ? (
          <Spinner />
        ) : rows.length === 0 ? (
          <Empty
            title={status === 'all' && !q ? 'No users yet' : 'No users match this filter'}
            hint={status === 'all' && !q ? 'Sign up a buyer, dealer, service provider or parts seller and they will show up here.' : 'Try a different filter or search.'}
            action={
              status === 'all' && !q ? (
                <button onClick={() => onNavigate('register')} className="mt-4 rounded-xl bg-indigo-600 text-white text-sm font-semibold px-4 py-2 hover:bg-indigo-700">
                  Sign up a user
                </button>
              ) : null
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50/70">
                <tr>
                  <Th>User</Th>
                  <Th>Type</Th>
                  <Th>Signed up</Th>
                  <Th>Email check</Th>
                  <Th>Account use</Th>
                  <Th right>Earned</Th>
                  <Th right>Still to unlock</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/60">
                    <Td>
                      <p className="font-medium text-slate-900">{fullName(r.user)}</p>
                      <p className="text-xs text-slate-500">{r.user?.email}{r.user?.phoneNumber ? ` · ${r.user.phone}` : ''}</p>
                    </Td>
                    <Td><Pill kind={r.userRole} /></Td>
                    <Td className="text-slate-600 whitespace-nowrap">{fmtDate(r.signedUpAt)}</Td>
                    <Td><Pill kind={r.user?.emailVerified ? 'verified' : 'unverified'} /></Td>
                    <Td>
                      <Pill kind={r.activated ? 'active' : 'inactive'} />
                      {r.activated && <p className="text-xs text-slate-400 mt-1">since {fmtDate(r.activatedAt)}</p>}
                    </Td>
                    <Td right className="font-semibold text-slate-900">{naira(r.totalEarned)}</Td>
                    <Td right className="text-slate-500">{r.stillToUnlock ? naira(r.stillToUnlock) : '—'}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pager meta={data?.meta} onPage={setPage} />
      </Card>
    </>
  );
};

export default AgentReferrals;