import { useState, useMemo } from 'react';
import { ArrowRight } from "lucide-react";
import Navbar from '../NavBar/NavBar'
import Footer from '../Footer/Footer'

const returnSections = [
  {
    id: 'eligibility',
    title: 'Return Eligibility',
    content: (
      <>
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          30-Day Return Window
        </h3>
        <p className="text-base text-gray-700 leading-relaxed">
          We accept returns within 30 days of delivery for most products. Items must be in original condition, unused, and in original packaging with all accessories and documentation. Custom-built PCs and personalized products may have different return conditions due to their bespoke nature. Please contact us before initiating any return to ensure eligibility.
        </p>
      </>
    )
  },
  {
    id: 'nonReturnable',
    title: 'Non-Returnable Items',
    content: (
      <p className="text-base text-gray-700 leading-relaxed">
        Certain items cannot be returned, including: opened software, personalized or custom-built products (unless defective), items damaged by misuse, and products that have been modified or altered. Digital products and gift cards are also non-returnable. Components that have been installed or used in a system may not be eligible for return unless defective upon arrival.
      </p>
    )
  },
  {
    id: 'process',
    title: 'Return Process',
    content: (
      <p className="text-base text-gray-700 leading-relaxed">
        To initiate a return, contact our customer service team with your order number and reason for return. We will provide you with a Return Merchandise Authorization (RMA) number and return instructions. Items must be securely packaged and shipped to our designated return address. Return shipping costs are the responsibility of the customer unless the item is defective or we made an error.
      </p>
    )
  },
  {
    id: 'refund',
    title: 'Refund Processing',
    content: (
      <p className="text-base text-gray-700 leading-relaxed">
        Refunds are processed within 5-7 business days after we receive and inspect the returned item. Refunds will be issued to the original payment method used for purchase. For Razorpay payments, refunds typically appear within 3-5 business days. Cash on delivery refunds will be processed via bank transfer. Direct bank transfer refunds will be credited to the same account within 2-3 business days.
      </p>
    )
  },
  {
    id: 'exchanges',
    title: 'Exchanges',
    content: (
      <p className="text-base text-gray-700 leading-relaxed">
        We offer exchanges for defective items or if we sent the wrong product. If you need to exchange an item for a different model or specification, this will be treated as a return and new purchase. Price differences, if any, will be charged or refunded accordingly. Custom PC exchanges are evaluated on a case-by-case basis.
      </p>
    )
  },
  {
    id: 'warranty',
    title: 'Warranty Claims',
    content: (
      <p className="text-base text-gray-700 leading-relaxed">
        Products covered under manufacturer warranty should be directed to the respective manufacturer for warranty service. For Maxtreo custom builds, we provide our own warranty terms as specified at the time of purchase. Warranty claims do not fall under our standard return policy and are handled separately through our technical support team.
      </p>
    )
  },
  {
    id: 'damaged',
    title: 'Damaged or Defective Items',
    content: (
      <p className="text-base text-gray-700 leading-relaxed">
        If you receive a damaged or defective item, please contact us immediately with photos of the damage and packaging. We will arrange for replacement or repair at no cost to you, including return shipping. For custom PCs, our technical team will diagnose the issue and provide appropriate resolution, which may include on-site service for local customers.
      </p>
    )
  },
  {
    id: 'cancellation',
    title: 'Cancellation Policy',
    content: (
      <p className="text-base text-gray-700 leading-relaxed">
        Orders can be cancelled before shipping at no charge. Once an order has been shipped, cancellation is not possible, and the standard return policy applies. Custom PC orders may be cancelled before the build process begins. If components have been ordered or the build has started, cancellation fees may apply to cover non-returnable components.
      </p>
    )
  },
  {
    id: 'contact',
    title: 'Contact for Returns',
    content: (
      <>
        <p className="text-base text-gray-700 leading-relaxed">
          For all return and refund inquiries, please contact us at:
        </p>
        <p className="text-base text-gray-700 leading-relaxed">
          <strong className="text-gray-900">Maxtreo</strong>
        </p>
        <button 
          className="flex items-center bg-gray-500 hover:bg-gray-600 text-white rounded-full py-3 px-6 mt-4 transition-all duration-300 shadow-lg hover:shadow-gray-500/25"
          onClick={() => window.location.href = '/contact'}
        >
          <span className="mr-2">Contact Support</span>
          <ArrowRight size={18} />
        </button>
      </>
    )
  }
];

// Utility function to generate the initial state (all closed)
const getInitialOpenState = (sections) => {
  return sections.reduce((acc, section) => {
    acc[section.id] = section.id === 'eligibility'; // Start with the first section open
    return acc;
  }, {});
};

export default function ReturnRefund() {
  // Use useMemo to calculate the initial state once based on the data
  const initialState = useMemo(() => getInitialOpenState(returnSections), []);

  // State to track which sections are open
  const [openSections, setOpenSections] = useState(initialState);
  
  // Use a map of the original sections array for rendering
  const sections = returnSections;

  /**
   * Toggles the open/closed state of a single accordion section.
   * A click on an open section will close it (fully collapsible).
   */
  const toggleSection = (id) => {
    setOpenSections((prev) => ({
      ...prev,
      // Toggle the boolean state of the clicked section ID
      [id]: !prev[id],
    }));
  };

  /**
   * Toggles the open/closed state of ALL sections.
   * If any section is open, it closes all. If all are closed, it opens all.
   */
  const toggleAll = () => {
    // Check if at least one section is currently open
    const isAnyOpen = Object.values(openSections).some(isOpen => isOpen);

    // If any are open, close all (set to false). If all are closed, open all (set to true).
    const newState = Object.keys(openSections).reduce((acc, id) => {
      acc[id] = !isAnyOpen; // If any open -> false, if none open -> true
      return acc;
    }, {});
    
    setOpenSections(newState);
  }

  const getIcon = (isOpen) => (isOpen ? '−' : '+');

  return (
    <>
      <Navbar />
      <div
        className="flex flex-col lg:flex-row gap-0 lg:gap-8 p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto bg-white pt-24 pb-12 px-2 sm:px-4 lg:px-8 w-full"
        style={{
          fontFamily:
            "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {/* Main Content */}
        <div className="flex-1 w-full">
          <div className="text-left mb-8">
            <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-4 tracking-tight">
              Return and Refund Policy
            </h1>
            <p className='text-sm text-gray-500'>
              Last updated: November 28, 2025
            </p>
          </div>

          {/* Toggle All Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleAll}
              className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-600 rounded-full hover:bg-gray-50 transition duration-150"
            >
              {Object.values(openSections).some(isOpen => isOpen) ? 'Collapse All' : 'Expand All'}
            </button>
          </div>
          <hr className="mb-8" />

          {/* Accordion Content */}
          <div className="space-y-0 w-full">
            {sections.map((section) => (
              <div key={section.id} className="border-b border-gray-200 last:border-b-0 w-full">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full text-left p-4 lg:p-6 flex items-start justify-between transition-colors duration-150 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                >
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-900 flex-1 pr-4">
                    {section.title}
                  </h2>
                  <span className="text-xl font-bold text-gray-400 shrink-0 ml-4 transition-transform duration-300">
                    {/* Rotate the icon for a smoother visual effect */}
                    <div className={openSections[section.id] ? 'transform rotate-90' : 'transform rotate-0'}>
                        {getIcon(openSections[section.id])}
                    </div>
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openSections[section.id]
                      ? 'max-h-[1000px] opacity-100' // Increased max-height for long content
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-4 lg:p-6 pt-0 text-gray-700 leading-relaxed text-sm lg:text-base whitespace-pre-wrap">
                    {typeof section.content === 'string' ? (
                      <p>{section.content}</p>
                    ) : (
                      section.content
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* --- End Accordion Content --- */}

          <div className="text-center mt-8 pt-8 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-600">
              © 2025 Maxtreo. All rights reserved.{' '}
              <a href="/privacy" className="text-gray-600 hover:underline">
                Privacy Policy
              </a>{' '}
              |{' '}
              <a href="/terms" className="text-gray-600 hover:underline">
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}