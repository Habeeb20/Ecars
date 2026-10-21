/* eslint-disable no-unused-vars */
// Admin: every agent, their users, earnings and payout history.
// Mount inside your admin dashboard, e.g. {tab === 'agents' && <AdminAgents />}
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { adminAgentApi } from '../../api/agentApi';
import { earningLabel } from '../agent/components/UI';
import {
  naira, fmtDate, fullName, useAsync, useDebounced, Spinner, ErrorBox, Empty,
  Pill, Card, PageHeader, Stat, FilterTabs, Th, Td,
} from '../agent/components/UI';

const AgentDetail = ({ id, onClose }) => {
  const { data, loading, error, reload } = useAsync(() => adminAgentApi.agent(id), [id]);
  const [tab, setTab] = useState('users');

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div className="w-full max-w-3xl bg-slate-50 h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <p className="font-bold text-slate-900">{data ? fullName(data.data.agent) : 'Agent'}</p>
            {data && <p className="text-sm text-slate-500">{data.data.agent.email} · {data.data.agent.phoneNumber || 'no phone'}</p>}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700" aria-label="Close"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-6">
          {loading ? <Spinner /> : error ? <ErrorBox message={error} onRetry={reload} /> : (() => {
            const { stats, referrals, earnings, payouts } = data.data;
            return (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  <Stat label="Users" value={stats.totalReferred} hint={`${stats.activated} active`} />
                  <Stat label="Earned" value={naira(stats.earned.total)} />
                  <Stat label="Unpaid" value={naira(stats.balance.available + stats.balance.requested)} tone="warn" />
                  <Stat label="Paid" value={naira(stats.balance.paid)} tone="good" />
                </div>

                <FilterTabs
                  value={tab}
                  onChange={setTab}
                  options={[
                    { value: 'users', label: `Users (${referrals.length})` },
                    { value: 'earnings', label: `Earnings (${earnings.length})` },
                    { value: 'payouts', label: `Payouts (${payouts.length})` },
                  ]}
                />

                <Card className="mt-4 overflow-x-auto">
                  {tab === 'users' && (referrals.length === 0 ? <Empty title="No users signed up" /> : (
                    <table className="min-w-full text-sm">
                      <thead className="bg-slate-50/70"><tr><Th>User</Th><Th>Type</Th><Th>Signed up</Th><Th>Account use</Th><Th right>Earned</Th></tr></thead>
                      <tbody className="divide-y divide-slate-100">
                        {referrals.map((r) => (
                          <tr key={r._id}>
                            <Td><p className="font-medium text-slate-900">{fullName(r.user)}</p><p className="text-xs text-slate-500">{r.user?.email}</p></Td>
                            <Td><Pill kind={r.userRole} /></Td>
                            <Td className="whitespace-nowrap text-slate-600">{fmtDate(r.createdAt)}</Td>
                            <Td><Pill kind={r.activated ? 'active' : 'inactive'} /></Td>
                            <Td right>{naira((r.signupCredited ? r.signupShare : 0) + (r.activated ? r.activityShare : 0))}</Td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ))}

                  {tab === 'earnings' && (earnings.length === 0 ? <Empty title="No earnings yet" /> : (
                    <table className="min-w-full text-sm">
                      <thead className="bg-slate-50/70"><tr><Th>Date</Th><Th>User</Th><Th>For</Th><Th>Status</Th><Th right>Amount</Th></tr></thead>
                      <tbody className="divide-y divide-slate-100">
                        {earnings.map((e) => (
                          <tr key={e._id}>
                            <Td className="whitespace-nowrap text-slate-600">{fmtDate(e.createdAt)}</Td>
                            <Td className="font-medium text-slate-900">{fullName(e.user)}</Td>
                            <Td className="text-slate-600">{earningLabel(e)}</Td>
                            <Td><Pill kind={e.status} /></Td>
                            <Td right className="font-semibold">{naira(e.amount)}</Td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ))}

                  {tab === 'payouts' && (payouts.length === 0 ? <Empty title="No payout requests" /> : (
                    <ul className="divide-y divide-slate-100">
                      {payouts.map((p) => (
                        <li key={p._id} className="p-4 flex justify-between gap-3">
                          <div>
                            <p className="font-semibold tabular-nums">{naira(p.amount)}</p>
                            <p className="text-sm text-slate-500">{p.bank.bankName} · {p.bank.accountNumber} · {p.bank.accountName}</p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Requested {fmtDate(p.requestedAt)}
                              {p.paidAt && ` · Paid ${fmtDate(p.paidAt)} (${p.paymentReference})`}
                              {p.rejectionReason && ` · Rejected: ${p.rejectionReason}`}
                            </p>
                          </div>
                          <Pill kind={p.status} />
                        </li>
                      ))}
                    </ul>
                  ))}
                </Card>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

const AdminAgents = () => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const q = useDebounced(search);

  const overview = useAsync(() => adminAgentApi.overview(), []);
  const agents = useAsync(() => adminAgentApi.agents({ search: q || undefined }), [q]);

  const o = overview.data?.data;
  const rows = agents.data?.data || [];

  return (
    <>
      <PageHeader title="Agents" subtitle="Every agent, their users, what they've earned and what they're owed." />

      {o && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Stat label="Agents" value={o.agents} />
          <Stat label="Users signed up" value={o.referred} hint={`${o.activated} active · ${o.inactive} not used yet`} />
          <Stat label="Owed to agents" value={naira(o.unpaid)} tone="warn" hint={`${o.pendingRequests} request(s) pending`} />
          <Stat label="Paid out" value={naira(o.paid)} tone="good" hint={`${naira(o.earned)} earned in total`} />
        </div>
      )}

      <Card>
        <div className="p-4 border-b border-slate-100">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search agents"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>
        </div>

        {agents.error ? <div className="p-4"><ErrorBox message={agents.error} onRetry={agents.reload} /></div>
          : agents.loading ? <Spinner />
          : rows.length === 0 ? <Empty title="No agents found" hint="Agents appear here once they sign up with the Agent role." />
          : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50/70">
                  <tr>
                    <Th>Agent</Th><Th right>Users</Th><Th right>Active</Th><Th right>Earned</Th>
                    <Th right>Unpaid</Th><Th right>Paid</Th><Th>Requests</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((a) => (
                    <tr key={a._id} onClick={() => setSelected(a._id)} className="cursor-pointer hover:bg-slate-50/60">
                      <Td>
                        <p className="font-medium text-slate-900">{fullName(a)}</p>
                        <p className="text-xs text-slate-500">{a.email}</p>
                      </Td>
                      <Td right>{a.referred}</Td>
                      <Td right>{a.activated}</Td>
                      <Td right className="font-semibold">{naira(a.earned)}</Td>
                      <Td right className="text-amber-700">{naira(a.available + a.requested)}</Td>
                      <Td right className="text-emerald-700">{naira(a.paid)}</Td>
                      <Td>
                        <div className="flex gap-1.5 flex-wrap">
                          {a.requests.pending > 0 && <Pill kind="pending" />}
                          {a.requests.approved > 0 && <Pill kind="approved" />}
                          {a.requests.pending + a.requests.approved === 0 && <span className="text-slate-400">—</span>}
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </Card>

      {selected && <AgentDetail id={selected} onClose={() => setSelected(null)} />}
    </>
  );
};

export default AdminAgents;