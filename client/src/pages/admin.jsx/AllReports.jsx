import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import {
  Shield,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Phone,
  MapPin,
  FileText,
  DollarSign,
  Calendar,
  ChevronRight,
} from "lucide-react";

const ReportCard = ({ report }) => {
  const [expanded, setExpanded] = useState(false);

  const getTypeConfig = (type) => {
    switch (type) {
      case "scam":
        return {
          icon: Shield,
          color: "text-red-600 bg-red-50 border-red-200",
          label: "Scam Report",
          bgGradient: "from-red-500 to-pink-600",
        };
      case "request":
        return {
          icon: Search,
          color: "text-blue-600 bg-blue-50 border-blue-200",
          label: "Car Request",
          bgGradient: "from-blue-500 to-cyan-600",
        };
      case "stolen":
        return {
          icon: AlertTriangle,
          color: "text-orange-600 bg-orange-50 border-orange-200",
          label: "Stolen Vehicle",
          bgGradient: "from-orange-500 to-red-600",
        };
      default:
        return { icon: FileText, color: "text-gray-600 bg-gray-50", label: "Report" };
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="flex items-center gap-1 text-amber-600 text-sm"><Clock className="w-4 h-4" /> Pending</span>;
      case "reviewed":
        return <span className="flex items-center gap-1 text-blue-600 text-sm"><FileText className="w-4 h-4" /> Reviewed</span>;
      case "resolved":
        return <span className="flex items-center gap-1 text-green-600 text-sm"><CheckCircle className="w-4 h-4" /> Resolved</span>;
      case "rejected":
        return <span className="flex items-center gap-1 text-red-600 text-sm"><XCircle className="w-4 h-4" /> Rejected</span>;
      default:
        return <span className="text-gray-600 text-sm capitalize">{status || "Pending"}</span>;
    }
  };

  const config = getTypeConfig(report.type);
  const Icon = config.icon;

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${config.bgGradient} p-5 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{config.label}</h3>
              <p className="text-sm opacity-90">Report #{report._id?.slice(-8)}</p>
            </div>
          </div>
          <div className="text-right">
            {report.type === "request" && report.budget && (
              <div className="text-2xl font-bold flex items-center justify-end gap-1">
                <DollarSign className="w-6 h-6" />
                {Number(report.budget).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">{report.title}</h4>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <User className="w-4 h-4" />
            <span>By: {report.reportedBy?.name || "Anonymous"}</span>
          </div>

          {report.phone && (
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{report.phone}</span>
            </div>
          )}

          {(report.location || report.preferredLocation) && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{report.location || report.preferredLocation}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(report.createdAt), "MMM d, yyyy • h:mm a")}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Status:</span>
            {getStatusBadge(report.status)}
          </div>
        </div>

        {/* Type-specific details */}
        {report.type === "stolen" && (
          <div className="mt-5 pt-5 border-t border-gray-200 grid grid-cols-2 gap-4 text-sm">
            {report.plateNumber && (
              <div>
                <span className="text-gray-600">Plate:</span>
                <p className="font-semibold uppercase">{report.plateNumber}</p>
              </div>
            )}
            {report.vin && (
              <div>
                <span className="text-gray-600">VIN:</span>
                <p className="font-mono text-xs">{report.vin}</p>
              </div>
            )}
            {report.color && (
              <div className="col-span-2">
                <span className="text-gray-600">Color:</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300" style={{ backgroundColor: report.color.toLowerCase() }} />
                  <span className="font-medium capitalize">{report.color}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {report.type === "request" && (
          <div className="mt-5 pt-5 border-t border-gray-200 grid grid-cols-2 gap-4 text-sm">
            {report.desiredMake && (
              <div>
                <span className="text-gray-600">Make:</span>
                <p className="font-semibold capitalize">{report.desiredMake}</p>
              </div>
            )}
            {report.desiredModel && (
              <div>
                <span className="text-gray-600">Model:</span>
                <p className="font-semibold capitalize">{report.desiredModel}</p>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        <div className="mt-5 pt-5 border-t border-gray-200">
          <p className="text-gray-700 leading-relaxed text-sm">
            {expanded ? report.description : `${report.description.substring(0, 150)}...`}
          </p>
          {report.description.length > 150 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        {/* Evidence Images */}
        {report.evidence?.length > 0 && (
          <div className="mt-5">
            <p className="text-sm font-medium text-gray-700 mb-3">Evidence ({report.evidence.length})</p>
            <div className="grid grid-cols-3 gap-3">
              {report.evidence.slice(0, 6).map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Evidence ${i + 1}`}
                  className="w-full h-28 object-cover rounded-lg shadow hover:shadow-md transition cursor-pointer"
                  onClick={() => window.open(url, "_blank")}
                />
              ))}
              {report.evidence.length > 6 && (
                <div className="flex items-center justify-center bg-gray-100 rounded-lg text-gray-500 text-sm font-medium">
                  +{report.evidence.length - 6}
                </div>
              )}
            </div>
          </div>
        )}

        {/* View Details Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            {expanded ? "Hide" : "View"} Details
            <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? "rotate-90" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("myToken"); // or whatever key you use
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/reports/reports`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status === "success") {
          setReports(response.data.data.reports || []);
        } else {
          setError("Failed to load reports");
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Failed to load reports. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl text-gray-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Community Reports</h1>
          <p className="text-lg text-gray-600">
            Scam alerts, stolen vehicles, and car requests from our users
          </p>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Reports Yet</h3>
            <p className="text-gray-500">Reports will appear here when submitted by the community.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reports.map((report) => (
              <ReportCard key={report._id} report={report} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportsPage;