"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, IndianRupee } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import GlassCard from "@/components/GlassCard";
import { mockPriceTrends } from "@/utils/mockData";

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
    <div className="min-h-screen px-4 pt-24 pb-12">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Calculator size={24} style={{ color: "var(--royal-gold)" }} />
            <h1 className="text-3xl font-bold" style={{ color: "var(--navy)" }}>Finance Tools</h1>
          </div>
          <p className="text-sm" style={{ color: "var(--navy-muted)" }}>EMI calculator and market trend analysis</p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <GlassCard className="p-6 space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: "var(--navy)" }}>
                <IndianRupee size={18} style={{ color: "var(--royal-gold)" }} />
                EMI Calculator
              </h2>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-medium tracking-wider" style={{ color: "var(--navy-muted)" }}>PROPERTY PRICE</label>
                  <span className="text-sm font-semibold" style={{ color: "var(--royal-gold-dark)" }}>{formatPrice(principal)}</span>
                </div>
                <input type="range" min={1000000} max={100000000} step={500000} value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full accent-[#C8A45C]" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-medium tracking-wider" style={{ color: "var(--navy-muted)" }}>DOWN PAYMENT</label>
                  <span className="text-sm font-semibold" style={{ color: "var(--navy)" }}>{downPaymentPct}%</span>
                </div>
                <input type="range" min={5} max={50} step={5} value={downPaymentPct}
                  onChange={(e) => setDownPaymentPct(Number(e.target.value))} className="w-full accent-[#2C5F8A]" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-medium tracking-wider" style={{ color: "var(--navy-muted)" }}>INTEREST RATE</label>
                  <span className="text-sm font-semibold" style={{ color: "var(--navy)" }}>{rate}% p.a.</span>
                </div>
                <input type="range" min={5} max={15} step={0.1} value={rate}
                  onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-[#C0392B]" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-medium tracking-wider" style={{ color: "var(--navy-muted)" }}>LOAN TENURE</label>
                  <span className="text-sm font-semibold" style={{ color: "var(--navy)" }}>{tenure} years</span>
                </div>
                <input type="range" min={5} max={30} step={1} value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))} className="w-full accent-[#2E7D5B]" />
              </div>

              <div className="pt-4 space-y-3" style={{ borderTop: "1px solid var(--card-border)" }}>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--navy-muted)" }}>Loan Amount</span>
                  <span className="font-medium" style={{ color: "var(--navy)" }}>{formatPrice(loanAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--navy-muted)" }}>Total Interest</span>
                  <span className="font-medium" style={{ color: "var(--accent-red)" }}>{formatPrice(totalInterest)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--navy-muted)" }}>Total Payment</span>
                  <span className="font-medium" style={{ color: "var(--navy)" }}>{formatPrice(totalPayment)}</span>
                </div>
                <div className="pt-3" style={{ borderTop: "1px solid var(--card-border)" }}>
                  <div className="flex justify-between">
                    <span className="font-medium" style={{ color: "var(--navy)" }}>Monthly EMI</span>
                    <span className="text-2xl font-bold" style={{ color: "var(--royal-gold-dark)" }}>{formatPrice(Math.round(emi))}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6">
            <GlassCard className="p-6">
              <h3 className="mb-4 text-lg font-semibold" style={{ color: "var(--navy)" }}>Loan Amortization</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={breakdownData}>
                    <defs>
                      <linearGradient id="principalGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C8A45C" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#C8A45C" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="interestGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C0392B" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#C0392B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,26,46,0.08)" />
                    <XAxis dataKey="year" stroke="rgba(26,26,46,0.3)" fontSize={10} />
                    <YAxis stroke="rgba(26,26,46,0.3)" fontSize={10} tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`} />
                    <Tooltip contentStyle={{ background: "white", border: "1px solid rgba(200,164,92,0.2)", borderRadius: "12px", fontSize: "12px", color: "#1A1A2E" }}
                      formatter={(value) => formatPrice(Number(value))} />
                    <Area type="monotone" dataKey="principal" stroke="#C8A45C" fill="url(#principalGrad)" strokeWidth={2} name="Principal" />
                    <Area type="monotone" dataKey="interest" stroke="#C0392B" fill="url(#interestGrad)" strokeWidth={2} name="Interest" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: "var(--navy)" }}>
                  <TrendingUp size={18} style={{ color: "var(--accent-green)" }} />
                  Market Price Trends
                </h3>
                <span className="text-[10px]" style={{ color: "var(--navy-muted)" }}>Average ₹/sqft across major cities</span>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockPriceTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,26,46,0.08)" />
                    <XAxis dataKey="month" stroke="rgba(26,26,46,0.3)" fontSize={10} />
                    <YAxis stroke="rgba(26,26,46,0.3)" fontSize={10} />
                    <Tooltip contentStyle={{ background: "white", border: "1px solid rgba(200,164,92,0.2)", borderRadius: "12px", fontSize: "12px", color: "#1A1A2E" }} />
                    <Line type="monotone" dataKey="avgPrice" stroke="#C8A45C" strokeWidth={2} dot={{ fill: "#C8A45C", r: 4 }} activeDot={{ r: 6, fill: "#C8A45C" }} name="Avg Price (₹/sqft)" />
                    <Line type="monotone" dataKey="volume" stroke="#2C5F8A" strokeWidth={2} dot={{ fill: "#2C5F8A", r: 4 }} name="Volume" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <GlassCard className="p-5 text-center">
                <p className="text-xs mb-1" style={{ color: "var(--navy-muted)" }}>Down Payment</p>
                <p className="text-xl font-bold" style={{ color: "var(--royal-gold-dark)" }}>{formatPrice(principal * downPaymentPct / 100)}</p>
                <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--cream)" }}>
                  <div className="h-full rounded-full" style={{ width: `${downPaymentPct}%`, background: "var(--royal-gold)" }} />
                </div>
              </GlassCard>
              <GlassCard className="p-5 text-center">
                <p className="text-xs mb-1" style={{ color: "var(--navy-muted)" }}>Principal</p>
                <p className="text-xl font-bold" style={{ color: "var(--accent-blue)" }}>{formatPrice(loanAmount)}</p>
                <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--cream)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(loanAmount / totalPayment * 100).toFixed(0)}%`, background: "var(--accent-blue)" }} />
                </div>
              </GlassCard>
              <GlassCard className="p-5 text-center">
                <p className="text-xs mb-1" style={{ color: "var(--navy-muted)" }}>Total Interest</p>
                <p className="text-xl font-bold" style={{ color: "var(--accent-red)" }}>{formatPrice(totalInterest)}</p>
                <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--cream)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(totalInterest / totalPayment * 100).toFixed(0)}%`, background: "var(--accent-red)" }} />
                </div>
              </GlassCard>
            </div>

            <div className="text-center">
              <p className="text-xs" style={{ color: "var(--navy-muted)", opacity: 0.5 }}>Data is illustrative. Consult your financial advisor.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
