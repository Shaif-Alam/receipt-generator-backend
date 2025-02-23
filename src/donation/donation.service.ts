import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class DonationService {

    constructor(private _db:DatabaseService) { }

    async countDonations(){
        try {
            const currentYear = new Date().getFullYear();
            const startOfYear = new Date(currentYear, 0, 1);
            const endOfYear = new Date(currentYear + 1, 0, 1);

            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

            const currentWeek = new Date();
            const startOfWeek = new Date(currentWeek);
            startOfWeek.setDate(currentWeek.getDate() - (currentWeek.getDay() === 0 ? 6 : currentWeek.getDay() - 1)); // Start of week (Monday)
            startOfWeek.setHours(0, 0, 0, 0);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 7); // End of week (Sunday)
            endOfWeek.setHours(23, 59, 59, 999);

            const today = new Date();
            const startDay = new Date(today)
            startDay.setHours(0, 0, 0, 0);

            const endDay = new Date(today)
            endDay.setDate(startDay.getDate()+1);
            endDay.setHours(23, 59, 59, 999);

            return await this._db.$transaction(async (prisma)=>{
                
                const total = await prisma.donation.aggregate({
                    _sum:{
                        amount:true
                    },
                }).then(data=>{
                    return data._sum.amount || 0;
                }).catch(error=>{
                    console.error("Error counting total donations", error.stack);
                    throw new InternalServerErrorException("Error while counting total donations");
                })


                const year = await prisma.donation.aggregate({
                    where:{
                        createdAt:{
                            gte:startOfYear,
                            lt:endOfYear
                        }
                    },
                    _sum:{
                        amount:true
                    },
                }).then(data=>{
                    return data._sum.amount || 0;
                }).catch(error=>{
                    console.error("Error counting year donations", error.stack);
                    throw new InternalServerErrorException("Error while counting year donations");
                })


                const month = await prisma.donation.aggregate({
                    where:{
                        createdAt:{
                            gte:startOfMonth,
                            lt:endOfMonth
                        }
                    },
                    _sum:{
                        amount:true
                    },
                }).then(data=>{
                    return data._sum.amount || 0;
                }).catch(error=>{
                    console.error("Error counting month donations", error.stack);
                    throw new InternalServerErrorException("Error while counting month donations");
                })


                const week = await prisma.donation.aggregate({
                    where:{
                        createdAt:{
                            gte:startOfWeek,
                            lt:endOfWeek
                        }
                    },
                    _sum:{
                        amount:true
                    },
                }).then(data=>{
                    return data._sum.amount || 0;
                }).catch(error=>{
                    console.error("Error counting week donations", error.stack);
                    throw new InternalServerErrorException("Error while counting week donations");
                })


                const today = await prisma.donation.aggregate({
                    where:{
                        createdAt:{
                            gte:startDay,
                            lt:endDay
                        }
                    },
                    _sum:{
                        amount:true
                    },
                }).then(data=>{
                    return data._sum.amount || 0;
                }).catch(error=>{
                    console.error("Error counting today donations", error.stack);
                    throw new InternalServerErrorException("Error while counting today donations");
                })

                return {total,year,month,week,today}
            })
        } catch (error) {
            throw error
        }
    }

    async getDonations(page?, limit?): Promise<{ data: any }> {
        if (page && limit) {
            page = +page;
            limit = +limit;
            try {
                const skip = (page - 1) * limit
                const data = await this._db.$transaction(async (prisma) => {
                    const total = await prisma.donation.count().catch(error => {
                        console.error("Error counting donation", error.stack);
                        throw new InternalServerErrorException("Error counting donation");
                    })
                    const donation = await prisma.donation.findMany({
                        skip,
                        take: limit,
                        orderBy: { createdAt: 'desc' },
                        include: {
                            donor: true
                        }
                    }).catch(error => {
                        console.error("Error fetching donation", error.stack);
                        throw new InternalServerErrorException("Error fetching donation");
                    })

                    return {
                        total,
                        page,
                        limit,
                        totalPages: Math.ceil(total / limit),
                        donation,
                    }
                })
                return {data}
            } catch (error) {
                throw error
            }

        } else {
            try {
                const data = await this._db.donation.findMany({
                    include: {
                        donor: true
                    }
                })
                return { data }
            } catch (error) {
                throw error
            }
        }
    }
}
