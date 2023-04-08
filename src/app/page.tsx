import Image from 'next/image'
import { Inter } from 'next/font/google'
import Button from '@/components/ui/Button'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
   <Button>Hello World</Button>
  )
}
