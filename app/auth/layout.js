export default async function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
