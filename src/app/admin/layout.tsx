import { AdminSidebar } from '@/app/admin/sidebar'
import { Header } from '@/app/admin/components/header'
import { type ReactNode } from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ResizeCtxProvider } from '@/ctx/resize-ctx'

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='bg-zinc-300/60 dark:bg-background flex w-full h-screen'>
      <SidebarProvider>
        <ResizeCtxProvider>
          <AdminSidebar />
        </ResizeCtxProvider>
      </SidebarProvider>
      <div className='w-full'>
        <Header />
        <main className='flex-1 flex flex-col'>{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout
