const hasValue = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null && String(value).trim() !== "";
};

const hasNotificationSettings = (settings = {}) =>
  ["lowStock", "newOrders", "weeklyReport", "promotions", "smsAlerts", "emailAlerts"].some(
    (key) => typeof settings[key] === "boolean"
  );

const hasBusinessInfo = (user) => {
  if (user.userType === "farmer") {
    return (
      hasValue(user.landSize) &&
      hasValue(user.crops) &&
      hasValue(user.irrigation) &&
      hasValue(user.farmingType) &&
      hasValue(user.soilType)
    );
  }

  return (
    hasValue(user.shopName) &&
    hasValue(user.gstNumber) &&
    hasValue(user.businessType) &&
    hasValue(user.businessAddress)
  );
};

const calculateProfileCompletion = (user) => {
  const missingSteps = [];
  let percentage = 0;

  if (hasValue(user.avatar)) percentage += 10;
  else missingSteps.push("Upload profile avatar");

  if (hasValue(user.phone)) percentage += 10;
  else missingSteps.push("Add phone number");

  if (hasValue(user.defaultAddress) || hasValue(user.addresses)) percentage += 20;
  else missingSteps.push("Add delivery address");

  if (hasBusinessInfo(user)) percentage += 30;
  else missingSteps.push("Complete business information");

  if (hasValue(user.bio)) percentage += 10;
  else missingSteps.push("Add profile bio");

  if (hasNotificationSettings(user.notificationSettings)) percentage += 10;
  else missingSteps.push("Configure notifications");

  if (hasValue(user.lastPasswordChanged)) percentage += 10;
  else missingSteps.push("Update password once");

  return {
    percentage: Math.min(100, percentage),
    missingSteps,
  };
};

module.exports = calculateProfileCompletion;
