import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { bulkCreateWorkouts, type Sport, type WorkoutData } from "@/lib/workouts";
import { FileUp, Download } from "lucide-react";

interface WorkoutImportCSVProps {
  onWorkoutsImported?: () => void;
}

interface CSVMapping {
  date: string;
  sport: string;
  distance_m: string;
  duration_s: string;
  rpe: string;
  notes: string;
}

export function WorkoutImportCSV({ onWorkoutsImported }: WorkoutImportCSVProps) {
  const [open, setOpen] = useState(false);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<CSVMapping>({
    date: '',
    sport: '',
    distance_m: '',
    duration_s: '',
    rpe: '',
    notes: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<WorkoutData[]>([]);
  const [step, setStep] = useState<'upload' | 'map' | 'preview'>('upload');
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      const data = lines.map(line => line.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')));
      
      if (data.length > 0) {
        setHeaders(data[0]);
        setCsvData(data.slice(1));
        setStep('map');
      }
    };
    reader.readAsText(file);
  };

  const handleMappingComplete = () => {
    if (!mapping.date || !mapping.sport || !mapping.distance_m || !mapping.duration_s || !mapping.rpe) {
      toast({
        title: "Incomplete mapping",
        description: "Please map all required fields (date, sport, distance, duration, RPE).",
        variant: "destructive",
      });
      return;
    }

    const preview: WorkoutData[] = csvData.slice(0, 5).map(row => {
      const dateIdx = headers.indexOf(mapping.date);
      const sportIdx = headers.indexOf(mapping.sport);
      const distanceIdx = headers.indexOf(mapping.distance_m);
      const durationIdx = headers.indexOf(mapping.duration_s);
      const rpeIdx = headers.indexOf(mapping.rpe);
      const notesIdx = mapping.notes ? headers.indexOf(mapping.notes) : -1;

      return {
        date: row[dateIdx] || '',
        sport: (row[sportIdx]?.toLowerCase() as Sport) || 'run',
        distance_m: parseInt(row[distanceIdx]) || 0,
        duration_s: parseDuration(row[durationIdx]) || 0,
        rpe: parseInt(row[rpeIdx]) || 5,
        notes: notesIdx >= 0 ? row[notesIdx] : undefined,
      };
    });

    setPreviewData(preview);
    setStep('preview');
  };

  const parseDuration = (duration: string): number => {
    if (!duration) return 0;
    
    // Handle MM:SS or HH:MM:SS format
    const parts = duration.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    } else if (parts.length === 3) {
      return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    }
    
    // Handle just seconds
    return parseInt(duration) || 0;
  };

  const handleImport = async () => {
    setIsProcessing(true);
    try {
      const workouts: WorkoutData[] = csvData.map(row => {
        const dateIdx = headers.indexOf(mapping.date);
        const sportIdx = headers.indexOf(mapping.sport);
        const distanceIdx = headers.indexOf(mapping.distance_m);
        const durationIdx = headers.indexOf(mapping.duration_s);
        const rpeIdx = headers.indexOf(mapping.rpe);
        const notesIdx = mapping.notes ? headers.indexOf(mapping.notes) : -1;

        return {
          date: row[dateIdx] || '',
          sport: (row[sportIdx]?.toLowerCase() as Sport) || 'run',
          distance_m: parseInt(row[distanceIdx]) || 0,
          duration_s: parseDuration(row[durationIdx]) || 0,
          rpe: parseInt(row[rpeIdx]) || 5,
          notes: notesIdx >= 0 ? row[notesIdx] : undefined,
        };
      }).filter(workout => workout.date && workout.distance_m > 0 && workout.duration_s > 0);

      await bulkCreateWorkouts(workouts);
      
      toast({
        title: "Import successful",
        description: `Imported ${workouts.length} workouts successfully.`,
      });
      
      resetState();
      setOpen(false);
      onWorkoutsImported?.();
    } catch (error) {
      toast({
        title: "Import failed",
        description: "Failed to import workouts. Please check your data and try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetState = () => {
    setCsvData([]);
    setHeaders([]);
    setMapping({
      date: '',
      sport: '',
      distance_m: '',
      duration_s: '',
      rpe: '',
      notes: '',
    });
    setPreviewData([]);
    setStep('upload');
  };

  const downloadTemplate = () => {
    const csvContent = "date,sport,distance_m,duration_s,rpe,notes\n2024-01-15,run,5000,1800,7,Morning run in the park";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'workout_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      setOpen(open);
      if (!open) resetState();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileUp className="h-4 w-4 mr-2" />
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Workouts from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file with your workout data. 
            <Button variant="link" onClick={downloadTemplate} className="p-0 h-auto ml-2">
              <Download className="h-3 w-3 mr-1" />
              Download template
            </Button>
          </DialogDescription>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="csv-file">Select CSV file</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="mt-2"
              />
            </div>
          </div>
        )}

        {step === 'map' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Map CSV columns to workout fields</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date *</Label>
                <Select onValueChange={(value) => setMapping(prev => ({ ...prev, date: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date column" />
                  </SelectTrigger>
                  <SelectContent>
                    {headers.map(header => (
                      <SelectItem key={header} value={header}>{header}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Sport *</Label>
                <Select onValueChange={(value) => setMapping(prev => ({ ...prev, sport: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sport column" />
                  </SelectTrigger>
                  <SelectContent>
                    {headers.map(header => (
                      <SelectItem key={header} value={header}>{header}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Distance (meters) *</Label>
                <Select onValueChange={(value) => setMapping(prev => ({ ...prev, distance_m: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select distance column" />
                  </SelectTrigger>
                  <SelectContent>
                    {headers.map(header => (
                      <SelectItem key={header} value={header}>{header}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Duration (seconds or MM:SS) *</Label>
                <Select onValueChange={(value) => setMapping(prev => ({ ...prev, duration_s: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration column" />
                  </SelectTrigger>
                  <SelectContent>
                    {headers.map(header => (
                      <SelectItem key={header} value={header}>{header}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>RPE (1-10) *</Label>
                <Select onValueChange={(value) => setMapping(prev => ({ ...prev, rpe: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select RPE column" />
                  </SelectTrigger>
                  <SelectContent>
                    {headers.map(header => (
                      <SelectItem key={header} value={header}>{header}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Notes (optional)</Label>
                <Select onValueChange={(value) => setMapping(prev => ({ ...prev, notes: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select notes column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {headers.map(header => (
                      <SelectItem key={header} value={header}>{header}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleMappingComplete}>Preview Data</Button>
            </DialogFooter>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preview (first 5 rows)</h3>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Sport</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>RPE</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.map((workout, index) => (
                  <TableRow key={index}>
                    <TableCell>{workout.date}</TableCell>
                    <TableCell className="capitalize">{workout.sport}</TableCell>
                    <TableCell>{workout.distance_m}m</TableCell>
                    <TableCell>{Math.floor(workout.duration_s / 60)}:{(workout.duration_s % 60).toString().padStart(2, '0')}</TableCell>
                    <TableCell>{workout.rpe}</TableCell>
                    <TableCell>{workout.notes || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <p className="text-sm text-muted-foreground">
              Total rows to import: {csvData.length}
            </p>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('map')}>
                Back to Mapping
              </Button>
              <Button onClick={handleImport} disabled={isProcessing}>
                {isProcessing ? "Importing..." : "Import Workouts"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}