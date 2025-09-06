import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, limit, query } from 'firebase/firestore';

export default function FeedbackList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'feedback'), limit(50));
    const unsub = onSnapshot(q, (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(rows);
    });
    return () => unsub();
  }, []);

  return (
    <div>
      <h2>Recent feedback</h2>
      {items.length === 0 ? (
        <p className="muted">No feedback yet. Be the first!</p>
      ) : (
        <ul className="list">
          {items.map((f) => (
            <li key={f.id} className="list-item">
              <div className="list-head">
                <strong>
                  {'⭐'.repeat(f.rating || 0)}
                  <span className="muted"> ({f.rating}/5)</span>
                </strong>
              </div>
              <p>{f.message}</p>
              <div className="muted small">
                {(f.name || 'Anonymous')}
                {f.email ? ` • ${f.email}` : ''}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
