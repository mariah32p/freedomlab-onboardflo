import React from 'react';
import { Star, TrendingUp, Users, Award, CheckCircle, Building } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'VP of Customer Success',
    company: 'TechFlow Solutions',
    industry: 'B2B SaaS',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
    content: 'OnboardFlo reduced our customer churn by 45% in the first month. The visual progress tracking keeps users engaged throughout the entire setup process. Our support tickets dropped dramatically.',
    rating: 5,
    metric: '45% less churn',
    timeframe: 'First month'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Head of Product',
    company: 'DataVault Inc',
    industry: 'Enterprise Software',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
    content: 'The analytics dashboard is incredible. We can see exactly where customers get stuck and optimize our flows in real-time. Game changer for our customer success team.',
    rating: 5,
    metric: '3x faster setup',
    timeframe: 'Within 2 weeks'
  },
  {
    name: 'Emily Watson',
    role: 'Customer Operations Manager',
    company: 'CloudSync Pro',
    industry: 'Cloud Services',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
    content: 'Our support tickets dropped by 60% after implementing OnboardFlo. Customers can now self-serve through the guided onboarding process. The ROI was immediate.',
    rating: 5,
    metric: '60% fewer tickets',
    timeframe: 'First quarter'
  }
];

const trustIndicators = [
  { icon: Users, value: '500+', label: 'Companies Trust Us' },
  { icon: TrendingUp, value: '87%', label: 'Average Completion Rate' },
  { icon: Award, value: '4.9/5', label: 'Customer Rating' },
  { icon: CheckCircle, value: '99.9%', label: 'Uptime Guarantee' }
];
export default function SocialProof() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Indicators */}
        <div className="text-center mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12">
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <indicator.icon className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 font-sans">{indicator.value}</div>
                <div className="text-sm md:text-base text-gray-600 font-sans">{indicator.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-sans">
            Trusted by customer success teams worldwide
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-sans">
            Join hundreds of companies that have transformed their customer onboarding 
            with OnboardFlo's proven platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Results Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center mb-2 md:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1">
                  <div className="text-xs md:text-sm font-bold text-emerald-700 font-sans">{testimonial.metric}</div>
                  <div className="text-xs text-emerald-600 font-sans">{testimonial.timeframe}</div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex items-start space-x-4 mb-6">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-15 h-15 rounded-full object-cover flex-shrink-0"
                  style={{ width: '60px', height: '60px' }}
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 font-sans">{testimonial.name}</div>
                  <div className="text-sm text-gray-600 font-sans">{testimonial.role}</div>
                  <div className="text-sm text-emerald-600 font-medium font-sans">{testimonial.company}</div>
                  <div className="text-xs text-gray-500 font-sans">{testimonial.industry}</div>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="md:hidden text-center mb-6">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mx-auto mb-3"
                />
                <div className="font-semibold text-gray-900 font-sans">{testimonial.name}</div>
                <div className="text-sm text-gray-600 font-sans">{testimonial.role}</div>
                <div className="text-sm text-emerald-600 font-medium font-sans">{testimonial.company}</div>
                <div className="text-xs text-gray-500 font-sans">{testimonial.industry}</div>
              </div>
              
              <blockquote className="text-gray-700 leading-relaxed font-sans text-base italic border-l-4 border-emerald-200 pl-4">
                "{testimonial.content}"
              </blockquote>
            </div>
          ))}
        </div>

        {/* Additional Trust Elements */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 font-sans">
              Join the companies improving their onboarding
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-lg md:text-xl font-bold text-gray-900 font-sans">Enterprise Ready</div>
                <div className="text-sm text-gray-600 font-sans">SOC 2 compliant infrastructure</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-lg md:text-xl font-bold text-gray-900 font-sans">5-Minute Setup</div>
                <div className="text-sm text-gray-600 font-sans">Get your first checklist live instantly</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-lg md:text-xl font-bold text-gray-900 font-sans">24/7 Support</div>
                <div className="text-sm text-gray-600 font-sans">Expert help when you need it</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}