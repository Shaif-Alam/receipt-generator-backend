import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateDonationDto, CreateExistingDonorDonationDto } from './dto/create-donor.dto';
import { Donor, Donation } from '@prisma/client';

@Injectable()
export class DonorService {
    constructor(private _db: DatabaseService) { }

    async createNewDonor(payload: CreateDonationDto): Promise<{ donor: Donor, donation: Donation }> {

        try {
            let data = await this._db.$transaction(async (prisma) => {
                const donor = await prisma.donor.upsert({
                    where: {
                        phone: payload.donor.phone,
                    },
                    create: payload.donor,
                    update: payload.donor
                }).catch(error => {
                    console.error("Error creating/updating donor", error.stack);
                    throw new InternalServerErrorException("Error creating donor");
                });

                const donorId = donor.id;
                const donation = await prisma.donation.create({
                    data: {
                        ...payload.donation,
                        donor: {
                            connect: { id: donorId },
                        }
                    },
                }).catch(error => {
                    console.error("Error creating donation", error.stack);
                    throw new InternalServerErrorException(" Error creating donation", error.stack);
                })
                return { donor, donation }
            })
            return data
        } catch (error) {
            throw error;
        }

    }

    async createExistingDonor(payload: CreateExistingDonorDonationDto): Promise<{ donor: Donor, donation: Donation }> {
        try {
            let data = await this._db.$transaction(async (prisma) => {
                const donor = await prisma.donor.findUnique({
                    where: {
                        phone: payload.phone,
                    }
                }).catch(error => {
                    console.error("Error finding donor", error.stack);
                    throw new InternalServerErrorException("Error finding donor");
                });

                if (!donor) throw new BadRequestException("Donor not found");
                const donorId = donor.id;
                const donation = await prisma.donation.create({
                    data: {
                        ...payload.donation,
                        donor: {
                            connect: { id: donorId },
                        }
                    },
                }).catch(error => {
                    console.error("Error creating donation", error.stack);
                    throw new InternalServerErrorException(" Error creating donation", error.stack);
                })
                return { donor, donation }
            })
            return data
        }
        catch (error) {
            throw error
        }
    }

    async getDonors(page?, limit?): Promise<{ data: any }> {
        if (page && limit) {
            page = +page;
            limit = +limit;
            try {
                const skip = (page - 1) * limit
                const data = await this._db.$transaction(async (prisma) => {
                    const total = await prisma.donor.count().catch(error => {
                        console.error("Error counting donors", error.stack);
                        throw new InternalServerErrorException("Error counting donors");
                    })
                    const donors = await prisma.donor.findMany({
                        skip,
                        take: limit,
                        orderBy: { createdAt: 'desc' },
                        include: {
                            donations: {
                                orderBy: {
                                    createdAt: "desc",
                                }
                            }
                        }
                    }).catch(error => {
                        console.error("Error fetching donors", error.stack);
                        throw new InternalServerErrorException("Error fetching donors");
                    })

                    return {
                        total,
                        page,
                        limit,
                        totalPages: Math.ceil(total / limit),
                        donors,
                    }
                })
                return {data}
            } catch (error) {
                throw error
            }

        } else {
            try {
                const data = await this._db.donor.findMany({
                    include: {
                        donations: {
                            orderBy: {
                                createdAt: "desc",
                            }
                        }
                    }
                })
                return { data }
            } catch (error) {
                throw error
            }
        }
    }

}
