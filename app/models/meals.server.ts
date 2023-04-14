import type { Meal, Prisma, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type MealWithCook = Prisma.MealGetPayload<{
  include: {
    cook: true;
  };
}>;

export async function getMealById(id: Meal["id"]) {
  return prisma.meal.findUnique({
    where: {
      id,
    },
  });
}

export async function getRandomMeals() {
  return prisma.meal.findMany({
    take: 3,
    orderBy: {
      id: "asc",
    },
  });
}

export async function getRandomMeal() {
  return prisma.meal.findFirst({
  });
}

export async function getAllMeals() {
  return prisma.meal.findMany({
    include: {
      cook: true,
    }
  });
}

export async function createMeal(
  data: Prisma.MealCreateInput
) {
  return prisma.meal.create({
    data: {
      ...data,
    },
  });
}

export async function getMealsByUserId(cookedBy: User["id"]) {
  return prisma.meal.findMany({
    where: {
      cookedBy
    },
  });
}