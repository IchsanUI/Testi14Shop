'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const logout = async () => {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
        })
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        router.push('/')
        router.refresh()
      }
    }

    logout()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Logging out...</p>
      </div>
    </div>
  )
}
