import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar.jsx";
import AppTopbar from "../components/AppTopbar.jsx";

import {
  Settings,
  User,
  Bell,
  Lock,
  ShieldCheck,
  CreditCard,
  Plug,
  Users,
  Building2,
  Download,
  History,
  HelpCircle,
  Moon,
  LayoutGrid,
  CheckCircle2,
  Cloud,
  Mail,
  Construction,
  Globe2,
  Crown,
  Trash2,
} from "lucide-react";


const tabs = [
  { icon: Settings, label: "General" },
  { icon: User, label: "Profile" },
  { icon: Bell, label: "Notifications" },
  { icon: Lock, label: "Security" },
  { icon: ShieldCheck, label: "Privacy" },
  { icon: CreditCard, label: "Billing & Plan" },
  { icon: Plug, label: "Integrations" },
  { icon: Users, label: "Team Management" },
  { icon: Building2, label: "Workspace" },
  { icon: Download, label: "Import / Export" },
  { icon: History, label: "Activity Log" },
];


const planFeatures = [
  "Unlimited Projects",
  "Unlimited Team Members",
  "Advanced Reports",
  "Priority Support",
  "Custom Integrations",
];


function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}


export default function SettingsPage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("General");

  const [workspaceName, setWorkspaceName] =
    useState("PM Tool Workspace");

  const [timezone, setTimezone] =
    useState("(GMT+05:00) Pakistan Standard Time");

  const [dateFormat, setDateFormat] =
    useState("MMM DD, YYYY");

  const [weekStart, setWeekStart] =
    useState("Monday");

  const [saved, setSaved] = useState(false);


  const [toggles, setToggles] = useState({
    darkMode: false,
    compactMode: true,
    showCompleted: true,
    autoSave: true,
    emailNotifications: true,
  });


  const toggle = (key) =>
    setToggles((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));


  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };


  const preferences = [
    {
      key: "darkMode",
      icon: Moon,
      label: "Dark Mode",
      desc: "Switch between light and dark theme.",
    },
    {
      key: "compactMode",
      icon: LayoutGrid,
      label: "Compact Mode",
      desc: "Reduce spacing and fit more content on screen.",
    },
    {
      key: "showCompleted",
      icon: CheckCircle2,
      label: "Show Completed Tasks",
      desc: "Display completed tasks in task lists.",
    },
    {
      key: "autoSave",
      icon: Cloud,
      label: "Auto Save",
      desc: "Automatically save changes while you work.",
    },
    {
      key: "emailNotifications",
      icon: Mail,
      label: "Email Notifications",
      desc: "Receive important updates via email.",
    },
  ];


  return (
    <div className="min-h-screen bg-surface flex">

      {/* Sidebar */}
      <Sidebar />


      <div className="flex-1 min-w-0">

        {/* Topbar */}
        <AppTopbar />


        <div className="p-6 grid grid-cols-1 xl:grid-cols-4 gap-6">

          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">

            {/* Header */}
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">
                Settings
              </h1>

              <p className="text-sm text-gray-500">
                Manage your account, preferences and workspace settings.
              </p>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5">

              {/* Settings Navigation */}
              <div className="space-y-4">

                <div className="bg-white rounded-2xl border border-gray-100 p-2">

                  {tabs.map((t) => {
                    const Icon = t.icon;

                    return (
                      <button
                        key={t.label}
                        onClick={() => setActiveTab(t.label)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                          activeTab === t.label
                            ? "bg-indigo-50 text-primary"
                            : "text-gray-500 hover:bg-surface"
                        }`}
                      >
                        <Icon
                          size={17}
                          strokeWidth={1.8}
                        />

                        {t.label}
                      </button>
                    );
                  })}

                </div>


                {/* Help Center */}
                <div className="
                  bg-white
                  rounded-2xl
                  border
                  border-gray-100
                  p-4
                  flex
                  items-center
                  justify-between
                ">

                  <div className="flex items-center gap-2 text-sm">

                    <span className="
                      w-8
                      h-8
                      rounded-lg
                      bg-indigo-50
                      text-primary
                      flex
                      items-center
                      justify-center
                    ">
                      <HelpCircle
                        size={17}
                        strokeWidth={1.8}
                      />
                    </span>

                    <div>
                      <p className="font-medium text-gray-800 text-xs">
                        Need help?
                      </p>

                      <p className="text-[11px] text-gray-400">
                        Visit our Help Center
                      </p>
                    </div>

                  </div>

                  <span className="text-gray-300">
                    ›
                  </span>

                </div>

              </div>


              {/* Settings Content */}
              <div className="space-y-5">

                {activeTab === "General" ? (

                  <>

                    {/* General Settings */}
                    <div className="
                      bg-white
                      rounded-2xl
                      border
                      border-gray-100
                      p-5
                    ">

                      <div className="
                        flex
                        items-center
                        justify-between
                        mb-5
                      ">

                        <h2 className="font-bold text-gray-900">
                          General Settings
                        </h2>

                        <button
                          onClick={handleSave}
                          className="
                            bg-primary
                            text-white
                            text-sm
                            font-semibold
                            px-4
                            py-2
                            rounded-lg
                            hover:bg-indigo-700
                            transition-all
                            hover:scale-105
                          "
                        >
                          {saved ? "Saved ✓" : "Save Changes"}
                        </button>

                      </div>


                      <div className="space-y-4">

                        {/* Workspace Name */}
                        <div className="
                          grid
                          grid-cols-1
                          sm:grid-cols-2
                          gap-4
                          items-center
                        ">

                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Workspace Name
                            </p>

                            <p className="text-xs text-gray-400">
                              This is the name of your workspace.
                            </p>
                          </div>

                          <input
                            value={workspaceName}
                            onChange={(e) =>
                              setWorkspaceName(e.target.value)
                            }
                            className="
                              border
                              border-gray-200
                              rounded-lg
                              px-3
                              py-2
                              text-sm
                              focus:outline-none
                              focus:ring-2
                              focus:ring-primary
                            "
                          />

                        </div>


                        {/* Timezone */}
                        <div className="
                          grid
                          grid-cols-1
                          sm:grid-cols-2
                          gap-4
                          items-center
                        ">

                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Default Timezone
                            </p>

                            <p className="text-xs text-gray-400">
                              This timezone will be used across the workspace.
                            </p>
                          </div>

                          <select
                            value={timezone}
                            onChange={(e) =>
                              setTimezone(e.target.value)
                            }
                            className="
                              border
                              border-gray-200
                              rounded-lg
                              px-3
                              py-2
                              text-sm
                              focus:outline-none
                              focus:ring-2
                              focus:ring-primary
                            "
                          >
                            <option>
                              (GMT+05:00) Pakistan Standard Time
                            </option>

                            <option>
                              (GMT+00:00) UTC
                            </option>

                            <option>
                              (GMT-05:00) Eastern Time
                            </option>

                            <option>
                              (GMT+01:00) Central European Time
                            </option>
                          </select>

                        </div>


                        {/* Date Format */}
                        <div className="
                          grid
                          grid-cols-1
                          sm:grid-cols-2
                          gap-4
                          items-center
                        ">

                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Date Format
                            </p>

                            <p className="text-xs text-gray-400">
                              Choose how dates are displayed.
                            </p>
                          </div>

                          <select
                            value={dateFormat}
                            onChange={(e) =>
                              setDateFormat(e.target.value)
                            }
                            className="
                              border
                              border-gray-200
                              rounded-lg
                              px-3
                              py-2
                              text-sm
                              focus:outline-none
                              focus:ring-2
                              focus:ring-primary
                            "
                          >
                            <option value="MMM DD, YYYY">
                              Aug 17, 2026 (MMM DD, YYYY)
                            </option>

                            <option value="DD/MM/YYYY">
                              17/08/2026 (DD/MM/YYYY)
                            </option>

                            <option value="MM/DD/YYYY">
                              08/17/2026 (MM/DD/YYYY)
                            </option>
                          </select>

                        </div>


                        {/* Week Start */}
                        <div className="
                          grid
                          grid-cols-1
                          sm:grid-cols-2
                          gap-4
                          items-center
                        ">

                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Week Starts On
                            </p>

                            <p className="text-xs text-gray-400">
                              Select the first day of the week.
                            </p>
                          </div>

                          <select
                            value={weekStart}
                            onChange={(e) =>
                              setWeekStart(e.target.value)
                            }
                            className="
                              border
                              border-gray-200
                              rounded-lg
                              px-3
                              py-2
                              text-sm
                              focus:outline-none
                              focus:ring-2
                              focus:ring-primary
                            "
                          >
                            <option>Sunday</option>
                            <option>Monday</option>
                          </select>

                        </div>

                      </div>

                    </div>


                    {/* Preferences */}
                    <div className="
                      bg-white
                      rounded-2xl
                      border
                      border-gray-100
                      p-5
                    ">

                      <h2 className="
                        font-bold
                        text-gray-900
                        mb-4
                      ">
                        Preferences
                      </h2>


                      <ul className="
                        divide-y
                        divide-gray-50
                      ">

                        {preferences.map((p) => {
                          const Icon = p.icon;

                          return (
                            <li
                              key={p.key}
                              className="
                                flex
                                items-center
                                justify-between
                                py-3
                              "
                            >

                              <div className="
                                flex
                                items-center
                                gap-3
                              ">

                                <span className="
                                  w-9
                                  h-9
                                  rounded-lg
                                  bg-indigo-50
                                  text-primary
                                  flex
                                  items-center
                                  justify-center
                                  flex-shrink-0
                                ">

                                  <Icon
                                    size={17}
                                    strokeWidth={1.8}
                                  />

                                </span>


                                <div>

                                  <p className="
                                    text-sm
                                    font-medium
                                    text-gray-800
                                  ">
                                    {p.label}
                                  </p>

                                  <p className="
                                    text-xs
                                    text-gray-400
                                  ">
                                    {p.desc}
                                  </p>

                                </div>

                              </div>


                              {/* Toggle */}
                              <button
                                onClick={() =>
                                  toggle(p.key)
                                }
                                className="
                                  rounded-full
                                  relative
                                  transition-colors
                                  flex-shrink-0
                                "
                                style={{
                                  width: 40,
                                  height: 22,
                                  backgroundColor:
                                    toggles[p.key]
                                      ? "#4F46E5"
                                      : "#E5E7EB",
                                }}
                              >

                                <span
                                  className="
                                    absolute
                                    top-0.5
                                    rounded-full
                                    bg-white
                                    transition-all
                                  "
                                  style={{
                                    width: 18,
                                    height: 18,
                                    left: toggles[p.key]
                                      ? 19
                                      : 2,
                                  }}
                                />

                              </button>

                            </li>
                          );
                        })}

                      </ul>

                    </div>

                  </>

                ) : (

                  <div className="
                    bg-white
                    rounded-2xl
                    border
                    border-gray-100
                    p-10
                    text-center
                  ">

                    <Construction
                      size={34}
                      strokeWidth={1.5}
                      className="
                        mx-auto
                        mb-3
                        text-primary
                      "
                    />

                    <p className="
                      font-semibold
                      text-gray-700
                      mb-1
                    ">
                      {activeTab}
                    </p>

                    <p className="
                      text-sm
                      text-gray-400
                    ">
                      This section is coming soon.
                    </p>

                  </div>

                )}

              </div>

            </div>

          </div>


          {/* Right Sidebar */}
          <div className="space-y-6">

            {/* Account Information */}
            <div className="
              bg-white
              rounded-2xl
              border
              border-gray-100
              p-5
            ">

              <h2 className="
                font-bold
                text-gray-900
                mb-4
              ">
                Account Information
              </h2>


              <div className="
                flex
                items-center
                gap-3
                mb-4
              ">

                <span className="
                  w-14
                  h-14
                  rounded-full
                  bg-gradient-to-br
                  from-primary
                  to-purple-500
                  text-white
                  text-lg
                  font-bold
                  flex
                  items-center
                  justify-center
                  flex-shrink-0
                ">
                  {initials(user?.name)}
                </span>


                <div>

                  <p className="
                    font-semibold
                    text-gray-900
                  ">
                    {user?.name}
                  </p>

                  <p className="
                    text-xs
                    text-gray-400
                  ">
                    Admin
                  </p>

                  <p className="
                    text-xs
                    text-emerald-500
                    font-medium
                  ">
                    <span className="inline-block mr-1">
                      ●
                    </span>
                    Online
                  </p>

                </div>

              </div>


              <button className="
                w-full
                border
                border-primary
                text-primary
                text-sm
                font-semibold
                py-2
                rounded-lg
                hover:bg-indigo-50
                transition-colors
                mb-4
              ">
                Edit Profile
              </button>


              <ul className="
                space-y-2
                text-sm
                text-gray-500
              ">

                {/* <li className="
                  flex
                  items-center
                  gap-2
                ">
                  <Mail
                    size={15}
                    strokeWidth={1.7}
                  />

                  {user?.email}
                </li> */}


                <li className="
                  flex
                  items-center
                  gap-2
                ">
                  <Globe2
                    size={15}
                    strokeWidth={1.7}
                  />

                  English (US)
                </li>

              </ul>

            </div>


            {/* Current Plan */}
            <div className="
              bg-white
              rounded-2xl
              border
              border-gray-100
              p-5
            ">

              <div className="
                flex
                items-center
                justify-between
                mb-4
              ">

                <h2 className="
                  font-bold
                  text-gray-900
                ">
                  Current Plan
                </h2>

                <span className="
                  text-sm
                  text-primary
                  font-medium
                  cursor-pointer
                ">
                  Manage Plan
                </span>

              </div>


              <div className="
                flex
                items-center
                gap-3
                mb-4
              ">

                <span className="
                  w-11
                  h-11
                  rounded-lg
                  bg-indigo-50
                  text-primary
                  flex
                  items-center
                  justify-center
                ">
                  <Crown
                    size={19}
                    strokeWidth={1.8}
                  />
                </span>


                <div className="flex-1">

                  <p className="
                    font-semibold
                    text-gray-800
                  ">
                    Free Plan
                  </p>

                  <p className="
                    text-xs
                    text-gray-400
                  ">
                    $0 / month
                  </p>

                </div>


                <span className="
                  text-xs
                  bg-emerald-50
                  text-emerald-600
                  px-2
                  py-0.5
                  rounded-full
                  font-medium
                ">
                  Active
                </span>

              </div>


              <ul className="
                space-y-2
                mb-4
              ">

                {planFeatures.map((f) => (

                  <li
                    key={f}
                    className="
                      text-xs
                      text-gray-400
                      flex
                      items-center
                      gap-2
                      line-through
                    "
                  >

                    <CheckCircle2
                      size={13}
                      strokeWidth={1.7}
                      className="text-gray-300"
                    />

                    {f}

                  </li>

                ))}

              </ul>


              <button className="
                w-full
                bg-primary
                text-white
                text-sm
                font-semibold
                py-2.5
                rounded-lg
                hover:bg-indigo-700
                transition-colors
              ">
                Upgrade to Pro
              </button>

            </div>


            {/* Danger Zone */}
            <div className="
              bg-white
              rounded-2xl
              border
              border-red-100
              p-5
            ">

              <h2 className="
                font-bold
                text-red-600
                mb-1
              ">
                Danger Zone
              </h2>

              <p className="
                text-xs
                text-gray-500
                mb-4
              ">
                These actions are permanent and cannot be undone.
              </p>


              <button className="
                w-full
                border
                border-red-200
                text-red-500
                text-sm
                font-semibold
                py-2.5
                rounded-lg
                hover:bg-red-50
                transition-colors
                flex
                items-center
                justify-center
                gap-2
              ">

                <Trash2
                  size={16}
                  strokeWidth={1.8}
                />

                Delete Workspace

              </button>

            </div>

          </div>

        </div>


        {/* Footer */}
        <footer className="
          text-center
          text-xs
          text-gray-400
          py-6
        ">
          © 2026 PM Tool. All rights reserved.
        </footer>

      </div>

    </div>
  );
}