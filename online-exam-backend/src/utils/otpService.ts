import prisma from "../config/db";

export const generateOTP = (): number => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const saveOTP = async (email: string, otp: number): Promise<void> => {
  await prisma.otp.deleteMany({
    where: {
      email: email,
    },
  });

  await prisma.otp.create({
    data: {
      email,
      otp,
      expireAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });
};

export const verifyOTP = async (
  email: string,
  otp: number,
): Promise<boolean> => {
  const otpRecord = await prisma.otp.findFirst({
    where: {
      email,
      otp,
    },
  });

  if (!otpRecord) return false;

  if (otpRecord.expireAt < new Date()) {
    await prisma.otp.deleteMany({
      where: { email },
    });
    return false;
  }
  await prisma.otp.deleteMany({ where: { email, otp } });
  return true;
};
