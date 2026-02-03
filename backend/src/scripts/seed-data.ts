import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ProjectsService } from '../projects/projects.service';
import { UsersService } from '../users/users.service';

async function seedData() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const projectsService = app.get(ProjectsService);
  const usersService = app.get(UsersService);

  try {
    // Create a sample user
    const user = await usersService.findOrCreate({
      githubId: '123456',
      handle: 'testuser',
      walletAddress: '0x1234567890123456789012345678901234567890',
      ensName: 'testuser.eth',
    });

    // Create sample projects
    const project1 = await projectsService.create({
      ownerId: user._id.toString(),
      githubRepoUrl: 'https://github.com/example/react-components',
      recipients: ['0x1234567890123456789012345678901234567890', '0x0987654321098765432109876543210987654321'],
      splits: [7000, 3000],
      ensName: 'react-components.eth',
      projectIdOnchain: 1,
    });

    const project2 = await projectsService.create({
      ownerId: user._id.toString(),
      githubRepoUrl: 'https://github.com/example/vue-utils',
      recipients: ['0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'],
      splits: [10000],
      ensName: 'vue-utils.eth',
      projectIdOnchain: 2,
    });

    console.log('Sample data created successfully!');
    console.log('User:', user);
    console.log('Projects:', [project1, project2]);
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await app.close();
  }
}

seedData();
