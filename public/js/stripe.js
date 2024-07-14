/*eslint-disable*/

import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  // public-key
  'pk_test_51PblZZHft9sqktjLBcvc8ViBZY4nLct5OqqbyXrrSjVVyIlrKBcpGYlQQG3heCbKl9T02Xd8qmJDI32ErYcob4cA006yQ4CPle',
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios.get(
      `http://127.0.0.1:8000/api/v1/bookings/checkout-session/${tourId}`,
    );

    // 2) Redirect to checkout using sessionId + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};
