import Link from 'next/link';
import { ParkingSquare } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-secondary text-secondary-foreground shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <ParkingSquare className="h-8 w-8" />
            <span className="font-headline text-2xl font-bold">
              ParkEase Web
            </span>
          </Link>
          <nav className="flex items-center gap-4">
             <Link href="/admin" className="text-sm font-medium hover:underline">
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
