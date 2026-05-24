import API from "./api";

export const getProfile = async () => {
  const res = await API.get("/profile");
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await API.put("/profile", data);
  return res.data;
};

export const changePassword = async (data) => {
  const res = await API.patch("/profile/security/password", data);
  return res.data;
};

export const updateNotifications = async (data) => {
  const res = await API.patch("/profile/notifications", data);
  return res.data;
};

export const updateSettings = async (data) => {
  const res = await API.patch("/profile/settings", data);
  return res.data;
};

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  const res = await API.post("/profile/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const uploadBanner = async (file) => {
  const formData = new FormData();
  formData.append("banner", file);
  const res = await API.post("/profile/banner", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const logoutAllDevices = async () => {
  const res = await API.post("/profile/security/logout-all");
  return res.data;
};

export const deleteAccount = async (password) => {
  const res = await API.delete("/profile/delete-account", { data: { password } });
  return res.data;
};

export const getOrders = async () => {
  const res = await API.get("/orders");
  return res.data;
};
