'use client';

import styles from '../../src/styles/Contact.module.css';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormStatus('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Submission failed');

      setFormStatus(data.message);
    } catch (error) {
      setFormStatus(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); // Clear form
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Contact Us</h1>
      </header>
      <section className={styles.contactInfo}>
        <div className={styles.infoColumn}>
          <h2>Customer Service</h2>
          <p>
            <span className={styles.icon}>📞</span>
            <strong>Phone:</strong> <a href="tel:18005551234">1-800-555-1234</a>
          </p>
          <p>
            <span className={styles.icon}>📧</span>
            <strong>Email:</strong> <a href="mailto:support@autotrustco.com">support@autotrustco.com</a>
          </p>
          <p>
            <span className={styles.icon}>⏰</span>
            <strong>Hours:</strong> Monday - Friday, 9 AM - 5 PM EST
          </p>
        </div>
        <div className={styles.infoColumn}>
          <h2>Head Office</h2>
          <p>
            <span className={styles.icon}>🏢</span>
            123 Auto Drive
          </p>
          <p>Toronto, ON M5V 2T6</p>
          <p>Canada</p>
        </div>
      </section>
      <section className={styles.contactForm}>
        <h2>Send Us a Message</h2>
        {formStatus && <p className={styles.formStatus}>{formStatus}</p>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your Name"
              disabled={isLoading}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Your Email"
              disabled={isLoading}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Your Phone Number"
              disabled={isLoading}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="Subject of Your Message"
              disabled={isLoading}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Your Message"
              disabled={isLoading}
            ></textarea>
          </div>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Submit'}
          </button>
        </form>
      </section>
      <section className={styles.resources}>
        <h2>Additional Resources</h2>
        <div className={styles.resourceLinks}>
          <a href="/faqs" className={styles.resourceLink}>FAQs</a>
          <a href="#" className={styles.resourceLink}>Chat with Us (Coming Soon)</a>
          <div className={styles.socialLinks}>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              🐦 Twitter
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              📘 Facebook
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              📸 Instagram
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}