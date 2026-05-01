"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, IndianRupee } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import { mockPriceTrends } from "@/utils/mockData";
import { isDemo } from "@/utils/isDemo";

const formatPrice = (price: number) => {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
  return `₹${price.toLocaleString("en-IN")}`;
};

export default function FinancePage() {
  const [principal, setPrincipal] = useState(20000000);
  const [rate, setRate] = useState(8.4);
  const [tenure, setTenure] = useState(20);
  const [downPaymentPct, setDownPaymentPct] = useState(20);

  const emi = useMemo(() => {
    const loanAmount = principal * (1 - downPaymentPct / 100);
    const monthlyRate = rate / 100 / 12;
    const months = tenure * 12;
    if (monthlyRate === 0) return loanAmount / months;
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return emi;
  }, [principal, rate, tenure, downPaymentPct]);

  const loanAmount = principal * (1 - downPaymentPct / 100);
  const totalPayment = emi * tenure * 12;
  const totalInterest = totalPayment - loanAmount;

  const breakdownData = useMemo(() => {
    const data = [];
    let balance = loanAmount;
    const monthlyRate = rate / 100 / 12;
    for (let year = 1; year <= tenure; year++) {
      let yearInterest = 0;
      let yearPrincipal = 0;
      for (let m = 0; m < 12; m++) {
        const interest = balance * monthlyRate;
        const principalPart = emi - interest;
        yearInterest += interest;
        yearPrincipal += principalPart;
        balance -= principalPart;
      }
      data.push({
        year: `Y${year}`,
        principal: Math.round(yearPrincipal),
        interest: Math.round(yearInterest),
        balance: Math.max(0, Math.round(balance)),
      });
    }
    return data;
  }, [loanAmount, rate, tenure, emi]);

  return (
    <div className="min-h-screen px-4 pt-24 pb-12" style={{ marginTop: isDemo ? "36px" : "0" }}>
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Calculator size={24} className="text-[var(--neon-cyan)]" />
            <h1 className="text-3xl font-bold text-white">Finance Tools</h1>
          </div>
          <p className="text-sm text-white/40">EMI calculator and market trend analysis</p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* EMI Calculator Inputs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <GlassCard className="p-6 space-y-6" glowColor="cyan">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <IndianRupee size={18} className="text-[var(--neon-cyan)]" />
                EMI Calculator
              </h2>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-medium tracking-wider text-white/40">PROPERTY PRICE</label>
                  <span className="text-sm font-semibold neon-text-cyan">{formatPrice(principal)}</span>
                </div>
                <input
                  type="range"
                  min={1000000}
                  max={100000000}
                  step={500000}
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full accent-[var(--neon-cyan)]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-medium tracking-wider text-white/40">DOWN PAYMENT</label>
                  <span className="text-sm font-semibold text-white">{downPaymentPct}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={50}
                  step={5}
                  value={downPaymentPct}
                  onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                  className="w-full accent-[var(--neon-purple)]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-medium tracking-wider text-white/40">INTEREST RATE</label>
                  <span className="text-sm font-semibold text-white">{rate}% p.a.</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={15}
                  step={0.1}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full accent-[var(--neon-pink)]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-medium tracking-wider text-white/40">LOAN TENURE</label>
                  <span className="text-sm font-semibold text-white">{tenure} years</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full accent-[var(--neon-green)]"
                />
              </div>

              <div className="border-t border-white/5 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Loan Amount</span>
                  <span className="font-medium text-white">{formatPrice(loanAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Total Interest</span>
                  <span className="font-medium text-[var(--neon-pink)]">{formatPrice(totalInterest)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Total Payment</span>
                  <span className="font-medium text-white">{formatPrice(totalPayment)}</span>
                </div>
                <div className="border-t border-white/5 pt-3">
                  <div className="flex justify-between">
                    <span className="text-white/60 font-medium">Monthly EMI</span>
                    <span className="text-2xl font-bold neon-text-cyan">{formatPrice(Math.round(emi))}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Charts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Amortization Chart */}
            <GlassCard className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Loan Amortization</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={breakdownData}>
                    <defs>
                      <linearGradient id="principalGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="interestGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff00aa" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ff00aa" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="year" stroke="rgba(255,255,255,0.2)" fontSize={10} />
                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(10,10,35,0.95)",
                        border: "1px solid rgba(0,240,255,0.2)",
                        borderRadius: "12px",
                        fontSize: "12px",
                        color: "#e0e0ff",
                      }}
                      formatter={(value: number) => formatPrice(value)}
                    />
                    <Area type="monotone" dataKey="principal" stroke="#00f0ff" fill="url(#principalGrad)" strokeWidth={2} name="Principal" />
                    <Area type="monotone" dataKey="interest" stroke="#ff00aa" fill="url(#interestGrad)" strokeWidth={2} name="Interest" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Price Trends */}
            <GlassCard className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <TrendingUp size={18} className="text-[var(--neon-green)]" />
                  Market Price Trends
                </h3>
                <span className="text-[10px] text-white/30">Average ₹/sqft across major cities</span>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockPriceTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={10} />
                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(10,10,35,0.95)",
                        border: "1px solid rgba(0,240,255,0.2)",
                        borderRadius: "12px",
                        fontSize: "12px",
                        color: "#e0e0ff",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="avgPrice"
                      stroke="#00f0ff"
                      strokeWidth={2}
                      dot={{ fill: "#00f0ff", r: 4 }}
                      activeDot={{ r: 6, fill: "#00f0ff" }}
                      name="Avg Price (₹/sqft)"
                    />
                    <Line
                      type="monotone"
                      dataKey="volume"
                      stroke="#b400ff"
                      strokeWidth={2}
                      dot={{ fill: "#b400ff", r: 4 }}
                      name="Volume"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Payment Breakdown Pie-like */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <GlassCard className="p-5 text-center">
                <p className="text-xs text-white/40 mb-1">Down Payment</p>
                <p className="text-xl font-bold text-[var(--neon-cyan)]">{formatPrice(principal * downPaymentPct / 100)}</p>
                <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-[var(--neon-cyan)]" style={{ width: `${downPaymentPct}%` }} />
                </div>
              </GlassCard>
              <GlassCard className="p-5 text-center">
                <p className="text-xs text-white/40 mb-1">Principal</p>
                <p className="text-xl font-bold text-[var(--neon-purple)]">{formatPrice(loanAmount)}</p>
                <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-[var(--neon-purple)]" style={{ width: `${(loanAmount / totalPayment * 100).toFixed(0)}%` }} />
                </div>
              </GlassCard>
              <GlassCard className="p-5 text-center">
                <p className="text-xs text-white/40 mb-1">Total Interest</p>
                <p className="text-xl font-bold text-[var(--neon-pink)]">{formatPrice(totalInterest)}</p>
                <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-[var(--neon-pink)]" style={{ width: `${(totalInterest / totalPayment * 100).toFixed(0)}%` }} />
                </div>
              </GlassCard>
            </div>

            <div className="text-center">
              <NeonButton variant="ghost" size="sm">
                <span className="text-xs text-white/30">Data is illustrative. Consult your financial advisor.</span>
              </NeonButton>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
