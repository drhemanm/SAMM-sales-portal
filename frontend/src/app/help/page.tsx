'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  HelpCircle,
  Phone,
  Mail,
  MessageCircle,
  Book,
  Video,
  FileText,
  Search,
  ChevronDown,
  ChevronRight,
  Send,
  ExternalLink,
  CheckCircle,
  Clock,
  User,
} from 'lucide-react';
import MobileLayout from '@/components/MobileLayout';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export default function HelpPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'guides'>('faq');
  
  // Contact Form
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const faqs: FAQ[] = [
    {
      id: 1,
      question: 'How do I create a new order?',
      answer: 'To create a new order, navigate to the Orders page and tap the "New Order" button. Select a customer, add products, review the details, and collect signatures before submitting.',
      category: 'Orders',
    },
    {
      id: 2,
      question: 'What happens when I am offline?',
      answer: 'The app works offline! Your orders will be saved locally and automatically synced to the server when you reconnect to the internet. You can view cached customers and products while offline.',
      category: 'General',
    },
    {
      id: 3,
      question: 'How do I apply discounts to orders?',
      answer: 'When creating an order, you can apply discounts (0-10%) to individual items. Select the discount percentage from the dropdown menu for each product in your cart.',
      category: 'Orders',
    },
    {
      id: 4,
      question: 'Can I view my sales performance?',
      answer: 'Yes! Go to the Analytics page to view your daily, weekly, and monthly performance metrics including sales, orders, new customers, and target achievement.',
      category: 'Analytics',
    },
    {
      id: 5,
      question: 'How do I update customer information?',
      answer: 'Customer information is managed in Odoo. Contact your administrator to update customer details like contact info, credit limits, or payment terms.',
      category: 'Customers',
    },
    {
      id: 6,
      question: 'What temperature requirements apply to products?',
      answer: 'Products are marked with temperature requirements: Frozen (-18°C), Chilled (0-4°C), or Ambient. Always check the temperature badge on product cards and ensure proper cold chain handling.',
      category: 'Products',
    },
    {
      id: 7,
      question: 'How do I check stock availability?',
      answer: 'Stock levels are displayed on each product card. The app checks real-time availability when you create orders to prevent overselling.',
      category: 'Products',
    },
    {
      id: 8,
      question: 'Can I track my order deliveries?',
      answer: 'Yes, go to the order detail page to see the delivery status, timeline, and expected delivery date. You will receive notifications when the status changes.',
      category: 'Orders',
    },
  ];

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production, send to support system
      console.log('Support request:', contactForm);
      
      setSubmitted(true);
      setContactForm({ subject: '', message: '' });
      
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting support request:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const quickLinks = [
    {
      icon: Book,
      title: 'User Guide',
      description: 'Complete documentation',
      color: 'blue',
      action: () => alert('User guide coming soon'),
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Watch how-to videos',
      color: 'red',
      action: () => alert('Video tutorials coming soon'),
    },
    {
      icon: FileText,
      title: 'Release Notes',
      description: "What's new in v2.0",
      color: 'green',
      action: () => alert('Release notes coming soon'),
    },
  ];

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white">
          <div className="p-6 pb-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => router.back()}
                className="p-3 bg-white/20 backdrop-blur-xl rounded-xl hover:bg-white/30 transition-all"
              >
                <ArrowLeft className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg">
                <HelpCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold">Help & Support</h1>
                <p className="text-white/90 text-sm mt-1">
                  We're here to help you
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-300" />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-2xl text-white placeholder:text-white/60 focus:bg-white/30 focus:border-white/50 transition-all outline-none"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('faq')}
              className={`flex-1 px-4 py-4 font-semibold text-sm transition-all ${
                activeTab === 'faq'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              FAQs
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex-1 px-4 py-4 font-semibold text-sm transition-all ${
                activeTab === 'contact'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Contact
            </button>
            <button
              onClick={() => setActiveTab('guides')}
              className={`flex-1 px-4 py-4 font-semibold text-sm transition-all ${
                activeTab === 'guides'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Guides
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 bg-gray-50 space-y-4">
          {activeTab === 'faq' && (
            <>
              {/* Quick Links */}
              {!searchQuery && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {quickLinks.map((link, index) => (
                    <button
                      key={index}
                      onClick={link.action}
                      className="card p-4 text-center hover:shadow-lg transition-all"
                    >
                      <div className={`w-12 h-12 mx-auto mb-2 bg-${link.color}-100 rounded-xl flex items-center justify-center`}>
                        <link.icon className={`h-6 w-6 text-${link.color}-600`} />
                      </div>
                      <p className="text-xs font-semibold text-gray-900 mb-1">
                        {link.title}
                      </p>
                      <p className="text-xxs text-gray-600">{link.description}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* FAQ List */}
              {filteredFAQs.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <Search className="w-full h-full" />
                  </div>
                  <h3 className="empty-state-title">No Results Found</h3>
                  <p className="empty-state-description">
                    Try searching with different keywords
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredFAQs.map((faq) => (
                    <div key={faq.id} className="card">
                      <button
                        onClick={() => toggleFAQ(faq.id)}
                        className="w-full flex items-start justify-between gap-3"
                      >
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xxs font-semibold">
                              {faq.category}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900">
                            {faq.question}
                          </h3>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform ${
                            expandedFAQ === faq.id ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      
                      {expandedFAQ === faq.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 animate-slide-up">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'contact' && (
            <>
              {/* Contact Methods */}
              <div className="space-y-3 mb-6">
                <a
                  href="tel:+27123456789"
                  className="card flex items-center gap-4 hover:shadow-lg transition-all"
                >
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <Phone className="h-7 w-7 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">Call Us</h3>
                    <p className="text-sm text-gray-600">+27 12 345 6789</p>
                    <p className="text-xs text-gray-500 mt-1">Mon-Fri, 8AM-5PM</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </a>

                <a
                  href="mailto:support@sameatmarket.com"
                  className="card flex items-center gap-4 hover:shadow-lg transition-all"
                >
                  <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                    <Mail className="h-7 w-7 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
                    <p className="text-sm text-gray-600">support@sameatmarket.com</p>
                    <p className="text-xs text-gray-500 mt-1">Response within 24 hours</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </a>

                <button
                  onClick={() => alert('WhatsApp support coming soon')}
                  className="card flex items-center gap-4 hover:shadow-lg transition-all w-full"
                >
                  <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center">
                    <MessageCircle className="h-7 w-7 text-emerald-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-gray-900 mb-1">WhatsApp</h3>
                    <p className="text-sm text-gray-600">+27 12 345 6789</p>
                    <p className="text-xs text-gray-500 mt-1">Quick response</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              {/* Success Message */}
              {submitted && (
                <div className="card bg-green-50 border-green-200 animate-slide-up">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900 mb-1">
                        Request Submitted!
                      </p>
                      <p className="text-sm text-green-700">
                        We've received your message and will respond within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Form */}
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Send className="h-5 w-5 text-emerald-600" />
                  Send us a Message
                </h3>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, subject: e.target.value })
                      }
                      placeholder="What do you need help with?"
                      required
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, message: e.target.value })
                      }
                      placeholder="Describe your issue or question..."
                      required
                      rows={5}
                      className="input-field resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full"
                  >
                    {submitting ? (
                      <>
                        <div className="spinner"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Support Hours */}
              <div className="card bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 mb-2">Support Hours</p>
                    <div className="space-y-1 text-sm text-blue-800">
                      <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                      <p>Saturday: 9:00 AM - 1:00 PM</p>
                      <p>Sunday & Public Holidays: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'guides' && (
            <>
              {/* Getting Started */}
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-4">Getting Started</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => alert('Guide coming soon')}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-900">Setting Up Your Profile</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                  <button
                    onClick={() => alert('Guide coming soon')}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="font-medium text-gray-900">Creating Your First Order</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                  <button
                    onClick={() => alert('Guide coming soon')}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Book className="h-5 w-5 text-purple-600" />
                      </div>
                      <span className="font-medium text-gray-900">Managing Customers</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Video Tutorials */}
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-4">Video Tutorials</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => alert('Video coming soon')}
                    className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Video className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-gray-900 mb-1">
                        Complete App Overview
                      </p>
                      <p className="text-xs text-gray-600">12 minutes • Watch now</p>
                    </div>
                    <ExternalLink className="h-5 w-5 text-gray-400" />
                  </button>
                  <button
                    onClick={() => alert('Video coming soon')}
                    className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                      <Video className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-gray-900 mb-1">
                        Order Processing Tutorial
                      </p>
                      <p className="text-xs text-gray-600">8 minutes • Watch now</p>
                    </div>
                    <ExternalLink className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Documentation */}
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-4">Documentation</h3>
                <button
                  onClick={() => alert('Documentation coming soon')}
                  className="w-full p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl hover:border-emerald-300 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Book className="h-6 w-6 text-emerald-600" />
                      <div className="text-left">
                        <p className="font-bold text-emerald-900">Full User Manual</p>
                        <p className="text-xs text-emerald-700">Complete documentation</p>
                      </div>
                    </div>
                    <ExternalLink className="h-5 w-5 text-emerald-600" />
                  </div>
                </button>
              </div>
            </>
          )}

          {/* Bottom Padding */}
          <div className="h-4"></div>
        </div>
      </div>
    </MobileLayout>
  );
}
