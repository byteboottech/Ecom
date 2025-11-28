import { useState, useMemo } from 'react';
import Footer from '../Footer/Footer';
import ModernNavbar from '../NavBar/NavBar';

const shippingSections = [
  {
    id: 'orderProcessing',
    title: 'Order Processing',
    content: (
      <>
        <p className="text-base text-gray-700 leading-relaxed">
          All confirmed orders are processed within 1–3 business days from the date of payment confirmation.
        </p>
        <p className="text-base text-gray-700 leading-relaxed">
          Custom-built PCs and workstations may require additional 2-5 business days for assembly and quality testing.
        </p>
        <p className="text-base text-gray-700 leading-relaxed">
          Orders are not processed or shipped on Sundays or national holidays.
        </p>
      </>
    )
  },
  {
    id: 'shippingCoverage',
    title: 'Shipping Coverage',
    content: (
      <>
        <p className="text-base text-gray-700 leading-relaxed">
          We provide nationwide shipping coverage across India, including metro cities, tier-2 cities, and most tier-3 locations.
        </p>
        <p className="text-base text-gray-700 leading-relaxed">
          Serviceable pincodes: All major cities including Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad, and 25,000+ other locations.
        </p>
        <p className="text-base text-gray-700 leading-relaxed">
          For remote areas or locations with limited courier access, our team will contact you within 24 hours to confirm delivery feasibility and arrange alternative solutions if needed.
        </p>
      </>
    )
  },
  {
    id: 'deliveryTimelines',
    title: 'Delivery Timelines',
    content: (
      <>
        <p className="text-base text-gray-700 leading-relaxed">
          <strong className="text-gray-900">Metro Cities:</strong> 3-5 business days after dispatch
        </p>
        <p className="text-base text-gray-700 leading-relaxed">
          <strong className="text-gray-900">Tier-2 Cities:</strong> 5-7 business days after dispatch
        </p>
        <p className="text-base text-gray-700 leading-relaxed">
          <strong className="text-gray-900">Tier-3 Cities & Remote Areas:</strong> 7-10 business days after dispatch
        </p>
        <p className="text-base text-gray-700 leading-relaxed">
          Express delivery options available for metro cities (1-2 business days) at additional cost.
        </p>
        <p className="text-base text-gray-700 leading-relaxed">
          Delivery times may be extended during peak seasons (festivals, sales events) or due to unforeseen circumstances such as weather conditions, courier delays, or regional strikes.
        </p>
      </>
    )
  },
  {
    id: 'shippingCharges',
    title: 'Shipping Charges',
    content: (
      <>
        <p className="text-base text-gray-700 leading-relaxed">
          <strong className="text-gray-900">Standard Shipping:</strong> ₹150-500 (varies by location and product weight)
        </p>
        <p className="text-base text-gray-700 leading-relaxed">
          <strong className="text-gray-900">Express Shipping:</strong> ₹300-800 (metro cities only)
        </p>
        <p className="text-base text-gray-700 leading-relaxed">
          <strong className="text-gray-900">Heavy Items (PCs/Workstations):</strong> ₹500-1,200 based on destination
        </p>
        <p className="text-base text-gray-700 leading-relaxed">
          <strong className="text-gray-900">Free Shipping:</strong> Available on orders above ₹50,000 or during promotional campaigns.
        </p>
        <p className="text-base text-gray-700 leading-relaxed">
          All shipping charges are calculated automatically at checkout and displayed before payment confirmation.
        </p>
      </>
    )
  },
  {
    id: 'orderTracking',
    title: 'Order Tracking',
    content: (
      <>
        <p className="text-base text-gray-700 leading-relaxed">
          Real-time tracking available for all orders through SMS, email, and WhatsApp notifications.
        </p>
        <p className="text-base text-gray-700 leading-relaxed">
          After dispatch, you'll receive a tracking ID and direct link to monitor your shipment's progress in real-time.
        </p>
        <p className="text-base text-gray-700 leading-relaxed">
          Track your order anytime on our website using your order number or through our partner courier's tracking portal.
        </p>
      </>
    )
  },
  {
    id: 'packagingHandling',
    title: 'Packaging & Handling',
    content: (
      <>
        <p className="text-base text-gray-700 leading-relaxed">
          All products are carefully packaged using protective materials including bubble wrap, foam inserts, and sturdy boxes.
        </p>
        <p className="text-base text-gray-700 leading-relaxed">
          High-value electronics undergo additional quality checks and specialized packaging to prevent transit damage.
        </p>
        <p className="text-base text-gray-700 leading-relaxed">
          Each package is sealed and labeled with fragile handling instructions for courier partners.
        </p>
      </>
    )
  },
  {
    id: 'damagedProducts',
    title: 'Damaged / Defective Products',
    content: (
      <>
        <p className="text-base text-gray-700 leading-relaxed">
          If you receive a damaged, defective, or incorrect product, please notify us immediately within 48 hours of delivery.
        </p>
        <p className="text-base text-gray-700 leading-relaxed">
          <strong className="text-gray-900">Reporting Process:</strong>
        </p>
        <p className="text-base text-gray-700 leading-relaxed">
          • Take photos/videos of the damaged item and packaging
        </p>
        <p className="text-base text-gray-700 leading-relaxed">
          • Contact our support team with your order number
        </p>
        <p className="text-base text-gray-700 leading-relaxed">
          • Our team will arrange for inspection and immediate replacement or refund
        </p>
        <p className="text-base text-gray-700 leading-relaxed">
          We provide hassle-free replacements for manufacturing defects covered under warranty terms.
        </p>
      </>
    )
  },
  {
    id: 'deliverySecurity',
    title: 'Delivery Security',
    content: (
      <>
        <p className="text-base text-gray-700 leading-relaxed">
          All high-value shipments require signature confirmation and valid ID verification at the time of delivery.
        </p>
        <p className="text-base text-gray-700 leading-relaxed">
          For orders above ₹1,00,000, we provide insured shipping with additional security protocols.
        </p>
        <p className="text-base text-gray-700 leading-relaxed">
          Delivery attempts will be made during business hours (9 AM - 8 PM). If no one is available, we'll reschedule delivery at your convenience.
        </p>
      </>
    )
  },
  {
    id: 'specialHandling',
    title: 'Special Handling',
    content: (
      <>
        <p className="text-base text-gray-700 leading-relaxed">
          <strong className="text-gray-900">Fragile Electronics:</strong> Graphics cards, motherboards, and sensitive components receive extra protective packaging.
        </p>
        <p className="text-base text-gray-700 leading-relaxed">
          <strong className="text-gray-900">Large Items:</strong> Complete PC systems and workstations are shipped via specialized logistics partners with white-glove delivery service.
        </p>
        <p className="text-base text-gray-700 leading-relaxed">
          <strong className="text-gray-900">Installation Support:</strong> Optional on-site setup assistance available for complete systems in select cities.
        </p>
      </>
    )
  },
  {
    id: 'contactSupport',
    title: 'Contact Support',
    content: (
      <>
        <p className="text-base text-gray-700 leading-relaxed">
          Our shipping support team is available Monday to Saturday, 10 AM to 7 PM IST.
        </p>
        <p className="text-base text-gray-700 leading-relaxed flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <strong className="text-gray-900">Email:</strong> maxtreo99@gmail.com
        </p>
        <p className="text-base text-gray-700 leading-relaxed flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <strong className="text-gray-900">Phone:</strong> +91 94955 26026
        </p>
        <p className="text-base text-gray-700 leading-relaxed flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <strong className="text-gray-900">WhatsApp:</strong> +91 94955 26026
        </p>
        <p className="text-base text-gray-700 leading-relaxed">
          For urgent shipping queries, WhatsApp support provides faster response times.
        </p>
      </>
    )
  }
];

// Utility function to generate the initial state (all closed)
const getInitialOpenState = (sections) => {
  return sections.reduce((acc, section) => {
    acc[section.id] = section.id === 'orderProcessing'; // Start with the first section open
    return acc;
  }, {});
};

export default function ShippingPolicy() {
  // Use useMemo to calculate the initial state once based on the data
  const initialState = useMemo(() => getInitialOpenState(shippingSections), []);

  // State to track which sections are open
  const [openSections, setOpenSections] = useState(initialState);
  
  // Use a map of the original sections array for rendering
  const sections = shippingSections;

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
      <ModernNavbar />
      <div
        className="font-rajadhani flex flex-col lg:flex-row gap-0 lg:gap-8 p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto bg-white pt-24 pb-12 px-2 sm:px-4 lg:px-8 w-full"
        // style={{
        //   fontFamily:
        //     "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",        
        // }}
      >
        {/* Main Content */}
        <div className="flex-1 w-full">
          <div className="text-left mb-8">
            <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-4 tracking-tight">
              Shipping Policy
            </h1>
            <p className="text-base text-gray-700 max-w-2xl mb-4">
              Thank you for shopping with us. We deliver PCs, workstations, and accessories across India with reliable and secure shipping.
            </p>
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