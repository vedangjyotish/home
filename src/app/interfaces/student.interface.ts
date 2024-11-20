export interface Student {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  contactNumber?: string;
  alternateContactNumber?: string;
  city?: string;
  pinCode?: string;
  dateOfBirth?: Date;
  profilePicture?: string;
  isVerified?: boolean;
  enrolledCourses?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
