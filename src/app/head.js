import Script from "next/script";

export default function Head() {
  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </>
  );
}
