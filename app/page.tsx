'use client';

import { useEffect, useState } from 'react';
import styles from './dashboard.module.css';

type SummaryData = {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  categoryTotals: Record<string, number>;
};

export default function Dashboard() {
  const [data, setData] = useState<SummaryData | any>(null);
  const adminId = 'cmnm0108h0000140a9p76bpy3';

  useEffect(() => {
    fetch('/api/dashboard/summary', {
      headers: { 'X-User-Id': adminId }
    })
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err));
  }, []);

  if (!data) {
    return (
      <div className={styles.loader}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className={styles.loader}>
        <div style={{ color: '#ef4444', textAlign: 'center' }}>
          <h2>API Error</h2>
          <p>{data.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.logoIcon}>Z</div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>Zorvyn</span>
            <span className={styles.brandSub}>Fintech</span>
          </div>
        </div>

        <div className={styles.navSection}>
          <div className={styles.navLabel}>Navigation</div>
          <ul className={styles.navList}>
            <li className={`${styles.navItem} ${styles.active}`}>
              <div className={styles.navIconGroup}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                Overview
              </div>
              <span>›</span>
            </li>
            <li className={styles.navItem}>
              <div className={styles.navIconGroup}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                Transactions
              </div>
            </li>
            <li className={styles.navItem}>
              <div className={styles.navIconGroup}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                Insights
              </div>
            </li>
          </ul>
        </div>

        <div className={styles.userSection}>
          <div className={styles.navLabel}>Role</div>
          <div className={styles.roleSelector}>
            <div className={styles.roleInner}>
              <div className={styles.roleIndicator}></div>
              Viewer
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
          
          <div className={styles.darkModeToggle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            Dark Mode On
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Header */}
        <header className={styles.topBar}>
          <div className={styles.pageTitle}>
            <h1>Dashboard Overview</h1>
            <p>Your financial summary at a glance</p>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.topRole}>
              <div className={styles.roleIndicator}></div>
              Viewer
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginLeft:'4px'}}><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            <button className={styles.iconBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </button>
          </div>
        </header>

        <div className={styles.contentWrapper}>
          {/* Stats Grid */}
          <section className={styles.cardsGrid}>
            <div className={`${styles.card} ${styles.cardNet}`}>
              <div className={styles.cardHeader}>
                <div className={`${styles.cardIcon} ${styles.iconNet}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                </div>
                <div className={styles.cardBadge}>+79%</div>
              </div>
              <h2 className={styles.cardValue}>₹{data.netBalance.toLocaleString('en-IN')}</h2>
              <span className={styles.cardTitle}>Net Balance</span>
            </div>

            <div className={`${styles.card} ${styles.cardIncome}`}>
              <div className={styles.cardHeader}>
                <div className={`${styles.cardIcon} ${styles.iconIncome}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                </div>
              </div>
              <h2 className={styles.cardValue}>₹{data.totalIncome.toLocaleString('en-IN')}</h2>
              <span className={styles.cardTitle}>Total Income<br/><span style={{textTransform:'none', fontSize:'10px', color:'#6b7280'}}>Salary + Freelance + More</span></span>
            </div>

            <div className={`${styles.card} ${styles.cardExpense}`}>
              <div className={styles.cardHeader}>
                <div className={`${styles.cardIcon} ${styles.iconExpense}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline><polyline points="16 17 22 17 22 11"></polyline></svg>
                </div>
              </div>
              <h2 className={styles.cardValue}>₹{data.totalExpense.toLocaleString('en-IN')}</h2>
              <span className={styles.cardTitle}>Total Expense<br/><span style={{textTransform:'none', fontSize:'10px', color:'#6b7280'}}>Across all categories</span></span>
            </div>

            <div className={`${styles.card} ${styles.cardSavings}`}>
              <div className={styles.cardHeader}>
                <div className={`${styles.cardIcon} ${styles.iconSavings}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                </div>
              </div>
              <h2 className={styles.cardValue}>
                {data.totalIncome > 0 ? Math.round(((data.totalIncome - data.totalExpense) / data.totalIncome) * 100) : 0}%
              </h2>
              <span className={styles.cardTitle}>Savings Rate<br/><span style={{textTransform:'none', fontSize:'10px', color:'#6b7280'}}>Of total income saved</span></span>
            </div>
          </section>

          {/* Charts Row */}
          <section className={styles.chartsSection}>
            {/* Line Chart */}
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>Monthly Cash Flow</h3>
                <p className={styles.panelSub}>Income vs Expense trend</p>
              </div>
              
              <div className={styles.lineChartArea}>
                <div className={styles.chartGrid}>
                  <div className={styles.gridLine}><span className={styles.gridLabel}>₹1.4L</span><div className={styles.gridDash}></div></div>
                  <div className={styles.gridLine}><span className={styles.gridLabel}>₹1.1L</span><div className={styles.gridDash}></div></div>
                  <div className={styles.gridLine}><span className={styles.gridLabel}>₹70.0K</span><div className={styles.gridDash}></div></div>
                  <div className={styles.gridLine}><span className={styles.gridLabel}>₹35.0K</span><div className={styles.gridDash}></div></div>
                  <div className={styles.gridLine}><span className={styles.gridLabel}>₹0</span><div className={styles.gridDash}></div></div>
                </div>
                
                <div className={styles.chartXAxis}>
                  <span className={styles.xLabel}>Jan 26</span>
                  <span className={styles.xLabel}>Feb 26</span>
                  <span className={styles.xLabel}>Mar 26</span>
                </div>

                <svg className={styles.svgChart} preserveAspectRatio="none" viewBox="0 0 600 200">
                  <defs>
                    <linearGradient id="gradGreen" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(16, 185, 129, 0.2)" />
                      <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
                    </linearGradient>
                    <linearGradient id="gradRed" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(244, 63, 94, 0.2)" />
                      <stop offset="100%" stopColor="rgba(244, 63, 94, 0)" />
                    </linearGradient>
                  </defs>
                  
                  {/* Income Area & Line */}
                  <path d="M0,80 C200,80 400,60 600,30 L600,200 L0,200 Z" className={styles.chartAreaGreen} />
                  <path d="M0,80 C200,80 400,60 600,30" className={styles.chartLineGreen} />
                  
                  {/* Expense Area & Line */}
                  <path d="M0,160 C200,160 400,155 600,140 L600,200 L0,200 Z" className={styles.chartAreaRed} />
                  <path d="M0,160 C200,160 400,155 600,140" className={styles.chartLineRed} />
                </svg>
              </div>
            </div>

            {/* Doughnut Chart */}
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>Spending Breakdown</h3>
                <p className={styles.panelSub}>By category</p>
              </div>
              
              <div className={styles.doughnutContainer}>
                <div className={styles.doughnutRing}>
                  <div className={styles.doughnutInner}></div>
                </div>

                <div className={styles.legendGrid}>
                  <div className={styles.legendItem}><div className={`${styles.dot} ${styles.dotPink}`}></div> Entertainment</div>
                  <div className={styles.legendItem}><div className={`${styles.dot} ${styles.dotBlue}`}></div> Food & Dining</div>
                  <div className={styles.legendItem}><div className={`${styles.dot} ${styles.dotYellow}`}></div> Investment</div>
                  <div className={styles.legendItem}><div className={`${styles.dot} ${styles.dotGreen}`}></div> Shopping</div>
                  <div className={styles.legendItem}><div className={`${styles.dot} ${styles.dotIndigo}`}></div> Transportation</div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
