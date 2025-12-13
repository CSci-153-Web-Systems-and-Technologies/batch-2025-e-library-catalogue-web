import { 
  BarChart3, Users, BookOpen, AlertTriangle, 
  Calendar, Download, FileText 
} from "lucide-react";

function ReportCard({ title, description, icon: Icon, colorClass, buttonColor, reportType }: any) {
  return (
    <div className={`flex flex-col justify-between p-6 rounded-3xl ${colorClass} shadow-sm transition-transform hover:scale-105 min-h-[220px]`}>
      
      <div className="space-y-4">
        <div className="h-12 w-12 bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm">
          <Icon className="h-6 w-6 text-slate-800" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-800 leading-tight">{title}</h3>
          <p className="text-sm text-slate-700 mt-2 font-medium opacity-80">{description}</p>
        </div>
      </div>
      

      <a 
        href={`/api/reports/${reportType}`} 
        className={`mt-6 w-full py-3 rounded-xl text-white text-sm font-bold shadow-sm ${buttonColor} hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
      >
        <Download className="h-4 w-4" />
        Generate Report
      </a>
    </div>
  );
}

export default function AdminReports() {
  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-xl font-black text-slate-800">Reports Center</h2>
           <p className="text-sm text-slate-500">Generate and export system analytics</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <ReportCard 
          title="Usage Statistics" 
          description="Analyze book borrowing trends and history."
          icon={BarChart3}
          colorClass="bg-blue-200"
          buttonColor="bg-blue-600"
          reportType="usage" 
        />

        <ReportCard 
          title="User Activity" 
          description="List of all registered members."
          icon={Users}
          colorClass="bg-green-200"
          buttonColor="bg-green-600"
          reportType="users" 
        />

        <ReportCard 
          title="Inventory Status" 
          description="Full catalog audit of all books."
          icon={BookOpen}
          colorClass="bg-cyan-200"
          buttonColor="bg-cyan-600"
          reportType="inventory" 
        />

        <ReportCard 
          title="Overdue Report" 
          description="List of outstanding overdue books."
          icon={AlertTriangle}
          colorClass="bg-red-200"
          buttonColor="bg-red-500"
          reportType="overdue" 
        />
      

      </div>
    </div>
  );
}