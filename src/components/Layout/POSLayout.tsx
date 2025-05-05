
import React, { ReactNode } from 'react';

interface POSLayoutProps {
  children: ReactNode;
}

const POSLayout: React.FC<POSLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-pos-background flex flex-col">
      <header className="bg-pos-dark text-pos-light p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/bd9aae2b-67cd-4156-be07-dae9877a6d5a.png" 
              alt="Deli in the Box" 
              className="h-12 w-12"
            />
            <h1 className="text-xl font-bold">Fast Food Express</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4">
        {children}
      </main>
      
      <footer className="bg-pos-dark text-pos-light p-4 text-center text-sm">
        <p>© {new Date().getFullYear()} Fast Food Express POS - Powered by Electron</p>
      </footer>
    </div>
  );
};

export default POSLayout;
