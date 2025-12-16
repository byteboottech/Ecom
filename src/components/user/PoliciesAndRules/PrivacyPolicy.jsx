  import { useState, useMemo } from 'react';
  import Footer from '../Footer/Footer';
  import ModernNavbar from '../NavBar/NavBar';

  // --- Data Definition (Moved outside component for cleanliness) ---
  const policySections = [
    {
      id: 'personalData', // Refactored to camelCase for consistency with state keys
      title: 'What Is Personal Data at Maxtreo?',
      content:
        'At Maxtreo, we believe strongly in fundamental privacy rights — and that those fundamental rights should not differ depending on where you live in the world. That\'s why we treat any data that relates to an identified or identifiable individual or that is linked or linkable to you as “personal data.” This includes your name, email, or serial number of your device — is personal data. Aggregated data that cannot reasonably be used to identify you is considered non-personal data for the purposes of this Privacy Policy.\n\nThis Privacy Policy covers how Maxtreo or an Maxtreo-affiliated company (collectively, “Maxtreo”) handles personal data whether you interact with us on our websites, through Maxtreo apps (such as our custom PC builder), or in person (including by phone or when visiting an Maxtreo Store). Maxtreo may also link to third parties on our services or make third-party apps available for download in our App Store. Maxtreo\'s Privacy Policy does not apply to how third parties define personal data or how they use it. We encourage you to read their privacy policies and know your privacy rights before interacting with them.',
    },
    {
      id: 'privacyRights',
      title: 'Your Privacy Rights at Maxtreo',
      content:
        'You have the right to access, correct, delete, or restrict the use of your personal data. Under Indian laws like the Digital Personal Data Protection Act (DPDP), you can withdraw consent, request data portability, or file complaints with data protection authorities. To exercise these rights, contact us using the details below—we respond within 30 days.',
    },
    {
      id: 'dataCollected',
      title: 'Personal Data Maxtreo Collects from You',
      content:
        'When you place an order or create an account, we collect details like your name, contact information, shipping address, and payment data. For custom PC builds, we may gather preferences on components to ensure accurate assembly. Website interactions (e.g., browsing history) are tracked anonymously to improve our site.',
    },
    {
      id: 'dataSources',
      title: 'Personal Data We Receive from Other Sources',
      content:
        'We may receive data from payment processors (e.g., Razorpay) or shipping partners (e.g., courier services) to fulfill orders. Third-party analytics tools provide aggregated usage data without personal identifiers. We do not purchase consumer data from external brokers.',
    },
    {
      id: 'dataUse',
      title: 'Our Use of Personal Data',
      content:
        'We use your data to process orders, ship products, provide customer support, and send promotional emails (with opt-out options). For custom builds, it\'s used for assembly and quality testing. Data helps us improve services, prevent fraud, and comply with legal obligations.',
    },
    {
      id: 'dataSharing',
      title: 'Our Sharing of Personal Data',
      content:
        'We share data only with trusted partners like logistics providers for delivery or payment gateways for transactions. We never sell your data. Sharing occurs for legal reasons (e.g., subpoenas) or to protect our rights, always under strict confidentiality agreements.',
    },
    {
      id: 'dataProtection',
      title: 'Protection of Personal Data at Maxtreo',
      content:
        'We employ industry-standard security measures, including encryption for payment data and secure servers. Access is limited to authorized personnel, and we conduct regular audits. In case of a data breach, we notify affected users and authorities as required by law.',
    },
    {
      id: 'children',
      title: 'Children and Personal Data',
      content:
        'Our services are not directed to children under 18. We do not knowingly collect data from minors. If we discover such data, we delete it promptly. Parents/guardians can contact us to review or remove children\'s information.',
    },
    {
      id: 'cookies',
      title: 'Cookies and Other Technologies',
      content:
        'We use cookies for site functionality, analytics, and targeted ads. Essential cookies enable shopping carts; others can be managed via browser settings. For details, see our Cookie Policy (linked in footer).',
    },
    {
      id: 'dataTransfer',
      title: 'Transfer of Personal Data',
      content:
        'As an India-based company, data is primarily stored domestically. International transfers (e.g., to cloud providers) use safeguards like Standard Contractual Clauses to ensure equivalent protection.',
    },
    {
      id: 'commitment',
      title: 'Our Commitment to Your Privacy',
      content:
        'Privacy is integral to Maxtreo\'s operations. We minimize data collection, anonymize where possible, and regularly review practices. This policy may update; check back for changes.',
    },
    {
      id: 'questions',
      title: 'Privacy Questions',
      content: (
        <div key="questions-content">
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            For questions or to exercise rights, contact:
          </p>
          <ul className="text-sm text-gray-700 leading-relaxed space-y-2">
            <li>
              <strong>Email:</strong> maxtreo99@gmail.com
            </li>
            <li>
              <strong>Phone:</strong> +91 94460 67663
            </li>
            <li>
              <strong>Address:</strong> Sreevalsam Building, Temple By Pass, Thodupuzha, Near SBI, Kerala, India
            </li>
          </ul>
        </div>
      ),
    },
  ];

  // --- Component Start ---

  // Utility function to generate the initial state (all closed)
  const getInitialOpenState = (sections) => {
    return sections.reduce((acc, section) => {
      // Note: We check if any section was *explicitly* requested to be open initially.
      // Since the original prompt used a hardcoded initial state, we'll keep the
      // *first* section open by default here for design consistency, but you can
      // easily change this to `{ [section.id]: false }` for a truly 100% closed start.
      acc[section.id] = section.id === 'personalData'; // Start with the first section open
      return acc;
    }, {});
  };

  export default function PrivacyPolicy() {
    // Use useMemo to calculate the initial state once based on the data
    const initialState = useMemo(() => getInitialOpenState(policySections), []);

    // State to track which sections are open
    const [openSections, setOpenSections] = useState(initialState);
    
    // Use a map of the original sections array for rendering
    const sections = policySections;

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
          className="flex flex-col lg:flex-row gap-0 lg:gap-8 p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto bg-white pt-24 pb-12 px-2 sm:px-4 lg:px-8 w-full"
          style={{
            fontFamily:
            "Roboto"
          }}
        >
        

          {/* Main Content */}
          <div className="flex-1 w-full">
            <div className="text-left mb-8">
              <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-4 tracking-tight">
                Maxtreo Privacy Policy
              </h1>
              <p className='text-sm text-gray-500'>
                Last updated: November 27, 2025
              </p>
            </div>

            {/* Toggle All Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={toggleAll}
                className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition duration-150"
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
                    className="w-full text-left p-4 lg:p-6 flex items-start justify-between transition-colors duration-150 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
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
                    // Key change: We remove max-h-96 and use actual height calculation for smoother transitions (less abrupt snapping)
                    // For a truly robust component, you'd use a library or a ref to calculate the actual height.
                    // For simplicity in this Tailwind example, we stick to the max-height trick but reduce the height for a better effect.
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      openSections[section.id]
                        ? 'max-h-[1000px] opacity-100' // Increased max-height for long content
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="p-4 lg:p-6 pt-0 text-gray-700 leading-relaxed text-sm lg:text-base whitespace-pre-wrap">
                      {/* Use whitespace-pre-wrap to respect the \n\n in string content */}
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
                <a href="/cookies" className="text-blue-600 hover:underline">
                  Cookie Policy
                </a>{' '}
                |{' '}
                <a href="/terms" className="text-blue-600 hover:underline">
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