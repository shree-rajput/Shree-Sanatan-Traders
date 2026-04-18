import React from "react";

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 font-sans overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b border-gray-100 pb-4">Shipping Policy</h1>
          
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">1. Order Processing Times</h2>
              <p>
                All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">2. Shipping Rates & Delivery Estimates</h2>
              <p>
                Shipping charges for your order will be calculated and displayed at checkout. Standard delivery typically takes 3-5 business days. Please note that delivery delays can occasionally occur due to regional constraints or severe weather.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">3. Shipment Confirmation & Order Tracking</h2>
              <p>
                You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">4. Damages</h2>
              <p>
                Shree Sanatan Traders is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim. Save all packaging materials and damaged goods before filing a claim.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
