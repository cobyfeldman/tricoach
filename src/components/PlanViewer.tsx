import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GripVertical, Clock, MapPin, Target, Save } from "lucide-react";
import { Plan, Session, updatePlan } from "@/lib/plans";
import { useToast } from "@/hooks/use-toast";

interface SortableSessionProps {
  session: Session;
  sessionId: string;
}

function SortableSession({ session, sessionId }: SortableSessionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sessionId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)}km`;
    }
    return `${meters}m`;
  };

  const getSportColor = (sport: string) => {
    switch (sport) {
      case 'swim': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'bike': return 'bg-green-100 text-green-800 border-green-200';
      case 'run': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'easy': return 'bg-emerald-100 text-emerald-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      case 'interval': return 'bg-purple-100 text-purple-800';
      case 'recovery': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <button
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={getSportColor(session.sport)} variant="outline">
            {session.sport.toUpperCase()}
          </Badge>
          <Badge className={getIntensityColor(session.intensity)} variant="secondary">
            {session.intensity}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          {session.distance_m > 0 && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {formatDistance(session.distance_m)}
            </div>
          )}
          {session.duration_s > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(session.duration_s)}
            </div>
          )}
        </div>
        
        {session.notes && (
          <p className="text-sm text-gray-700">{session.notes}</p>
        )}
      </div>
    </div>
  );
}

interface WeekCardProps {
  week: any;
  onSessionsReorder: (weekIndex: number, dayIndex: number, sessions: Session[]) => void;
}

function WeekCard({ week, onSessionsReorder }: WeekCardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent, dayIndex: number) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const day = week.days[dayIndex];
      const oldIndex = day.sessions.findIndex((_: any, index: number) => 
        `${week.week}-${dayIndex}-${index}` === active.id
      );
      const newIndex = day.sessions.findIndex((_: any, index: number) => 
        `${week.week}-${dayIndex}-${index}` === over.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const newSessions = arrayMove(day.sessions as Session[], oldIndex, newIndex);
        onSessionsReorder(week.week - 1, dayIndex, newSessions);
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Week {week.week}
        </CardTitle>
        <CardDescription>
          {week.days.reduce((total: number, day: any) => total + day.sessions.length, 0)} sessions this week
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {week.days.map((day: any, dayIndex: number) => (
          <div key={dayIndex} className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">
              Day {day.day} {day.sessions.length === 0 ? '(Rest Day)' : `(${day.sessions.length} sessions)`}
            </h4>
            
            {day.sessions.length > 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => handleDragEnd(event, dayIndex)}
              >
                <SortableContext
                  items={day.sessions.map((_: any, index: number) => 
                    `${week.week}-${dayIndex}-${index}`
                  )}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {day.sessions.map((session: Session, sessionIndex: number) => (
                      <SortableSession
                        key={`${week.week}-${dayIndex}-${sessionIndex}`}
                        session={session}
                        sessionId={`${week.week}-${dayIndex}-${sessionIndex}`}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

interface PlanViewerProps {
  plan: Plan;
  onPlanUpdate?: (updatedPlan: Plan) => void;
}

export function PlanViewer({ plan, onPlanUpdate }: PlanViewerProps) {
  const [currentPlan, setCurrentPlan] = useState(plan);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSessionsReorder = (weekIndex: number, dayIndex: number, newSessions: Session[]) => {
    const updatedWeeks = [...currentPlan.weeks];
    updatedWeeks[weekIndex] = {
      ...updatedWeeks[weekIndex],
      days: updatedWeeks[weekIndex].days.map((day, idx) => 
        idx === dayIndex ? { ...day, sessions: newSessions } : day
      )
    };
    
    setCurrentPlan({
      ...currentPlan,
      weeks: updatedWeeks,
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedPlan = await updatePlan(currentPlan.id, {
        weeks: currentPlan.weeks,
      });
      
      setCurrentPlan(updatedPlan);
      setHasChanges(false);
      onPlanUpdate?.(updatedPlan);
      
      toast({
        title: "Plan saved",
        description: "Your training plan has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving plan",
        description: "Failed to save your changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{currentPlan.title}</h1>
          <p className="text-muted-foreground">
            {currentPlan.distance} • {currentPlan.weeks.length} weeks
          </p>
        </div>
        
        {hasChanges && (
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </div>

      <div className="grid gap-6">
        {currentPlan.weeks.map((week) => (
          <WeekCard
            key={week.week}
            week={week}
            onSessionsReorder={handleSessionsReorder}
          />
        ))}
      </div>
    </div>
  );
}