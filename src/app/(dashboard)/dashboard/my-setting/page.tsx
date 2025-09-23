"use client";

import React, { useState } from "react";

interface SettingTab {
  id: string;
  title: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

interface SettingsData {
  tabs: SettingTab[];
  terms: string;
  privacy: string;
  contact: ContactInfo;
}

type EditableContent = string | ContactInfo;

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData>(settingsData);
  const tabs: SettingTab[] = settings.tabs;
  const [activeTab, setActiveTab] = useState<string>("terms");
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<EditableContent | null>(null);

  // Handle edit toggle
  const handleEdit = (value: EditableContent) => {
    setIsEditing(true);
    setEditValue(value);
  };

  // Handle save update
  const handleSave = (type: "terms" | "privacy" | "contact") => {
    const updatedSettings = { ...settings };

    if (type === "terms" && typeof editValue === "string") {
      updatedSettings.terms = editValue;
    }

    if (type === "privacy" && typeof editValue === "string") {
      updatedSettings.privacy = editValue;
    }

    if (type === "contact" && typeof editValue !== "string" && editValue) {
      updatedSettings.contact = { ...editValue };
    }

    setSettings(updatedSettings);
    setIsEditing(false);
    setEditValue(null);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "terms":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Terms & Conditions</h2>
            <div className="p-3">
              {isEditing && typeof editValue === "string" ? (
                <div className="space-y-2">
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full border border-pink-400 p-2 rounded-md"
                    rows={5}
                  />
                  <button
                    onClick={() => handleSave("terms")}
                    className="px-4 py-2 bg-pink-600 text-white rounded-lg"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 leading-relaxed">
                    {settings.terms}
                  </p>
                  <button
                    onClick={() => handleEdit(settings.terms)}
                    className="text-sm text-pink-600 underline mt-2"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Privacy Policy</h2>
            <div className="p-3 ">
              {isEditing && typeof editValue === "string" ? (
                <div className="space-y-2">
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full border border-pink-400 p-2 rounded-md"
                    rows={5}
                  />
                  <button
                    onClick={() => handleSave("privacy")}
                    className="px-4 py-2 bg-pink-600 text-white rounded-lg"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 leading-relaxed">
                    {settings.privacy}
                  </p>
                  <button
                    onClick={() => handleEdit(settings.privacy)}
                    className="text-sm text-pink-600 underline mt-2"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>
        );

      case "contact":
        const contactData = settings.contact;
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Contact Us</h2>

            {isEditing && editValue && typeof editValue !== "string" ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editValue.email}
                  onChange={(e) =>
                    setEditValue({ ...editValue, email: e.target.value })
                  }
                  className="w-full border p-2 rounded-md"
                />
                <input
                  type="text"
                  value={editValue.phone}
                  onChange={(e) =>
                    setEditValue({ ...editValue, phone: e.target.value })
                  }
                  className="w-full border p-2 rounded-md"
                />
                <input
                  type="text"
                  value={editValue.address}
                  onChange={(e) =>
                    setEditValue({ ...editValue, address: e.target.value })
                  }
                  className="w-full border p-2 rounded-md"
                />
                <button
                  onClick={() => handleSave("contact")}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="space-y-4 mt-6">
                <div className="p-4 border border-pink-200 rounded-lg">
                  <p className="font-medium">Email</p>
                  <p className="text-pink-600">{contactData.email}</p>
                </div>
                <div className="p-4 border border-pink-200 rounded-lg">
                  <p className="font-medium">Phone</p>
                  <p className="text-pink-600">{contactData.phone}</p>
                </div>
                <div className="p-4 border border-pink-200 rounded-lg">
                  <p className="font-medium">Address</p>
                  <p className="text-pink-600">{contactData.address}</p>
                </div>

                <button
                  onClick={() => handleEdit(contactData)}
                  className="text-sm text-pink-600 underline mt-2"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Settings</h2>
            <p className="text-gray-600">
              Select a setting category from the menu to configure your
              preferences.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 text-gray-800 p-6">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Sidebar - Tabs */}
        <div className="md:col-span-1 bg-white p-4 rounded-xl shadow-md space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsEditing(false); // reset editing when switching tabs
              }}
              className={`w-full text-left py-3 px-4 rounded-lg flex justify-between items-center transition-colors ${
                activeTab === tab.id
                  ? "bg-pink-100 text-pink-700 font-medium"
                  : "hover:bg-pink-50"
              }`}
            >
              {tab.title}
              <span>&#8250;</span>
            </button>
          ))}
        </div>

        {/* Right Content - Tab Details */}
        <div className="md:col-span-3 bg-white p-6 rounded-xl shadow-md overflow-y-auto max-h-[70vh]">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

const settingsData: SettingsData = {
  tabs: [
    { id: "terms", title: "Terms & Conditions" },
    { id: "privacy", title: "Privacy Policy" },
    { id: "contact", title: "Contact Us" },
  ],
  terms:
    "Phosfluorescently enhance installed base vortals and plug-and-play human capital. Completely monetize bricks-and-clicks products rather than turnkey models. Energistically scale 24/365 services with cutting-edge vortals. Synergistically whiteboard magnetic web services before viral supply chains. Enthusiastically transform visionary human capital without functionalized quality vectors. Intrinsicly underwhelm customized quality vectors through flexible ideas. Collaboratively benchmark performance based intellectual capital without B2B applications.",
  privacy:
    "Uniquely parallel task focused leadership without ethical manufactured products. Holisticly myocardinate future-proof expertise before just in time ROI. Interactively reinvent business paradigms without high-payoff processes. Continually evolve superior action items after leading-edge interfaces. Progressively grow future-proof total linkage vis-a-vis resource maximizing.",
  contact: {
    email: "support@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Healthcare St, Medical District, City, 10001",
  },
};
