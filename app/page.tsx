"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
    BarChart, 
    Bar, 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { 
    MapPin, 
    CalendarDays, 
    Users, 
    Banknote, 
    CheckCircle, 
    ChevronDown, 
    BarChart3,
    Loader2,
    IndianRupee,
    Percent,
} from 'lucide-react';

// --- Static Data (Odisha Specific) ---
// We still need the district list for the dropdown
const ODISHA_DISTRICTS = [
    'Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack', 
    'Deogarh', 'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Jajpur', 
    'Jharsuguda', 'Kalahandi', 'Kandhamal', 'Kendrapara', 'Keonjhar', 'Khordha', 
    'Koraput', 'Malkangiri', 'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada', 
    'Puri', 'Rayagada', 'Sambalpur', 'Subarnapur', 'Sundargarh'
];

const MOCK_DISTRICTS_BY_STATE = {
    'Odisha': ODISHA_DISTRICTS,
};

const PIE_COLORS = ['#4f46e5', '#10b981', '#f59e0b'];

// --- React Components (Keep all your components as they are) ---
// AppHeader, StatCard, MonthlyTrendChart, DistrictComparisonChart,
// FundBreakdownChart, LoadingSpinner, ErrorMessage...
// (All these components are the same as in your file)
// ... (Your existing components go here) ...
// [Omitting for brevity, paste your existing components here]

/**
 * Header Component
 */
const AppHeader = () => (
    <header className="bg-white shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
                <h1 className="text-xl font-bold text-slate-900">MGNREGA Odisha Report</h1>
                <p className="text-sm text-slate-600">Monthly Performance Dashboard</p>
            </div>
        </div>
    </header>
);

/**
 * Re-usable Stat Card for Key Metrics (NEW UI)
 */
interface StatCardProps {
    title: string;
    value: React.ReactNode | number;
    icon?: React.ReactNode;
    change?: string;
    unit?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, unit }) => (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-slate-200 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
        <div className="flex items-center space-x-3 mb-2">
            <div className="text-indigo-600">
                {icon}
            </div>
            <p className="text-sm font-medium text-slate-600">{title}</p>
        </div>
        
        <p className="text-3xl font-bold text-slate-900 mb-2">
            {value}
            {unit && <span className="text-lg ml-1 font-medium text-slate-500">{unit}</span>}
        </p>

        {change && (
            <p className="text-xs text-slate-500">
                <span className={`font-semibold ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {change}%
                </span> vs. last month
            </p>
        )}
    </div>
);


/**
 * Chart for Monthly Trend
 */
type MonthlyTrendDataPoint = {
    name: string;
    "Work Days (in Lakhs)": number;
    [key: string]: any;
};

type MonthlyTrendChartProps = {
    data: MonthlyTrendDataPoint[];
};

const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ data }) => (
    <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                />
                <Legend />
                <Line 
                    type="monotone" 
                    dataKey="Work Days (in Lakhs)" 
                    stroke="#4f46e5" 
                    strokeWidth={2} 
                    activeDot={{ r: 8 }} 
                />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

/**
 * Chart for District Comparison
 */
type DistrictComparisonDataPoint = {
    name: string;
    "Expenditure (Cr)": number;
    [key: string]: any;
};

const DistrictComparisonChart: React.FC<{ data: DistrictComparisonDataPoint[] }> = ({ data }) => (
    <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="name" type="category" stroke="#64748b" width={80} />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                />
                <Legend />
                <Bar dataKey="Expenditure (Cr)" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
);

/**
 * Chart for Fund Utilization (NEW UI - labels removed)
 */
const FundBreakdownChart = ({ data }: { data: { name: string; value: number }[] }) => (
    <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    </div>
);


/**
 * Loading Spinner Component
 */
const LoadingSpinner = () => (
    <div className="flex flex-col justify-center items-center h-64 text-center">
         <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
         <p className="mt-4 text-lg font-medium text-slate-700">Loading Data...</p>
         <p className="text-sm text-slate-500">Please wait while we fetch the details.</p>
    </div>
);

/**
 * Error Message Component
 */
type ErrorMessageProps = {
    message: string;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
        <p className="font-bold">An Error Occurred</p>
        <p>{message}</p>
    </div>
);


/**
 * Main App Component (Page)
 */
export default function App() {
    // --- State Management ---
    const selectedState = 'Odisha';
    const [selectedDistrict, setSelectedDistrict] = useState(ODISHA_DISTRICTS[0]);
    const [selectedPeriod, setSelectedPeriod] = useState('current');

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Data state
    type KpiData = {
        households: number | string;
        workDays: number | string;
        funds: number | string;
        completed: number | string;
        averageWage: number | string;
        completionRate: number | string;
        change?: string;
    };
    
    const [kpiData, setKpiData] = useState<KpiData | null>(null);
    const [monthlyData, setMonthlyData] = useState<MonthlyTrendDataPoint[]>([]);
    const [comparisonData, setComparisonData] = useState<DistrictComparisonDataPoint[]>([]);
    const [fundData, setFundData] = useState<{ name: string; value: number }[]>([]);

    const districtsForSelectedState = useMemo(() => {
        return MOCK_DISTRICTS_BY_STATE[selectedState] || [];
    }, [selectedState]);

    // --- Data Fetching (MODIFIED) ---
    useEffect(() => {
        if (selectedDistrict && selectedPeriod) {
            setIsLoading(true);
            setError(null);
            setKpiData(null); // Clear old data

            // This is the function to fetch data from our new backend
            const fetchData = async () => {
                try {
                    // Fetch from your backend API (running on port 5000)
                    const url = process.env.NEXT_PUBLIC_BE_URL;
                    const response = await fetch(`${url}/api/data/dashboard?district=${selectedDistrict}&period=${selectedPeriod}`);
                    
                    if (!response.ok) {
                        const errData = await response.json();
                        throw new Error(errData.message || `HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    
                    // Set all data from the single API response
                    setKpiData(data.kpiData);
                    setMonthlyData(data.monthlyData);
                    setComparisonData(data.comparisonData);
                    setFundData(data.fundData);
                    
                } catch (err) {
                    console.error("Fetch error:", err);
                    if (err instanceof Error) {
                        setError(err.message);
                    } else {
                        setError(String(err) || 'Failed to fetch data. Please try again.');
                    }
                } finally {
                    setIsLoading(false);
                }
            };

            fetchData();
        }
    }, [selectedDistrict, selectedPeriod]); // Re-fetch when district or period changes

    // --- Event Handlers ---
        const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectedDistrict(e.target.value);
        };
    
        const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectedPeriod(e.target.value);
        };
        
        // --- Custom Select Wrapper ---
        const SelectWrapper: React.FC<React.PropsWithChildren<React.SelectHTMLAttributes<HTMLSelectElement>>> = ({ children, ...props }) => (
            <div className="relative">
                <select 
                    className="w-full appearance-none bg-white border border-slate-300 rounded-lg py-2.5 px-4 pr-10 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                    {...props}
                >
                    {children}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <ChevronDown className="w-5 h-5" />
                </div>
            </div>
        );


    return (
        <div className="bg-slate-100 min-h-screen font-sans">
            <AppHeader />

            <main className="container mx-auto p-4 md:p-6 max-w-7xl">
                
                {/* --- Selector Controls --- */}
                <div className="bg-white p-5 rounded-xl shadow-lg mb-6 border border-slate-200">
                    <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-5">Select Your Area</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        
                        <button className="w-full md:col-span-1 flex items-center justify-center bg-indigo-50 text-indigo-600 px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <MapPin className="w-5 h-5 mr-2" />
                            Detect My Location
                        </button>

                        <div className="md:col-span-1">
                            <label htmlFor="state" className="block text-sm font-medium text-slate-700 mb-1">State</label>
                            <SelectWrapper id="state" value={selectedState} disabled>
                                <option value="Odisha">Odisha</option>
                            </SelectWrapper>
                        </div>

                        <div className="md:col-span-1">
                            <label htmlFor="district" className="block text-sm font-medium text-slate-700 mb-1">District</label>
                            <SelectWrapper id="district" value={selectedDistrict} onChange={handleDistrictChange} disabled={!districtsForSelectedState.length}>
                                {districtsForSelectedState.map(district => (
                                    <option key={district} value={district}>{district}</option>
                                ))}
                            </SelectWrapper>
                        </div>

                        <div className="md:col-span-1">
                            <label htmlFor="period" className="block text-sm font-medium text-slate-700 mb-1">Time Period</label>
                            <SelectWrapper id="period" value={selectedPeriod} onChange={handlePeriodChange}>
                                <option value="current">Current Month</option>
                                <option value="3-months">Last 3 Months</option>
                                <option value="6-months">Last 6 Months</option>
                            </SelectWrapper>
                        </div>
                    </div>
                </div>

                {/* --- Data Dashboard --- */}
                {isLoading && <LoadingSpinner />}
                
                {error && <ErrorMessage message={error} />}
                
                {!isLoading && !error && kpiData && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-slate-800">
                            Report for: <span className="text-indigo-600">{selectedDistrict}, {selectedState}</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            <StatCard 
                                title="Households Employed" 
                                value={kpiData.households} 
                                icon={<Users className="w-6 h-6" />}
                                change={kpiData.change}
                            />
                            <StatCard 
                                title="Total Work Days" 
                                value={kpiData.workDays} 
                                icon={<CalendarDays className="w-6 h-6" />}
                            />
                            <StatCard 
                                title="Funds Disbursed" 
                                value={kpiData.funds} 
                                icon={<Banknote className="w-6 h-6" />}
                            />
                            <StatCard 
                                title="Works Completed" 
                                value={kpiData.completed} 
                                icon={<CheckCircle className="w-6 h-6" />}
                            />
                            <StatCard 
                                title="Average Wage Paid" 
                                value={kpiData.averageWage} 
                                icon={<IndianRupee className="w-6 h-6" />}
                                unit="per day"
                            />
                             <StatCard 
                                title="Work Completion Rate" 
                                value={kpiData.completionRate} 
                                icon={<Percent className="w-6 h-6" />}
                                unit="%"
                            />
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="bg-white p-5 rounded-xl shadow-lg border border-slate-200 lg:col-span-1 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Monthly Trend (Work Days)</h3>
                                <MonthlyTrendChart data={monthlyData} />
                            </div>
                            <div className="bg-white p-5 rounded-xl shadow-lg border border-slate-200 lg:col-span-1 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Top 10 Districts (Expenditure)</h3>
                                <DistrictComparisonChart data={comparisonData} />
                            </div>
                            <div className="bg-white p-5 rounded-xl shadow-lg border border-slate-200 lg:col-span-1 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Fund Utilization</h3>
                                <FundBreakdownChart data={fundData} />
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
