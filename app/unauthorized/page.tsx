export default function Unauthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
        <p className="text-gray-600">You do not have permission to access this page.</p>
      </div>
    </div>
  )
}

