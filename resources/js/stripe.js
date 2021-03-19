import { loadStripe } from "@stripe/stripe-js";
import { placeOrder } from "./apiService";
import { CardWidget } from "./CardWidget";

export const initStripe = async () => {
  const stripe = await loadStripe(
    "pk_test_51HkPn5HRLEg3EZTlShGOapAemOifEQPWqwYWsdWdGsF8KLK60jkL3CQ2xs3p96F9PTyraR9iqiHnwz8fxDxPmL42006E0Hlpse"
  );
  let card = null;
  
  // const mountWidget = () => {
    // const elements = stripe.elements();
  //   let style = {
  //     base: {
  //       color: "#32325d",
  //       fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
  //       fontSmoothing: "antialiased",
  //       fontSize: "16px",
  //       "::placeholder": {
  //         color: "#aab7c4",
  //       },
  //     },
  //     invalid: {
  //       color: "#fa755a",
  //       iconColor: "#fa755a",
  //     },
  //   };
  //   card = elements.create("card", { style, hidePostalCode: true });
  //   card.mount("#card-element");
  // };

  const paymentType = document.querySelector("#paymentType");
  if (!paymentType) {
    return;
  }
  paymentType.addEventListener("change", (e) => {
    if (e.target.value === "card") {
      // Display widget
      card = new CardWidget(stripe);
      card.mount();
    } else {
      card.destroy();
    }
  });
  // Ajax call
  const paymentForm = document.querySelector("#payment-form");
  if (paymentForm) {
    paymentForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      let formData = new FormData(paymentForm);
      console.log(formData);
      let formObject = {};
      for (let [key, value] of formData.entries()) {
        formObject[key] = value;
      }

      if (!card) {
        // Ajax call
        placeOrder(formObject);
        return;
      }

      const token = await card.createToken();
      formObject.stripeToken = token.id;
      placeOrder(formObject);

      // //   Verify card
      // stripe
      //   .createToken(card)
      //   .then((result) => {
      //     formObject.stripeToken = result.token.id;
      //     placeOrder(formObject);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    });
  }
};
