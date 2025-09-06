import { useEffect } from 'react';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import { ensureAnonAuth, setupAppCheck } from './firebase';
import './index.css';


export default function App() {
  useEffect(() => {
  setupAppCheck();
  ensureAnonAuth();
}, []);


return (
  <div className="container">
    <h1>Feedback Collector</h1>
    <p className="sub">Share your thoughts to help us improve !!!</p>
    <div className="grid">
      <div className="card"><FeedbackForm /></div>
      <div className="card"><FeedbackList /></div>
    </div>
  </div>
);
}