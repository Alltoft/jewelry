// jsx
import React from 'react';
// import './FAQPage.css';

const FAQPage = () => {
  const faqs = [
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy on all items. Items must be in original condition.',
    },
    {
      question: 'Do you provide international shipping?',
      answer: 'Yes, we ship to over 50 countries worldwide. Shipping fees apply.',
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order ships, you will receive an email with tracking information.',
    },
    // Add more FAQs as needed
  ];

  return (
    <div className="faq-page">
      <h1>Frequently Asked Questions</h1>
      {faqs.map((faq, index) => (
        <div key={index} className="faq-item">
          <h2>{faq.question}</h2>
          <p>{faq.answer}</p>
        </div>
      ))}
    </div>
  );
};

export default FAQPage;