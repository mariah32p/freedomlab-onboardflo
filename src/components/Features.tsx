import React from 'react';
import { CheckCircle, Link, BarChart3, Smartphone, Palette, Eye } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: CheckCircle,
      title: 'Visual Checklist Builder',
      description: 'Simple form to create checklists with steps, descriptions, and links. Build professional onboarding flows in minutes.',
    },
    {
      icon: Link,
      title: 'Shareable Checklist Links',
      description: 'Each checklist gets a public URL customers can visit. No logins required - just send the link and track progress.',
    },
    {
      icon: Eye,
      title: 'Progress Tracking',
      description: 'See which customers completed which steps via email collection. Know exactly where each client stands.',
    },
    {
      icon: Smartphone,
      title: 'Customer Experience',
      description: 'Clean, mobile-friendly checklist page that customers visit. Professional appearance that reflects your brand.',
    },
    {
      icon: BarChart3,
      title: 'Basic Analytics',
      description: 'Completion rates and common drop-off points. Understand where customers need more help.',
    },
    {
      icon: Palette,
      title: 'Simple Branding',
      description: 'Add your logo and colors to public checklist pages. Maintain brand consistency throughout the process.',
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-sans">
            Everything you need for client onboarding
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
            Core features that work for agencies, consultants, and SaaS companies
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="p-6 rounded-xl border border-gray-200 hover:border-emerald-300 transition-colors group">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                  <Icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-sans">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed font-sans">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}