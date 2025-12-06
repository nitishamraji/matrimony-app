-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "age" INTEGER,
    "gender" TEXT,
    "city" TEXT,
    "about" TEXT,
    "religion" TEXT,
    "height" TEXT,
    "maritalStatus" TEXT,
    "motherTongue" TEXT,
    "eatingHabits" TEXT,
    "drinkingSmoking" TEXT,
    "education" TEXT,
    "occupation" TEXT,
    "incomeRange" TEXT,
    "familyDetails" TEXT,
    "imageUrl" TEXT,
    "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
