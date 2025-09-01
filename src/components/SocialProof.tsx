import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Mariah W.',
    role: 'VP of Customer Success',
    industry: 'Technology',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
    content: 'OnboardFlo reduced our customer churn by 45% in the first month. The visual progress tracking keeps users engaged throughout the entire setup process.',
    rating: 5
  },
  {
    name: 'Diane R.',
    role: 'Head of Operations',
    industry: 'Professional Services',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
    content: 'The analytics dashboard is incredible. We can see exactly where customers get stuck and optimize our flows in real-time. Game changer for our team.',
    rating: 5
  },
  {
    name: 'Nathan R.',
    role: 'IT Director',
    industry: 'Legal Services',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
    content: 'Our support tickets dropped by 60% after implementing OnboardFlo. Customers can now self-serve through the guided onboarding process.',
    rating: 5
  }
];

export default function SocialProof() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-sans">
            Trusted by customer success teams
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
            Join hundreds of companies that have transformed their customer onboarding 
            with OnboardFlo's proven platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Desktop Layout */}
              <div className="hidden md:flex items-start space-x-4 mb-6">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-15 h-15 rounded-full object-cover flex-shrink-0"
                  style={{ width: '60px', height: '60px' }}
                />
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <div className="font-semibold text-gray-900 font-sans">{testimonial.name}</div>
                  <div className="text-sm text-gray-600 font-sans">{testimonial.role}</div>
                  <div className="text-sm text-emerald-600 font-medium font-sans">{testimonial.industry}</div>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="md:hidden text-center mb-6">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mx-auto mb-3"
                />
                <div className="flex items-center justify-center mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="font-semibold text-gray-900 font-sans">{testimonial.name}</div>
                <div className="text-sm text-gray-600 font-sans">{testimonial.role}</div>
                <div className="text-sm text-emerald-600 font-medium font-sans">{testimonial.industry}</div>
              </div>
              
              <p className="text-gray-700 leading-relaxed font-sans text-base">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}