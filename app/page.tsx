'use client';

import { useEffect, useState, FormEvent } from 'react';
import styles from './dashboard.module.css';
import { getTestUsers } from './actions';

type SummaryData = {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  categoryTotals: Record<string, number>;
};

type RecordEntry = {
  id: string;
  amount: number;
  type: string;
  category: string;
  date: string;
  notes: string | null;
  createdAt: string;
};

type UserData = {
  id: string;
  name: string;
  role: string;
};

export default function Dashboard() {
  const [activeView, setActiveView] = useState<'Overview' | 'Transactions'>('Overview');
  
  // Dashboard Data State
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // Transactions Data State
  const [records, setRecords] = useState<RecordEntry[]>([]);
  const [recordsError, setRecordsError] = useState<string | null>(null);
  
  // Role switcher state
  const [users, setUsers] = useState<UserData[]>([]);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // 1. Initial Load: Fetch test users for dropdown mock
  useEffect(() => {
    getTestUsers().then((testUsers) => {
      setUsers(testUsers);
      if (testUsers.length > 0) {
        // Default to the first user (usually Admin or Viewer)
        setCurrentUser(testUsers[0]);
      }
    });
  }, []);

  // 2. Fetch Data whenever Active View or Current User changes
  useEffect(() => {
    if (!currentUser) return;
    setSummaryError(null);
    setRecordsError(null);
    
    if (activeView === 'Overview') {
      fetch('/api/dashboard/summary', { headers: { 'X-User-Id': currentUser.id } })
        .then(async res => {
          const json = await res.json();
          if (!res.ok) throw new Error(json.error || 'Failed to fetch summary');
          return json;
        })
        .then(json => setSummaryData(json))
        .catch(err => setSummaryError(err.message));
    } 
    else if (activeView === 'Transactions') {
      fetchRecords();
    }
  }, [activeView, currentUser]);

  const fetchRecords = () => {
    fetch('/api/records', { headers: { 'X-User-Id': currentUser!.id } })
      .then(async res => {
        const json = await res.json();
        // Validation Constraint Example: Capture 403 gracefully
        if (!res.ok) throw new Error(`${res.status} ${res.statusText} - ${json.error || 'Forbidden'}`);
        return json;
      })
      .then(json => {
        if (Array.isArray(json)) setRecords(json);
        else if (json.records) setRecords(json.records);
        else if (json.data) setRecords(json.data);
        else setRecords([]);
      })
      .catch(err => setRecordsError(err.message));
  };

  const handleAddRecord = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const payload = {
      amount: Number(formData.get('amount')),
      type: formData.get('type') as string,
      category: formData.get('category') as string,
      date: new Date().toISOString(),
      notes: formData.get('notes') as string,
    };

    try {
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': currentUser!.id
        },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText} - ${json.error || 'Failed to add record'}`);
      }
      
      // Success! Re-fetch records and switch view
      fetchRecords();
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setFormError(`Action Denied: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) return <div className={styles.loader}><div className={styles.spinner}></div></div>;

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
            <li 
              className={`${styles.navItem} ${activeView === 'Overview' ? styles.active : ''}`}
              onClick={() => setActiveView('Overview')}
            >
              <div className={styles.navIconGroup}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                Overview
              </div>
              {activeView === 'Overview' && <span>›</span>}
            </li>
            <li 
              className={`${styles.navItem} ${activeView === 'Transactions' ? styles.active : ''}`}
              onClick={() => setActiveView('Transactions')}
            >
              <div className={styles.navIconGroup}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                Transactions
              </div>
              {activeView === 'Transactions' && <span>›</span>}
            </li>
          </ul>
        </div>

        {/* Interactive Role Switcher */}
        <div className={styles.userSection}>
          <div className={styles.navLabel}>Test Role ({currentUser.name})</div>
          
          <div style={{position:'relative'}}>
            <div className={styles.roleSelector} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <div className={styles.roleInner}>
                <div className={styles.roleIndicator} style={{ borderColor: currentUser.role === 'Admin' ? '#fb7185' : currentUser.role === 'Analyst' ? '#eab308' : '#34d399' }}></div>
                {currentUser.role}
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            
            {isDropdownOpen && (
              <div style={{position:'absolute', bottom:'100%', left:0, right:0, backgroundColor:'#1a1c23', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.1)', marginBottom:'8px', overflow:'hidden', zIndex:50}}>
                {users.map(u => (
                  <div key={u.id} style={{padding:'12px 16px', fontSize:'13px', cursor:'pointer', borderBottom:'1px solid rgba(255,255,255,0.05)'}} onClick={() => { setCurrentUser(u); setIsDropdownOpen(false); }}>
                    {u.role} - <span style={{color:'#9ca3af', fontSize:'11px'}}>{u.name}</span>
                  </div>
                ))}
              </div>
            )}
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
            <h1>{activeView === 'Overview' ? 'Dashboard Overview' : 'Transactions Setup'}</h1>
            <p>{activeView === 'Overview' ? 'Your financial summary at a glance' : 'Manage your financial records natively'}</p>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.topRole}>
              <div className={styles.roleIndicator} style={{ borderColor: currentUser.role === 'Admin' ? '#fb7185' : currentUser.role === 'Analyst' ? '#eab308' : '#34d399' }}></div>
              {currentUser.role}
            </div>
          </div>
        </header>

        <div className={styles.contentWrapper}>
          
          {/* VIEW: OVERVIEW */}
          {activeView === 'Overview' && (
            <>
              {summaryError && <div className={styles.errorBox}><strong>API Validation Intercepted:</strong> {summaryError}</div>}
              {!summaryData && !summaryError ? (
                 <div className={styles.loader} style={{height:'300px'}}><div className={styles.spinner}></div></div>
              ) : summaryData && (
                <>
                  <section className={styles.cardsGrid}>
                    {/* Reused Cards */}
                    <div className={`${styles.card} ${styles.cardNet}`}>
                      <div className={styles.cardHeader}>
                        <div className={`${styles.cardIcon} ${styles.iconNet}`}>
                          <svg width="20" height="20" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" fill="none" strokeWidth="2"/><line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="2"/></svg>
                        </div>
                      </div>
                      <h2 className={styles.cardValue}>₹{summaryData.netBalance.toLocaleString('en-IN')}</h2>
                      <span className={styles.cardTitle}>Net Balance</span>
                    </div>

                    <div className={`${styles.card} ${styles.cardIncome}`}>
                      <div className={styles.cardHeader}>
                        <div className={`${styles.cardIcon} ${styles.iconIncome}`}>
                          <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                        </div>
                      </div>
                      <h2 className={styles.cardValue}>₹{summaryData.totalIncome.toLocaleString('en-IN')}</h2>
                      <span className={styles.cardTitle}>Total Income</span>
                    </div>

                    <div className={`${styles.card} ${styles.cardExpense}`}>
                      <div className={styles.cardHeader}>
                        <div className={`${styles.cardIcon} ${styles.iconExpense}`}>
                          <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>
                        </div>
                      </div>
                      <h2 className={styles.cardValue}>₹{summaryData.totalExpense.toLocaleString('en-IN')}</h2>
                      <span className={styles.cardTitle}>Total Expense</span>
                    </div>

                    <div className={`${styles.card} ${styles.cardSavings}`}>
                      <div className={styles.cardHeader}>
                        <div className={`${styles.cardIcon} ${styles.iconSavings}`}>
                          <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                        </div>
                      </div>
                      <h2 className={styles.cardValue}>
                        {summaryData.totalIncome > 0 ? Math.round(((summaryData.totalIncome - summaryData.totalExpense) / summaryData.totalIncome) * 100) : 0}%
                      </h2>
                      <span className={styles.cardTitle}>Savings Rate</span>
                    </div>
                  </section>
                  
                  {/* Doughnut Chart Mock View for Interactivity Context */}
                  {Object.keys(summaryData.categoryTotals).length > 0 && (
                    <section className={styles.chartsSection} style={{marginTop:'24px', gridTemplateColumns:'1fr'}}>
                      <div className={styles.panel}>
                        <div className={styles.panelHeader}>
                          <h3 className={styles.panelTitle}>Spending Breakdown by Category</h3>
                        </div>
                        <div className={styles.legendGrid}>
                          {Object.entries(summaryData.categoryTotals).map(([cat, amount], i) => (
                             <div key={cat} className={styles.legendItem} style={{fontSize:'14px'}}>
                               <div className={`${styles.dot}`} style={{backgroundColor:['#ec4899','#3b82f6','#eab308','#10b981','#6366f1'][i%5]}}></div> 
                               {cat}: <strong style={{color:'white'}}>₹{amount.toLocaleString('en-IN')}</strong>
                             </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  )}
                </>
              )}
            </>
          )}

          {/* VIEW: TRANSACTIONS */}
          {activeView === 'Transactions' && (
            <>
              {/* Add Record Form - Tests Creation Logic */}
              <form className={styles.formBox} onSubmit={handleAddRecord}>
                <div style={{width:'100%', marginBottom:'8px'}}>
                   <h3 className={styles.panelTitle}>Add New Transaction</h3>
                   <p className={styles.panelSub}>Testing backend access controls (Admin only)</p>
                   {formError && <div style={{ color: '#ef4444', marginTop: '12px', fontSize: '13px', background: 'rgba(239, 68, 68, 0.1)', padding:'10px', borderRadius:'8px' }}>{formError}</div>}
                </div>
                
                <div className={styles.formGroup}>
                  <label>Amount (₹)</label>
                  <input type="number" name="amount" required className={styles.inputField} placeholder="e.g. 5000" />
                </div>
                <div className={styles.formGroup}>
                  <label>Type</label>
                  <select name="type" className={styles.inputField} required>
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Category</label>
                  <input type="text" name="category" required className={styles.inputField} placeholder="e.g. Food, Salary" />
                </div>
                <div className={styles.formGroup} style={{flexGrow:1}}>
                  <label>Notes</label>
                  <input type="text" name="notes" className={styles.inputField} placeholder="Description..." />
                </div>
                <div className={styles.formGroup}>
                  <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
                    {isSubmitting ? 'Adding...' : 'Add Record'}
                  </button>
                </div>
              </form>

              {/* Transactions List - Tests Viewing Logic */}
              {recordsError ? (
                <div className={styles.errorBox}><strong>API Access Restricted:</strong> {recordsError} <br/><br/><span style={{fontSize:'12px', color:'#9ca3af'}}>* Backend successfully rejected your request. Switch to Analyst or Admin to view records.</span></div>
              ) : (
                <div className={styles.tableContainer}>
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Notes</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.length === 0 ? (
                        <tr><td colSpan={5} style={{textAlign:'center', padding:'32px'}}>No records found or loading...</td></tr>
                      ) : (
                        records.map(rec => (
                          <tr key={rec.id}>
                            <td>{new Date(rec.date || rec.createdAt).toLocaleDateString()}</td>
                            <td><span className={rec.type === 'INCOME' ? styles.badgeIncome : styles.badgeExpense}>{rec.type}</span></td>
                            <td>{rec.category}</td>
                            <td>{rec.notes || '-'}</td>
                            <td style={{fontWeight:600}}>₹{rec.amount.toLocaleString('en-IN')}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
}
