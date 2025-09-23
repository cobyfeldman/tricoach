import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getWeeklySummary, formatDistance, formatDuration, type WeeklySummary } from "@/lib/workouts";
import { Activity, Clock, Target } from "lucide-react";

interface WeeklySummaryCardProps {
  weekStart?: string;
}

export function WeeklySummaryCard({ weekStart }: WeeklySummaryCardProps) {
  const [summary, setSummary] = useState<WeeklySummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true);
        const currentWeek = weekStart || getCurrentWeekStart();
        const data = await getWeeklySummary(currentWeek);
        setSummary(data);
      } catch (error) {
        console.error('Failed to load weekly summary:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, [weekStart]);

  const getCurrentWeekStart = (): string => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Make Monday the start of week
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - daysToSubtract);
    return weekStart.toISOString().split('T')[0];
  };

  const getWeekDateRange = (weekStart: string): string => {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    return `${startStr} - ${endStr}`;
  };

  const getSportEmoji = (sport: string): string => {
    switch (sport) {
      case 'swim': return '🏊';
      case 'bike': return '🚴';
      case 'run': return '🏃';
      default: return '💪';
    }
  };

  const getSportColor = (sport: string): string => {
    switch (sport) {
      case 'swim': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'bike': return 'bg-green-100 text-green-800 border-green-200';
      case 'run': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Weekly Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Weekly Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">No data available</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Weekly Summary
        </CardTitle>
        <CardDescription>
          {getWeekDateRange(summary.weekStart)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{summary.workoutCount}</div>
            <div className="text-sm text-muted-foreground">Workouts</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{formatDistance(summary.totalDistance, 'run')}</div>
            <div className="text-sm text-muted-foreground">Distance</div>
          </div>
          <div>
            <div className="text-2xl font-bold flex items-center justify-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDuration(summary.totalDuration)}
            </div>
            <div className="text-sm text-muted-foreground">Duration</div>
          </div>
        </div>

        {summary.workoutCount > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-1">
              <Target className="h-4 w-4" />
              By Sport
            </h4>
            <div className="space-y-2">
              {Object.entries(summary.sports)
                .filter(([_, data]) => data.count > 0)
                .map(([sport, data]) => (
                  <div key={sport} className="flex items-center justify-between">
                    <Badge variant="secondary" className={getSportColor(sport)}>
                      {getSportEmoji(sport)} {sport.charAt(0).toUpperCase() + sport.slice(1)} ({data.count})
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      {formatDistance(data.distance, sport as any)} • {formatDuration(data.duration)}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {summary.workoutCount === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No workouts this week yet.</p>
            <p className="text-sm">Start logging your training!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}