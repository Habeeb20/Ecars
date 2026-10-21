/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { agentApi, errMsg } from '../../../api/agentApi';
import { naira, fmtDate, useAsync, Spinner, ErrorBox, Empty, Pill, Card, PageHeader } from './ui';

const input =
  'w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10';

const AgentPayouts = () => {
  const overview = useAsync(() => agentApi.overview(), []);
  const history = useAsync(() => agentApi.payouts({ limit: 50 }), []);
  const [busy, setBusy] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Pre-fill with the bank details from the last request
  const last = history.data?.data?.[0]?.bank;
  useEffect(() => {
    if (last) reset({ bankName: last.bankName, accountName: last.accountName, accountNumber: last.accountNumber });
  }, [last, reset]);

  if (overview.loading || history.loading) return <Spinner />;
  if (overview.error) return <ErrorBox message={overview.error} onRetry={overview.reload} />;
  if (history.error) return <ErrorBox message={history.error} onRetry={history.reload} />;

  const s = overview.data.data;
  const payouts = history.data.data;

  const onSubmit = async (values) => {
    setBusy(true);
    try {
      await agentApi.requestPayout(values);
      toast.success('Payout requested', { description: 'Admin will review it shortly.' });
      overview.reload();
      history.reload();
    } catch (e) {
      toast.error('Request failed', { description: errMsg(e) });
    } finally {
      setBusy(false);
    }
  };

  const blockedReason =
    s.balance.available <= 0
      ? 'You have no available earnings yet.'
      : !s.canRequest && s.nextRequestAt
      ? `You can request once a week. Your next request opens on ${fmtDate(s.nextRequestAt)}.`
      : '';

  return (
    <>
      <PageHeader title="Payouts" subtitle="Withdraw your available earnings once a week." />

      <div className="grid lg:grid-cols-5 gap-4 mb-6 items-start">
        <Card className="lg:col-span-2 p-6">
          <p className="text-sm text-slate-500">Available to withdraw</p>
          <p className="text-3xl font-bold text-emerald-700 mt-1 tabular-nums">{naira(s.balance.available)}</p>
          <p className="text-sm text-slate-500 mt-3">
            {naira(s.balance.requested)} already requested · {naira(s.balance.paid)} paid
          </p>
          {blockedReason && (
            <div className="mt-4 flex gap-2 rounded-xl bg-amber-50 text-amber-800 text-sm p-3">
              <Clock className="h-4 w-4 mt-0.5 shrink-0" /> {blockedReason}
            </div>
          )}
        </Card>

        <Card className="lg:col-span-3 p-6">
          <p className="font-semibold text-slate-900">Where should we send it?</p>
          <p className="text-sm text-slate-500 mt-1">The whole available balance is requested. Check the account details before you submit.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-4 mt-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Bank name</span>
              <input className={`${input} mt-1.5`} {...register('bankName', { required: 'Required' })} />
              {errors.bankName && <p className="text-xs text-red-600 mt-1">{errors.bankName.message}</p>}
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Account number</span>
              <input
                inputMode="numeric"
                maxLength={10}
                className={`${input} mt-1.5`}
                {...register('accountNumber', { required: 'Required', pattern: { value: /^\d{10}$/, message: '10 digits' } })}
              />
              {errors.accountNumber && <p className="text-xs text-red-600 mt-1">{errors.accountNumber.message}</p>}
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">Account name</span>
              <input className={`${input} mt-1.5`} {...register('accountName', { required: 'Required' })} />
              {errors.accountName && <p className="text-xs text-red-600 mt-1">{errors.accountName.message}</p>}
            </label>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={busy || !s.canRequest}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm px-5 py-2.5"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                Request {naira(s.balance.available)}
              </button>
            </div>
          </form>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100">
          <p className="font-semibold text-slate-900">Payout history</p>
        </div>
        {payouts.length === 0 ? (
          <Empty title="No payout requests yet" hint="Your requests and their outcome will be listed here." />
        ) : (
          <ul className="divide-y divide-slate-100">
            {payouts.map((p) => (
              <li key={p._id} className="p-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900 tabular-nums">{naira(p.amount)}</p>
                  <p className="text-sm text-slate-500">
                    {p.bank.bankName} · {p.bank.accountNumber} · requested {fmtDate(p.requestedAt)}
                  </p>
                  {p.status === 'rejected' && p.rejectionReason && (
                    <p className="text-sm text-red-600 mt-1">Reason: {p.rejectionReason}. The money is back in your available balance.</p>
                  )}
                  {p.status === 'paid' && (
                    <p className="text-sm text-slate-500 mt-1">Paid {fmtDate(p.paidAt)} · Ref {p.paymentReference}</p>
                  )}
                  {p.status === 'approved' && <p className="text-sm text-slate-500 mt-1">Approved {fmtDate(p.approvedAt)}. Payment is on its way.</p>}
                </div>
                <Pill kind={p.status} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
};

export default AgentPayouts;