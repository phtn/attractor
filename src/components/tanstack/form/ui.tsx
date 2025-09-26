import { ClassName } from '@/app/types'
import { cn } from '@/lib/utils'
import { type AnyFieldApi } from '@tanstack/react-form'

export function FieldInfo ({ field }: { field: AnyFieldApi }) {
  return (
    <span>
      {field.state.meta.isTouched && field.state.meta.errors.length
        ? (
          <em>{field.state.meta.errors.join(', ')}</em>
          )
        : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </span>
  )
}

interface SubmitButtonProps {
  pending: boolean;
  isSubmitted?: boolean;
  className?: ClassName;
  title?: string;
}

export const SubmitButton = ({
  pending,
  isSubmitted,
  className,
  title,
}: SubmitButtonProps) => {
  return (
    <button
      type='submit'
      disabled={pending || isSubmitted}
      className={cn(
        'w-32 h-12 border bg-panel dark:bg-hot-dark border-panel',
        'border-[0.33px] cursor-pointer rounded-full',
        'flex flex-row items-center justify-center',
        'text-[15px] font-semibold font-quick text-white',
        'focus:outline-none focus:ring focus:ring-offset-0 focus:ring-orange-300',
        'disabled:opacity-60 disabled:text-gray-400 disabled:border-gray-300/80',
        'shadow-inner shadow-ultra-fade/15',
        className
      )}
    >
      {pending ? 'Submitting' : (title ?? 'Submit')}
    </button>
  )
}
