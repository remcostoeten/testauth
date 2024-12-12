/**
 * Switches the database provider for the application.
 */

import fs from 'fs';
import { execSync, exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const DEFAULT_DOCKER_CONFIG = {
  user: 'postgres',
  password: 'postgres',
  database: 'testauth',
  port: '5432'
};

// Check if Docker is installed and running
async function checkDocker() {
  try {
    await new Promise((resolve, reject) => {
      exec('docker info', (error) => {
        if (error) {
          reject(new Error('Docker is not running or not installed'));
        }
        resolve();
      });
    });
    return true;
  } catch (error) {
    console.error('\n❌ Docker Error:', error.message);
    console.log('Please make sure Docker is installed and running.');
    console.log('Installation guide: https://docs.docker.com/get-docker/');
    return false;
  }
}

// Check if port is in use
async function isPortInUse(port) {
  try {
    await new Promise((resolve, reject) => {
      exec(`lsof -i :${port}`, (error, stdout) => {
        if (stdout.trim()) {
          reject(new Error(`Port ${port} is already in use`));
        }
        resolve();
      });
    });
    return false;
  } catch (error) {
    return true;
  }
}

// Check if container already exists
async function checkContainer(containerName) {
  try {
    const result = await new Promise((resolve) => {
      exec('docker ps -a --format "{{.Names}}"', (error, stdout) => {
        if (error) {
          resolve(false);
        }
        resolve(stdout.includes(containerName));
      });
    });
    return result;
  } catch {
    return false;
  }
}

async function getDockerCredentials(useDefault = false) {
  if (useDefault) {
    return DEFAULT_DOCKER_CONFIG;
  }

  console.log('\nDefault values shown in parentheses. Press Enter to use default.');
  const user = await question(`Database user (${DEFAULT_DOCKER_CONFIG.user}): `) || DEFAULT_DOCKER_CONFIG.user;
  const password = await question(`Database password (${DEFAULT_DOCKER_CONFIG.password}): `) || DEFAULT_DOCKER_CONFIG.password;
  const database = await question(`Database name (${DEFAULT_DOCKER_CONFIG.database}): `) || DEFAULT_DOCKER_CONFIG.database;
  const port = await question(`Port (${DEFAULT_DOCKER_CONFIG.port}): `) || DEFAULT_DOCKER_CONFIG.port;

  return { user, password, database, port };
}

async function setupSqlite() {
  console.log('\nSQLite Setup Options:');
  console.log('1. Use Local Database');
  console.log('2. Use Cloud Provider');
  console.log('3. Skip for now');
  console.log('4. Cancel setup');

  const choice = await question('\nSelect an option (1-4): ');

  switch (choice) {
    case '1':
      const useLocal = await question('\nDo you want to use a local.db instead of dev.db? (y/N): ');
      const dbName = useLocal.toLowerCase() === 'y' ? 'local.db' : 'dev.db';
      const dbPath = path.join(rootDir, 'prisma', dbName);

      // Delete existing database if it exists
      if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
        console.log(`Deleted existing ${dbName}`);
      }

      return `file:${dbName}`;

    case '2':
      console.log('\nEnter your SQLite cloud provider credentials:');
      const cloudUrl = await question('Database URL (e.g., sqlite://your-cloud-url): ');
      return cloudUrl;

    case '3':
      console.log('\nSkipping database setup.');
      console.log('Please set DATABASE_URL in your .env file before running the application.');
      return 'SKIP';

    case '4':
      console.log('\nCancelling setup.');
      process.exit(0);

    default:
      console.log('\nInvalid option selected.');
      process.exit(1);
  }
}

async function setupPostgres() {
  console.log('\nPostgreSQL Setup Options:');
  console.log('1. Use Docker (automatically setup a new database)');
  console.log('2. Use Cloud Provider (manually enter credentials)');
  console.log('3. Skip for now (you will need to set DATABASE_URL manually)');
  console.log('4. Cancel setup');

  const choice = await question('\nSelect an option (1-4): ');

  switch (choice) {
    case '1':
      // Check Docker prerequisites
      if (!(await checkDocker())) {
        console.log('\nSkipping Docker setup due to missing prerequisites.');
        return 'SKIP';
      }

      console.log('\nDefault Docker Configuration:');
      console.log('- User:', DEFAULT_DOCKER_CONFIG.user);
      console.log('- Password:', DEFAULT_DOCKER_CONFIG.password);
      console.log('- Database:', DEFAULT_DOCKER_CONFIG.database);
      console.log('- Port:', DEFAULT_DOCKER_CONFIG.port);

      const customizeDocker = await question('\nDo you want to customize Docker credentials? (y/N): ');
      const credentials = await getDockerCredentials(customizeDocker.toLowerCase() !== 'y');

      // Check if port is in use
      if (await isPortInUse(credentials.port)) {
        console.error(`\n❌ Port ${credentials.port} is already in use.`);
        console.log('Please choose a different port or free up the current one.');
        return 'SKIP';
      }

      // Check if container exists
      const containerName = 'testauth-postgres';
      if (await checkContainer(containerName)) {
        const removeContainer = await question('\nExisting PostgreSQL container found. Remove it? (y/N): ');
        if (removeContainer.toLowerCase() === 'y') {
          try {
            execSync(`docker rm -f ${containerName}`, { stdio: 'inherit' });
            console.log('Removed existing container');
          } catch (error) {
            console.error('\n❌ Failed to remove existing container:', error.message);
            return 'SKIP';
          }
        } else {
          console.log('\nSkipping setup to preserve existing container.');
          return 'SKIP';
        }
      }

      // Create Docker setup
      const dockerComposePath = path.join(rootDir, 'docker-compose.yml');
      const dockerComposeContent = `version: '3.8'
services:
  postgres:
    image: postgres:latest
    container_name: ${containerName}
    environment:
      POSTGRES_USER: ${credentials.user}
      POSTGRES_PASSWORD: ${credentials.password}
      POSTGRES_DB: ${credentials.database}
    ports:
      - "${credentials.port}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${credentials.user} -d ${credentials.database}"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:`;

      fs.writeFileSync(dockerComposePath, dockerComposeContent);
      console.log('\nCreated docker-compose.yml');

      // Create or update .env and .env.local with the database URL
      const dbUrl = `postgresql://${credentials.user}:${credentials.password}@localhost:${credentials.port}/${credentials.database}`;
      const envContent = `DATABASE_URL=${dbUrl}`;
      
      fs.writeFileSync(path.join(rootDir, '.env'), envContent);
      console.log('Updated .env file');

      try {
        fs.writeFileSync(path.join(rootDir, '.env.local'), envContent);
        console.log('Updated .env.local file');
      } catch (error) {
        console.log('Note: Could not create .env.local file');
      }
      
      try {
        console.log('\nStarting PostgreSQL container...');
        execSync('docker-compose up -d', { stdio: 'inherit', cwd: rootDir });
        
        // Wait for container to be healthy
        console.log('Waiting for PostgreSQL to be ready...');
        let attempts = 0;
        const maxAttempts = 30;
        
        while (attempts < maxAttempts) {
          try {
            execSync(`docker exec ${containerName} pg_isready -U ${credentials.user} -d ${credentials.database}`);
            console.log('PostgreSQL container is running and ready!');
            break;
          } catch (error) {
            attempts++;
            if (attempts === maxAttempts) {
              throw new Error('PostgreSQL container failed to become ready');
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        
        return dbUrl;
      } catch (error) {
        console.error('\n❌ Error starting Docker container:', error.message);
        console.log('\nTroubleshooting steps:');
        console.log('1. Check if Docker daemon is running');
        console.log('2. Verify port availability');
        console.log('3. Check system resources');
        console.log('4. Review Docker logs: docker logs testauth-postgres');
        return 'SKIP';
      }

    case '2':
      console.log('\nEnter your PostgreSQL cloud credentials:');
      const host = await question('Host (e.g., example.postgres.database.azure.com): ');
      const port = await question('Port (default: 5432): ') || '5432';
      const database = await question('Database name: ');
      const user = await question('Username: ');
      const password = await question('Password: ');
      
      return `postgresql://${user}:${password}@${host}:${port}/${database}`;

    case '3':
      console.log('\nSkipping database setup.');
      console.log('Please set DATABASE_URL in your .env file before running the application.');
      return 'SKIP';

    case '4':
      console.log('\nCancelling setup.');
      process.exit(0);

    default:
      console.log('\nInvalid option selected.');
      process.exit(1);
  }
}

async function main() {
  try {
    const args = process.argv.slice(2);
    const validProviders = ['postgresql', 'sqlite'];

    if (args.length !== 1 || !validProviders.includes(args[0])) {
      console.error('Usage: npm run switch-db [postgresql|sqlite]');
      process.exit(1);
    }

    const provider = args[0];
    let databaseUrl;

    if (provider === 'postgresql') {
      databaseUrl = await setupPostgres();
    } else {
      databaseUrl = await setupSqlite();
    }

    if (databaseUrl === 'SKIP') {
      rl.close();
      return;
    }

    // Update .env file with the new database URL
    const envContent = `DATABASE_URL=${databaseUrl}`;
    fs.writeFileSync(path.join(rootDir, '.env'), envContent);
    console.log('\nUpdated .env file with new database configuration');

    try {
      fs.writeFileSync(path.join(rootDir, '.env.local'), envContent);
      console.log('Updated .env.local file');
    } catch (error) {
      console.log('Note: Could not create .env.local file');
    }

    // Update schema.prisma file
    const schemaPath = path.join(rootDir, 'prisma', 'schema.prisma');
    let schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    const datasourceRegex = /datasource db {[\s\S]*?}/;
    const newDatasource = `datasource db {
  provider = "${provider}"
  url      = env("DATABASE_URL")
}`;
    
    schemaContent = schemaContent.replace(datasourceRegex, newDatasource);
    fs.writeFileSync(schemaPath, schemaContent);
    console.log('Updated schema.prisma file with new provider');

    // Run Prisma commands
    console.log('\nRunning Prisma commands...');
    
    try {
      // Delete existing migrations if they exist
      const migrationsPath = path.join(rootDir, 'prisma', 'migrations');
      if (fs.existsSync(migrationsPath)) {
        fs.rmSync(migrationsPath, { recursive: true, force: true });
        console.log('Deleted existing migrations');
      }

      // Generate Prisma client
      console.log('Generating Prisma client...');
      execSync('npx prisma generate', { 
        stdio: 'inherit',
        cwd: rootDir
      });

      // Push schema changes
      console.log('Pushing schema changes...');
      execSync('npx prisma db push --force-reset', { 
        stdio: 'inherit',
        cwd: rootDir
      });

      console.log(`\nSuccessfully switched to ${provider} database!`);
    } catch (error) {
      console.error('Error executing Prisma commands:', error.message);
      process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
