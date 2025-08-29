import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'VP of Customer Success',
    company: 'TechFlow',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'OnboardFlo reduced our customer churn by 45% in the first month. The visual progress tracking keeps users engaged throughout the entire setup process.',
    rating: 5
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Head of Product',
    company: 'DataVault',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'The analytics dashboard is incredible. We can see exactly where customers get stuck and optimize our flows in real-time. Game changer for our team.',
    rating: 5
  },
  {
    name: 'Emily Watson',
    role: 'Customer Operations Manager',
    company: 'CloudSync',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'Our support tickets dropped by 60% after implementing OnboardFlo. Customers can now self-serve through the guided onboarding process.',
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Loved by customer success teams
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join hundreds of companies that have transformed their customer onboarding 
            with OnboardFlo's proven platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <div className="relative mb-6">
                <Quote className="w-8 h-8 text-emerald-500 mb-4" />
                <p className="text-gray-700 leading-relaxed">
                  "{testimonial.content}"
                </p>
              </div>
              
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-sm text-emerald-600 font-medium">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}