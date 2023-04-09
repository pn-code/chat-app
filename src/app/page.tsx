import Image from 'next/image'
import { Inter } from 'next/font/google'
import Button from '@/components/ui/Button'
import { db } from '@/lib/db'

const inter = Inter({ subsets: ['latin'] })

export default async function Home() {

  return (
   <Button>Hello World</Button>
  )
}
