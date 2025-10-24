import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import paymentService from '../services/paymentService';
import './StripePayment.css';

// Inicializar Stripe con la clave pública de forma segura
const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : Promise.resolve(null);

/**
 * Componente interno que maneja la lógica de pago
 */
function CheckoutForm({ paymentData, onSuccess, onError, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Crear el pago usando nuestro servicio (que usa el adaptador)
      const paymentIntent = await paymentService.crearPago(paymentData);

      // Confirmar el pago con Stripe
      const { error: stripeError, paymentIntent: confirmedPayment } = await stripe.confirmCardPayment(
        paymentIntent.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: paymentData.cliente?.nombre || 'Cliente',
              email: paymentData.cliente?.email || '',
            },
          }
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        onError && onError(stripeError);
      } else if (confirmedPayment.status === 'succeeded') {
        onSuccess && onSuccess(confirmedPayment);
      }
    } catch (error) {
      setError(error.message);
      onError && onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-payment-form">
      <div className="payment-info">
        <h3>💳 Información de Pago</h3>
        <div className="payment-summary">
          <div className="summary-item">
            <span>Producto:</span>
            <span>{paymentData.nombreProducto}</span>
          </div>
          <div className="summary-item">
            <span>Cantidad:</span>
            <span>{paymentData.cantidad}</span>
          </div>
          <div className="summary-item">
            <span>Precio unitario:</span>
            <span>Q {paymentData.precio.toFixed(2)}</span>
          </div>
          <div className="summary-item total">
            <span>Total:</span>
            <span>Q {(paymentData.precio * paymentData.cantidad).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="card-element-container">
        <label>Datos de la Tarjeta</label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
                fontFamily: 'system-ui, -apple-system, sans-serif',
              },
              invalid: {
                color: '#9e2146',
              },
            },
            hidePostalCode: true,
          }}
        />
      </div>

      {error && (
        <div className="payment-error">
          <span>⚠️ {error}</span>
        </div>
      )}

      <div className="payment-actions">
        <button
          type="button"
          onClick={onCancel}
          className="cancel-button"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="pay-button"
          disabled={!stripe || isLoading}
        >
          {isLoading ? (
            <>
              <span className="loader"></span>
              Procesando...
            </>
          ) : (
            <>
              💳 Pagar Q {(paymentData.precio * paymentData.cantidad).toFixed(2)}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/**
 * Componente principal de pago con Stripe
 * Mantiene el diseño consistente del sistema
 */
function StripePayment({ 
  isOpen, 
  onClose, 
  paymentData, 
  onPaymentSuccess, 
  onPaymentError 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [stripeConfigError, setStripeConfigError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!publishableKey) {
      setStripeConfigError('Falta configurar REACT_APP_STRIPE_PUBLISHABLE_KEY en el entorno del frontend.');
    } else {
      setStripeConfigError(null);
    }
  }, []);

  const handleSuccess = (paymentIntent) => {
    console.log('Pago exitoso:', paymentIntent);
    onPaymentSuccess && onPaymentSuccess(paymentIntent);
    onClose();
  };

  const handleError = (error) => {
    console.error('Error en el pago:', error);
    onPaymentError && onPaymentError(error);
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className={`stripe-payment-modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>💳 Pago con Tarjeta</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {stripeConfigError ? (
            <div className="stripe-config-error" style={{ color: '#b91c1c', background: '#fee2e2', padding: '12px', borderRadius: '8px' }}>
              {stripeConfigError}
            </div>
          ) : (
            <Elements stripe={stripePromise}>
              <CheckoutForm
                paymentData={paymentData}
                onSuccess={handleSuccess}
                onError={handleError}
                onCancel={handleCancel}
              />
            </Elements>
          )}
        </div>

        <div className="modal-footer">
          <div className="security-info">
            <span>🔒 Pago seguro procesado por Stripe</span>
            <div className="security-badges">
              <span>SSL</span>
              <span>PCI DSS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StripePayment;
