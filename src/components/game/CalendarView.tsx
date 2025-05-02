import React from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Button from '../common/Button';

interface CalendarViewProps {
  calendar: {
    startDate: Date;
    weekends: number[];
    specialEvents: Array<{
      day: number;
      title: string;
      description: string;
    }>;
  };
  currentDay: number;
  totalDays: number;
  onClose: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ calendar, currentDay, totalDays, onClose }) => {
  // Number of days to display per week
  const daysPerWeek = 7;
  
  // Calculate number of weeks in the project
  const totalWeeks = Math.ceil(totalDays / daysPerWeek);
  
  // Generate days to display
  const getDaysInWeek = (weekIndex: number) => {
    const startDay = weekIndex * daysPerWeek + 1;
    const days = [];
    
    for (let i = 0; i < daysPerWeek; i++) {
      const dayNumber = startDay + i;
      if (dayNumber <= totalDays) {
        days.push(dayNumber);
      } else {
        days.push(null); // Padding for incomplete week
      }
    }
    
    return days;
  };
  
  // Format date string
  const formatDate = (day: number) => {
    const date = new Date(calendar.startDate);
    date.setDate(date.getDate() + (day - 1));
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    });
  };
  
  return (
    <motion.div 
      className="absolute inset-0 bg-black/50 flex items-center justify-center z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full shadow-2xl border border-gray-700"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center text-white">
            <Calendar size={24} className="mr-2 text-blue-400" />
            Project Timeline
          </h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-gray-300 hover:text-white"
          >
            <X size={20} />
          </Button>
        </div>
        
        <div className="mb-4">
          <div className="h-2 rounded-full bg-gray-700 w-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${(currentDay / totalDays) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-gray-400 text-sm mt-1">
            <span>Start</span>
            <span>Day {currentDay} of {totalDays}</span>
            <span>Completion</span>
          </div>
        </div>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {Array.from({ length: totalWeeks }).map((_, weekIndex) => (
            <div key={weekIndex} className="space-y-2">
              <div className="text-sm text-gray-400">Week {weekIndex + 1}</div>
              <div className="grid grid-cols-7 gap-2">
                {getDaysInWeek(weekIndex).map((day, dayIndex) => day !== null ? (
                  <div 
                    key={dayIndex}
                    className={`p-3 rounded-lg ${
                      day === currentDay 
                        ? 'bg-blue-600/80 text-white' 
                        : day < currentDay 
                          ? 'bg-gray-700 text-gray-300' 
                          : calendar.weekends.includes(day)
                            ? 'bg-gray-700/50 text-gray-400'
                            : 'bg-gray-800/70 text-gray-300'
                    } ${
                      calendar.specialEvents.some(event => event.day === day)
                        ? 'border-2 border-indigo-500'
                        : 'border border-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-lg font-medium">{day}</span>
                      {calendar.specialEvents.some(event => event.day === day) && (
                        <Star size={16} className="text-indigo-400" fill="currentColor" />
                      )}
                    </div>
                    <div className="text-xs mt-1 opacity-80">
                      {formatDate(day)}
                    </div>
                    
                    {/* Show event title if any */}
                    {calendar.specialEvents.some(event => event.day === day) && (
                      <div className="mt-2 text-xs font-medium text-indigo-300">
                        {calendar.specialEvents.find(event => event.day === day)?.title}
                      </div>
                    )}
                  </div>
                ) : (
                  <div key={dayIndex} className="p-4 rounded-lg bg-transparent"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-300 mb-2">
            Special Events
          </h3>
          <div className="space-y-2">
            {calendar.specialEvents.map((event, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg border border-gray-600 ${
                  event.day === currentDay ? 'bg-indigo-900/30' : 'bg-gray-800/50'
                }`}
              >
                <div className="flex items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      event.day < currentDay ? 'bg-green-500' : 
                      event.day === currentDay ? 'bg-blue-500' : 'bg-gray-600'
                    }`}
                  >
                    <span className="text-sm font-medium">{event.day}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{event.title}</h4>
                    <p className="text-sm text-gray-400">{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CalendarView; 