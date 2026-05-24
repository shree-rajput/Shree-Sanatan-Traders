import API from "./api";

export const updateProfile = async (data) => {
  const res = await API.put("/users/me", data);
  return res.data;
};

export const changePassword = async (data) => {
  const res = await API.patch("/users/change-password", data);
  return res.data;
};

export const getOrders = async () => {
  const res = await API.get("/orders");
  return res.data;
};