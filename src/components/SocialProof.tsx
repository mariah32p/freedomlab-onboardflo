import React from 'react';
import { Star, TrendingUp, Users, Award, CheckCircle, Building, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Mariah W.',
    role: 'Operations Director',
    company: 'Tech Solutions',
    industry: 'Technology & Software',
    content: 'OnboardFlo streamlined our client onboarding process completely. The visual progress tracking keeps our customers engaged and we can see exactly where they need help.',
    rating: 5,
    metric: 'Streamlined process',
    timeframe: 'Immediate impact'
  },
  {
    name: 'Nathan R.',
    role: 'IT Manager',
    company: 'Legal Services Group',
    industry: 'Legal Services',
    content: 'The dashboard gives us clear visibility into our client onboarding process. We can track progress and identify where clients need additional support.',
    rating: 5,
    metric: 'Clear visibility',
    timeframe: 'Day one'
  },
  {
    name: 'Amber I.',
    role: 'Creative Director',
    company: 'Design Studio',
    industry: 'Design & Insurance',
    content: 'The brand customization features let us create onboarding experiences that perfectly match our clients\' brands. The template system saved us hours of setup time.',
    rating: 5,
    metric: 'Perfect branding',
    timeframe: 'Setup complete'
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
            Trusted by professionals who value efficiency
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-sans">
            See how OnboardFlo helps professionals across different industries 
            create better onboarding experiences.
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

              {/* Quote icon and testimonial info */}
              <div className="mb-6">
                <Quote className="w-8 h-8 text-emerald-500 mb-4" />
                <div className="font-semibold text-gray-900 font-sans">{testimonial.name}</div>
                <div className="text-sm text-gray-600 font-sans">{testimonial.role}</div>
                <div className="text-sm text-emerald-600 font-medium font-sans">{testimonial.company}</div>
                <div className="text-xs text-gray-500 font-sans">{testimonial.industry}</div>
              </div>
              
              <blockquote className="text-gray-700 leading-relaxed font-sans text-base">
                "{testimonial.content}"
              </blockquote>
            </div>
          ))}
        </div>

        {/* Additional Trust Elements */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 font-sans">
              Built for professionals who value quality
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-lg md:text-xl font-bold text-gray-900 font-sans">Quick Setup</div>
                <div className="text-sm text-gray-600 font-sans">Get your first checklist live in minutes</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-lg md:text-xl font-bold text-gray-900 font-sans">Real-Time Tracking</div>
                <div className="text-sm text-gray-600 font-sans">See customer progress as it happens</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Building className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-lg md:text-xl font-bold text-gray-900 font-sans">Professional Templates</div>
                <div className="text-sm text-gray-600 font-sans">Industry-specific starting points</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}