import React from "react";

const ReturnsRefunds = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 font-sans overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b border-gray-100 pb-4">Returns & Refunds</h1>
          
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <p className="font-medium text-gray-800">
              Thanks for shopping at Shree Sanatan Traders. If you are not entirely satisfied with your purchase, we're here to help.
            </p>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">Returns</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>You have 7 calendar days to return an item from the date you received it.</li>
                <li>To be eligible for a return, your item must be unused and in the same condition that you received it.</li>
                <li>Your item must be in the original packaging.</li>
                <li>Your item needs to have the receipt or proof of purchase.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">Refunds</h2>
              <p>
                Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.
              </p>
              <p className="mt-2">
                If your return is approved, we will initiate a refund to your credit card (or original method of payment). You will receive the credit within a certain amount of days, depending on your card issuer's policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">Non-Returnable Items</h2>
              <p>
                Certain items, such as opened seeds, customized spiritual items, or organic fertilizers where the seal has been compromised, cannot be returned for safety and quality assurance reasons.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsRefunds;
