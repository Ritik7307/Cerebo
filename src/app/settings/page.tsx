import { Settings as SettingsIcon, User, Shield, Bell, Database } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-heading font-bold text-white tracking-tight">Settings</h1>
        <p className="text-zinc-400">Manage your profile, preferences, and integrations.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation */}
        <div className="md:col-span-1 space-y-1">
          <SettingsTab active icon={<User />} label="Profile" />
          <SettingsTab icon={<Shield />} label="Account" />
          <SettingsTab icon={<Bell />} label="Notifications" />
          <SettingsTab icon={<Database />} label="Data & Export" />
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Profile Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Display Name</label>
                <input 
                  type="text" 
                  defaultValue="Ritik Prajapati" 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Bio</label>
                <textarea 
                  rows={4}
                  defaultValue="Senior Full Stack Engineer & UX Expert."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <button className="bg-white text-black px-4 py-2 rounded-md font-medium text-sm hover:bg-zinc-200 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ active, icon, label }: { active?: boolean, icon: any, label: string }) {
  return (
    <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
      active ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
    }`}>
      <div className="w-4 h-4">{icon}</div>
      {label}
    </button>
  );
}
