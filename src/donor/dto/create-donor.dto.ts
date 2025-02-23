import { Donor, Donation, $Enums } from "@prisma/client";

export class DonorDto implements Omit<Donor,'id'|'createdAt'|'updatedAt'|'deletedAt'> {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export class DonationDto implements Omit<Donation,'id'|'createdAt'|'updatedAt'|'deletedAt'|'donorId'> {
    amount: number;
    currency: string;
    paymentMethod: $Enums.PaymentMethod;
    status: $Enums.DonationStatus;
    notes: string;
    // donorId: number;
}


export class CreateDonationDto {
    donor:DonorDto;
    donation:DonationDto;
}
export class CreateExistingDonorDonationDto {
    phone:string;
    donation:DonationDto;
}