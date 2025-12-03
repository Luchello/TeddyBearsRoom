"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Package, Heart, Settings, LogOut, Crown } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  // Note: activeTab은 Tabs 컴포넌트의 value로 사용 예정
  const [_activeTab, setActiveTab] = useState("overview");

  // Mock User Data
  const user = {
    name: "Master Bear",
    email: "master@teddybear.com",
    tier: "VIP",
    points: 12500,
    avatar: "/tbr_logo.png", // Light mode avatar
    avatarDark: "/tbr_logo_dark.png", // Dark mode avatar
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header / Profile Card */}
        <div className="relative">
          {/* Background Decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl dark:from-primary/10 dark:to-purple-900/20 -z-10" />

          <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white/80 backdrop-blur-xl dark:bg-black/40 dark:backdrop-blur-md dark:border dark:border-primary/30">
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />

            <CardContent className="p-8 md:p-12 relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Avatar */}
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 p-1 dark:from-primary dark:to-purple-600">
                    <div className="w-full h-full rounded-full bg-white dark:bg-black overflow-hidden relative">
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="w-full h-full object-contain p-2 dark:hidden"
                      />
                      <img
                        src={user.avatarDark}
                        alt="Profile"
                        className="w-full h-full object-contain p-2 hidden dark:block"
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <Crown className="w-3 h-3 fill-current" />
                    {user.tier}
                  </div>
                </div>

                {/* Info */}
                <div className="text-center md:text-left space-y-2 flex-1">
                  <h1 className="text-3xl font-bold text-foreground dark:text-white dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    {user.name}
                  </h1>
                  <p className="text-muted-foreground dark:text-gray-400">{user.email}</p>
                  <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                    <div className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-bold dark:bg-primary/20 dark:text-primary dark:shadow-[0_0_10px_rgba(0,255,65,0.2)]">
                      {user.points.toLocaleString()} P
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl dark:border-white/20 dark:text-white dark:hover:bg-white/10">
                      Edit Profile
                    </Button>
                  </div>
                </div>

                {/* Logout */}
                <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400">
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="overview" className="space-y-8" onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start bg-transparent p-0 gap-4 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: User },
              { id: "orders", label: "My Orders", icon: Package },
              { id: "wishlist", label: "Wishlist", icon: Heart },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="rounded-full px-6 py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg dark:data-[state=active]:bg-primary dark:data-[state=active]:text-black dark:data-[state=active]:shadow-[0_0_15px_rgba(0,255,65,0.4)] transition-all"
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Content Area */}
          <div className="min-h-[400px]">
            <TabsContent value="overview" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="rounded-3xl border-none bg-white/50 backdrop-blur shadow-lg dark:bg-black/40 dark:border dark:border-primary/20">
                  <CardHeader>
                    <CardTitle className="dark:text-white">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground dark:text-gray-400">No recent activity.</p>
                  </CardContent>
                </Card>
                <Card className="rounded-3xl border-none bg-white/50 backdrop-blur shadow-lg dark:bg-black/40 dark:border dark:border-primary/20">
                  <CardHeader>
                    <CardTitle className="dark:text-white">Recommended for You</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video rounded-2xl bg-muted/50 flex items-center justify-center dark:bg-white/5">
                      <p className="text-sm text-muted-foreground dark:text-gray-500">Personalized recommendations coming soon...</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <Card className="rounded-3xl border-none bg-white/50 backdrop-blur shadow-lg dark:bg-black/40 dark:border dark:border-primary/20">
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4 dark:text-primary/30" />
                  <h3 className="text-xl font-bold mb-2 dark:text-white">No orders yet</h3>
                  <p className="text-muted-foreground mb-6 dark:text-gray-400">Start your collection today.</p>
                  <Button asChild className="rounded-full dark:bg-primary dark:text-black dark:hover:bg-primary/80">
                    <Link href="/products">Shop Now</Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wishlist">
              <Card className="rounded-3xl border-none bg-white/50 backdrop-blur shadow-lg dark:bg-black/40 dark:border dark:border-primary/20">
                <CardContent className="p-12 text-center">
                  <Heart className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4 dark:text-primary/30" />
                  <h3 className="text-xl font-bold mb-2 dark:text-white">Your wishlist is empty</h3>
                  <p className="text-muted-foreground mb-6 dark:text-gray-400">Save items you love for later.</p>
                  <Button asChild className="rounded-full dark:bg-primary dark:text-black dark:hover:bg-primary/80">
                    <Link href="/products">Explore</Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="rounded-3xl border-none bg-white/50 backdrop-blur shadow-lg dark:bg-black/40 dark:border dark:border-primary/20">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/50 dark:bg-white/5">
                    <div>
                      <h4 className="font-bold dark:text-white">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground dark:text-gray-400">Receive updates about your orders and promotions.</p>
                    </div>
                    <Button variant="outline" className="rounded-full dark:border-white/20 dark:text-white">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/50 dark:bg-white/5">
                    <div>
                      <h4 className="font-bold dark:text-white">Privacy Settings</h4>
                      <p className="text-sm text-muted-foreground dark:text-gray-400">Manage your data and visibility.</p>
                    </div>
                    <Button variant="outline" className="rounded-full dark:border-white/20 dark:text-white">Manage</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
