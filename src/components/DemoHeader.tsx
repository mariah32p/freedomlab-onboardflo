import React from 'react';
import { Workflow, Bell, User } from 'lucide-react';

export default function DemoHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center mr-4">
                <Workflow className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 font-sans">OnboardFlo</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-8">
              <button className="text-emerald-600 hover:text-emerald-700 transition-colors font-medium font-sans border-b-2 border-emerald-500 pb-1">
                Dashboard
              </button>
              <button className="text-gray-600 hover:text-gray-900 transition-colors font-medium font-sans">
                Checklists
              </button>
              <button className="text-gray-600 hover:text-gray-900 transition-colors font-medium font-sans">
                Submissions
              </button>
              <button className="text-gray-600 hover:text-gray-900 transition-colors font-medium font-sans">
                Branding
              </button>
              <button className="text-gray-600 hover:text-gray-900 transition-colors font-medium font-sans">
                Settings
              </button>
            </nav>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold font-sans">JD</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 font-sans">John Doe</div>
                  <div className="text-xs text-gray-500 font-sans">john@designstudio.com</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <User className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}