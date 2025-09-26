import { Button } from '@/components/ui/button'
import { useCallback } from 'react'
import { type CheckoutParams } from 'paymongo-fn'
import { useCheckout } from './use-checkout'

export const Checkout = () => {
  const { checkout } = useCheckout()
  const createCheckoutSession = useCallback(async () => {
    const cp2 = {
      data: {
        attributes: {
          send_email_receipt: false,
          show_description: true,
          show_line_items: true,
          cancel_url: 'https://bigticket.ph/checkout/cancel',
          description: 'gold',
          line_items: [
            {
              currency: 'PHP',
              amount: 100000,
              description: 'gold',
              name: 'gold',
              quantity: 1,
            },
          ],
          payment_method_types: ['paymaya'],
          reference_number: Math.random().toString(36).substring(7),
          success_url: 'https://bigticket.ph/checkout/success',
        },
      },
    } as CheckoutParams
    try {
      const data = await checkout(cp2)
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }, [checkout])

  return (
    <div className='flex-1 w-full p-2 h-[32rem] flex items-center justify-center'>
      <div className='w-[28rem] h-[16rem] border-r border-foreground/5 bg-foreground/10 backdrop-blur-lg justify-center items-center flex-col flex -space-y-1 text-center tracking-tighter'>
        <div>
          <Button size='lg' onClick={createCheckoutSession}>
            <span className='text-lg tracking-tighter'>
              Create Checkout Session
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}
