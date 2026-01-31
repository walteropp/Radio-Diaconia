
import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { MOCK_SCHEDULE } from '../constants';

const Schedule: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 text-blue-900 rounded-lg">
          <Calendar size={24} />
        </div>
        <h3 className="text-xl font-cinzel font-bold text-gray-800">Programación Hoy</h3>
      </div>

      <div className="space-y-4">
        {MOCK_SCHEDULE.map((item, i) => (
          <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
            <div className="flex flex-col items-center min-w-[60px] text-blue-900">
              <Clock size={16} />
              <span className="text-xs font-bold mt-1">{item.time}</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">{item.title}</h4>
              <p className="text-xs text-gray-500">Con {item.host}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schedule;
