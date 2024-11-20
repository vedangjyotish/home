export interface ICartItem {
    courseId: string;
    courseName: string;
    courseImage: string;
    selectedModules: number[]; // Module indices that are selected
    totalModules: number; // Total number of modules available in the course
    price: number;
    isFullCourse: boolean;
}

export interface IPaymentDetails {
    name: string;
    email: string;
    phone: string;
    whatsappNumber: string;
    transactionId: string;
    paymentProof?: string; // URL or file path of payment proof
    paymentStatus: 'pending' | 'verified' | 'rejected';
    paymentDate?: Date;
    amount: number;
}

export interface IEnrollment {
    userId: string;
    courseId: string;
    enrollmentDate: Date;
    paymentDetails: IPaymentDetails;
    selectedModules: number[];
    status: 'active' | 'pending' | 'rejected';
}
