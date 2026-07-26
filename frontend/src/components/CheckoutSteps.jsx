const STEPS = ['Carrito', 'Identificación', 'Entrega', 'Pago', 'Confirmación'];

// currentStep: número del 1 al 5, indica en qué paso está el usuario
export default function CheckoutSteps({ currentStep }) {
  return (
    <div className="checkout-steps">
      {STEPS.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;
        return (
          <div key={label} className="checkout-step">
            <span className={`checkout-step-dot ${isActive ? 'active' : ''}`} />
            <span className={`checkout-step-label ${isActive ? 'active' : ''}`}>{label}</span>
            {stepNumber < STEPS.length && <span className="checkout-step-line" />}
          </div>
        );
      })}
    </div>
  );
}