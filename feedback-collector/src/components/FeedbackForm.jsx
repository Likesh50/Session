import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function FeedbackForm() {
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setNotice('');

    const trimmed = message.trim();
    if (!trimmed || trimmed.length > 1000) {
      setNotice('Message is required (max 1000 chars).');
      return;
    }
    if (rating < 1 || rating > 5) {
      setNotice('Rating must be 1–5.');
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, 'feedback'), {
        message: trimmed,
        rating: Number(rating),
        name: name.trim() || null,
        email: email.trim() || null,
      });

      setMessage('');
      setRating(5);
      setName('');
      setEmail('');
      setNotice('Thanks! Your feedback was submitted.');
    } catch (err) {
      console.error(err);
      setNotice('Could not submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="form">
      <h2>Leave feedback</h2>

      <label>Rating</label>
      <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))}>
        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
      </select>

      <label>Message</label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="What worked well? What can we improve?"
        rows={5}
      />

      <div className="row">
        <div>
          <label>Name (optional)</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Email (optional)</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>

      <button disabled={loading} type="submit">
        {loading ? 'Submitting…' : 'Submit feedback'}
      </button>

      {notice && <p className="notice">{notice}</p>}
    </form>
  );
}
