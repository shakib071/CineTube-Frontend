import { Navbar } from "@/components/layout/navbar";
import { getUserFromToken } from "@/services/auth.service";



export default async function CommonLayout({children}: {children: React.ReactNode}) {
  const User = await getUserFromToken();
  // console.log("User in layout:", User);
  return (
    <div className="min-h-screen flex flex-col " >
        <Navbar initialUser={User} />
        <main className="flex-1 ">
            {children}
        </main>

    </div>
  )
}
