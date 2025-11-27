import Navbar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";

export default function TermsConditions() {
  const sections = [
    { id: "acceptance", title: "1. Acceptance of Terms" },
    { id: "products", title: "2. Products & Services" },
    { id: "payment", title: "3. Payment Terms" },
    { id: "order", title: "4. Order Processing & Delivery" },
    { id: "accounts", title: "5. User Accounts" },
    { id: "ip", title: "6. Intellectual Property" },
    { id: "liability", title: "7. Limitation of Liability" },
    { id: "governing", title: "8. Governing Law" },
    { id: "contact", title: "9. Contact Information" },
  ];

  return (
    <>
      <Navbar />
      <div className="flex flex-col p-4 lg:p-6 gap-6 max-w-6xl mx-auto bg-white pt-24 pb-12">
        {/* Header */}
        <div className="text-center border-b border-gray-200 pb-4">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            Terms and Conditions
          </h1>
          <p className="text-sm text-gray-600">
            Last updated: November 27, 2025
          </p>
        </div>

        {/* Table of Contents */}
        <nav className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6  top-4 z-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Table of Contents</h2>
          <ul className="space-y-1 text-sm">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors inline-block py-1"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content */}
        <div className="space-y-8" id="top">
          {/* Acceptance of Terms */}
          <section id="acceptance" className="scroll-mt-20">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
              1. Acceptance of Terms
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
                Agreement to Our Terms
              </h3>
              <p>
                By accessing and using maxtreo's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service. These terms apply to all visitors, users, and others who access or use our service.
              </p>
            </div>
          </section>

          {/* Products & Services */}
          <section id="products" className="scroll-mt-20">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
              2. Products & Services
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                maxtreo specializes in custom PC builds and solutions, as well as selling other brand products. All product descriptions, specifications, and images are provided for informational purposes. We reserve the right to modify product specifications, pricing, and availability without prior notice. Custom PC builds are subject to component availability and may require additional lead time.
              </p>
            </div>
          </section>

          {/* Payment Terms */}
          <section id="payment" className="scroll-mt-20">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
              3. Payment Terms
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                We accept multiple payment methods including Razorpay online payments, cash on delivery, and direct bank transfers. Payment must be completed before order processing for online and bank transfer orders. For cash on delivery orders, payment is due upon receipt of goods. All prices are in Indian Rupees and include applicable taxes unless otherwise specified.
              </p>
            </div>
          </section>

          {/* Order Processing & Delivery */}
          <section id="order" className="scroll-mt-20">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
              4. Order Processing & Delivery
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                Orders are processed within 1-3 business days after payment confirmation. Custom PC builds may require additional time based on component availability and complexity. Delivery times vary by location and shipping method selected. We are not responsible for delays caused by factors beyond our control, including but not limited to natural disasters, shipping carrier delays, or customs processing.
              </p>
            </div>
          </section>

          {/* User Accounts */}
          <section id="accounts" className="scroll-mt-20">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
              5. User Accounts
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                When you create an account with us, including through Google login, you must provide accurate and complete information. You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
              </p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section id="ip" className="scroll-mt-20">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
              6. Intellectual Property
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                The content, features, and functionality of our website are owned by maxtreo and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works of our content without our express written permission.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section id="liability" className="scroll-mt-20">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
              7. Limitation of Liability
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                maxtreo shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of our service. Our total liability shall not exceed the amount paid by you for the specific product or service.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section id="governing" className="scroll-mt-20">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
              8. Governing Law
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms or your use of our service shall be subject to the exclusive jurisdiction of the courts in Kerala, India.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section id="contact" className="scroll-mt-20">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
              9. Contact Information
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                For questions about these Terms and Conditions, please contact us at:
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <span className="font-semibold text-gray-900 min-w-0 flex-1">maxtreo</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-gray-900 min-w-0 flex-1">Address:</span>
                  <span className="text-gray-700 ml-2">Sreevalsam Building, Temple By Pass, Thodupuzha, Near SBI</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-gray-900 min-w-0 flex-1">Email:</span>
                  <span className="text-gray-700 ml-2">support@maxtreo.com</span> {/* Placeholder; replace with actual */}
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-gray-900 min-w-0 flex-1">Phone:</span>
                  <span className="text-gray-700 ml-2">+91-XXXXXXXXXX</span> {/* Placeholder; replace with actual */}
                </li>
              </ul>
            </div>
          </section>
        </div>

        {/* Footer Note */}
        <div className="text-center text-sm text-gray-500 mt-8 pt-6 border-t border-gray-200">
          <p>&copy; 2025 maxtreo. All rights reserved.</p>
        </div>
      </div>
      <Footer />
    </>
  );
}