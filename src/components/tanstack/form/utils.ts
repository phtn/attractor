import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { InputField } from './fields'
import { SubmitButton } from './ui'
const { fieldContext, formContext } = createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldComponents: {
    InputField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
})
