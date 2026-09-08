import SunmiPrinter from "@es-webdev/react-native-sunmi-printer";
import * as Linking from "expo-linking";
import { useEffect } from "react";
import { BackHandler, Platform, Text, View } from "react-native";

interface ReceiptItem {
  name: string;
  qty: number;
  price: number;
}

interface ReceiptPayload {
  restaurantName: string;
  orderNumber: string;
  items: ReceiptItem[];
  total: number;
}

async function printReceipt(data: ReceiptPayload) {
  if (Platform.OS !== "android") return;

  await SunmiPrinter.printerInit();
  await SunmiPrinter.setAlignment(1); // center
  await SunmiPrinter.setFontSize(28);
  await SunmiPrinter.printerText(`${data.restaurantName}\n`);
  await SunmiPrinter.setFontSize(20);
  await SunmiPrinter.printerText(`Order #${data.orderNumber}\n`);
  await SunmiPrinter.printerText("--------------------------\n");

  await SunmiPrinter.setAlignment(0); // left
  for (const item of data.items) {
    await SunmiPrinter.printerText(
      `${item.name} x${item.qty}  ৳${item.price}\n`,
    );
  }

  await SunmiPrinter.printerText("--------------------------\n");
  await SunmiPrinter.setAlignment(2); // right
  await SunmiPrinter.printerText(`Total: ৳${data.total}\n\n\n`);
  await SunmiPrinter.lineWrap(3);
}

function handleIncomingUrl(url: string | null) {
  if (!url) return;
  try {
    const parsed = Linking.parse(url);
    const raw = parsed.queryParams?.data;
    if (typeof raw === "string") {
      const data: ReceiptPayload = JSON.parse(decodeURIComponent(raw));
      printReceipt(data).finally(() => {
        setTimeout(() => {
          if (Platform.OS === "android") BackHandler.exitApp();
        }, 300);
      });
    }
  } catch (err) {
    console.error("Failed to parse print URL", err);
  }
}

export default function Index() {
  useEffect(() => {
    Linking.getInitialURL().then(handleIncomingUrl);
    const sub = Linking.addEventListener("url", (event) =>
      handleIncomingUrl(event.url),
    );
    return () => sub.remove();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Printing…</Text>
    </View>
  );
}
