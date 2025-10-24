import React from "react";
import Logo from '../../../Images/neo_tokyo-logo.png';

const ParallaxRevealSection = () => {
  return (
    <div className="wrapper">
      <div className="content-container">
        {/* Company Logo */}
        <div className="company-logo">
          <img src={Logo} alt=" Logo" />
        </div>
        
        {/* Description Content */}
        <div className="description-content">
          <div className="tagline">
            <span className="tagline-bold">Premium Computer Equipment & Gaming Gear</span>       
          </div>
          
          <div className="headline">
            <span className="headline-text">UPGRADE YOUR SETUP</span>
          </div>
          
          <div className="description-text">
            High-performance PCs, gaming peripherals, and professional workstations
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Niveau+Grotesk:wght@400;500;700&family=Raleway:wght@300;400;600;700&display=swap');
        
        .wrapper {
          position: relative;
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #fff;
          padding: 0 20px;
        }
        
        .content-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 800px;
          width: 100%;
          opacity: 0;
          animation: fadeInUp 1s ease-out forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .company-logo {
          margin-bottom: 2rem;
          animation: fadeInUp 1s ease-out 0.2s both;
        }

        .company-logo img {
          height: 5rem;
          width: auto;
          max-width: 100%;
        }

        .description-content {
          opacity: 0;
          animation: fadeInUp 1s ease-out 0.4s both;
        }

        .tagline {
          font-size: 1rem;
          color: #666;
          font-weight: 600;
          font-family: 'Raleway', sans-serif;
          letter-spacing: 0.1em;
          line-height: 1.2;
          margin-bottom: 0.5rem;
        }

        .tagline-bold {
          font-weight: 700;
          color: #333;
        }

        .headline {
          font-size: 1.2rem;
          color: #000;
          font-weight: 700;
          font-family: 'Raleway', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          margin: 1.5rem 0 0.5rem;
        }

        .headline-text {
          font-weight: 800;
        }

        .description-text {
          font-size: 0.9rem;
          color: #555;
          font-weight: 400;
          font-family: 'Raleway', sans-serif;
          letter-spacing: 0.05em;
          line-height: 1.4;
          max-width: 500px;
          margin-top: 0.5rem;
        }

        /* Responsive Styles */
        @media (max-width: 1200px) {
          .company-logo img {
            height: 3.5rem;
          }
        }

        @media (max-width: 992px) {
          .company-logo img {
            height: 3rem;
          }
          .headline {
            font-size: 1.1rem;
          }
          .tagline {
            font-size: 0.9rem;
          }
          .description-text {
            font-size: 0.85rem;
          }
        }

        @media (max-width: 768px) {
          .wrapper {
            padding: 0 15px;
          }
          
          .company-logo {
            margin-bottom: 1.5rem;
          }
          
          .company-logo img {
            height: 2.5rem;
          }
          
          .headline {
            font-size: 1rem;
            letter-spacing: 0.15em;
          }
          
          .tagline {
            font-size: 0.85rem;
          }
          
          .description-text {
            font-size: 0.8rem;
            max-width: 90%;
          }
        }

        @media (max-width: 576px) {
          .company-logo img {
            height: 2.2rem;
          }
          
          .headline {
            font-size: 0.95rem;
            margin-top: 1rem;
          }
          
          .tagline {
            font-size: 0.8rem;
          }
          
          .description-text {
            font-size: 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .company-logo img {
            height: 1.8rem;
          }
          
          .headline {
            font-size: 0.9rem;
            letter-spacing: 0.1em;
          }
          
          .tagline {
            font-size: 0.75rem;
          }
          
          .description-text {
            font-size: 0.7rem;
          }
        }
        
        @media (max-width: 360px) {
          .company-logo img {
            height: 1.6rem;
          }
          
          .headline {
            font-size: 0.85rem;
          }
          
          .tagline {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ParallaxRevealSection;