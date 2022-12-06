import { Prisma } from "@prisma/client";

export type AlbumCreateInput = Omit<Prisma.AlbumCreateInput, 'coverCID'>