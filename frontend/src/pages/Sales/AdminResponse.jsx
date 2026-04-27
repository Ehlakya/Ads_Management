import React, { useEffect, useState } from 'react';
import { ShieldCheck, Clock, XCircle, Building2, Megaphone, DollarSign, MessageSquare } from 'lucide-react';
import salesService from '../../services/salesService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const AdminResponse = () => {
  const { user } = useAuth();
  const [myRequests, setMyRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const response = await salesService.getSales();
      // Filter only requests made by this agent
      const filtered = response.data.filter(req => req.agent_id === user.id);
      setMyRequests(filtered);
    } catch (error) {
      toast.error('Failed to load response data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-response-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Admin Response Hub</h1>
          <p className="page-subtitle">Track the authorization status of your submitted sales requests.</p>
        </div>
      </header>

      <div className="responses-grid">
        {isLoading ? (
          <div className="loading-state">Loading your requests...</div>
        ) : myRequests.length > 0 ? (
          myRequests.map((req) => (
            <div key={req.id} className={`response-card glass-card ${req.status}`}>
              <div className="card-badge">
                {req.status === 'approved' ? <ShieldCheck size={20} /> : req.status === 'rejected' ? <XCircle size={20} /> : <Clock size={20} />}
                <span>{req.status.toUpperCase()}</span>
              </div>
              
              <div className="card-body">
                <div className="campaign-box">
                  <Megaphone size={16} />
                  <h4>{req.ad_title}</h4>
                </div>
                
                <div className="info-row">
                  <Building2 size={16} className="text-muted" />
                  <span>{req.theater_name}</span>
                </div>
                
                <div className="info-row">
                  <DollarSign size={16} className="text-muted" />
                  <span className="amount">${Number(req.sale_amount).toLocaleString()}</span>
                </div>
              </div>

              <div className="admin-feedback">
                <div className="feedback-header">
                  <MessageSquare size={14} />
                  <span>Official Response</span>
                </div>
                <p>
                  {req.status === 'approved' 
                    ? "Authorization granted. You may now proceed with the final billing and campaign activation for this theater."
                    : req.status === 'rejected'
                    ? "Request declined. Please review the campaign details and budget constraints before resubmitting."
                    : "Your request is currently under review by the administration. Please check back later."}
                </p>
              </div>
              
              <div className="card-footer">
                <span>Submitted: {new Date(req.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-responses glass-card">
            <Clock size={48} className="text-muted" />
            <h3>No pending or past responses</h3>
            <p>Your submitted sales requests will appear here once you initiate them.</p>
          </div>
        )}
      </div>

      <style>{`
        .admin-response-page {
          animation: fadeIn 0.4s ease-out;
        }

        .responses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .response-card {
          display: flex;
          flex-direction: column;
          padding: 0;
          overflow: hidden;
          border: 1px solid var(--border);
          transition: transform 0.2s ease;
        }

        .response-card:hover {
          transform: translateY(-5px);
        }

        .card-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          font-weight: 800;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
        }

        .response-card.approved .card-badge { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .response-card.rejected .card-badge { background: rgba(239, 68, 68, 0.1); color: var(--error); }
        .response-card.pending .card-badge { background: rgba(99, 102, 241, 0.1); color: var(--primary); }

        .card-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .campaign-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--primary);
        }

        .campaign-box h4 { font-size: 1.125rem; font-weight: 700; color: white; }

        .info-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-muted);
        }

        .info-row .amount {
          color: white;
          font-weight: 700;
          font-size: 1.25rem;
        }

        .admin-feedback {
          padding: 1.25rem 1.5rem;
          background: rgba(255,255,255,0.02);
          border-top: 1px solid var(--border);
          flex: 1;
        }

        .feedback-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }

        .admin-feedback p {
          font-size: 0.875rem;
          line-height: 1.6;
          color: var(--text-muted);
          font-style: italic;
        }

        .card-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--border);
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .empty-responses {
          grid-column: 1 / -1;
          padding: 5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default AdminResponse;
