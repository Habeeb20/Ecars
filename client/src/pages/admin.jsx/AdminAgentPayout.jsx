/* eslint-disable no-unused-vars */
// Admin: grant / revoke payout requests, record payments, see full history.
// Mount inside your admin dashboard, e.g. {tab === 'agent-payouts' && <AdminAgentPayouts />}
import React, { useEffect, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { adminAgentApi, errMsg } from '../../api/agentApi';
import {
  naira, fmtDate, fullName, useAsync, Spinner, ErrorBox, Empty, Pill, Card,
  PageHeader, Stat, FilterTabs, Pager,
} from '../agent/components/UI';

const ActionModal = ({ kind, payout, onClose, onDone }) => {
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const isReject = kind === 'reject';

  const submit = async (e) => {
    e.preventDefault();
    if (!value.trim()) return toast.error(isReject ? 'Give a reason' : 'Enter the transfer reference');
    setBusy(true);
    try {
      if (isReject) await adminAgentApi.reject(payout._id, value.trim());
      else await adminAgentApi.markPaid(payout._id, value.trim());
      toast.success(isReject ? 'Request rejected' : 'Marked as paid');
      onDone();
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-md p-6 relative">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X className="h-5 w-5" /></button>
        <h3 className="font-bold text-slate-900 text-lg">{isReject ? 'Reject this request' : 'Record payment'}</h3>
        <p className="text-sm text-slate-500 mt-1">
          {naira(payout.amount)} for {fullName(payout.agent)}.{' '}
          {isReject ? 'The money goes back to their available balance.' : `Send to ${payout.bank.bankName} · ${payout.bank.accountNumber} · ${payout.bank.accountName}, then enter the reference.`}
        </p>
        {isReject ? (
          <textarea
            autoFocus rows={3} maxLength={300} value={value} onChange={(e) => setValue(e.target.value)}
            placeholder="Reason the agent will see"
            className="mt-4 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />
        ) : (
          <input
            autoFocus value={value} onChange={(e) => setValue(e.target.value)} maxLength={100}
            placeholder="Transfer reference or receipt number"
            className="mt-4 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />
        )}
        <div className="flex justify-end gap-2 mt-5">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
          <button
            type="submit" disabled={busy}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60 ${isReject ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {isReject ? 'Reject request' : 'Mark as paid'}
          </button>
        </div>
      </form>
    </div>
  );
};

const AdminAgentPayouts = () => {
  const [status, setStatus] = useState('unpaid');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // { kind, payout }
  const [busyId, setBusyId] = useState(null);
  useEffect(() => setPage(1), [status]);

  const overview = useAsync(() => adminAgentApi.overview(), []);
  const list = useAsync(
    () => adminAgentApi.payouts({ status: status === 'all' ? undefined : status, page }),
    [status, page]
  );

  const refresh = () => { overview.reload(); list.reload(); };

  const approve = async (p) => {
    setBusyId(p._id);
    try {
      await adminAgentApi.approve(p._id);
      toast.success('Request approved');
      refresh();
    } catch (e) {
      toast.error(errMsg(e));
    } finally {
      setBusyId(null);
    }
  };

  const o = overview.data?.data;
  const rows = list.data?.data || [];

  return (
    <>
      <PageHeader title="Agent payouts" subtitle="Approve or reject requests, record payments, and keep the history." />

      {o && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Stat label="Pending requests" value={o.pendingRequests} tone="warn" hint={naira(o.pendingRequestsAmount)} />
          <Stat label="Approved, not paid" value={o.approvedAwaitingPayment} hint="Send the money, then mark paid" />
          <Stat label="Owed to agents" value={naira(o.unpaid)} />
          <Stat label="Paid so far" value={naira(o.paid)} tone="good" />
        </div>
      )}

      <Card>
        <div className="p-4 border-b border-slate-100">
          <FilterTabs
            value={status}
            onChange={setStatus}
            options={[
              { value: 'unpaid', label: 'Unpaid' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'paid', label: 'Paid' },
              { value: 'rejected', label: 'Rejected' },
              { value: 'all', label: 'All history' },
            ]}
          />
        </div>

        {list.error ? <div className="p-4"><ErrorBox message={list.error} onRetry={list.reload} /></div>
          : list.loading ? <Spinner />
          : rows.length === 0 ? <Empty title="Nothing here" hint="No payout requests match this filter." />
          : (
            <ul className="divide-y divide-slate-100">
              {rows.map((p) => (
                <li key={p._id} className="p-4 flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-bold text-slate-900 tabular-nums">{naira(p.amount)}</p>
                      <Pill kind={p.status} />
                    </div>
                    <p className="text-sm text-slate-700 mt-1">{fullName(p.agent)} <span className="text-slate-400">· {p.agent?.email}</span></p>
                    <p className="text-sm text-slate-500">{p.bank.bankName} · {p.bank.accountNumber} · {p.bank.accountName}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Requested {fmtDate(p.requestedAt)} · {p.earningsCount} earning(s)
                      {p.approvedAt && ` · Approved ${fmtDate(p.approvedAt)}`}
                      {p.paidAt && ` · Paid ${fmtDate(p.paidAt)} · Ref ${p.paymentReference}`}
                      {p.rejectedAt && ` · Rejected ${fmtDate(p.rejectedAt)}: ${p.rejectionReason}`}
                    </p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    {p.status === 'pending' && (
                      <>
                        <button
                          onClick={() => approve(p)} disabled={busyId === p._id}
                          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2"
                        >
                          {busyId === p._id && <Loader2 className="h-4 w-4 animate-spin" />} Approve
                        </button>
                        <button onClick={() => setModal({ kind: 'reject', payout: p })} className="rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-sm font-semibold px-4 py-2">
                          Reject
                        </button>
                      </>
                    )}
                    {p.status === 'approved' && (
                      <>
                        <button onClick={() => setModal({ kind: 'paid', payout: p })} className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2">
                          Mark as paid
                        </button>
                        <button onClick={() => setModal({ kind: 'reject', payout: p })} className="rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-sm font-semibold px-4 py-2">
                          Revoke
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        <Pager meta={list.data?.meta} onPage={setPage} />
      </Card>

      {modal && (
        <ActionModal
          {...modal}
          onClose={() => setModal(null)}
          onDone={() => { setModal(null); refresh(); }}
        />
      )}
    </>
  );
};

export default AdminAgentPayouts;