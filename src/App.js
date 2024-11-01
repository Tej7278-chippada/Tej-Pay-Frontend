import './App.css';
import CancellationRefund from './components/Pages/CancellationRefund';
import Contact from './components/Pages/Contact';
import PrivacyPolicy from './components/Pages/PrivacyPolicy';
import ShippingDelivery from './components/Pages/ShippingDelivery';
import TermsConditions from './components/Pages/TermsConditions';
import PaymentForm from './components/PaymentPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaymentForm />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/cancellation-refund" element={<CancellationRefund />} />
        <Route path="/shipping-delivery" element={<ShippingDelivery />} />
      </Routes>
    </Router>
  );
}

export default App;
