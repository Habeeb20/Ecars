/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Copy, Check, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { agentApi } from '../../../api/agentApi';
import { naira, fmtDate, useAsync, Spinner, ErrorBox, Card, PageHeader, Stat } from './UI';

const AgentOverview = ({ onNavigate }) => {
  const { data, loading, error, reload } = useAsync(() => agentApi.overview(), []);
  const [copied, setCopied] = useState('');

  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  const s = data.data;
  const link = `${window.location.origin}/register?ref=${s.referralCode}`;

  const copy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      toast.success('Copied');
      setTimeout(() => setCopied(''), 1500);
    } catch {
      toast.error('Could not copy. Select and copy it manually.');
    }
  };

  // The ₦1,000 each user is worth, split into what's been earned and what's still to come
  const total = s.totalReferred * 1000;
  const remaining = Math.max(0, total - s.earned.total);
  const pct = (n) => (total ? (n / total) * 100 : 0);

  return (
    <>
      <PageHeader title="Overview" subtitle="Your users, your earnings, and what's still to unlock." />

      <div className="grid lg:grid-cols-5 gap-4 mb-4">
        {/* Balance */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0B3D2E] text-white p-6 flex flex-col justify-between">
          <div>
            <p className="text-sm text-emerald-200/80">Available to withdraw</p>
            <p className="text-4xl font-bold mt-2 tabular-nums">{naira(s.balance.available)}</p>
            <p className="text-sm text-emerald-100/70 mt-3">
              {naira(s.balance.requested)} requested · {naira(s.balance.paid)} paid out
            </p>
          </div>
          <div className="mt-6">
            <button
              onClick={() => onNavigate('payouts')}
              className="inline-flex items-center gap-2 rounded-xl bg-white text-[#0B3D2E] font-semibold text-sm px-4 py-2.5 hover:bg-emerald-50"
            >
              {s.canRequest ? 'Request payout' : 'View payouts'} <ArrowRight className="h-4 w-4" />
            </button>
            {!s.canRequest && s.nextRequestAt && (
              <p className="text-xs text-emerald-100/70 mt-2">Next request from {fmtDate(s.nextRequestAt)}</p>
            )}
          </div>
        </div>

        {/* Where each ₦1,000 goes */}
        <Card className="lg:col-span-3 p-6">
          <p className="font-semibold text-slate-900">Every user you sign up is worth ₦1,000</p>
          <p className="text-sm text-slate-500 mt-1">
            You get ₦100 when they sign up and ₦900 once they start using their account.
          </p>

          {total > 0 ? (
            <>
              <div className="flex h-3 rounded-full overflow-hidden bg-slate-100 mt-5">
                <div className="bg-sky-500" style={{ width: `${pct(s.earned.signup)}%` }} />
                <div className="bg-emerald-500" style={{ width: `${pct(s.earned.activity)}%` }} />
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4 text-sm">
                <div>
                  <p className="flex items-center gap-2 text-slate-500"><span className="h-2 w-2 rounded-full bg-sky-500" />Signup share</p>
                  <p className="font-semibold text-slate-900 tabular-nums">{naira(s.earned.signup)}</p>
                </div>
                <div>
                  <p className="flex items-center gap-2 text-slate-500"><span className="h-2 w-2 rounded-full bg-emerald-500" />Activity share</p>
                  <p className="font-semibold text-slate-900 tabular-nums">{naira(s.earned.activity)}</p>
                </div>
                <div>
                  <p className="flex items-center gap-2 text-slate-500"><span className="h-2 w-2 rounded-full bg-slate-200" />Still to unlock</p>
                  <p className="font-semibold text-slate-900 tabular-nums">{naira(remaining)}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="mt-5 rounded-xl bg-slate-50 px-4 py-5 text-sm text-slate-600">
              You haven't signed anyone up yet.{' '}
              <button onClick={() => onNavigate('register')} className="font-semibold text-indigo-600 hover:underline">
                Sign up your first user
              </button>
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Stat label="Users signed up" value={s.totalReferred} />
        <Stat label="Active" value={s.activated} tone="good" hint="Have started using their account" />
        <Stat label="Not used yet" value={s.inactive} tone="warn" hint={`${naira(s.pendingPotential)} waiting to unlock`} />
        <Stat label="Points" value={s.points} />
      </div>

      <Card className="p-6">
        <p className="font-semibold text-slate-900">Your signup link</p>
        <p className="text-sm text-slate-500 mt-1">
          Anyone who signs up through this link or your code is counted as your user.
        </p>
        <div className="grid sm:grid-cols-3 gap-3 mt-4">
          <div className="sm:col-span-2 flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-2.5">
            <span className="text-sm text-slate-700 truncate">{link}</span>
            <button onClick={() => copy(link, 'link')} className="text-slate-400 hover:text-slate-700" aria-label="Copy link">
              {copied === 'link' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-2.5">
            <span className="text-sm font-mono font-semibold text-slate-800">{s.referralCode}</span>
            <button onClick={() => copy(s.referralCode, 'code')} className="text-slate-400 hover:text-slate-700" aria-label="Copy code">
              {copied === 'code' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </Card>
    </>
  );
};

export default AgentOverview;