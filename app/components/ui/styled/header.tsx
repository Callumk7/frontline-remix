import ProfilePage from "@/routes/profile.$userId";

export function Header({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-cabin font-bold text-5xl">
      {children}
    </div>
  )
}
