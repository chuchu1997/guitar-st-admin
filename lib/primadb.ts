


import { PrismaClient} from "@prisma/client";



declare global {
    const prisma:PrismaClient | undefined
}


const prismadb =new PrismaClient();



export default prismadb 
