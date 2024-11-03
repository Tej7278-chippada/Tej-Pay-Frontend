import './App.css';
import CancellationRefund from './components/Pages/CancellationRefund';
import Contact from './components/Pages/Contact';
import PrivacyPolicy from './components/Pages/PrivacyPolicy';
import ShippingDelivery from './components/Pages/ShippingDelivery';
import TermsConditions from './components/Pages/TermsConditions';
import PaymentForm from './components/PaymentPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
}

export default App;
