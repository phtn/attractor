'use client'

import { opts } from '@/utils/helpers'
import { type Preloaded, usePreloadedQuery } from 'convex/react'
import { useCallback, useState } from 'react'
import { api } from 'vx/_generated/api'
import { CatsTable } from './cats-table'
import { CreateCat } from './create-cat'
import { EditCat } from './edit-cat'
import { Cat } from 'vx/cats/d'

interface ContentProps {
  preloaded: Preloaded<typeof api.cats.get.active>;
}
export const Content = ({ preloaded }: ContentProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Cat | null>(null)
  const [editingRowId, setEditingRowId] = useState<string | null>(null)

  const toogleForm = useCallback(() => {
    setShowCreateForm((prev) => !prev)
    // Close edit form when opening create form
    if (showEditForm) {
      setShowEditForm(false)
      setEditingCategory(null)
      setEditingRowId(null)
    }
  }, [showEditForm])

  const toggleEditForm = useCallback(
    (category?: Cat) => {
      setShowEditForm((prev) => !prev)
      setEditingCategory(category ?? null)
      setEditingRowId(category?.cid ?? null)
      if (showCreateForm) {
        setShowCreateForm(false)
      }
    },
    [showCreateForm]
  )

  const reactive = usePreloadedQuery(preloaded)

  const CatForm = useCallback(() => {
    const options = opts(
      <CreateCat show={showCreateForm} toggleFn={toogleForm} />,
      <div />
    )
    return <>{options.get(showCreateForm)}</>
  }, [showCreateForm, toogleForm])

  const EditForm = useCallback(() => {
    const options = opts(
      <EditCat
        show={showEditForm}
        toggleFn={toggleEditForm}
        categoryData={editingCategory}
      />,
      <div />
    )
    return <>{options.get(showEditForm)}</>
  }, [showEditForm, toggleEditForm, editingCategory])

  return (
    <main className='w-full space-x-3 xl:flex h-[calc(100lvh-72px)] pb-8 overflow-scroll lg:space-y-8 block'>
      <CatsTable
        data={reactive}
        create={showCreateForm}
        edit={showEditForm}
        editingRowId={editingRowId}
        toogleForm={toogleForm}
        toggleEditForm={toggleEditForm}
      />
      <CatForm />
      <EditForm />
    </main>
  )
}
