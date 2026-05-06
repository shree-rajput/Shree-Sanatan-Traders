import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const translations = {
  en: {
    // Navbar
    home: "Home",
    shop: "Shop",
    categories: "Categories",
    search_placeholder: "Search equipment, parts or tools...",
    account: "Account",
    login: "Login",
    my_profile: "My Profile",
    order_history: "Order History",
    admin_panel: "Admin Panel",
    sign_out: "Sign Out",
    cart: "Cart",
    express_delivery: "Express Agriculture Delivery",
    
    // Sidebar
    all_categories: "All Categories",
    filter_by_price: "Filter by Price",
    
    // Product Card
    add_to_cart: "Add to Cart",
    buy_now: "Buy Now",
    out_of_stock: "Out of Stock",
    
    // Product Details
    whatsapp_order: "Order on WhatsApp",
    product_description: "Product Description",
    specifications: "Specifications",
    price: "Price",
    inclusive_taxes: "Inclusive of all taxes",
    
    // Common Actions
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    back: "Back",
    
    // Hero / Home
    hero_title: "Quality Agriculture Equipment",
    hero_subtitle: "Modern tools for modern farmers. Get the best deals on tractors, seeds, and irrigation systems.",
    hero_main_title: "Reliable Agriculture Equipment for Every Farmer",
    hero_main_subtitle: "Best Quality Irrigation Kits, Tools & Trailers at Affordable Prices.",
    shop_now: "Shop Now",
    call_now: "Call Now",
    featured_products: "Featured Products",
    shop_by_categories: "Shop by Categories",
    why_choose_us: "Why Choose Us",
    trusted_seller: "Trusted Local Seller",
    trusted_seller_desc: "Serving farmers in Kargoon & nearby areas.",
    fast_delivery: "Fast Delivery",
    fast_delivery_desc: "Quick and secure delivery to your doorstep.",
    affordable_prices: "Affordable Prices",
    affordable_prices_desc: "Best quality products at the best prices.",
    farmer_friendly: "Farmer Friendly",
    farmer_friendly_desc: "Products selected for farmers' real needs.",
    about_shop: "About Our Shop",
    about_desc: "A trusted name in agriculture equipment, located in Kargoon District, Bamandi. We are committed to providing quality products and excellent service to our farmers.",
    what_customers_say: "What Our Customers Say",
    visit_us: "Visit Us",
    call_us: "Call Us",
    whatsapp: "WhatsApp",
    chat_on_whatsapp: "Chat with us on WhatsApp",
    
    // Cart
    your_cart: "Your Cart",
    cart_empty: "Your cart is empty",
    cart_empty_desc: "Looks like you haven't added anything yet. Explore our premium equipment to get started.",
    browse_shop: "Browse Shop",
    order_summary: "Order Summary",
    subtotal: "Subtotal",
    shipping: "Shipping",
    total_price: "Total Price",
    delivery_address: "Delivery Address",
    address_placeholder: "Enter full village address...",
    placing_order: "Placing Order...",
    proceed_to_checkout: "Proceed to Checkout",
    secure_payment: "Secure Payment",
    quick_delivery: "Quick Delivery",
    calculated_next: "Calculated Next",
    clear_cart: "Clear Cart",
    continue_shopping: "Continue Shopping",
    items: "items",
    
    // Orders
    order_history: "Order History",
    no_orders: "No Orders Found",
    no_orders_desc: "You haven't placed any orders yet.",
    order_id: "Order ID",
    items_purchased: "Items Purchased",
    delivered_to: "Delivered To",
    payment_status: "Payment Status",
    order: "Order",
    
    // Profile
    my_account: "My Account",
    manage_profile: "Manage your profile, orders, and addresses",
    account_overview: "Account Overview",
    my_orders: "My Orders",
    address_book: "Address Book",
    settings: "Settings",
    personal_information: "Personal Information",
    full_name: "Full Name",
    phone_number: "Phone Number",
    email_address: "Email Address",
    save_changes: "Save Changes",
    saving: "Saving...",
    profile_updated: "Profile updated successfully!",
    profile_update_failed: "Failed to update profile.",
    recent_orders: "Recent Orders",
    delivery_address_title: "Delivery Address",
    default_address: "Default Address",
    edit_address: "Edit Address",
    add_new_address: "Add New Address",
    spent: "Spent",
    
    // Footer
    footer_about: "Your trusted marketplace for premium agricultural supplies, traditional goods, and pure spiritual essentials directly sourced from authentic farms and artisans.",
    quick_links: "Quick Links",
    support: "Support",
    contact_info: "Contact Info",
    all_rights_reserved: "All rights reserved.",
    privacy_policy: "Privacy Policy",
    terms_of_service: "Terms of Service",
    shipping_policy: "Shipping Policy",
    returns_refunds: "Returns & Refunds",
    bulk_orders: "Bulk Orders",
    track_order: "Track Order",
    all_products: "All Products",
    
    // Auth
    login_title: "Login",
    sign_in_desc: "Sign in to continue to Shree Sanatan Traders",
    dont_have_account: "Don't have an account?",
    create_account: "Create an account",
    email: "Email",
    password: "Password",
    login_btn: "Login",
    register_btn: "Register",
    register_title: "Create Account",
    already_have_account: "Already have an account?",
    name: "Name",
    phone: "Phone",
    district: "District",
    state: "State",
    pincode: "Pincode",
    village: "Village/Address",
    welcome_back: "Welcome back to Shree Sanatan!",
    login_failed: "Login failed. Please check your credentials.",
    register_success: "Account created successfully! Redirecting to login...",
    register_failed: "Registration failed. Please try again.",
    full_name: "Full Name",
    
    // Checkout
    checkout_title: "Checkout",
    shipping_details: "Shipping Details",
    confirm_pay: "Confirm & Pay",
    delivery_address_prompt: "Where should we deliver your products?",
    full_delivery_address: "Full Delivery Address",
    address_placeholder: "e.g. 123 Heritage Lane, Village, District, ZIP Code",
    address_detail_hint: "Please be detailed. Our logistics partners require accurate addressing.",
    return_to_cart: "Return to Cart",
    continue_summary: "Continue to Summary",
    order_summary: "Order Summary",
    review_summary: "Please review your selections and destination before confirming payment.",
    items_overview: "Items Overview",
    standard_delivery: "Standard Delivery",
    edit_shipping: "Edit Shipping",
    place_order_btn: "Place Order",
    order_success: "Order placed successfully! Thank you for trusting us.",
    order_failed: "Failed to place order. Please try again.",
    
    // Order Details
    order_receipt: "Order Receipt",
    back_to_orders: "Back to all orders",
    order_id: "Order ID",
    payment_details: "Payment Details",
    products_total: "Products Total",
    delivery_charge: "Delivery Charge",
    items_purchased: "Items Purchased",
    order_not_found: "Order not found",
    return_to_orders_btn: "Return to Orders",
    failed_load_order: "Failed to load order details.",
    
    // Support Pages
    shipping_policy_title: "Shipping Policy",
    returns_refunds_title: "Returns & Refunds",
    bulk_orders_title: "Bulk Orders",
    contact_us_title: "Contact Us",
    shipping_sec_1: "Order Processing Times",
    shipping_sec_1_desc: "All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.",
    shipping_sec_2: "Shipping Rates & Estimates",
    shipping_sec_2_desc: "Standard delivery typically takes 3-5 business days. Delivery delays can occasionally occur.",
    returns_sec_1: "Returns Eligibility",
    returns_sec_1_desc: "Items must be unused and in the same condition that you received them. You have 7 days to return an item.",
    bulk_desc: "Interested in ordering large quantities for your farm or business? Contact us for special pricing.",
    contact_desc: "Have questions about our products? Reach out to our team in Kargoon, MP.",
    get_in_touch: "Get in Touch",
    our_location: "Our Location",
    whatsapp_us: "WhatsApp Us",
  },
  hi: {
    // Navbar
    home: "होम",
    shop: "दुकान",
    categories: "श्रेणियां",
    search_placeholder: "उपकरण, पुर्जे या औजार खोजें...",
    account: "खाता",
    login: "लॉगिन",
    my_profile: "मेरी प्रोफाइल",
    order_history: "ऑर्डर इतिहास",
    admin_panel: "एडमिन पैनल",
    sign_out: "साइन आउट",
    cart: "कार्ट",
    express_delivery: "एक्सप्रेस कृषि डिलीवरी",
    
    // Sidebar
    all_categories: "सभी श्रेणियां",
    filter_by_price: "कीमत के अनुसार फिल्टर",
    
    // Product Card
    add_to_cart: "कार्ट में जोड़ें",
    buy_now: "अभी खरीदें",
    out_of_stock: "स्टॉक में नहीं",
    
    // Product Details
    whatsapp_order: "WhatsApp पर ऑर्डर करें",
    product_description: "उत्पाद विवरण",
    specifications: "विशेषताएं",
    price: "कीमत",
    inclusive_taxes: "सभी करों सहित",
    
    // Common Actions
    save: "सहेजें",
    cancel: "रद्द करें",
    delete: "हटाएं",
    edit: "संपादित करें",
    back: "पीछे",
    
    // Hero / Home
    hero_title: "गुणवत्तापूर्ण कृषि उपकरण",
    hero_subtitle: "आधुनिक किसानों के लिए आधुनिक उपकरण। ट्रैक्टर, बीज और सिंचाई प्रणालियों पर सर्वोत्तम सौदे प्राप्त करें।",
    hero_main_title: "प्रत्येक किसान के लिए विश्वसनीय कृषि उपकरण",
    hero_main_subtitle: "किफायती कीमतों पर सर्वोत्तम गुणवत्ता वाले सिंचाई किट, उपकरण और ट्रेलर।",
    shop_now: "अभी खरीदें",
    call_now: "अभी कॉल करें",
    featured_products: "विशेष उत्पाद",
    shop_by_categories: "श्रेणियों के अनुसार खरीदारी करें",
    why_choose_us: "हमें क्यों चुनें",
    trusted_seller: "विश्वसनीय स्थानीय विक्रेता",
    trusted_seller_desc: "खरगोन और आसपास के क्षेत्रों में किसानों की सेवा कर रहे हैं।",
    fast_delivery: "तेज डिलीवरी",
    fast_delivery_desc: "आपके घर तक त्वरित और सुरक्षित डिलीवरी।",
    affordable_prices: "किफायती कीमतें",
    affordable_prices_desc: "सर्वोत्तम कीमतों पर सर्वोत्तम गुणवत्ता वाले उत्पाद।",
    farmer_friendly: "किसान अनुकूल",
    farmer_friendly_desc: "किसानों की वास्तविक जरूरतों के लिए चुने गए उत्पाद।",
    about_shop: "हमारी दुकान के बारे में",
    about_desc: "खरगोन जिले, बामंदी में स्थित कृषि उपकरणों में एक विश्वसनीय नाम। हम अपने किसानों को गुणवत्तापूर्ण उत्पाद और उत्कृष्ट सेवा प्रदान करने के लिए प्रतिबद्ध हैं।",
    what_customers_say: "हमारे ग्राहक क्या कहते हैं",
    visit_us: "हमसे मिलें",
    call_us: "हमें कॉल करें",
    whatsapp: "WhatsApp",
    chat_on_whatsapp: "त्वरित सहायता के लिए हमारे साथ WhatsApp पर चैट करें",
    
    // Cart
    your_cart: "आपका कार्ट",
    cart_empty: "आपका कार्ट खाली है",
    cart_empty_desc: "ऐसा लगता है कि आपने अभी तक कुछ भी नहीं जोड़ा है। शुरू करने के लिए हमारे प्रीमियम उपकरणों को देखें।",
    browse_shop: "दुकान देखें",
    order_summary: "ऑर्डर सारांश",
    subtotal: "सबटोटल",
    shipping: "शिपिंग",
    total_price: "कुल कीमत",
    delivery_address: "डिलीवरी का पता",
    address_placeholder: "गाँव का पूरा पता दर्ज करें...",
    placing_order: "ऑर्डर दे रहे हैं...",
    proceed_to_checkout: "चेकआउट के लिए आगे बढ़ें",
    secure_payment: "सुरक्षित भुगतान",
    quick_delivery: "त्वरित डिलीवरी",
    calculated_next: "अगले चरण में गणना की जाएगी",
    clear_cart: "कार्ट खाली करें",
    continue_shopping: "खरीदारी जारी रखें",
    items: "आइटम",
    
    // Orders
    order_history: "ऑर्डर इतिहास",
    no_orders: "कोई ऑर्डर नहीं मिला",
    no_orders_desc: "आपने अभी तक कोई ऑर्डर नहीं दिया है।",
    order_id: "ऑर्डर आईडी",
    items_purchased: "खरीदे गए आइटम",
    delivered_to: "यहाँ डिलीवर किया गया",
    payment_status: "भुगतान की स्थिति",
    order: "ऑर्डर",
    
    // Profile
    my_account: "मेरा खाता",
    manage_profile: "अपनी प्रोफाइल, ऑर्डर और पते प्रबंधित करें",
    account_overview: "खाता अवलोकन",
    my_orders: "मेरे ऑर्डर",
    address_book: "पता पुस्तिका",
    settings: "सेटिंग्स",
    personal_information: "व्यक्तिगत जानकारी",
    full_name: "पूरा नाम",
    phone_number: "फ़ोन नंबर",
    email_address: "ईमेल पता",
    save_changes: "परिवर्तन सहेजें",
    saving: "सहेज रहे हैं...",
    profile_updated: "प्रोफ़ाइल सफलतापूर्वक अपडेट की गई!",
    profile_update_failed: "प्रोफ़ाइल अपडेट करने में विफल।",
    recent_orders: "हाल के ऑर्डर",
    delivery_address_title: "डिलीवरी का पता",
    default_address: "डिफ़ॉल्ट पता",
    edit_address: "पता संपादित करें",
    add_new_address: "नया पता जोड़ें",
    spent: "खर्च किए",
    
    // Footer
    footer_about: "प्रीमियम कृषि आपूर्ति, पारंपरिक सामान और सीधे प्रामाणिक खेतों और कारीगरों से प्राप्त शुद्ध आध्यात्मिक आवश्यक वस्तुओं के लिए आपका विश्वसनीय बाज़ार।",
    quick_links: "त्वरित लिंक",
    support: "सहायता",
    contact_info: "संपर्क जानकारी",
    all_rights_reserved: "सर्वाधिकार सुरक्षित।",
    privacy_policy: "गोपनीयता नीति",
    terms_of_service: "सेवा की शर्तें",
    shipping_policy: "शिपिंग नीति",
    returns_refunds: "रिटर्न और रिफंड",
    bulk_orders: "थोक ऑर्डर",
    track_order: "ऑर्डर ट्रैक करें",
    all_products: "सभी उत्पाद",
    
    // Auth
    login_title: "लॉगिन करें",
    sign_in_desc: "श्री सनातन ट्रेडर्स में जारी रखने के लिए साइन इन करें",
    dont_have_account: "क्या आपका खाता नहीं है?",
    create_account: "खाता बनाएं",
    email: "ईमेल",
    password: "पासवर्ड",
    login_btn: "लॉगिन करें",
    register_btn: "रजिस्टर करें",
    register_title: "नया खाता बनाएं",
    already_have_account: "क्या आपके पास पहले से खाता है?",
    name: "नाम",
    phone: "फ़ोन",
    district: "जिला",
    state: "राज्य",
    pincode: "पिनकोड",
    village: "गाँव/पता",
    welcome_back: "श्री सनातन में आपका स्वागत है!",
    login_failed: "लॉगिन विफल। कृपया अपनी साख जांचें।",
    register_success: "खाता सफलतापूर्वक बनाया गया! लॉगिन पर रीडायरेक्ट कर रहा है...",
    register_failed: "पंजीकरण विफल। कृपया पुन: प्रयास करें।",
    
    // Checkout
    checkout_title: "चेकआउट",
    shipping_details: "शिपिंग विवरण",
    confirm_pay: "पुष्टि और भुगतान",
    delivery_address_prompt: "हमें आपके उत्पाद कहाँ पहुँचाने चाहिए?",
    full_delivery_address: "पूरा डिलीवरी पता",
    address_placeholder: "उदा. 123 हेरिटेज लेन, गाँव, जिला, पिनकोड",
    address_detail_hint: "कृपया विस्तार से बताएं। हमारे लॉजिस्टिक्स भागीदारों को सटीक पते की आवश्यकता होती है।",
    return_to_cart: "कार्ट पर वापस जाएं",
    continue_summary: "सारांश पर जारी रखें",
    order_summary: "ऑर्डर सारांश",
    review_summary: "भुगतान की पुष्टि करने से पहले कृपया अपने चयन और गंतव्य की समीक्षा करें।",
    items_overview: "आइटम ओवरव्यू",
    standard_delivery: "स्टैंडर्ड डिलीवरी",
    edit_shipping: "शिपिंग बदलें",
    place_order_btn: "ऑर्डर दें",
    order_success: "ऑर्डर सफलतापूर्वक दिया गया! हम पर भरोसा करने के लिए धन्यवाद।",
    order_failed: "ऑर्डर देने में विफल। कृपया पुन: प्रयास करें।",
    
    // Order Details
    order_receipt: "ऑर्डर रसीद",
    back_to_orders: "सभी ऑर्डर पर वापस जाएं",
    order_id: "ऑर्डर आईडी",
    payment_details: "भुगतान विवरण",
    products_total: "उत्पादों का कुल",
    delivery_charge: "डिलीवरी शुल्क",
    items_purchased: "खरीदे गए आइटम",
    order_not_found: "ऑर्डर नहीं मिला",
    return_to_orders_btn: "ऑर्डर पर वापस जाएं",
    failed_load_order: "ऑर्डर विवरण लोड करने में विफल।",
    
    // Support Pages
    shipping_policy_title: "शिपिंग नीति",
    returns_refunds_title: "वापसी और रिफंड",
    bulk_orders_title: "थोक ऑर्डर",
    contact_us_title: "संपर्क करें",
    shipping_sec_1: "ऑर्डर प्रोसेसिंग समय",
    shipping_sec_1_desc: "सभी ऑर्डर 1-2 व्यावसायिक दिनों के भीतर संसाधित किए जाते हैं। सप्ताहांत या छुट्टियों पर ऑर्डर शिप या डिलीवर नहीं किए जाते हैं।",
    shipping_sec_2: "शिपिंग दरें और अनुमान",
    shipping_sec_2_desc: "स्टैंडर्ड डिलीवरी में आमतौर पर 3-5 व्यावसायिक दिन लगते हैं। क्षेत्रीय बाधाओं के कारण देरी हो सकती है।",
    returns_sec_1: "वापसी की पात्रता",
    returns_sec_1_desc: "आइटम अप्रयुक्त और उसी स्थिति में होने चाहिए जिसमें आपने उन्हें प्राप्त किया था। आपके पास आइटम वापस करने के लिए 7 दिन हैं।",
    bulk_desc: "अपने खेत या व्यवसाय के लिए बड़ी मात्रा में ऑर्डर करने में रुचि रखते हैं? विशेष मूल्य निर्धारण के लिए हमसे संपर्क करें।",
    contact_desc: "हमारे उत्पादों के बारे में प्रश्न हैं? खरगोन, मप्र में हमारी टीम से संपर्क करें।",
    get_in_touch: "संपर्क में रहें",
    our_location: "हमारा स्थान",
    whatsapp_us: "व्हाट्सएप करें",
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const t = (key) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
