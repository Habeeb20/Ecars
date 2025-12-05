// pages/dashboard/Overview.jsx
import { useAuth } from "../../contexts/AuthContext"
export default function Overview() {
  return <h1 className="text-4xl font-bold">Welcome back, {useAuth().user?.firstName}!</h1>
}