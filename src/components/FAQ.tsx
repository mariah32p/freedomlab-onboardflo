import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'How quickly can I set up my first onboarding checklist?',
    answer: 'Most users create their first checklist in under 10 minutes. You can start with one of our proven templates or build from scratch using our simple drag-and-drop builder.'
  },
  {
    question: 'Do my customers need to create accounts to use the checklists?',
    answer: 'No! Your customers simply click a link you send them and can complete the checklist immediately. No signups or downloads required on their end. Note: Pro users can optionally add password protection to their checklists for extra security.'
  },
  {
    question: 'Can I customize the look and feel to match my brand?',
    answer: 'Absolutely. You can upload your logo, set custom colors, choose fonts, and even customize the completion message. Your checklists will look like a natural extension of your brand.'
  },
  {
    question: 'What happens if a customer gets stuck or needs help?',
    answer: 'You\'ll see real-time progress in your dashboard and can identify exactly where customers need assistance. You can reach out proactively when someone hasn\'t made progress.'
  },
  {
    question: 'Is there a limit to how many checklists I can create?',
    answer: 'The Standard plan includes up to 3 active checklists, while the Pro plan offers unlimited checklists. You can always upgrade as your needs grow.'
  },
  {
    question: 'How does the 7-day free trial work?',
    answer: 'Your trial includes full access to all features. We\'ll collect your payment information upfront, but you won\'t be charged until after your 7-day trial ends. Cancel anytime during the trial with no charges.'
  },
  {
    question: 'How secure is customer data and file uploads?',
    answer: 'All customer data is stored securely in our database with proper access controls. Currently, file uploads capture filenames for tracking purposes. All data transmission is encrypted, and you maintain full control over your customer data through your dashboard.'
  },
  {
    question: 'What kind of analytics and reporting do you provide?',
    answer: 'You\'ll get detailed insights including completion rates, average time to complete, drop-off points, and individual customer progress. Use this data to continuously optimize your onboarding process.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-sans">
            Frequently asked questions
          </h2>
          <p className="text-xl text-gray-600 font-sans">
            Everything you need to know about OnboardFlo
          </p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-6 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-inset rounded-xl"
              >
                <h3 className="text-lg font-semibold text-gray-900 font-sans pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed font-sans">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}