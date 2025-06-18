"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormatUtils } from "@/utils/format";

interface Calendar24Props {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  label?: string;
}

export function Calendar24(props: Calendar24Props) {
  const { value, onChange, placeholder = "Chọn ngày và thời gian", label } = props;

  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(value || new Date());
  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");

  // Initialize inputs when value changes
  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setDateInput(value.toISOString().split('T')[0]);
      setTimeInput(value.toTimeString().slice(0, 5));
    } else {
      const now = new Date();
      setSelectedDate(now);
      setDateInput(now.toISOString().split('T')[0]);
      setTimeInput(now.toTimeString().slice(0, 5));
    }
  }, [value]);

  const handleDateChange = (newDate: string) => {
    setDateInput(newDate);
    updateDateTime(newDate, timeInput);
  };

  const handleTimeChange = (newTime: string) => {
    setTimeInput(newTime);
    updateDateTime(dateInput, newTime);
  };

  const updateDateTime = (dateStr: string, timeStr: string) => {
    if (dateStr && timeStr) {
      const combinedDateTime = new Date(`${dateStr}T${timeStr}`);
      if (!isNaN(combinedDateTime.getTime())) {
        setSelectedDate(combinedDateTime);
      }
    }
  };

  const handleApply = () => {
    if (dateInput && timeInput) {
      const combinedDateTime = new Date(`${dateInput}T${timeInput}`);
      if (!isNaN(combinedDateTime.getTime())) {
        onChange(combinedDateTime);
        setOpen(false);
      }
    }
  };

  const handleClear = () => {
    onChange(undefined);
    setOpen(false);
  };

  const formatDisplayDate = (date: Date | undefined) => {
    if (!date) return placeholder;
   return FormatUtils.formatDate(date,"vi-VN",true);
    // return date.toLocaleString('en-US', {
    //   year: 'numeric',
    //   month: 'short',
    //   day: 'numeric',
    //   hour: '2-digit',
    //   minute: '2-digit',
    //   hour12: true
    // });
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="space-y-2">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between text-left font-normal"
            onClick={() => setOpen(!open)}
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className={value ? "text-gray-900" : "text-gray-500"}>
                {formatDisplayDate(value)}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Calendar className="h-4 w-4" />
              <span className="font-medium text-sm">Select Date & Time</span>
            </div>
            
            {/* Date Selection */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-600">Date</Label>
              <Input
                type="date"
                value={dateInput}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-600">Time</Label>
              <div className="flex gap-2">
                <Input
                  type="time"
                  value={timeInput}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="flex-1"
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="px-2">
                      <Clock className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2" align="end">
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {timeOptions.map((time) => (
                        <button
                          key={time}
                          onClick={() => handleTimeChange(time)}
                          className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-100 ${
                            timeInput === time ? 'bg-blue-100 text-blue-600' : ''
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Preview */}
            <div className="p-2 bg-gray-50 rounded text-sm">
              <span className="text-gray-600">Preview: </span>
              <span className="font-medium">
                {formatDisplayDate(selectedDate)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="flex-1"
              >
                Clear
              </Button>
              <Button
                size="sm"
                onClick={handleApply}
                className="flex-1"
                disabled={!dateInput || !timeInput}
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
