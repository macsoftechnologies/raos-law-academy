import React, { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, router } from "expo-router";

export default function RazorpayPayment() {
const { price, handlingFee, total } = useLocalSearchParams<{price: string, handlingFee: string, total: string}>();
console.log("Price:", price, "Handling Fee:", handlingFee, "Total:", total+"razor pay receive");

  const webviewRef = useRef<WebView>(null);

  const payableAmount = parseFloat(total) || 0;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body>
        <script>
          var options = {
            key: "rzp_test_SVPqfndZJ8uVoh",
            amount: ${payableAmount * 100},
            currency: "INR",
            name: "RAOS LAW ACADEMY",
            description: "Course Payment",
            handler: function (response) {
            
              // Send minimal data to React Native
              window.ReactNativeWebView.postMessage(JSON.stringify({
                status: "success",
                payment_id: response.razorpay_payment_id
              }));
            },
            modal: {
              ondismiss: function () {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  status: "cancelled"
                }));
              }
            },
            prefill: {
              name: "User Name",
              email: "user@email.com",
              contact: "9999999999"
            },
            theme: { color: "#5CB85C" }
          };
          var rzp = new Razorpay(options);
          rzp.open();
        </script>

      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        originWhitelist={["*"]}
        source={{ html }}
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        onMessage={(event) => {
  try {
    const data = JSON.parse(event.nativeEvent.data);


    if (data.status === "success") {

      console.log("Payment Success:", data.payment_id);
      router.push({
        pathname: "/paymentgateways/payment_sucess"
      })

    }

    if (data.status === "cancelled") {
      console.log("Payment Cancelled");
       router.push({
        pathname: "/paymentgateways/payment_failure"
      })
    }
  } catch (error) {
    console.log("WebView message parse error:", error);
  }
}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 50,
  },
});