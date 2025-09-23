import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Calendar, TrendingUp, Target } from "lucide-react";
import { WeeklySummaryCard } from "@/components/WeeklySummaryCard";
import { ChatBot } from "@/components/ChatBot";

const Dashboard = () => {
  return (
    <div className="space-y-6" role="main" aria-labelledby="dashboard-title">
      <div>
        <h1 id="dashboard-title" className="text-3xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground">Welcome back! Here's your training overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="md:col-span-2 lg:col-span-1">
          <WeeklySummaryCard />
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workouts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fitness Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Race Goal</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 weeks</div>
            <p className="text-xs text-muted-foreground">Until Ironman 70.3</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Workouts</CardTitle>
            <CardDescription>Your latest training sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-swim rounded-full" aria-hidden="true"></div>
                  <span className="text-sm">Swimming - 2000m</span>
                </div>
                <span className="text-sm text-muted-foreground">Today</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-bike rounded-full" aria-hidden="true"></div>
                  <span className="text-sm">Cycling - 45km</span>
                </div>
                <span className="text-sm text-muted-foreground">Yesterday</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-run rounded-full" aria-hidden="true"></div>
                  <span className="text-sm">Running - 10k</span>
                </div>
                <span className="text-sm text-muted-foreground">2 days ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Your planned workouts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-run rounded-full" aria-hidden="true"></div>
                  <span className="text-sm">Long Run - 15k</span>
                </div>
                <span className="text-sm text-muted-foreground">Tomorrow</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-bike rounded-full" aria-hidden="true"></div>
                  <span className="text-sm">Bike Intervals</span>
                </div>
                <span className="text-sm text-muted-foreground">Friday</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-swim rounded-full" aria-hidden="true"></div>
                  <span className="text-sm">Swim Technique</span>
                </div>
                <span className="text-sm text-muted-foreground">Saturday</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <ChatBot />
    </div>
  );
};

export default Dashboard;