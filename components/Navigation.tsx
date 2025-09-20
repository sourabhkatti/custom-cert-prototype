'use client'

import { Package, Settings, Shield, Users, FileText, Layers } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Layers, active: false },
  { name: 'Images', href: '/images', icon: Package, active: false },
  { name: 'Custom Packages', href: '/custom-packages', icon: Shield, active: true },
  { name: 'Users', href: '/users', icon: Users, active: false },
  { name: 'Reports', href: '/reports', icon: FileText, active: false },
  { name: 'Settings', href: '/settings', icon: Settings, active: false },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-chainguard-dark border-r border-gray-700 w-64 h-screen p-6">
      <div className="mb-8">
        <h1 className="text-xl font-bw-fusiona font-bold text-white">
          Chainguard
        </h1>
        <p className="text-sm text-chainguard-text-secondary">Console</p>
      </div>

      <ul className="space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/custom-packages' && pathname?.startsWith('/custom-packages'))

          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-chainguard-teal/10 text-chainguard-teal border-l-2 border-chainguard-teal'
                    : 'text-chainguard-text-secondary hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            </li>
          )
        })}
      </ul>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="border-t border-gray-700 pt-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-chainguard-teal/20 flex items-center justify-center">
              <span className="text-chainguard-teal text-sm font-medium">U</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">User Account</p>
              <p className="text-xs text-chainguard-text-secondary">admin@company.com</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}