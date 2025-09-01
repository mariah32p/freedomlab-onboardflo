import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Mariah W.',
    industry: 'Technology & Software',
    content: 'OnboardFlo streamlined our client onboarding process completely. The visual progress tracking keeps our customers engaged and we can see exactly where they need help.',
    rating: 5
  },
  {
    name: 'Nathan R.',
    industry: 'Legal Services',
    content: 'The dashboard gives us clear visibility into our client onboarding process. We can track progress and identify where clients need additional support.',
    rating: 5
  },
  {
    name: 'Amber I.',
    industry: 'Design & Insurance',
    content: 'The brand customization features let us create onboarding experiences that perfectly match our clients\' brands. The template system saved us hours of setup time.',
    rating: 5
  }
];
export default function SocialProof() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-sans">
            What professionals are saying
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-sans">
            Real feedback from professionals using OnboardFlo to improve their customer onboarding.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Rating */}
              <div className="flex items-center mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <div className="mb-6">
                <Quote className="w-8 h-8 text-emerald-500 mb-4" />
                <blockquote className="text-gray-700 leading-relaxed font-sans text-base mb-4">
                  "{testimonial.content}"
                </blockquote>
                <div className="font-semibold text-gray-900 font-sans">{testimonial.name}</div>
                <div className="text-sm text-emerald-600 font-medium font-sans">{testimonial.industry}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}