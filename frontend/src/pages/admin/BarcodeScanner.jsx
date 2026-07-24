import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import toast from "react-hot-toast";
import API from "../../services/api";
import { LuScanLine, LuArrowDownToLine, LuArrowUpFromLine } from "react-icons/lu";

const BarcodeScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [action, setAction] = useState("in"); // "in" or "out"
  const [quantity, setQuantity] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [scanner, setScanner] = useState(null);

  useEffect(() => {
    // Initialize Scanner on mount
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
      },
      false
    );

    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    setScanner(html5QrcodeScanner);

    return () => {
      // Cleanup on unmount
      html5QrcodeScanner.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, []);

  const onScanSuccess = async (decodedText, decodedResult) => {
    if (processing) return; // Prevent double scans

    // We assume the QR code contains JSON string { productId, sku, name }
    // Or if it's a standard barcode, it's just the SKU string
    let scannedData = { sku: decodedText };
    try {
      const parsed = JSON.parse(decodedText);
      if (parsed.productId || parsed.sku) {
        scannedData = parsed;
      }
    } catch (e) {
      // Not a JSON string, must be a raw SKU string from standard barcode
    }

    setScanResult(scannedData);

    // Auto-process the stock update if quantity is 1
    // (User can change quantity first before scanning)
    await processStockUpdate(scannedData);
  };

  const onScanFailure = (error) => {
    // We ignore failures as it constantly fails when no QR code is in sight
  };

  const processStockUpdate = async (data = scanResult) => {
    if (!data) return;
    setProcessing(true);

    try {
      const res = await API.post("/admin/barcode/scan", {
        productId: data.productId,
        sku: data.sku,
        action,
        quantity: parseInt(quantity)
      });

      if (res.data.success) {
        toast.success(res.data.message);

        // Pause scanning briefly to let user see success
        if (scanner) {
          scanner.pause(true);
          setTimeout(() => {
            scanner.resume();
            setScanResult(null);
          }, 3000);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to process barcode");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black dark:text-white flex items-center gap-2">
          <LuScanLine /> Barcode & QR Scanner
        </h1>
        <p className="text-gray-500">Scan products using your camera to instantly update stock.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scanner Window */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold dark:text-white">Live Scanner</h2>
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${action === "in" ? "bg-green-500 text-white shadow-md" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  }`}
                onClick={() => setAction("in")}
              >
                <LuArrowDownToLine /> Stock IN
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${action === "out" ? "bg-red-500 text-white shadow-md" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  }`}
                onClick={() => setAction("out")}
              >
                <LuArrowUpFromLine /> Stock OUT
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quantity to {action === "in" ? "Add" : "Remove"} per Scan
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white"
            />
          </div>

          <div id="reader" className="w-full overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700"></div>
        </div>

        {/* Scan Results */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
          <h2 className="text-xl font-bold dark:text-white mb-6">Last Scan Result</h2>

          {scanResult ? (
            <div className={`flex-1 flex flex-col justify-center items-center text-center p-6 rounded-2xl border ${processing ? "border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/20" : "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20"
              }`}>
              <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <LuScanLine className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                {scanResult.name || "Unknown Product"}
              </h3>
              <p className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                SKU: {scanResult.sku}
              </p>

              <div className="mt-8">
                {processing ? (
                  <p className="text-yellow-600 dark:text-yellow-400 font-bold animate-pulse">Processing Stock {action.toUpperCase()}...</p>
                ) : (
                  <p className="text-green-600 dark:text-green-400 font-bold">Successfully updated! Resuming scanner...</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
              <LuScanLine className="text-5xl mb-3 opacity-50" />
              <p>Awaiting scan...</p>
              <p className="text-xs mt-2 text-center max-w-xs">Point your camera at a Product Barcode or QR code.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
