import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HowItWorks from "./pages/HowItWorks";
import Pricing from "./pages/Pricing";
import Marketplace from "./pages/Marketplace";
import GigDetail from "./pages/GigDetail";
import FreelancerProfile from "./pages/FreelancerProfile";
import Messages from "./pages/Messages";

import ClientDashboard from "./pages/client/ClientDashboard";
import ClientGigs from "./pages/client/ClientGigs";
import PostGig from "./pages/client/PostGig";
import ClientPayments from "./pages/client/ClientPayments";

import FreelancerDashboard from "./pages/freelancer/FreelancerDashboard";
import FreelancerProposals from "./pages/freelancer/FreelancerProposals";
import FreelancerProfileEdit from "./pages/freelancer/FreelancerProfileEdit";
import FreelancerSchedule from "./pages/freelancer/FreelancerSchedule";
import FreelancerEarnings from "./pages/freelancer/FreelancerEarnings";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminVerifications from "./pages/admin/AdminVerifications";
import AdminGigs from "./pages/admin/AdminGigs";
import AdminDisputes from "./pages/admin/AdminDisputes";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/gigs/:id" element={<GigDetail />} />
        <Route path="/freelancers/:id" element={<FreelancerProfile />} />
        <Route path="/messages" element={<Messages role="client" />} />

        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/client/gigs" element={<ClientGigs />} />
        <Route path="/client/post-gig" element={<PostGig />} />
        <Route path="/client/payments" element={<ClientPayments />} />
        <Route path="/client/messages" element={<Messages role="client" />} />

        <Route path="/freelancer" element={<FreelancerDashboard />} />
        <Route path="/freelancer/proposals" element={<FreelancerProposals />} />
        <Route path="/freelancer/profile" element={<FreelancerProfileEdit />} />
        <Route path="/freelancer/schedule" element={<FreelancerSchedule />} />
        <Route path="/freelancer/earnings" element={<FreelancerEarnings />} />
        <Route path="/freelancer/messages" element={<Messages role="freelancer" />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/verifications" element={<AdminVerifications />} />
        <Route path="/admin/gigs" element={<AdminGigs />} />
        <Route path="/admin/disputes" element={<AdminDisputes />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />

        <Route path="*" element={<Home />} />
      </Routes>
    </HashRouter>
  );
}
