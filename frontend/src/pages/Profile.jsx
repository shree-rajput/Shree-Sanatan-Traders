import React, { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LuLoaderCircle } from "react-icons/lu";

import AddressManager from "../components/AddressManager";
import ProfileCard from "../components/profile/ProfileCard";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfileStats from "../components/profile/ProfileStats";
import { LoadingSkeleton } from "../components/profile/ProfileInput";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { getOrders, getProfile } from "../services/profileService";

const ProfileOverview = lazy(() => import("../components/profile/ProfileOverview"));
const ProfileBusiness = lazy(() => import("../components/profile/ProfileBusiness"));
const ProfileOrders = lazy(() => import("../components/profile/ProfileOrders"));
const ProfileNotifications = lazy(() => import("../components/profile/ProfileNotifications"));
const ProfileSecurity = lazy(() => import("../components/profile/ProfileSecurity"));
const ProfileSettings = lazy(() => import("../components/profile/ProfileSettings"));

const Profile = () => {
  const { user: authUser, login, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState(authUser);
  const [orders, setOrders] = useState([]);
  const [addressesCount, setAddressesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const syncUser = useCallback(
    (nextUser) => {
      if (!nextUser) return;
      setProfile(nextUser);
      login(nextUser, token);
    },
    [login, token]
  );

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const [profileRes, ordersRes, addressesRes] = await Promise.all([
          getProfile(),
          getOrders(),
          API.get("/addresses"),
        ]);

        if (!isMounted) return;
        const nextUser = profileRes.user || profileRes;
        setProfile(nextUser);
        login(nextUser, token);
        setOrders(Array.isArray(ordersRes) ? ordersRes : ordersRes.orders || []);
        setAddressesCount(Array.isArray(addressesRes.data) ? addressesRes.data.length : 0);
      } catch (err) {
        if (!isMounted) return;
        setError(err.response?.data?.message || "Failed to load profile");
        toast.error(err.response?.data?.message || "Failed to load profile");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [login, token]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const activeContent = useMemo(() => {
    const props = { user: profile, onProfileUpdate: syncUser };
    switch (activeTab) {
      case "business":
        return <ProfileBusiness {...props} />;
      case "addresses":
        return <AddressManager />;
      case "orders":
        return <ProfileOrders orders={orders} />;
      case "notifications":
        return <ProfileNotifications {...props} />;
      case "security":
        return <ProfileSecurity />;
      case "settings":
        return <ProfileSettings {...props} />;
      case "overview":
      default:
        return <ProfileOverview {...props} />;
    }
  }, [activeTab, orders, profile, syncUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 h-24 animate-pulse rounded-3xl bg-gray-100" />
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <div className="h-[560px] animate-pulse rounded-3xl bg-gray-100" />
            <LoadingSkeleton rows={6} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <LuLoaderCircle className="mx-auto mb-4 text-red-500" size={36} />
          <h1 className="text-2xl font-black text-gray-900">Profile unavailable</h1>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-2xl bg-green-600 px-5 py-3 text-sm font-black text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <ProfileHeader user={profile} />

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <ProfileSidebar
            user={profile}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={handleLogout}
          />

          <main className="space-y-6">
            <ProfileStats
              orders={orders}
              addressesCount={addressesCount}
              completion={profile?.profileCompletion || 0}
            />
            <ProfileCard className="min-h-[560px]">
              <Suspense fallback={<LoadingSkeleton rows={5} />}>{activeContent}</Suspense>
            </ProfileCard>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
