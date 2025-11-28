import Navbar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";

export default function TermsConditions() {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Rajdhani', sans-serif; }
      `}</style>
      <Navbar />
      <div className="flex flex-col lg:flex-row gap-0 lg:gap-8 p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto bg-white pt-24 pb-12 px-2 sm:px-4 lg:px-8 w-full">
        {/* Main Content */}
        <div className="flex-1 w-full">
          <div className="text-left mb-8">
            <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-4 tracking-tight">
              Terms and Conditions
            </h1>
            <p className='text-sm text-gray-500'>
              Last updated: November 28, 2025
            </p>
          </div>

          <hr className="mb-8" />

          {/* Main Content */}
          <div className="space-y-8" id="top">
            {/* Acceptance of Terms */}
            <section id="acceptance" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                1. Acceptance of Terms
              </h2>
              <div className="text-gray-700 leading-relaxed text-sm lg:text-base">
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
              <div className="text-gray-700 leading-relaxed text-sm lg:text-base">
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
              <div className="text-gray-700 leading-relaxed text-sm lg:text-base">
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
              <div className="text-gray-700 leading-relaxed text-sm lg:text-base">
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
              <div className="text-gray-700 leading-relaxed text-sm lg:text-base">
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
              <div className="text-gray-700 leading-relaxed text-sm lg:text-base">
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
              <div className="text-gray-700 leading-relaxed text-sm lg:text-base">
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
              <div className="text-gray-700 leading-relaxed text-sm lg:text-base">
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
              <div className="text-gray-700 leading-relaxed text-sm lg:text-base">
                <p>
                  For questions about these Terms and Conditions, please contact us at:
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <span className="font-semibold text-gray-900 min-w-0 flex-1">maxtreo</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold text-gray-900 min-w-0 flex-1">Address:</span>
                    <span className="text-gray-700 ml-2">Sreevalsam Building, Temple By Pass, Thodupuzha, Near SBI, Kerala, India</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold text-gray-900 min-w-0 flex-1">Email:</span>
                    <span className="text-gray-700 ml-2">maxtreo99@gmail.com</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold text-gray-900 min-w-0 flex-1">Phone:</span>
                    <span className="text-gray-700 ml-2">+91 94460 67663</span>
                  </li>
                </ul>
              </div>
            </section>
          </div>

          <div className="text-center mt-8 pt-8 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-600">
              © 2025 Maxtreo. All rights reserved.{' '}
              <a href="/privacy" className="text-gray-600 hover:underline">
                Privacy Policy
              </a>{' '}
              |{' '}
              <a href="/shipping" className="text-gray-600 hover:underline">
                Shipping Policy
              </a>{' '}
              |{' '}
              <a href="/returns" className="text-gray-600 hover:underline">
                Return and Refund Policy
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}