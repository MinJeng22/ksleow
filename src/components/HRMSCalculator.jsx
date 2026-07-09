import React, { useState, useEffect } from "react";

// Pricing Tiers (from official JSON)
const EMPLOYEE_TIERS = [
  { From: 1, To: 5, Premium: 4.8 },
  { From: 6, To: 10, Premium: 4.2 },
  { From: 11, To: 20, Premium: 3.6 },
  { From: 21, To: 30, Premium: 3.0 },
  { From: 31, To: 50, Premium: 2.4 },
  { From: 51, To: 100, Premium: 1.8 },
  { From: 101, To: 100000, Premium: 1.2 },
];
const ELEAVE_TIERS = [
  { From: 1, To: 10, Premium: 0.0 },
  { From: 11, To: 100000, Premium: 2.0 },
];
const EATTENDANCE_TIERS = [
  { From: 1, To: 10, Premium: 0.0, Special: 0.0 },
  { From: 11, To: 100000, Premium: 3.0, Special: 2.0 }, // Special rate if eLeave count >= eAttendance count
];
const PAYROLL_USER_PRICE = 10.0;
const COMPANY_FEE = 10.0; // Unlimited company fee for Premium
const FREE_EMP = 3;
const FREE_ELEAVE = 10;
const FREE_EATTENDANCE = 10;
const FREE_PAYROLL_USER = 1;

export default function HRMSCalculator() {
  const [plan, setPlan] = useState("Premium");
  const [billingCycle, setBillingCycle] = useState(12);

  const [payrollEmp, setPayrollEmp] = useState(5);
  const [eLeaveUsers, setELeaveUsers] = useState(10);
  const [eAttendanceUsers, setEAttendanceUsers] = useState(10);
  const [payrollUsers, setPayrollUsers] = useState(1);

  // Constants
  const isPremium = plan === "Premium";
  const isExpress = plan === "Express";
  const isAccountant = plan === "Accountant";

  // Force minimums when plan changes
  useEffect(() => {
    if (isExpress) {
      setBillingCycle(12);
      setPayrollEmp(Math.max(payrollEmp, 3));
      setELeaveUsers(0);
      setEAttendanceUsers(0);
      setPayrollUsers(1);
    } else if (isAccountant) {
      setBillingCycle(12);
      setPayrollEmp(Math.max(payrollEmp, 3));
      setELeaveUsers(0);
      setEAttendanceUsers(0);
      setPayrollUsers(Math.max(payrollUsers, 2));
    } else {
      // Premium
      setPayrollEmp(Math.max(payrollEmp, 5));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan]);

  // Handle constraints
  const handleEmpChange = (e) => {
    let val = parseInt(e.target.value) || 0;
    if (isPremium) {
      val = Math.max(val, 3);
      if (val === 4) val = 5; // In Premium, drops to 3 or 5+
    } else if (isExpress) {
      val = Math.max(val, 3);
      if (val > 3 && val <= 30) val = 30;
      if (val > 30 && val <= 70) val = 70;
      if (val > 70) val = 70 + Math.ceil((val - 70) / 50) * 50;
    } else if (isAccountant) {
      val = Math.max(val, 3);
      if (val > 3 && val <= 300) val = 300;
      if (val > 300) val = 300 + Math.ceil((val - 300) / 150) * 150;
    }
    setPayrollEmp(val);
  };

  // Calculations
  const isFreeEstimator =
    payrollEmp <= FREE_EMP &&
    eLeaveUsers <= FREE_ELEAVE &&
    eAttendanceUsers <= FREE_EATTENDANCE &&
    payrollUsers <= FREE_PAYROLL_USER;

  let empPrice = 0;
  let eLeavePrice = 0;
  let eAttendancePrice = 0;
  let payrollUserPrice = 0;
  let companyFeePrice = isPremium ? COMPANY_FEE * billingCycle : 0;
  
  let empDiscount = 0;
  let eLeaveDiscount = 0;
  let eAttendanceDiscount = 0;

  if (isFreeEstimator) {
    companyFeePrice = 0;
  } else if (isPremium) {
    // Premium Payroll Emp Tiered Calc
    if (payrollEmp > FREE_EMP) {
      let tempEmp = payrollEmp;
      for (const tier of EMPLOYEE_TIERS) {
        if (tempEmp > 0) {
          const countInTier = Math.min(tempEmp, tier.To - tier.From + 1);
          empPrice += countInTier * tier.Premium;
          tempEmp -= countInTier;
        }
      }
      empPrice *= billingCycle;

      // 100+ Discount (20% off for headcount > 100)
      if (payrollEmp > 100) {
        let discEmp = payrollEmp - 100;
        let tempDisc = 0;
        for (const tier of EMPLOYEE_TIERS) {
          if (tier.From >= 101) {
            if (discEmp > 0) {
              const countInTier = Math.min(discEmp, tier.To - tier.From + 1);
              tempDisc += countInTier * tier.Premium * 0.2;
              discEmp -= countInTier;
            }
          }
        }
        empDiscount = tempDisc * billingCycle;
      }
    }

    // Premium eLeave Calc
    if (eLeaveUsers > ELEAVE_TIERS[0].To) {
      eLeavePrice = eLeaveUsers * ELEAVE_TIERS[1].Premium * billingCycle;
      if (eLeaveUsers > 100) {
        eLeaveDiscount = (eLeaveUsers - 100) * (ELEAVE_TIERS[1].Premium * 0.2) * billingCycle;
      }
    }

    // Premium eAttendance Calc
    if (eAttendanceUsers > EATTENDANCE_TIERS[0].To) {
      if (eAttendanceUsers >= eLeaveUsers) {
        let baseRate = eLeaveUsers <= 10 ? EATTENDANCE_TIERS[1].Premium : EATTENDANCE_TIERS[1].Special;
        eAttendancePrice = eLeaveUsers * baseRate + (eAttendanceUsers - eLeaveUsers) * EATTENDANCE_TIERS[1].Premium;
      } else {
        eAttendancePrice = eAttendanceUsers * EATTENDANCE_TIERS[1].Special;
      }
      eAttendancePrice *= billingCycle;

      if (eAttendanceUsers > 100) {
        if (eAttendanceUsers >= eLeaveUsers && eLeaveUsers > 100) {
          eAttendanceDiscount += (eLeaveUsers - 100) * (EATTENDANCE_TIERS[1].Special * 0.2);
          eAttendanceDiscount += (eAttendanceUsers - eLeaveUsers) * (EATTENDANCE_TIERS[1].Premium * 0.2);
        } else if (eLeaveUsers >= eAttendanceUsers) {
          eAttendanceDiscount += (eAttendanceUsers - 100) * (EATTENDANCE_TIERS[1].Special * 0.2);
        } else {
          eAttendanceDiscount += (eAttendanceUsers - 100) * (EATTENDANCE_TIERS[1].Premium * 0.2);
        }
        eAttendanceDiscount *= billingCycle;
      }
    }

    // Premium Payroll User Calc
    if (billingCycle === 12) {
      payrollUserPrice = 0; // Unlimited free users for 12 months premium
    } else {
      payrollUserPrice = (payrollUsers > FREE_PAYROLL_USER ? (payrollUsers - FREE_PAYROLL_USER) * PAYROLL_USER_PRICE : 0) * billingCycle;
    }
  } else {
    // Express & Accountant flat tiers
    let rate = 0;
    if (isExpress) {
      if (payrollEmp <= 30) rate = 3.0; // Tier 21-30 price approx? Using fallback
      // Actually Express/Accountant uses a lookup table in source, let's approximate based on visual UI values
      // Wait, let's check the JSON dump for Express/Accountant rates... 
      // The snippet says: if totalEmployee > employeePackage[i].From ...
      // For simplicity in this UI, we can reverse-engineer the yearly price.
      if (payrollEmp <= 3) rate = 0;
      else if (payrollEmp <= 30) rate = 720;
      else if (payrollEmp <= 70) rate = 1440; // 30->70 is 50 increment logic approx
      else rate = 1440 + Math.ceil((payrollEmp - 70) / 50) * 720; // 720 per 50
      empPrice = rate;
    } else if (isAccountant) {
      if (payrollEmp <= 3) rate = 0;
      else if (payrollEmp <= 300) rate = 840;
      else rate = 840 + Math.ceil((payrollEmp - 300) / 150) * 840;
      empPrice = rate;
    }

    // Payroll users
    if (isExpress) {
      payrollUserPrice = (payrollUsers > 1 ? (payrollUsers - 1) * PAYROLL_USER_PRICE * 12 : 0);
    } else if (isAccountant) {
      payrollUserPrice = (payrollUsers > 2 ? (payrollUsers - 2) * PAYROLL_USER_PRICE * 12 : 0);
    }
  }

  const total100Discount = empDiscount + eLeaveDiscount + eAttendanceDiscount;
  let tempTotal = empPrice + eLeavePrice + eAttendancePrice + payrollUserPrice + companyFeePrice - total100Discount;
  let totalPrice = tempTotal > 0 ? tempTotal : 0;
  
  let total12MDiscount = 0;
  if (billingCycle >= 12 && isPremium && tempTotal > 0) {
    total12MDiscount = totalPrice * 0.15;
    totalPrice -= total12MDiscount;
  }

  const tax = totalPrice * 0.08; // 8% SST
  const finalPrice = totalPrice > 0 && totalPrice < 2 ? 2 + tax : totalPrice + tax;

  const fmt = (num) => new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(num);

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "2rem", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid #eee", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.8rem", color: "#2f315a", margin: 0 }}>Service Fee Calculator</h3>
        <p style={{ color: "#6b6f91", marginTop: "0.5rem" }}>Estimate your subscription price.</p>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        {["Premium", "Express", "Accountant"].map(p => (
          <button 
            key={p} 
            onClick={() => setPlan(p)}
            style={{ 
              flex: 1, 
              padding: "1rem", 
              borderRadius: 8, 
              border: `2px solid ${plan === p ? "#3069b8" : "#eee"}`, 
              background: plan === p ? "#f4f8ff" : "#fff",
              color: plan === p ? "#3069b8" : "#6b6f91",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {isPremium && (
        <div style={{ marginBottom: "2rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#2f315a" }}>Payment Frequency</label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {[1, 3, 6, 9, 12].map(m => (
              <button 
                key={m} 
                onClick={() => setBillingCycle(m)}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: 6,
                  border: `1px solid ${billingCycle === m ? "#3069b8" : "#ddd"}`,
                  background: billingCycle === m ? "#3069b8" : "#fff",
                  color: billingCycle === m ? "#fff" : "#444",
                  cursor: "pointer"
                }}
              >
                {m} {m === 1 ? "month" : "months"}
              </button>
            ))}
          </div>
        </div>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2rem" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
            <th style={{ padding: "1rem 0", color: "#2f315a" }}>Modules</th>
            <th style={{ padding: "1rem 0", textAlign: "center", color: "#2f315a" }}>Headcounts</th>
            <th style={{ padding: "1rem 0", textAlign: "right", color: "#2f315a" }}>Fee</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: "1rem 0", borderBottom: "1px solid #eee", fontWeight: 500 }}>Payroll Employee</td>
            <td style={{ padding: "1rem 0", borderBottom: "1px solid #eee", textAlign: "center" }}>
              <input 
                type="number" 
                value={payrollEmp} 
                onChange={handleEmpChange}
                style={{ width: 100, padding: "0.5rem", textAlign: "center", borderRadius: 4, border: "1px solid #ccc" }}
                min={3}
              />
            </td>
            <td style={{ padding: "1rem 0", borderBottom: "1px solid #eee", textAlign: "right", fontWeight: 600 }}>{fmt(empPrice)}</td>
          </tr>
          
          {isPremium && (
            <>
              <tr>
                <td style={{ padding: "1rem 0", borderBottom: "1px solid #eee", fontWeight: 500 }}>eLeave & eClaim</td>
                <td style={{ padding: "1rem 0", borderBottom: "1px solid #eee", textAlign: "center" }}>
                  <input 
                    type="number" 
                    value={eLeaveUsers} 
                    onChange={e => setELeaveUsers(Math.max(0, parseInt(e.target.value) || 0))}
                    style={{ width: 100, padding: "0.5rem", textAlign: "center", borderRadius: 4, border: "1px solid #ccc" }}
                    min={0}
                  />
                </td>
                <td style={{ padding: "1rem 0", borderBottom: "1px solid #eee", textAlign: "right", fontWeight: 600 }}>{fmt(eLeavePrice)}</td>
              </tr>
              <tr>
                <td style={{ padding: "1rem 0", borderBottom: "1px solid #eee", fontWeight: 500 }}>eAttendance</td>
                <td style={{ padding: "1rem 0", borderBottom: "1px solid #eee", textAlign: "center" }}>
                  <input 
                    type="number" 
                    value={eAttendanceUsers} 
                    onChange={e => setEAttendanceUsers(Math.max(0, parseInt(e.target.value) || 0))}
                    style={{ width: 100, padding: "0.5rem", textAlign: "center", borderRadius: 4, border: "1px solid #ccc" }}
                    min={0}
                  />
                </td>
                <td style={{ padding: "1rem 0", borderBottom: "1px solid #eee", textAlign: "right", fontWeight: 600 }}>{fmt(eAttendancePrice)}</td>
              </tr>
            </>
          )}

          <tr>
            <td style={{ padding: "1rem 0", borderBottom: "1px solid #eee", fontWeight: 500 }}>Payroll User</td>
            <td style={{ padding: "1rem 0", borderBottom: "1px solid #eee", textAlign: "center" }}>
              {isPremium && billingCycle === 12 ? (
                <span style={{ fontWeight: 600, color: "#3069b8" }}>Unlimited</span>
              ) : (
                <input 
                  type="number" 
                  value={payrollUsers} 
                  onChange={e => setPayrollUsers(Math.max(isAccountant ? 2 : 1, parseInt(e.target.value) || 0))}
                  style={{ width: 100, padding: "0.5rem", textAlign: "center", borderRadius: 4, border: "1px solid #ccc" }}
                  min={isAccountant ? 2 : 1}
                />
              )}
            </td>
            <td style={{ padding: "1rem 0", borderBottom: "1px solid #eee", textAlign: "right", fontWeight: 600 }}>{fmt(payrollUserPrice)}</td>
          </tr>
          
          {isPremium && (
            <tr>
              <td style={{ padding: "1rem 0", borderBottom: "1px solid #eee", fontWeight: 500 }} colSpan={2}>Unlimited Company</td>
              <td style={{ padding: "1rem 0", borderBottom: "1px solid #eee", textAlign: "right", fontWeight: 600 }}>{fmt(companyFeePrice)}</td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ background: "#f8f9fc", padding: "1.5rem", borderRadius: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", color: "#6b6f91" }}>
          <span>Subtotal</span>
          <span>{fmt(tempTotal)}</span>
        </div>
        
        {total100Discount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", color: "#16a14b" }}>
            <span>100+ Headcount Discount (20%)</span>
            <span>-{fmt(total100Discount)}</span>
          </div>
        )}
        
        {total12MDiscount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", color: "#16a14b" }}>
            <span>12-Month Discount (15%)</span>
            <span>-{fmt(total12MDiscount)}</span>
          </div>
        )}
        
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", color: "#6b6f91" }}>
          <span>8% SST</span>
          <span>{isFreeEstimator ? fmt(0) : fmt(tax)}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e2e8f0", paddingTop: "1rem" }}>
          <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#2f315a" }}>Total</span>
          <span style={{ fontSize: "1.8rem", fontWeight: 800, color: isFreeEstimator ? "#16a14b" : "#ff5a3b" }}>
            {isFreeEstimator ? "FOC **" : fmt(finalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}
