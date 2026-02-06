import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async getAllProjects() {
    return this.projectsService.findAll();
  }

  @Post()
  async registerProject(@Body() body: any) {
    return this.projectsService.registerProject(body);
  }

  @Get(':handle')
  async getProject(@Req() req: Request) {
    const handle = req.params.handle as string;
    return this.projectsService.findByHandle(handle);
  }

  @Get('user/my-projects')
  @UseGuards(JwtAuthGuard)
  async getMyProjects(@Req() req: Request) {
    const user = req.user as any;
    return this.projectsService.findByOwnerId(user.sub);
  }
}
