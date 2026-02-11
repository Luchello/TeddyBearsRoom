"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Package, Heart, Settings, LogOut, Crown } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const [, setActiveTab] = useState("overview");

  // Mock User Data
  const user = {
    name: "Master Bear",
    email: "master@teddybear.com",
    tier: "VIP",
    points: 12500,
    avatar: "/tbr_logo.png", // Light mode avatar
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header / Profile Card */}
        <div className="relative">
          {/* Background Decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl -z-10" />

          <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white/80 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />

            <CardContent className="p-8 md:p-12 relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Avatar */}
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 p-1">
                    <div className="w-full h-full rounded-full bg-white overflow-hidden relative">
                      <Image
                        src={user.avatar}
                        alt="Profile"
                        width={128}
                        height={128}
                        className="w-full h-full object-contain p-2"
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
                  <h1 className="text-3xl font-bold text-foreground">
                    {user.name}
                  </h1>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                    <div className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-bold">
                      {user.points.toLocaleString()} P
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      Edit Profile
                    </Button>
                  </div>
                </div>

                {/* Logout */}
                <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-foreground hover:text-red-500">
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
                className="rounded-full px-6 py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg=active]:bg-primary=active]:text-black=active]:shadow-[0_0_15px_rgba(255,105,180,0.4)] transition-all"
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
                <Card className="rounded-3xl border-none bg-white/50 backdrop-blur shadow-lg">
                  <CardHeader>
                    <CardTitle className="">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">No recent activity.</p>
                  </CardContent>
                </Card>
                <Card className="rounded-3xl border-none bg-white/50 backdrop-blur shadow-lg">
                  <CardHeader>
                    <CardTitle className="">Recommended for You</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video rounded-2xl bg-muted/50 flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">Personalized recommendations coming soon...</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <Card className="rounded-3xl border-none bg-white/50 backdrop-blur shadow-lg">
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-bold mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-6">Start your collection today.</p>
                  <Button asChild className="rounded-full">
                    <Link href="/products">Shop Now</Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wishlist">
              <Card className="rounded-3xl border-none bg-white/50 backdrop-blur shadow-lg">
                <CardContent className="p-12 text-center">
                  <Heart className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Your wishlist is empty</h3>
                  <p className="text-muted-foreground mb-6">Save items you love for later.</p>
                  <Button asChild className="rounded-full">
                    <Link href="/products">Explore</Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="rounded-3xl border-none bg-white/50 backdrop-blur shadow-lg">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/50">
                    <div>
                      <h4 className="font-bold">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive updates about your orders and promotions.</p>
                    </div>
                    <Button variant="outline" className="rounded-full">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/50">
                    <div>
                      <h4 className="font-bold">Privacy Settings</h4>
                      <p className="text-sm text-muted-foreground">Manage your data and visibility.</p>
                    </div>
                    <Button variant="outline" className="rounded-full">Manage</Button>
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
