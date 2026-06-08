import React from "react";

// DAPAT may "export default function" din ito
export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 
        TODO: Maglagay ng <Navbar /> dito para sa customer side 
      */}
      <main className="flex-grow">
        {children}
      </main>
      {/* 
        TODO: Maglagay ng <Footer /> dito para sa customer side 
      */}
    </div>
  );
}
