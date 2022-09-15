import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async getBookmarks(userId: number) {
    return await this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  async getBookmarksById(userId: number, bookmarkId: number) {
    return await this.prisma.bookmark.findFirst({
      where: {
        userId,
        id: bookmarkId,
      },
    });
  }

  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });
    return bookmark;
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto,
  ) {
    // get the bookmark by id
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        userId,
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    return await this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    // get the bookmark by id
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        userId,
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    return await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
